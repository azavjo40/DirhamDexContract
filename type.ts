import { ContractReceipt, ContractTransaction, BigNumber } from "ethers";
import { Signer } from "ethers";

export interface ITransactionResult {
  tx: ContractTransaction;
  receipt: ContractReceipt;
  event: {
    args: IUser;
    event: string;
  };
}

export interface IUser {
  walletAddress: Signer;
  firstName: string;
  lastName: string;
  age: number;
}

export interface ILoginResult {
  userId: BigNumber;
  firstName: string;
  lastName: string;
  age: BigNumber;
  walletAddress: string;
}
