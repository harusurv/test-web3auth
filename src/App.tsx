import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CHAIN_NAMESPACES, SafeEventEmitterProvider,WALLET_ADAPTERS } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import "./App.css";
import RPC from "./web3RPC"; // for using web3.js
import {
  WalletConnectV2Adapter,
  getWalletConnectV2Settings,
} from "@web3auth/wallet-connect-v2-adapter";

const CryptoJs = require('crypto-js')
const { SHA512, AES,enc } = CryptoJs
const supported = ["google","facebook","reddit","discord","twitch","apple","twitter"]
const clientId =
  process.env.CLIENT_ID; // get from https://dashboard.web3auth.io
const encryptKey = (private_key:string,secret_key:string) => {
    const key = SHA512(secret_key).toString(enc.Hex).substring(0, 32)
    const encryptionIV = SHA512(process.env.RANDOM_IV).toString(enc.Hex).substring(0, 16)
    var crypted = AES.encrypt(private_key, key, {iv:encryptionIV});
    return crypted.toString()
}

function App() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);

  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [loggedIn, setLoggedIn] = useState(false);
  const [invalidKey, setInvalidKey] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId:clientId as string,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1",
            rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
          uiConfig: {
            appName: "W3A",
            appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
            theme: "light",
            loginMethodsOrder: ["google","apple",  "twitter"],
            defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
            loginGridCol: 3,
            primaryButton: "socialLogin", // "externalLogin" | "socialLogin" | "emailLogin"
          },
          web3AuthNetwork: "cyan",
        });

        const openloginAdapter = new OpenloginAdapter({
          loginSettings: {
            mfaLevel: "mandatory",
          },
          adapterSettings: {
            whiteLabel: {
              name: "InfinityWallet",
              logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
              logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
              defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
              dark: false, // whether to enable dark mode. defaultValue: false
            },
            mfaSettings: {
              deviceShareFactor: {
                enable: true,
                priority: 1,
                mandatory: true,
              },
              backUpShareFactor: {
                enable: true,
                priority: 2,
                mandatory: false,
              },
              socialBackupFactor: {
                enable: true,
                priority: 3,
                mandatory: false,
              },
              passwordFactor: {
                enable: true,
                priority: 4,
                mandatory: false,
              },
            },
          },
        });
        web3auth.configureAdapter(openloginAdapter);
        await web3auth.init();

        var provider_selected = "google";
        const params = new URLSearchParams(window.location.search);
        if(params.get('provider') != undefined && (params.get('provider') as string).length > 0){
          provider_selected = params.get('provider') as string;
          if(!supported.includes(provider_selected)){
            provider_selected = "google"
          }
        }
        const web3authProvider = await web3auth.connectTo(
          WALLET_ADAPTERS.OPENLOGIN,
          {
            loginProvider: web3auth.provider,
          }
        );
        setProvider(web3authProvider);
        setLoggedIn(true);
        const rpc = new RPC(web3authProvider as SafeEventEmitterProvider);
        const privateKey = await rpc.getPrivateKey();
        const secretKey = localStorage.getItem("key") as string;
        localStorage.removeItem("key");
        window.open("infinity://?type=auth&hash="+encryptKey(privateKey,secretKey))
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
