// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract User is AccessControlUpgradeable {
    bytes32 private constant USER_ROLE = keccak256("USER_ROLE");

    event UserRegistered(
        uint256 userId,
        address indexed walletAddress,
        string firstName,
        string lastName,
        uint age
    );

    event UserRemoved(uint256 userId, address indexed walletAddress);

    struct SUser {
        uint256 userId;
        string firstName;
        string lastName;
        uint age;
        address walletAddress;
    }

    SUser[] private users;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    modifier userErrorMessage(string memory errorMsg, bool isOnly) {
        if (isOnly) {
            require(hasRole(USER_ROLE, msg.sender), errorMsg);
        } else {
            require(!hasRole(USER_ROLE, msg.sender), errorMsg);
        }
        _;
    }

    modifier onlyAdminErrorMessage(string memory errorMsg) {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), errorMsg);
        _;
    }

    function register(
        string memory firstName,
        string memory lastName,
        uint age
    )
        public
        userErrorMessage("User already registered", false)
        returns (SUser memory)
    {
        uint256 userId = users.length;
        SUser memory newUser = SUser(
            userId,
            firstName,
            lastName,
            age,
            msg.sender
        );
        users.push(newUser);
        _setupRole(USER_ROLE, msg.sender);
        emit UserRegistered(userId, msg.sender, firstName, lastName, age);
        return newUser;
    }

    function login()
        public
        view
        userErrorMessage("User not found", true)
        returns (SUser memory)
    {
        for (uint256 i = 0; i < users.length; i++) {
            SUser memory user = users[i];
            if (user.walletAddress == msg.sender) {
                return user;
            }
        }
        return SUser(0, "", "", 0, address(0));
    }

    function listUsers()
        public
        view
        onlyAdminErrorMessage("Admin access only")
        returns (SUser[] memory)
    {
        return users;
    }

    function remove()
        public
        userErrorMessage("User does not exist", true)
        returns (bool)
    {
        for (uint256 i = 0; i < users.length; i++) {
            SUser memory user = users[i];
            if (user.walletAddress == msg.sender) {
                revokeRole(USER_ROLE, user.walletAddress);
                users[user.userId] = users[users.length - 1];
                users.pop();
                emit UserRemoved(user.userId, user.walletAddress);
                return true;
            }
        }
        return false;
    }
}
