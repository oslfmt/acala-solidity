// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

// this is an implementation deriving from OpenZeppelin's ERC20 contract
contract Token is ERC20Upgradeable {
  address payable owner;

  // initializer modifier makes sure this function call only be called ONCE
  function initialize() public initializer {
    // call base contract initializer
    ERC20Upgradeable.__ERC20_init("Token", "TOK");
    owner = payable(msg.sender);
  }

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() initializer {}

  modifier onlyOwner {
    require(
      msg.sender == owner,
      "Only owner can call this function"
    );
    _;
  }

  function getOwner() public view returns(address payable) {
    return owner;
  }

  /**
   * @dev Allows contract to receive ether payments. Mints an equivalent amount of tokens as deposited ether.
   */
  receive() external payable {
    // POSSIBLE ERROR: https://docs.soliditylang.org/en/v0.8.10/contracts.html#receive-ether-function
    // may run out of gas
    _mintToken(msg.value);
  }

  /**
   * @dev Mints `_amount` of tokens for the caller. This is only called after depositing eth, ensuring tokens are
   * only minted in the case of an eth deposit.
   */
  function _mintToken(uint256 _amount) private {
    // TODO: check event to make sure the receiver of tokens is correct
    _mint(tx.origin, _amount);
    emit Mint(tx.origin, _amount);
  }

  /**
   * @dev Returns the ether balance of the contract
   */
  function getEthBalance() public view returns(uint256) {
    return address(this).balance;
  }

  event Mint(address recipient, uint256 amount);
}

// TODO
// - deploy to kovan
// - need to return 90% of eth, not all of it
// - upgrading - do we need owner variable for Token, if admin has owner?
// - upgrading - do we need entirely new contract, or can we just have "appended" functions?
// - upgrading - how to turn it off

// things I'd like to understand:
// - External means only accessed externally--does this refer to code or who can call it?
// - to call a function method, do I need to use web3.eth.sendTransaction() or web3.eth.call()?? or can I just do
// contract.method()? I think there is some shorthand here, with the truffle framework making the 3rd method default to
// either a send() or a call() depending on if data is just read or written. It defaults to accounts[0] as the sender
// If I were using raw web3.js I would do something like: contractInstance.method.sendTransaction(...) I think
// - how to do events logging