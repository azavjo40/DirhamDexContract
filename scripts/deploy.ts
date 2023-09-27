import { ethers } from "hardhat";
import readline from "readline";

const rl = readline.createInterface(process.stdin, process.stdout);
require("dotenv").config();
const { DIRHAM_ADSRESS } = process.env;

async function main() {
  const [deployer] = await ethers.getSigners();
  const DirhamContractFactory = await ethers.getContractFactory("Dirham");
  let dirham;
  if (DIRHAM_ADSRESS) {
    dirham = DirhamContractFactory.attach(DIRHAM_ADSRESS!);
  } else {
    dirham = await DirhamContractFactory.deploy();
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

//run script: npx hardhat run scripts/deploy.ts --network sepolia
