import { ethers } from "hardhat";

async function main() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  const hardhatToken = await ethers.deployContract("Token");

  console.log(await hardhatToken.balanceOf(addr1.address));

  await hardhatToken.transfer(addr1.address, 50);

  console.log(await hardhatToken.balanceOf(addr1.address));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
