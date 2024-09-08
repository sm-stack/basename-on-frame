/** @jsxImportSource frog/jsx */

export function getSharePage(name: string) {
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
                src="/share.png"
                style={{
                    height: '100%',
                    width: '100%',
                }}
            >
                <div
                    style={{
                        alignItems: 'center',
                        backgroundSize: '100% 100%',
                        display: 'flex',
                        flexWrap: 'nowrap',
                        height: '100',
                        justifyContent: 'center',
                        textAlign: 'center',
                        width: '100%',
                        position: 'relative',
                        fontWeight: '900',
                        fontSize: '32',
                        color: 'white',
                        top: '170',
                        flexDirection: 'row',
                        alignVertical: 'center',
                    }}
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
                </div>
            </img>
        </div>
    );
}