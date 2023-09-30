import { ethers } from "hardhat";
import readline from "readline";

const rl = readline.createInterface(process.stdin, process.stdout);
require("dotenv").config();
const { USER_CONTRACT_ADSRESS } = process.env;

async function main() {
  const [deployer] = await ethers.getSigners();
  const UserContractFactory = await ethers.getContractFactory("UserContract");

  let user;
  if (USER_CONTRACT_ADSRESS) {
    user = UserContractFactory.attach(USER_CONTRACT_ADSRESS!);
  } else {
    user = await UserContractFactory.deploy();
  }
  console.log("USER_CONTRACT_ADSRESS=" + (await user.getAddress()));
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

//run script: npx hardhat run scripts/deployUserContract.ts --network sepolia
