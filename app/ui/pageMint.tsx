/** @jsxImportSource frog/jsx */
import { Box } from '../api/[[...routes]]/ui';

export function getMintPage(name: string, years: string, price: number) {
    const formattedYears = Number.isInteger(Number(years)) ? Number(years).toFixed(0) : Number(years).toFixed(1);
    return (
        <div
            style={{
                alignItems: 'center',
                backgroundSize: '100% 100%',
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                height: '100%',
                justifyContent: 'center',
                textAlign: 'center',
                width: '100%',
            }}
        >
            <img
                src="/review.png"
                style={{
                    height: '100%',
                    width: '100%',
                }}
            >
            <Box
                position='absolute'
                fontFamily={{custom: 'coinbase'}}
                fontWeight='900'
                fontSize='32'
                color='white'
                width='100%'
                height='48'
                top='80'
                left='40'
                flexDirection='row'
                alignVertical='center'
            >
                <img
                    src="/icon.png"
                    width={80}
                    height={80}
                />
                <div
                    style={{
                        color: 'white',
                        fontSize: 66,
                        fontFamily: 'coinbase',
                        fontWeight: 900,
                        letterSpacing: '-0.015em',
                        lineHeight: 1.4,
                        marginTop: 0,
                        padding: '0 20px',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {`${name}.base.eth`}
                </div>
            </Box>
            <div
                style={{
                    display: 'flex',
                    color: 'white',
                    fontSize: 32,
                    fontFamily: 'coinbase',
                    fontWeight: 900,
                    letterSpacing: '-0.015em',
                    lineHeight: 1.4,
                    marginTop: 340,
                    marginLeft: 40,
                    padding: '0 20px',
                    whiteSpace: 'pre-wrap',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        color: 'white',
                        fontSize: 66,
                        fontFamily: 'coinbase',
                        fontWeight: 900,
                        letterSpacing: '-0.015em',
                        lineHeight: 1.4,
                        marginTop: 0,
                        padding: '0 20px',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    { formattedYears == '1' ? `${formattedYears} year` : `${formattedYears} years`}
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    color: 'white',
                    fontSize: 32,
                    fontFamily: 'coinbase',
                    fontWeight: 900,
                    letterSpacing: '-0.015em',
                    lineHeight: 1.4,
                    marginTop: 340,
                    position: 'absolute',
                    left: 450,
                    padding: '0 20px',
                    whiteSpace: 'pre-wrap',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        color: 'white',
                        fontSize: 66,
                        fontFamily: 'coinbase',
                        fontWeight: 900,
                        letterSpacing: '-0.015em',
                        lineHeight: 1.4,
                        marginTop: 0,
                        padding: '0 20px',
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {`${price.toFixed(4)} ETH`}
                </div>
            </div>
            </img>
        </div>
    );
}