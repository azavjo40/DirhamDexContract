import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";

describe("DIRHAM Contract", function () {
  let dirham: Contract;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;
  const MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));

  beforeEach(async function () {
    const DIRHAM = await ethers.getContractFactory("DIRHAM");
    [owner, addr1, addr2] = await ethers.getSigners();

    dirham = await DIRHAM.deploy();
    await dirham.deployed();

    await dirham.grantRole(MINTER_ROLE, await owner.getAddress());
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const ownerAddress = await owner.getAddress();
      expect(await dirham.hasRole(await dirham.DEFAULT_ADMIN_ROLE(), ownerAddress)).to.be.true;
    });

    it("Should set the right minter role", async function () {
      const ownerAddress = await owner.getAddress();
      expect(await dirham.hasRole(MINTER_ROLE, ownerAddress)).to.be.true;
    });
  });

  describe("Minting", function () {
    it("Should mint new tokens", async function () {
      const addr1Address = await addr1.getAddress();
      await dirham.mint(addr1Address, 100);
      expect(await dirham.balanceOf(addr1Address)).to.equal(100);
    });
  });

  describe("Burning", function () {
    it("Should burn tokens", async function () {
      const addr1Address = await addr1.getAddress();
      await dirham.mint(addr1Address, 100);
      await dirham.burn(addr1Address, 50);
      expect(await dirham.balanceOf(addr1Address)).to.equal(50);
    });
  });
});

// npx hardhat test test/Dirham.test.ts
