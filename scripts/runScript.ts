import { ethers } from "hardhat";
import { config } from "dotenv";

config();

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    const ExchangeFactory = await ethers.getContractFactory("Exchange");
    const exchange = ExchangeFactory.attach(ethers.utils.getAddress(process.env.EXCHANGE_ADDRESS!));

    // await exchange.grantRole(await exchange.DEFAULT_ADMIN_ROLE(), "0x846AcA109DEA290808107e1E83F829B3d0204a5E");
    console.log(await exchange.exchangeRates("0x6175a8471C2122f778445e7E07A164250a19E661"));
    // await exchange.setExchangeRate("0x6175a8471C2122f778445e7E07A164250a19E661", 1);
  } catch (e) {
    console.log(e);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//run script: npx hardhat run scripts/runScript.ts --network sepolia
