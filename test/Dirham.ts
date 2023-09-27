import { expect } from "chai";
import { ethers } from "hardhat";

describe("Dirham contract v 1", function () {
  // ...previous test...

  it("Should transfer dirhams between accounts", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const hardhatDirham = await ethers.deployContract("Dirham");

    // Transfer 50 Dirhams from owner to addr1
    await hardhatDirham.transfer(addr1.address, 50);
    expect(await hardhatDirham.balanceOf(addr1.address)).to.equal(50);
  });
});
