import { ethers, upgrades } from "hardhat";
import readline from "readline";

const rl = readline.createInterface(process.stdin, process.stdout);
require("dotenv").config();
const { EXCHANGE_ADDRESS } = process.env;

async function main() {
  const [deployer] = await ethers.getSigners();
  const ExchangeV2 = await ethers.getContractFactory("ExchangeV2");
  const upgradedExchange = await upgrades.upgradeProxy(EXCHANGE_ADDRESS!, ExchangeV2);
  console.log("EXCHANGE_ADDRESS=" + upgradedExchange.address);
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

//run script: npx hardhat run scripts/upgrade.ts --network sepolia
