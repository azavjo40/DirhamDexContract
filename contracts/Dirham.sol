// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DIRHAM is ERC20, AccessControl {
    bytes32 private constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("DHM", "DHM") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(MINTER_ROLE, DEFAULT_ADMIN_ROLE);
    }

    modifier onlyMinterErrorMessage(string memory errorMsg) {
        require(hasRole(MINTER_ROLE, msg.sender), errorMsg);
        _;
    }

    function mint(
        address to,
        uint256 amount
    )
        public
        onlyMinterErrorMessage("You do not have the necessary role to mint")
    {
        _mint(to, amount);
    }

    function burn(
        address _account,
        uint256 _amount
    )
        public
        onlyMinterErrorMessage("You do not have the necessary role to burn")
    {
        _burn(_account, _amount);
    }
}
