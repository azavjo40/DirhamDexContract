import { ethers } from "hardhat";
import readline from "readline";

const rl = readline.createInterface(process.stdin, process.stdout);
require("dotenv").config();
const { DIRHAM_ADSRESS, DEX_CONTRACT_ADSRESS, USDT_ADDRESS } = process.env;

async function main() {
  const [deployer] = await ethers.getSigners();
  const DexContractFactory = await ethers.getContractFactory("DexContract");
  let dirham;
  if (DEX_CONTRACT_ADSRESS) {
    dirham = DexContractFactory.attach(DEX_CONTRACT_ADSRESS!);
  } else {
    dirham = await DexContractFactory.deploy(DIRHAM_ADSRESS);
  }
  console.log("DIRHAM_ADSRESS=" + (await dirham.getAddress()));
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

//run script: npx hardhat run scripts/deployDexContract.ts --network sepolia
