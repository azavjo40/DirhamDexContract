import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { User } from "../typechain-types";

describe("User Contract", function () {
  let user: User;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    const User = await ethers.getContractFactory("User");
    [owner, addr1, addr2] = await ethers.getSigners();

    user = await User.deploy();
    await user.deployed();
  });

  describe("Register", function () {
    it("Should register user", async function () {
      const tx = await user.connect(owner).register("Azam", "Sufiev", 31);
      const receipt = await tx.wait();
      const event = receipt.events?.find((e) => e.event === "UserRegistered");
      expect(event?.args?.walletAddress).to.equal(await owner.getAddress());
    });

    it("Should not allow re-registering the same address", async function () {
      await user.connect(addr1).register("Azam", "Sufiev", 31);
      await expect(user.connect(addr1).register("Azam", "Sufiev", 31)).to.be.revertedWith("User already registered");
    });

    describe("Login", function () {
      it("Should allow a registered user to login", async function () {
        await user.connect(owner).register("Azam", "Sufiev", 31);

        const userInfo = await user.connect(owner).login();
        expect(userInfo.firstName).to.equal("Azam");
        expect(userInfo.lastName).to.equal("Sufiev");
      });

      it("Should not allow an unregistered user to login", async function () {
        await expect(user.connect(addr2).login()).to.be.revertedWith("User not found");
      });
    });

    describe("Remove user", function () {
      it("Should allow remove user", async function () {
        await user.connect(owner).register("Azam", "Sufiev", 31);
        const userInfo = await user.connect(owner).login();
        expect(userInfo.firstName).to.equal("Azam");
        await user.connect(owner).remove();
        await expect(user.connect(owner).login()).to.be.revertedWith("User not found");
      });

      it("Should not allow remove user", async function () {
        await expect(user.connect(owner).remove()).to.be.revertedWith("User does not exist");
      });
    });

    describe("Admin role", function () {
      it("Should allow get all users admin role", async function () {
        const DEFAULT_ADMIN_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEFAULT_ADMIN_ROLE"));
        await user.grantRole(DEFAULT_ADMIN_ROLE, await owner.getAddress());
        await user.connect(addr1).register("Azam", "Sufiev", 31);
        const usersRespons = await user.listUsers();
        expect(usersRespons.length).to.equal(1);
      });

      it("Should not allow non-admin to get all users", async function () {
        await expect(user.connect(addr1).listUsers()).to.be.revertedWith("Admin access only");
      });
    });
  });
});

// npx hardhat test test/User.test.ts
