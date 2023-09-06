import { ethers } from "hardhat";

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  const hardhatToken = await ethers.deployContract("Token");

  console.log("Befor balance", await hardhatToken.balanceOf(addr1.address));

  await hardhatToken.transfer(addr1.address, 50);

  console.log("After balance", await hardhatToken.balanceOf(addr1.address));

  console.log("addr1 balance", await hardhatToken.balanceOf(addr1.address));
  console.log("addr2 balance", await hardhatToken.balanceOf(addr2.address));
  await hardhatToken.connect(addr1).transfer(addr2.address, 50);
  console.log("addr1 balance", await hardhatToken.balanceOf(addr1.address));
  console.log("addr2 balance", await hardhatToken.balanceOf(addr2.address));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//run script: npx hardhat run scripts/token.ts
