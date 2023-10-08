// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./dirham.sol";

contract Exchange is
    Initializable,
    AccessControlUpgradeable,
    OwnableUpgradeable
{
    uint256 private constant BPS = 10_000;
    uint256 private constant WITHDRAW_GAS_ESTIMATE = 400;

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

    DIRHAM private dirhamToken;
    address private coldWallet;
    address private rootReferrer;

    mapping(address => uint256) public exchangeRates;
    bytes32 private constant MARKETING_ROLE = keccak256("MARKETING_ROLE");

    function initialize(
        address _DIRHAMToken,
        address _coldWallet
    ) public initializer {
        if (_DIRHAMToken == address(0) || _coldWallet == address(0)) {
            revert();
        }

        __AccessControl_init();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(MARKETING_ROLE, DEFAULT_ADMIN_ROLE);
        __Ownable_init();

        dirhamToken = DIRHAM(_DIRHAMToken);
        coldWallet = _coldWallet;
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
            coldWallet,
            totalCoinValue
        );

        dirhamToken.mint(msg.sender, _amount);
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
        dirhamToken.burn(to, amount);
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
