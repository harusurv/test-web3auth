import { useEffect, useState } from "react";

import {network,chainConfig} from './config'
import { getRedirectResult } from "firebase/auth";
import {auth} from './firebase.js'

import {loginWithGoogle,loginWithApple,loginWithTwitter,loginWithFacebook} from './providers'
import "./App.css";
import RPC from "./web3RPC"; // for using web3.js

const CryptoJs = require('crypto-js')
const { SHA512, AES,enc } = CryptoJs
const supported = ["google","facebook","reddit","discord","twitch","apple","twitter"]
const encryptKey = (private_key:string,secret_key:string) => {
    const key = SHA512(secret_key).toString(enc.Hex).substring(0, 32)
    const encryptionIV = SHA512(process.env.RANDOM_IV).toString(enc.Hex).substring(0, 16)
    var crypted = AES.encrypt(private_key, key, {iv:encryptionIV});
    return crypted.toString()
}

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [urlGo,setUrlGo] = useState('')
  useEffect(() => {
    const init = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const provider = urlParams.get('provider') as string
        const key = urlParams.get('key') as string
        const loginRes = await getRedirectResult(auth)
        console.log(loginRes)
        if(key && provider && loginRes == null){
          localStorage.setItem('key',key);
          if(provider == "google")
            loginWithGoogle()
          else if(provider == "facebook")
            loginWithFacebook()
          else if(provider == "twitter")
            loginWithTwitter()
          else if(provider == "apple")
            loginWithApple()
        }
        else{
          const idToken = (await loginRes?.user?.getIdToken(true)) as string;
          const secretKey = localStorage.getItem("key") as string;
          localStorage.removeItem("key");
          const url = "infinity://?type=auth&hash="+encryptKey(idToken,secretKey)
          setUrlGo(url)
          window.open(url)
          setLoggedIn(true)
        }
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);
  return (
    <div className="container">
      {loggedIn ? <a href={urlGo}>Open in infinitywallet</a> : "Loading"}

    </div>
  );
}

export default App;
