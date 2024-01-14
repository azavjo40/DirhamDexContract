import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { Signer } from 'ethers';
import { DIRHAM, Exchange, ExchangeV2, IERC20, User } from '../typechain-types';
require('dotenv').config();
const {
  DIRHAM_ADSRESS,
  COLD_WALLET,
  USDT_ADDRESS,
  USER_ADSRESS,
  EXCHANGE_ADDRESS,
} = process.env;

describe('ExchangeV2 Contract', function () {
  let exchange: ExchangeV2;
  let dirham: DIRHAM;
  let user: User;
  let usdtToken: IERC20;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  const MINTER_ROLE = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes('MINTER_ROLE')
  );
  const MARKETING_ROLE = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes('MARKETING_ROLE')
  );
  const USER_ROLE = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes('USER_ROLE')
  );

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const DIRHAM = await ethers.getContractFactory('DIRHAM');

    if (DIRHAM_ADSRESS) {
      dirham = DIRHAM.attach(DIRHAM_ADSRESS!);
    } else {
      dirham = await DIRHAM.deploy();
    }

    const UserFactory = await ethers.getContractFactory('User');

    if (USER_ADSRESS) {
      user = UserFactory.attach(USER_ADSRESS!);
    } else {
      user = await UserFactory.deploy();
    }

    const ExchangeFactory = await ethers.getContractFactory('ExchangeV2');
    if (EXCHANGE_ADDRESS) {
      exchange = ExchangeFactory.attach(EXCHANGE_ADDRESS);
    } else {
      exchange = (await upgrades.deployProxy(ExchangeFactory, [
        dirham.address,
        USER_ADSRESS,
        COLD_WALLET,
      ])) as Exchange;
      await exchange.deployed();
      // exchange = await ExchangeFactory.deploy();
    }
    // await exchange.setExchangeRate(USDT_ADDRESS!, 1);
    // await dirham.grantRole(MINTER_ROLE, exchange.address);
    // await exchange.grantRole(MARKETING_ROLE, owner.getAddress());

    usdtToken = await ethers.getContractAt('IERC20', USDT_ADDRESS!);
  });

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(
        await exchange.hasRole(
          await dirham.DEFAULT_ADMIN_ROLE(),
          owner.getAddress()
        )
      ).to.be.true;
    });

    it('Should set the right minter role', async function () {
      expect(await dirham.hasRole(MINTER_ROLE, exchange.address)).to.be.true;
    });

    it('Should set the right marketing role', async function () {
      expect(await exchange.hasRole(MARKETING_ROLE, owner.getAddress())).to.be
        .true;
    });
  });

  describe('Buy token', function () {
    it('Should allow buying tokens', async function () {
      const ownerAddress = await owner.getAddress();

      if (!(await user.hasRole(USER_ROLE, ownerAddress))) {
        await user.connect(owner).register('Azam', 'Sufiev', 31);
      }

      const initialBalance = await dirham.balanceOf(ownerAddress);

      const amountToBuy = ethers.utils.parseUnits('1', 18);
      await usdtToken.connect(owner).approve(exchange.address, amountToBuy);

      const tx = await exchange
        .connect(owner)
        .buyTokens(USDT_ADDRESS!, amountToBuy);
      const receipt = await tx.wait();
      const event = receipt.events?.find((e) => e.event === 'TokensPurchased');

      expect(event?.args?.buyer).to.equal(ownerAddress);
      expect(event?.args?.amount).to.equal(amountToBuy);

      const newBalance = await dirham.balanceOf(ownerAddress);
      expect(newBalance.sub(initialBalance)).to.equal(amountToBuy);
    });

    // it('Should allow withdraw tokens', async function () {
    //   const ownerAddress = await owner.getAddress();
    //   const userAddress = '0x298A98B7041DDf400b10183d3028287Ed5cF43D0';
    //
    //   const amountToWithdraw = ethers.utils.parseUnits('1', 18);
    //   await usdtToken
    //     .connect(owner)
    //     .approve(exchange.address, amountToWithdraw);
    //
    //   const tx = await exchange
    //     .connect(owner)
    //     .withdraw(USDT_ADDRESS!, ownerAddress, amountToWithdraw, {
    //       gasLimit: 2000000,
    //     });
    //
    //   const receipt = await tx.wait();
    //   const event = receipt.events?.find((e) => e.event === 'TokensWithdrawn');
    //   console.log(event);
    //
    //   expect(event).to.exist;
    //   expect(event?.args?.recipient).to.equal(userAddress);
    //   expect(event?.args?.amount.toString()).to.equal(
    //     amountToWithdraw.toString()
    //   );
    // });
  });
});

// npx hardhat test test/ExchangeV2.test.ts --network sepolia
