# ping-pong

A simple ping pong contract for Ton Blockchain. Send it money and it will send the money back.

## Contract endpoints

- you can send money to the contract without the message.
- `"ping"` to send money to be sent back with `"pong"` message.
- `"withdraw"` to withdraw all but 0,01 TON from the contract. 

## Project structure

- `contracts` - source code of all the smart contracts of the project and their dependencies.
- `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
- `tests` - tests for the contracts.
- `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`yarn blueprint build`

### Test

`yarn blueprint test`

### Deploy or run another script

Before deploying, set ID in `scripts/deployPingPong.ts:6`

`yarn blueprint run`
