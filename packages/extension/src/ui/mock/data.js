import {
    randomId,
    randomInt,
} from '~utils/random';
import daiIcon from '~ui/images/tokens/dai.png';
import usdcIcon from '~ui/images/tokens/usdc.png';
import compoundLogo from './images/compound.png';

export const generate = (count, generator) => {
    const data = [];
    for (let i = 0; i < count; i += 1) {
        data.push(generator(i));
    }
    return data;
};

export const randomAddress = () => `0x${randomId(40)}`;

export const seedPhrase = 'oyster lemon tornado cat hamster basic similar vote priority purchase planet idle';

export const addresses = [
    '0x3339C3c842732F4DAaCf12aed335661cf4eab66b',
    ...generate(3, randomAddress),
];

export const assets = [
    {
        code: 'dai',
        address: randomAddress(),
        linkedTokenAddress: randomAddress(),
        icon: daiIcon,
        balance: 0.51232,
    },
    {
        code: 'usdc',
        address: randomAddress(),
        linkedTokenAddress: randomAddress(),
        icon: usdcIcon,
        balance: 2832.21,
    },
    {
        code: 'cc',
        address: randomAddress(),
        linkedTokenAddress: randomAddress(),
        balance: 0,
    },
    ...generate(5, () => ({
        address: randomAddress(),
        linkedTokenAddress: randomAddress(),
        balance: 0,
    })),
];

export const sites = [
    {
        title: 'Aztec Protocol',
        url: 'https://www.aztecprotocol.com',
        icons: [
            {
                href: 'https://www.aztecprotocol.com/icons/icon-144x144.png?v=d70c0dfad3304ef3eca84c656c8c63ab',
                sizes: '144x144',
            },
        ],
    },
];

export const domains = [
    {
        name: 'Compound Finance',
        iconSrc: compoundLogo,
        url: 'https://compound.finance/',
        domain: 'compound.finance',
    },
];

export const notes = [
    {
        noteHash: `0x${randomId()}`,
        value: randomInt(100),
        asset: assets[0],
    },
    {
        noteHash: `0x${randomId()}`,
        value: randomInt(100),
        asset: assets[1],
    },
];

export const pastTransactions = [
    {
        type: 'deposit',
        asset: assets[0],
        address: addresses[0],
        value: 50,
        timestamp: Date.now() - 40 * 1000,
    },
    {
        type: 'deposit',
        asset: assets[1],
        address: addresses[0],
        value: 1000,
        timestamp: Date.now() - 60 * 60 * 1000,
    },
    {
        type: 'send',
        asset: assets[0],
        address: addresses[0],
        value: 0.12,
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
        type: 'withdraw',
        asset: assets[0],
        address: addresses[0],
        value: 1.523,
        timestamp: Date.now() - 45 * 24 * 60 * 60 * 1000,
    },
];

export const depositTransactions = generate(3, i => ({
    amount: randomInt(1, 100),
    to: addresses[i + 1],
}));

export const withdrawTransactions = generate(3, i => ({
    amount: randomInt(1, 100),
    to: addresses[i + 1],
}));

export const sendTransactions = generate(3, () => ({
    amount: randomInt(1, 100),
    to: addresses[randomInt(1, addresses.length - 1)],
}));