import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("dotenv").config();

const { ETHERSCAN_API_KEY, SEPOLIA_PRIVATE_KEY, INFURA_API_KEY } = process.env;
// Go to https://infura.io, sign up, create a new API key
// in its dashboard, and replace "KEY" with it
// const INFURA_API_KEY = "";

// Replace this private key with your Sepolia account private key
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
// const SEPOLIA_PRIVATE_KEY = "";

//The first thing you need is an API key from Etherscan. To get one, go to https://etherscan.io/myapikey
// const ETHERSCAN_API_KEY = ''

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
