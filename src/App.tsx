import { useEffect, useState } from "react";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import type { IProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/single-factor-auth";

import "./App.css";
import RPC from "./web3RPC"; // for using web3.js

const CryptoJs = require('crypto-js')
const { SHA512, AES,enc } = CryptoJs
const supported = ["google","facebook","reddit","discord","twitch","apple","twitter"]
const clientId = process.env.CLIENT_ID; // get from https://dashboard.web3auth.io
const encryptKey = (private_key:string,secret_key:string) => {
    const key = SHA512(secret_key).toString(enc.Hex).substring(0, 32)
    const encryptionIV = SHA512(process.env.RANDOM_IV).toString(enc.Hex).substring(0, 16)
    var crypted = AES.encrypt(private_key, key, {iv:encryptionIV});
    return crypted.toString()
}
const initWeb3 = async () => {
  const web3authSfa = new Web3Auth({
    clientId,
    chainConfig,
    web3AuthNetwork: network,
    usePnPKey: false,
  });
  const providerEth = new EthereumPrivateKeyProvider({ config: { chainConfig } })
  await web3authSfa.init(providerEth);
  return web3authSfa
}
function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [invalidKey, setInvalidKey] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        let loginRes
        if(provider == "google")
          loginRes = await loginWithGoogle()
        else if(provider == "facebook")
          loginRes = await loginWithFacebook()
        else if(provider == "twitter")
          loginRes = await loginWithTwitter()
        else if(provider == "apple")
          loginRes = await loginWithApple()
        if(!loginRes){
          return
        }
        const idToken = await loginRes.user.getIdToken(true);
        const secretKey = localStorage.getItem("key") as string;
        localStorage.removeItem("key");
        window.open("infinity://?type=auth&hash="+encryptKey(idToken,secretKey))
      } catch (error) {
        console.error(error);
      }
    };
    const params = new URLSearchParams(window.location.search);
    if(params.get('key') != undefined && (params.get('key') as string).length > 0){
      localStorage.setItem("key", params.get('key') as string);
    }
    else{
      if(window.location.hash.length == 0) {
        setInvalidKey(true)
      }
    }

    init();
  }, []);
  return (
    <div className="container">

    </div>
  );
}

export default App;
