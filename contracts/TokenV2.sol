// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

// this is an implementation deriving from OpenZeppelin's ERC20 contract
contract TokenV2 is ERC20Upgradeable {
  address payable owner;

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

    // user burns ERC20 token and get 90% of ETH back
  function burnTokensAndRetrieveEth(uint256 _amount) external {
    // If we assume the ONLY way to get tokens is by depositing ETH, then no need to check deposit, just return 90% of ETH
    require(balanceOf(msg.sender) >= _amount, "Not enough tokens");

    // burn tokens from sender account
    _burn(msg.sender, _amount);
    // ufixed8x1 t = 9 / 10;

    // return 90% of ETH (for now just return full amount)
    _returnEth(payable(msg.sender), _amount);
  }

  /**
   * @dev Returns `_amount` ether to `_to`. Note: can only be called when user has deposited some amount of tokens.
   */
  // do we need function to be payable?
  function _returnEth(address payable _to, uint256 _amount) private {
    (bool sent,) = _to.call{value: _amount}("");
    require(sent, "Failed to send eth");
  }

  /**
   * @dev Returns the ether balance of the contract
   */
  function getEthBalance() public view returns(uint256) {
    return address(this).balance;
  }

  function killUpgradeFunctionality() public onlyOwner {
    // turn off upgradability of contract
  }

  event Mint(address recipient, uint256 amount);
}
