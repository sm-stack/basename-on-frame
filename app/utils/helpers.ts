export async function fetchFarcasterUser(fid: number): Promise<string> {
    try {
        const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                api_key: process.env.NEYNAR_KEY || ''
            }
        };
    
        const response = await fetch(url, options);
        const data = await response.json();
        const user = data.users[0];
    
        return user.username
    } catch (error) {
        console.log(error);
        return '';
    }
}

export async function fetchFarcasterUserAddress(fid: number): Promise<string> {
    try {
        const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                api_key: process.env.NEYNAR_KEY || ''
            }
        };
    
        const response = await fetch(url, options);
        const data = await response.json();
        const user = data.users[0];
  
        return user.verified_addresses.eth_addresses[0]
    } catch (error) {
        console.log(error);
        return '';
    }
}

export function constructShareUrl(message: string, url: string) {
    return `https://warpcast.com/~/compose?text=${message}&embeds[]=${url}`;
}