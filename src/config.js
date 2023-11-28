import { CHAIN_NAMESPACES } from "@web3auth/base";

export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x5",
  rpcTarget: "https://rpc.ankr.com/eth_goerli",
  displayName: "Goerli Testnet",
  blockExplorer: "https://goerli.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
}

export const firebaseConfig = {
  apiKey: "AIzaSyCvqKhoXCA0NTf4U54du1PsVmw95mLDzQs",
  authDomain: "infinitywallet-f9d51.firebaseapp.com",
  databaseURL: "https://infinitywallet-f9d51.firebaseio.com",
  projectId: "infinitywallet-f9d51",
  storageBucket: "infinitywallet-f9d51.appspot.com",
  messagingSenderId: "1028970182942",
  appId: "1:1028970182942:web:0b84ac9cbf9cfc63"
};
export const providers = ["google","apple","facebook","twitter"]
export const verifier = 'infinitywallet-login-firebase'
export const network = 'testnet'
