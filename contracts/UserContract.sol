pragma solidity ^0.8.0;

contract UserContract {
    mapping(address => bool) private admins;

    struct User {
        uint256 id;
        string firstName;
        string lastName;
        uint age;
        address walletAddress;
    }

    User[] private users;

    constructor() {
        admins[msg.sender] = true;
    }

    modifier onlyAdmin() {
        require(isAdmin(msg.sender), "Only admin can call this function");
        _;
    }

    function isAdmin(address _address) private view returns (bool) {
        if (admins[_address]) {
            return true;
        }
        return false;
    }

    function addAdmin(address _adminAddress) public onlyAdmin {
        admins[_adminAddress] = true;
    }

    function userExists(address userAddress) internal view returns (bool) {
        for (uint256 i = 0; i < users.length; i++) {
            if (users[i].walletAddress == userAddress) {
                return true;
            }
        }
        return false;
    }

    function registerUser(
        string memory firstName,
        string memory lastName,
        uint age
    ) public {
        require(!userExists(msg.sender), "User already registered");

        uint256 userId = users.length;
        User memory newUser = User(
            userId,
            firstName,
            lastName,
            age,
            msg.sender
        );
        users.push(newUser);
    }

    function getUserById(uint256 _userId) public view returns (User memory) {
        require(_userId < users.length, "User does not exist");
        User memory user = users[_userId];
        return user;
    }

    function getUsers() public view onlyAdmin returns (User[] memory) {
        return users;
    }

    function removeUser(uint256 userId) public onlyAdmin returns (bool) {
        require(userId < users.length, "User does not exist");
        users[userId] = users[users.length - 1];
        users.pop();
        return true;
    }
}
