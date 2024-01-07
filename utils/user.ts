import { Contract, Signer } from "ethers";
import { ILoginResult, ITransactionResult, IUser } from "../type";

export async function registerUser(userContract: Contract, user: IUser): Promise<ITransactionResult> {
  const tx = await userContract.connect(user.walletAddress).register(user.firstName, user.lastName, user.age);
  const receipt = await tx.wait();
  const event = receipt.events.find((e: any) => e.event === "UserRegistered");
  return { tx, receipt, event };
}

export async function loginUser(userContract: Contract, signer: Signer): Promise<ILoginResult> {
  return await userContract.connect(signer).login();
}
