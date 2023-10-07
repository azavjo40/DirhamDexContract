import { ethers } from "hardhat";
import readline from "readline";

const rl = readline.createInterface(process.stdin, process.stdout);
require("dotenv").config();
const { DIRHAM_ADSRESS, USDT_ADDRESS, BUSD_ADDRESS, USDC_ADDRESS }: any = process.env;

interface IDirhamContract {
  setExchangeRate(token: string, rate: number): Promise<void>;
}

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    const [owner] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    const DirhamContractFactory = await ethers.getContractFactory("Dirham");

    const dirham: IDirhamContract = DirhamContractFactory.attach(DIRHAM_ADSRESS!) as unknown as IDirhamContract;
    const res = await dirham.setExchangeRate(USDT_ADDRESS!, 1);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//run script: npx hardhat run scripts/addRate.ts --network sepolia
