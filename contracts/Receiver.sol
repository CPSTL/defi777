pragma solidity >=0.6.2 <0.7.0;

import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import "@openzeppelin/contracts/introspection/IERC1820Registry.sol";

abstract contract Receiver is IERC777Recipient {
  mapping(address => bool) internal canReceive;

  IERC1820Registry constant internal ERC1820_REGISTRY = IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);

  constructor() internal {
    ERC1820_REGISTRY.setInterfaceImplementer(address(this), keccak256("ERC777TokensRecipient"), address(this));
  }

  function _tokensReceived(IERC777 token, address from, uint256 amount, bytes memory data) internal virtual;

  function tokensReceived(
    address /*operator*/,
    address from,
    address /*to*/,
    uint256 amount,
    bytes calldata userData,
    bytes calldata /*operatorData*/
  ) external override {
    // require(canReceive[msg.sender]);
    _tokensReceived(IERC777(msg.sender), from, amount, userData);
  }

  function recover(address token) external /*onlyOwner*/ {
    // require(!canReceive[address(token)]);

    IERC777(token).send(msg.sender, IERC777(token).balanceOf(address(this)), "");
  }
}
