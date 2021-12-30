const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
const Token = artifacts.require("Token");
const TokenV2 = artifacts.require("TokenV2");

contract("Token", async accounts => {
  let token;
  const owner = accounts[0];
  const sender = accounts[1];
  const nonDepositer = accounts[2];
  const amount = 10;
  const retrieve_amount = 1;

  before(async () => {
    // deploy proxy
    token = await deployProxy(Token, []);
  });

  describe("preupgraded contract", () => {
    it("should deploy contract with initial token balance of zero and proper owner", async () => {
      const balance = await token.totalSupply();
      assert.equal(balance, 0); 
      assert.equal(await token.getOwner(), owner, "Incorrect owner of contract");
    });
  
    it("receives eth payments and mints an equivalent token amount to the sender", async () => {
      let startingEthBalance = await token.getEthBalance();
      assert.equal(startingEthBalance, 0);
  
      // pay ETH to contract
      await web3.eth.sendTransaction({
        from: sender,
        to: token.address,
        value: amount,
      });
  
      // check that balance of contract for both eth and tokens is correct
      let endingEthBalance = await token.getEthBalance();
      let endingTokenBalance = await token.totalSupply();
      assert.equal(amount, endingTokenBalance, "Contract does not have correct supply of tokens");
      assert.equal(amount, endingEthBalance, "Contract does not have correct ETH balance");
  
      // check that tokens were minted for the sender of the ETH
      const tokenBalance = await token.balanceOf(sender);
      assert.equal(tokenBalance, amount);
    });
  
    // it("contract does not have burning functionality yet", async () => {
    //   token.burnTokensAndRetrieveEth(1, {from: accounts[3]})
    //     .catch(err => {
    //       assert.include("undefined");
    //     });
    // });
  });

  describe("upgraded contract", () => {
    let token2;

    before(async () => {
      // points proxy to new implementation
      token2 = await upgradeProxy(token.address, TokenV2);
    });

    it('proxy contract still has same address', async () => {
      assert.equal(token.address, token2.address, "proxy addresses are not the same");
    })

    // do we need an owner variable in the token contract, since admin has an owner?
    // if so, how to get admin owner??
    it("the owner is correct", async () => {
      assert.equal(await token.getOwner(), owner, "original proxy");
      assert.equal(await token2.getOwner(), owner, "upgraded");
    });

    it("maintains the same state", async () => {
      // previously the sender deposited 10 ETH so balance of contract should be 10, user should have 10 tokens also
      const contractEthBalance = await token2.getEthBalance();
      const totalTokenSupply = await token2.totalSupply();
      const senderTokenBalance = await token2.balanceOf(sender);
      assert.equal(amount, contractEthBalance, "contract ETH balance is wrong");
      assert.equal(amount, totalTokenSupply, "token supply is not correct");
      assert.equal(amount, senderTokenBalance, "sender doesn't have correct token balance");
    });

    it("contract returns 90% of ETH and burns all corresponding tokens", async () => {
      let startingEthBalance = await token2.getEthBalance();
  
      // user retrieves 1 eth
      await token2.burnTokensAndRetrieveEth(retrieve_amount, {from: sender});
      
      // total supply should be less
      let tokenSupply = await token2.totalSupply();
      assert.equal(tokenSupply, amount - retrieve_amount);
      // user tokenBalance should be less
      let senderTokenBalance = await token2.balanceOf(sender);
      assert.equal(senderTokenBalance, amount - retrieve_amount);
      // contract ETH balance should be less
      let endingEthBalance = await token2.getEthBalance();
      assert.equal(endingEthBalance, startingEthBalance - retrieve_amount);
    });
  
    it("contract does not allow retrieving eth for users without necessary amount of tokens", async () => {
      let tokenBalance = await token2.balanceOf(nonDepositer);
      assert.equal(tokenBalance, 0);
  
      // should not go through because user did not deposit any ETH to contract
      token2.burnTokensAndRetrieveEth(2, {from: nonDepositer})
        .catch(err => {
          assert.include(err, 'Not enough tokens');
        });
    });
  });
});
