import { ethers } from "hardhat";
import { config } from "dotenv";

config();

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    const [owner] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    const DexContract = await ethers.getContractFactory("DexContract");

    const dex: any = DexContract.attach(process.env.DEX_CONTRACT_ADSRESS!);

    await dex.buyTokens(process.env.USDT_ADDRESS, 1, 10);

    // const res = await token.transfer(addressToCheck, 100);
    // console.log(res);

    // const balance = await dirham.balanceOf(addressToCheck);

    // console.log(`Balance of ${addressToCheck}: ${balance.toString()}`);
  } catch (e) {
    console.log(e);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//run script:  npx hardhat run scripts/dexContract.ts --network sepolia
