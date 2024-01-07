import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { loginUser, registerUser } from "../utils/user";

describe("User Contract", function () {
  let user: Contract;
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
      const { event } = await registerUser(user, {
        walletAddress: owner,
        firstName: "Azam",
        lastName: "Sufiev",
        age: 31,
      });
      expect(event.args.walletAddress).to.equal(await owner.getAddress());
    });

    it("Should not allow re-registering the same address", async function () {
      await registerUser(user, { walletAddress: addr1, firstName: "Azam", lastName: "Sufiev", age: 31 });
      await expect(
        registerUser(user, { walletAddress: addr1, firstName: "Azam", lastName: "Sufiev", age: 31 })
      ).to.be.revertedWith("User already registered");
    });

    describe("Login", function () {
      it("Should allow a registered user to login", async function () {
        await registerUser(user, { walletAddress: owner, firstName: "Azam", lastName: "Sufiev", age: 31 });

        const userInfo = await loginUser(user, owner);
        expect(userInfo.firstName).to.equal("Azam");
        expect(userInfo.lastName).to.equal("Sufiev");
      });

      it("Should not allow an unregistered user to login", async function () {
        await expect(loginUser(user, addr2)).to.be.revertedWith("User not found");
      });
    });
  });
});

// npx hardhat test test/User.test.ts
