/** @jsxImportSource frog/jsx */
import { Box } from '../api/[[...routes]]/ui';

export function getDurationPage(name: string) {
    return (<div
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
                src="/available.png"
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
                    top='96'
                    justifyContent='center'
                    textAlign='center'
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
            </img>
        </div>
    );
}