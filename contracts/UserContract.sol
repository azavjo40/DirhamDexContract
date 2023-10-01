pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract UserContract is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");

    event UserRegistered(
        uint256 userId,
        address indexed walletAddress,
        string firstName,
        string lastName,
        uint age
    );
    event UserRemoved(uint256 userId, address indexed walletAddress);

    struct User {
        uint256 id;
        string firstName;
        string lastName;
        uint age;
        address walletAddress;
        bool isDeleted;
    }

    User[] private users;

    mapping(address => bool) private userExistsMap;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    function registerUser(
        string memory firstName,
        string memory lastName,
        uint age
    ) public {
        require(!userExistsMap[msg.sender], "User already registered");

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
        userExistsMap[msg.sender] = true;
        emit UserRegistered(userId, msg.sender, firstName, lastName, age);
    }

    function getUserById(uint256 _userId) public view returns (User memory) {
        require(_userId < users.length, "User does not exist");

        User memory user = users[_userId];
        require(user.walletAddress != address(0), "User does not exist");

        return user;
    }

    function getUsers()
        public
        view
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (User[] memory)
    {
        return users;
    }

    function removeUser(
        uint256 userId
    ) public onlyRole(DEFAULT_ADMIN_ROLE) returns (bool) {
        require(userId < users.length, "User does not exist");

        User storage user = users[userId];
        require(!user.isDeleted, "User already deleted");

        user.isDeleted = true;
        emit UserRemoved(userId, user.walletAddress);
        return true;
    }
}
