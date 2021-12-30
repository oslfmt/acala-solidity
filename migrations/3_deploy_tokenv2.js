const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const Token = artifacts.require("Token");
const TokenV2 = artifacts.require("TokenV2");

module.exports = async function(deployer) {
  // 1. Deploy the new TokenV2 contract
  // 2. Updates the existing proxy to point to new implementation
  const existing = await Token.deployed();
  await upgradeProxy(existing.address, TokenV2, { deployer });
}