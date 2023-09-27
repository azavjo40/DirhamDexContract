import { ethers } from "hardhat";
import { config } from "dotenv";

config();

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    const [owner] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    const DirhamContract = await ethers.getContractFactory("Dirham");

    const dirham: any = DirhamContract.attach(process.env.DIRHAM_ADSRESS!);

    const addressToCheck = owner.address;

    // const res = await token.transfer(addressToCheck, 100);
    // console.log(res);

    const balance = await dirham.balanceOf(addressToCheck);

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
