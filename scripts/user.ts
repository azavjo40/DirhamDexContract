import { ethers } from "hardhat";
import { config } from "dotenv";

config();
const { USER_CONTRACT_ADSRESS } = process.env;

interface IUserContract {
  getUsers(): Promise<any>;
  registerUser(firstName: string, lastName: string, age: number): Promise<void>;
}

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    const [owner] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    const UserContract = await ethers.getContractFactory("UserContract");

    const user: IUserContract = UserContract.attach(USER_CONTRACT_ADSRESS!) as unknown as IUserContract;
    // const res = await user.registerUser("Azam", "Sufiev", 31);
    // console.log("Response", res);
    const users = await user.getUsers();
    console.log("Users", users);
  } catch (e) {
    console.log(e);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//run script:  npx hardhat run scripts/user.ts --network sepolia
