// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./Dirham.sol";

contract DexContract {
    uint256 private constant BPS = 10_000;
    uint256 private constant rate = 1;
    uint256 private constant WITHDRAW_GAS_ESTIMATE = 400;

    // Address of the Dirham contract
    address public dirhamContractAddress;

    // Constructor to set the Dirham contract address when deploying DexContract
    constructor(address _dirhamContractAddress) {
        dirhamContractAddress = _dirhamContractAddress;
    }

    function buyTokens(address _stableCoin, uint256 _amount) external {
        uint256 coinValue = ((_amount * rate) / BPS);
        SafeERC20.safeTransferFrom(
            IERC20(_stableCoin),
            msg.sender,
            address(this),
            coinValue
        );

        // Calculate the amount of tokens to mint based on the rate and user's input amount
        uint256 tokenAmount = _amount * rate;

        // Mint tokens to the user based on the calculated token amount
        Dirham(dirhamContractAddress).mint(msg.sender, tokenAmount);
    }

    function withdraw(
        address _stableCoin,
        address to,
        uint256 _amount
    ) external {
        uint256 coinValue = ((_amount * rate) / BPS);
        SafeERC20.safeTransferFrom(
            IERC20(address(_stableCoin)),
            msg.sender,
            to,
            coinValue
        );

        // Calculate the equivalent amount in currency based on the rate
        uint256 currencyAmount = _amount / rate;

        // Burn tokens from the user's account
        Dirham(dirhamContractAddress).burn(msg.sender, currencyAmount);
    }
}
