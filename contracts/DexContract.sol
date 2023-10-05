// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Dirham.sol";

contract DexContract is AccessControl {
    uint256 private constant BPS = 10_000;
    uint256 private constant WITHDRAW_GAS_ESTIMATE = 400;

    // mapping to store exchange rates for each stablecoin
    mapping(address => uint256) private exchangeRates;

    // Address of the Dirham contract
    address private dirhamContractAddress;

    // Constructor to set the Dirham contract address when deploying DexContract
    constructor(address _dirhamContractAddress) {
        dirhamContractAddress = _dirhamContractAddress;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setExchangeRate(address coin) private view returns (uint256) {
        require(coin != address(0), "UnsupportedCoin");
        return exchangeRates[coin];
    }

    function getExchangeRate(
        address token,
        uint256 rate
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(token != address(0), "UnsupportedCoin");
        exchangeRates[token] = rate;
    }

    function buyTokens(address _stableCoin, uint256 _amount) external {
        uint256 rate = exchangeRates[_stableCoin];

        uint256 totalCoinValue = ((_amount * rate) / BPS);

        SafeERC20.safeTransferFrom(
            IERC20(_stableCoin),
            msg.sender,
            address(this),
            totalCoinValue
        );

        // Mint tokens to the user based on the calculated token amount
        Dirham(dirhamContractAddress).mint(msg.sender, _amount);
    }

    function withdraw(
        address coin,
        address to,
        uint256 amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 exchangeRate = exchangeRates[coin];
        require(exchangeRate > 0, "UnsupportedCoin");

        uint256 convertedAmount = (amount * BPS) / exchangeRate;

        SafeERC20.safeTransferFrom(
            IERC20(address(coin)),
            msg.sender,
            to,
            convertedAmount
        );

        // Burn tokens from the user's account
        Dirham(dirhamContractAddress).burn(msg.sender, amount);
    }
}
