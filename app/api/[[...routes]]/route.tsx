/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { neynar } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import path from 'path';
import fs from 'fs/promises';
import { vars } from './ui'
import { getDurationPage, getMintPage, getMintSuccessPage, getSharePage } from '@/app/ui';
import { checkAvailability, checkPrice, getPrimaryBasename, getRegisterInputs } from '@/app/utils/contracts';
import { constructShareUrl, fetchFarcasterUser, fetchFarcasterUserAddress } from '@/app/utils/helpers';

type State = {
  basename: string,
  duration: string,
}

async function getFontData() {
  const fontPath = path.resolve('./public/fonts/Coinbase_Display-Regular-web-1.32.ttf');
  const fontData = await fs.readFile(fontPath);
  return fontData;
}
const app = new Frog<{State: State}>({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: process.env.NEYNAR_KEY || '' }),
  title: 'Basename on Farcaster Frames',
  initialState: {
    basename: '',
    duration: '',
  },
  ui: { vars },
  imageOptions: {
    fonts: [
      {
        name: 'coinbase',
        data: await getFontData(),
        style: 'normal',
        weight: 400,
      },
    ]
  },
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', (c) => {
  return c.res({
    image: '/default.png',
    intents: [
      <TextInput placeholder="SEARCH FOR A NAME" />,
      <Button action='/duration'>Next</Button>,
    ],
  })
})

app.frame('/duration', async (c) => {
  const { inputText, deriveState } = c;
  // Accept only alphanumeric characters
  const regex = /^[a-z|A-Z|0-9|]+$/;
  if (!inputText || regex.test(inputText) === false) {
    return c.error({ message: 'Should write valid name', statusCode: 404 });
  }

  const name = inputText.toLowerCase();
  const state = deriveState(previousState => {
    if (name) {
      previousState.basename = name
    };
  })

  const available = await checkAvailability(name);
  if (!available) {
    return c.error({ message: 'Name already taken', statusCode: 404 })
  }

  // Get the user's primary address
  const fid = c.frameData?.fid;
  if (!fid) {
    return c.error({ message: 'Invalid user', statusCode: 404 })
  }
  const address = await fetchFarcasterUserAddress(fid);
  
  if (!address) {
    return c.error({ message: 'No verified eth addresses, please add one and retry.', statusCode: 404 })
  }
  const primaryBasename = await getPrimaryBasename(address);
  const isPrimaryName = primaryBasename ? '/has-primary-name' : '/mint'

  return c.res({
    image: ( getDurationPage(state.basename) ),
    intents: [
      <TextInput placeholder="Registration year in number.." />,
      <Button action='/'>Back</Button>,
      <Button action={isPrimaryName} value='false'>Next</Button>,
    ],
  })
})

app.frame('/has-primary-name', (c) => {
  const { inputText, deriveState } = c

  deriveState(previousState => {
    if (inputText) {
      previousState.duration = inputText
    }
  })

  return c.res({
    image: '/has-primary-name.png',
    intents: [
      <Button action='/mint' value='false'>No</Button>,
      <Button action='/mint' value='true'>Yes</Button>,
    ],
  })
})

app.frame('/mint', async (c) => {
  const { inputText, buttonValue, deriveState } = c
  const fid = c.frameData?.fid;
  if (!fid) {
    return c.error({ message: 'Invalid user', statusCode: 404 })
  }

  let name = '';
  let duration = ''
  deriveState(previousState => {
    name = previousState.basename
    duration = inputText ? inputText : previousState.duration
  })
  if (!name) {
    return c.error({ message: 'Invalid name', statusCode: 404 })
  }

  // 31557600 = about 1 year (365.25 days)
  const years = Number(duration) * 24 * 60 * 60 * 365 + 21600; // Add 0.25 days (21600 sec)
  if (isNaN(years) || years < 31557600) {
    return c.error({ message: 'Should write valid duration', statusCode: 404 })
  }

  // Check the price of the name
  const checkPriceRes = await checkPrice(name, years);
  if (!checkPriceRes) {
    return c.error({ message: 'Error getting price', statusCode: 404 })
  }
  const price = Number(checkPriceRes) / 10 ** 18;
  const bigPrice = Number(checkPriceRes).toString();

  const username = await fetchFarcasterUser(fid);
  if (!username) {
    return c.error({ message: 'Error getting username', statusCode: 404 })
  }

  // Change Primary Name?
  const changePrimaryName = String(buttonValue === 'true')
 
  return c.res({
    action: '/wait',
    image: (
      getMintPage(name, duration, price)
    ),
    intents: [
      <Button action='/'>Back</Button>,
      <Button.Transaction target={`/mint-name/${name}/${bigPrice}/${username}/${years}/${changePrimaryName}`}>Mint</Button.Transaction>,
    ],
  })
})

app.frame('/wait', (c) => {
  const { transactionId } = c

  if (!transactionId) {
    return c.error({ message: 'Error minting basename', statusCode: 404 })
  }

  return c.res({
    image: ('/wait.png'),
    intents: [
      <Button action='/finish-mint'>Next</Button>,
    ],
  })
})

app.transaction('/mint-name/:name/:bigPrice/:username/:duration/:changePrimaryName', async (c) => { 
  const { address } = c

  const name = c.req.param('name')
  const bigPrice = c.req.param('bigPrice')
  const username = c.req.param('username')
  const duration = c.req.param('duration')
  const changePrimaryName = c.req.param('changePrimaryName')
  if (address === undefined
    || name === undefined
    || bigPrice === undefined
    || username === undefined
    || duration === undefined
    || changePrimaryName === undefined
  ) {
    return c.error({ message: 'Invalid transaction', statusCode: 404 })
  }

  return c.contract(getRegisterInputs(name, address, username, duration, bigPrice, changePrimaryName))
})

app.frame('/finish-mint', (c) => {
  const { deriveState } = c
  let name;
  deriveState(previousState => {
    name = previousState.basename
  })
  if (!name) {
    return c.error({ message: 'Error minting name', statusCode: 404 })
  }

  const message = `I just minted ${name}.base.eth on Frame. Secure yours now and get Based!`;
  const shareRedirectUrl = constructShareUrl(message, `${process.env.BASE_URL}/api/share/${name}`);
  const basenameRedirectUrl = `https://base.org/name/${name}`

  return c.res({
    image: ( getMintSuccessPage(name) ),
    intents: [
      <Button.Link href={basenameRedirectUrl}>Check on Basename</Button.Link>,
      <Button.Link href={shareRedirectUrl}>Share</Button.Link>
    ],
  })
})

app.frame('/share/:name', (c) => {
  const name = c.req.param('name')
  if (name === undefined) {
    return c.error({ message: 'Invalid name', statusCode: 404 })
  }

  return c.res({
    image: ( getSharePage(name) ),
    intents: [
      <TextInput placeholder="SEARCH FOR A NAME" />,
      <Button action='/duration'>Next</Button>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)

// NOTE: That if you are using the devtools and enable Edge Runtime, you will need to copy the devtools
// static assets to the public folder. You can do this by adding a script to your package.json:
// ```json
// {
//   scripts: {
//     "copy-static": "cp -r ./node_modules/frog/_lib/ui/.frog ./public/.frog"
//   }
// }
// ```
// Next, you'll want to set up the devtools to use the correct assets path:
// ```ts
// devtools(app, { assetsPath: '/.frog' })
// ```
