import { ethers, upgrades } from "hardhat";
import readline from "readline";
import { Exchange } from "../typechain-types";

const rl = readline.createInterface(process.stdin, process.stdout);
require("dotenv").config();
const { DIRHAM_ADSRESS, COLD_WALLET, USDT_ADDRESS } = process.env;

const MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
const MARKETING_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MARKETING_ROLE"));

async function main() {
  const [deployer] = await ethers.getSigners();
  const DIRHAM = await ethers.getContractFactory("DIRHAM");
  let dirham;
  if (DIRHAM_ADSRESS) {
    dirham = DIRHAM.attach(DIRHAM_ADSRESS!);
  } else {
    dirham = await DIRHAM.deploy();
  }
  console.log("DIRHAM_ADSRESS=" + dirham.address);

  const ExchangeFactory = await ethers.getContractFactory("Exchange");
  let exchange;
  if (process.env.EXCHANGE_ADDRESS) {
    exchange = ExchangeFactory.attach(process.env.EXCHANGE_ADDRESS);
  } else {
    exchange = (await upgrades.deployProxy(ExchangeFactory, [dirham.address, COLD_WALLET])) as Exchange;
    await exchange.deployed();
    // exchange = await ExchangeFactory.deploy();
  }
  console.log("EXCHANGE_ADDRESS=" + exchange.address);

  // console.log("Setting exchange initialize...");
  // await exchange.initialize(dirham.address, COLD_WALLET!);

  console.log("Setting exchange rate...");
  await exchange.setExchangeRate(USDT_ADDRESS!, 10_000);

  console.log("Setting up minter role...");
  await dirham.grantRole(MINTER_ROLE, exchange.address);

  console.log("Setting up marketing role...");
  await exchange.grantRole(MARKETING_ROLE, deployer.address);
}

rl.question("Continue? (y/N)", (a) => {
  if (a.toLowerCase() !== "y") {
    process.exit(0);
  }

  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
});

//run script: npx hardhat run scripts/deploy.ts --network sepolia
//veryfy: npx hardhat verify address --network sepolia
