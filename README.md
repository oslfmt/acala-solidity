# Solidity Smart Contract Challenge
This is my attempt to complete the ERC20 upgradeable smart contract.
NOTE: This is my initial attempt, and is not complete. The things I have gotten stuck on and am still
working on are:
1. The contract currently returns 100% of ETH, not 90%. I will need to figure out how to use fractional
values in solidity, as math with decimal values like 0.9 is more complicated.
2. The contract does not have a kill switch to turn off upgradeability. Since I am using OZ's upgradeable
proxy contract, my immediate thought is to have a function and a flag that indicates if upgradeability is
has been turned on or off. If off, then the transaction calling for an upgrade should fail. Since the
upgradeability logic lies in the proxy contract, I may need to dig in to OZ's implementation.

## Transaction deploys smart contracts:
https://kovan.etherscan.io/tx/0x225eb3b42738494f2f074ae27296c36d3adcab73944de1c01a71a92d3d924665
https://kovan.etherscan.io/tx/0xf90abec50e8126966cfabf0b126dd903c877822318a97210ce57969064f08a48 (deploy proxy)

## Transaction sends ETH to mint ERC20 token:
https://kovan.etherscan.io/tx/0xaaa4d2c5a25bd391eeeb0c0499a09c3a481974d9290af7f9c16a2001727ae75e

## Transaction performs upgrade:
https://kovan.etherscan.io/tx/0xa2f0964cf3bfaf753433e17281b6bf97734a66685f026fd227760df7149a67f5

## Transaction performs kill switch:
TODO

## Transaction that burn ERC20 token and receive ETH:
https://kovan.etherscan.io/tx/0x92077377b81606536407c070081b3b9c4ab76c0a37eac0c785985f85c53a8d52

