// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Dirham.sol";

contract DexContract {
    // Address of the Dirham contract
    address public dirhamContractAddress;

    // Constructor to set the Dirham contract address when deploying DexContract
    constructor(address _dirhamContractAddress) {
        dirhamContractAddress = _dirhamContractAddress;
    }

    // Function for users to buy tokens by sending Ether and specifying the rate and amount
    function buyTokens(
        address currencyContractAddress, // Address of the currency contract (e.g., USDT)
        uint256 rate, // Conversion rate from currency to tokens
        uint256 amount // Amount of currency to be converted
    ) external payable {
        // Calculate the amount of tokens to mint based on the rate and user's input amount
        uint256 tokenAmount = amount * rate;

        // Check if the user has sufficient balance in the currency contract
        require(
            IERC20(currencyContractAddress).balanceOf(msg.sender) >= amount,
            "Insufficient balance"
        );

        // Check if the user sent enough Ether to purchase the tokens
        require(msg.value >= amount, "Insufficient Ether sent");

        // Transfer the specified amount of currency from the user to DexContract
        IERC20(currencyContractAddress).transferFrom(
            msg.sender,
            address(this),
            amount
        );

        // Mint tokens to the user based on the calculated token amount
        Dirham(dirhamContractAddress).mint(msg.sender, tokenAmount);
    }

    // Function for users to withdraw tokens and receive currency in return
    function withdrawTokens(
        address currencyContractAddress, // Address of the currency contract (e.g., USDT)
        uint256 rate, // Conversion rate from tokens to currency
        uint256 amount // Amount of tokens to be converted
    ) external {
        // Check if the user has sufficient token balance to withdraw
        require(
            IERC20(dirhamContractAddress).balanceOf(msg.sender) >= amount,
            "Insufficient token balance"
        );

        // Burn tokens from the user's account
        Dirham(dirhamContractAddress).burn(msg.sender, amount);

        // Calculate the equivalent amount in currency based on the rate
        uint256 currencyAmount = amount / rate;

        // Transfer the specified amount of currency to the user
        IERC20(currencyContractAddress).transfer(msg.sender, currencyAmount);
    }
}
