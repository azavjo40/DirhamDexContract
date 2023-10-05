// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Dirham is ERC20, AccessControl {
    bytes32 private constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private constant BPS = 10_000;
    uint256 private constant WITHDRAW_GAS_ESTIMATE = 400;

    mapping(address => uint256) public exchangeRates;

    event TokensPurchased(
        address indexed buyer,
        address indexed stableCoin,
        uint256 amount
    );

    event TokensWithdrawn(
        address indexed recipient,
        address indexed coin,
        uint256 amount
    );

    event ExchangeRateUpdated(address indexed token, uint256 rate);

    constructor(address exchangeRate) ERC20("DHM", "DHM") {
        exchangeRates[exchangeRate] = 1;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(MINTER_ROLE, DEFAULT_ADMIN_ROLE);
    }

    function buyTokens(address _stableCoin, uint256 _amount) external {
        uint256 rate = exchangeRates[_stableCoin];

        uint256 totalCoinValue = ((_amount * rate) / BPS);

        require(
            IERC20(_stableCoin).balanceOf(msg.sender) >= totalCoinValue,
            "Insufficient balance"
        );

        SafeERC20.safeTransferFrom(
            IERC20(_stableCoin),
            msg.sender,
            address(this),
            totalCoinValue
        );
        _mint(msg.sender, _amount);

        emit TokensPurchased(msg.sender, _stableCoin, _amount);
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
        _burn(msg.sender, amount);

        emit TokensWithdrawn(to, coin, amount);
    }

    function setExchangeRate(
        address token,
        uint256 rate
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(token != address(0), "UnsupportedCoin");
        exchangeRates[token] = rate;
        emit ExchangeRateUpdated(token, rate);
    }
}
