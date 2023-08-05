import { toNano } from 'ton-core';
import { PingPong } from '../wrappers/PingPong';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const pingPong = provider.open(await PingPong.fromInit(12n));

    await pingPong.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(pingPong.address);

    // run methods on `pingPong`
}
