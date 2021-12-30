const { deployProxy } = require("@openzeppelin/truffle-upgrades");

const Token = artifacts.require("Token");

module.exports = async function(deployer) {
  // 1. Deploys ProxyAdmin
  // 2. Deploy Token implementation contract
  // 3. Deploy proxy contract
  // 4. Initialize it by calling initialize(). This calls Base ERC20 contract initializer, which just sets name and symbol. It also then sets the owner to the deployer.
  await deployProxy(Token, [], { deployer, initializer: 'initialize' });
}