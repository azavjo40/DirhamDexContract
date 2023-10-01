// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract UserContract is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");

    // Event emitted when a new user is registered
    event UserRegistered(
        uint256 userId,
        address indexed walletAddress,
        string firstName,
        string lastName,
        uint age
    );

    // Event emitted when a user is removed
    event UserRemoved(uint256 userId, address indexed walletAddress);

    // Struct representing a user
    struct User {
        uint256 id;
        string firstName;
        string lastName;
        uint age;
        address walletAddress;
        bool isDeleted;
    }

    // Array to store user data
    User[] private users;

    // Mapping to check if a user exists
    mapping(address => bool) private userExistsMap;

    // Constructor to set up admin roles when deploying the contract
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    // Function for users to register themselves
    function registerUser(
        string memory firstName,
        string memory lastName,
        uint age
    ) public {
        // Check if the user is not already registered
        require(!userExistsMap[msg.sender], "User already registered");

        // Create a new user and add them to the users array
        uint256 userId = users.length;
        User memory newUser = User(
            userId,
            firstName,
            lastName,
            age,
            msg.sender,
            false
        );
        users.push(newUser);

        // Mark the user as registered and emit the UserRegistered event
        userExistsMap[msg.sender] = true;
        emit UserRegistered(userId, msg.sender, firstName, lastName, age);
    }

    // Function to get user details by their ID
    function getUserById(uint256 _userId) public view returns (User memory) {
        // Check if the user ID is valid and the user exists
        require(_userId < users.length, "User does not exist");

        // Get and return the user details
        User memory user = users[_userId];
        require(user.walletAddress != address(0), "User does not exist");

        return user;
    }

    // Function to get the list of all users (only accessible by admins)
    function getUsers()
        public
        view
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (User[] memory)
    {
        return users;
    }

    // Function to remove a user by their ID (only accessible by admins)
    function removeUser(
        uint256 userId
    ) public onlyRole(DEFAULT_ADMIN_ROLE) returns (bool) {
        // Check if the user ID is valid and the user exists
        require(userId < users.length, "User does not exist");

        // Get the user and mark them as deleted, then emit the UserRemoved event
        User storage user = users[userId];
        require(!user.isDeleted, "User already deleted");
        user.isDeleted = true;
        emit UserRemoved(userId, user.walletAddress);

        return true;
    }
}
