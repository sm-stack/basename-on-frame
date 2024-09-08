import { 
    http, createPublicClient, encodeFunctionData, keccak256,
    toBytes, Abi, Address, encodePacked, namehash,
} from "viem";
import { L2RESOLVER_ABI, REGISTRAR_CONTROLLER_ABI } from "./abi";
import { base } from "viem/chains";
import { ContractTransactionParameters } from "frog";

const REGISTRAR_CONTROLLER_ADDRESS = '0x4ccb0bb02fcaba27e82a56646e81d8c5bc4119a5';
const L2_RESOLVER_ADDRESS = '0xC6d566A56A1aFf6508b41f6c90ff131615583BCD';
const ROOT_NODE = '0xff1e3c0eb00ec714e34b6114125fbde1dea2f24a72fbf672e7b7fd5690328e10';

export async function checkAvailability(name: string) {
    const chain = base;
    const transport = http(process.env.RPC_URL);
    const client = createPublicClient({ transport, chain });
    
    try {
        const available = await client.readContract({
            address: REGISTRAR_CONTROLLER_ADDRESS,
            abi: REGISTRAR_CONTROLLER_ABI,
            functionName: 'available',
            args: [name],
        });
        return available;
    } catch {
        return false;
    }
}

export async function checkPrice(name: string, duration: number) {
    const chain = base;
    const transport = http(process.env.RPC_URL);
    const client = createPublicClient({ transport, chain });
    
    try {
        const res = await client.readContract({
            address: REGISTRAR_CONTROLLER_ADDRESS,
            abi: REGISTRAR_CONTROLLER_ABI,
            functionName: 'registerPrice',
            args: [name, duration],
        });
        return res;
    } catch {
        return '';
    }
}

export async function getPrimaryBasename(address: string) {
    const chain = base;
    const transport = http(process.env.RPC_URL);
    const client = createPublicClient({ transport, chain });

    try {
        const addressReverseNode = convertReverseNodeToBytes(address, base.id);
        const basename = await client.readContract({
            abi: L2RESOLVER_ABI,
            address: L2_RESOLVER_ADDRESS,
            functionName: 'name',
            args: [addressReverseNode],
        });
        if (basename) {
            return basename;
        }
    } catch (error) {
        console.log(error);
    }
    return '';
}

export function getRegisterInputs(
    name: string,
    address: string,
    username: string,
    duration: string,
    bigPrice: string,
    changePrimaryName: string,
): ContractTransactionParameters {
    // Enroll the address, name and farcaster username to L2Resolver contract
    const nodeHash = calculateNodeHash(name);
    const functionNames = ['setAddr', 'setName', 'setText'];
    const args = [[nodeHash, address], [nodeHash, `${name}.base.eth`], [nodeHash, 'xyz.farcaster', username]];

    const calldata = getMultiCallData(functionNames, args);

    return {
        chainId: 'eip155:8453',
        to: REGISTRAR_CONTROLLER_ADDRESS,
        abi: REGISTRAR_CONTROLLER_ABI as Abi,
        functionName: 'register',
        args: [{
            name,
            owner: address,
            duration,
            resolver: L2_RESOLVER_ADDRESS,
            data: calldata,
            reverseRecord: changePrimaryName === 'true',
        }],
        value: BigInt(bigPrice),
    }
}

function encodeCalldata(functionName: string, args: any[]) {
    return encodeFunctionData({
        abi: L2RESOLVER_ABI,
        functionName,
        args,
    });
}

function getMultiCallData(functionNames: string[], args: any[]) {
    return functionNames.map((functionName, index) => {
        return encodeCalldata(functionName, args[index]);
    });
}

function calculateNodeHash(name: string) {
    const hashedName = keccak256(toBytes(name));
    const concatenated = new Uint8Array([
        ...toBytes(ROOT_NODE),
        ...toBytes(hashedName),
    ]);

    return keccak256(concatenated);
}

function convertReverseNodeToBytes(address: string, chainId: number) {
    const addressFormatted = address.toLocaleLowerCase() as Address;
    const addressNode = keccak256(addressFormatted.substring(2) as Address);
    const chainCoinType = convertChainIdToCoinType(chainId);
    const baseReverseNode = namehash(
        `${chainCoinType.toLocaleUpperCase()}.reverse`,
    );
    const addressReverseNode = keccak256(
        encodePacked(['bytes32', 'bytes32'], [baseReverseNode, addressNode]),
    );
    return addressReverseNode;
};

function convertChainIdToCoinType(chainId: number): string {
    const cointype = (0x80000000 | chainId) >>> 0;
    return cointype.toString(16).toLocaleUpperCase();
};