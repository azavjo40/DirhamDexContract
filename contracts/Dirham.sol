// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Dirham is ERC20, AccessControl {
    // Define role identifiers for admin and user roles
    bytes32 private constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Private balance mapping for tracking user balances
    mapping(address => uint256) private _balances;

    // Private allowance mapping for managing delegated allowances
    mapping(address => mapping(address => uint256)) private _allowances;

    // Contract constructor sets up roles and initializes the ERC20 token
    constructor() ERC20("DHM", "DHM") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Function to mint new tokens and assign them to the specified address
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        // Mint new tokens and assign them to the target address
        _mint(to, amount);
    }

    // Function to burn a specific amount of tokens from a user's account
    function burn(address _account, uint256 _amount) public {
        // Burn the specified amount of tokens from the user's account
        _burn(_account, _amount);
    }
}
