import { ethers } from "hardhat";
import { config } from "dotenv";

config();

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    const [owner] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    const TokenContract = await ethers.getContractFactory("Token");

    const token: any = TokenContract.attach(process.env.ADSRESS_CONTRACT!);

    const addressToCheck = owner.address;

    // const res = await token.transfer(addressToCheck, 100);
    // console.log(res);

    const balance = await token.balanceOf(addressToCheck);

    console.log(`Balance of ${addressToCheck}: ${balance.toString()}`);
  } catch (e) {
    console.log(e);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//run script:  npx hardhat run scripts/token_v2.ts --network sepolia
