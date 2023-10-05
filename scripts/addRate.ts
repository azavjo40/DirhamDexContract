import { ethers } from "hardhat";
import readline from "readline";

const rl = readline.createInterface(process.stdin, process.stdout);
require("dotenv").config();
const { USDT_ADDRESS, DEX_CONTRACT_ADSRESS }: any = process.env;

interface IDexContract {
  setExchangeRate(token: string, rate: number): Promise<void>;
}

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    const [owner] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    const DexContractFactory = await ethers.getContractFactory("DexContract");

    const dex: IDexContract = DexContractFactory.attach(DEX_CONTRACT_ADSRESS!) as unknown as IDexContract;
    const res = await dex.setExchangeRate(USDT_ADDRESS, 1);
    console.log(res);
    console.log("Users", res);
  } catch (e) {
    console.log(e);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//run script: npx hardhat run scripts/addRate.ts --network sepolia
