import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { fromNano, toNano } from 'ton-core';
import { PingPong } from '../wrappers/PingPong';
import '@ton-community/test-utils';

describe('PingPong', () => {
    let blockchain: Blockchain;
    let pingPong: SandboxContract<PingPong>;
    let deployer: SandboxContract<TreasuryContract>

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        pingPong = blockchain.openContract(await PingPong.fromInit(1n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await pingPong.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: pingPong.address,
            deploy: true,
            success: true,
        });

        await pingPong.send(
            deployer.getSender(),
            {
                value: toNano('500')
            }, null
        )
    });

    it('should deploy', async () => {
        console.log("balance - ", await pingPong.getBalance())
    })

    it('withdraws only from deployer', async () => {
        const some_user = await blockchain.treasury('user');

        const balanceBefore = await some_user.getBalance()

        await pingPong.send(some_user.getSender(), {
            value: toNano('0.2')
        }, 'withdraw')

        const balanceAfter = await some_user.getBalance()

        expect(balanceBefore).toBeGreaterThanOrEqual(balanceAfter)
    })

    it('withdraws to deployer', async () => {
        const balanceBefore = await deployer.getBalance()

        await pingPong.send(deployer.getSender(), {
            value: toNano('0.01')
        }, 'withdraw')

        const balanceAfter = await deployer.getBalance()

        expect(balanceAfter).toBeGreaterThanOrEqual(balanceBefore)
    })

    it('should send money back', async () => {
        const some_user = await blockchain.treasury('user')

        const balanceBefore = await some_user.getBalance()
        console.log("balanceBefore - ", fromNano(balanceBefore))

        await pingPong.send(
            some_user.getSender(),
            {
                value: toNano('1')
            },
            "ping")

        const balanceAfter = await some_user.getBalance()
        console.log("balanceAfter - ", fromNano(balanceAfter))
        const abs = (n: bigint) => (n < 0n) ? -n : n;
        expect(abs(balanceAfter - balanceBefore)).toBeLessThanOrEqual(toNano('0.01'))
    });
});
