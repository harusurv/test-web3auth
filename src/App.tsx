import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import "./App.css";
import RPC from "./web3RPC"; // for using web3.js
import {
  WalletConnectV2Adapter,
  getWalletConnectV2Settings,
} from "@web3auth/wallet-connect-v2-adapter";
const CryptoJs = require('crypto-js')
const { SHA512, AES,enc } = CryptoJs
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
  const [secretKey,setSecretKey] = useState<string>('')
  const [loggedIn, setLoggedIn] = useState(false);
  const [invalidKey, setInvalidKey] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        if(params.get('key') != undefined && (params.get('key') as string).length > 0){
          setSecretKey(params.get('key') as string);
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
              mfaLevel: "optional",
            },
            adapterSettings: {
              uxMode: "redirect", // "redirect" | "popup"
              whiteLabel: {
                name: "Your app Name",
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
          const defaultWcSettings = await getWalletConnectV2Settings(
            "eip155",
            [1, 137, 56,25,42161,1666600000,10,50,321,66,43114],
            "04309ed1007e77d1f119b85205bb779d"
          );
          const walletConnectV2Adapter = new WalletConnectV2Adapter({
            adapterSettings: { ...defaultWcSettings.adapterSettings },
            loginSettings: { ...defaultWcSettings.loginSettings },
          });

          web3auth.configureAdapter(walletConnectV2Adapter);

          setWeb3auth(web3auth);

          await web3auth.initModal();

          setProvider(web3auth.provider);

          if (web3auth.connected) {

            setLoggedIn(true);
          }
        }
        else{
          setInvalidKey(true)
        }

      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);
  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };
  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    setLoggedIn(true);
    const rpc = new RPC(web3authProvider as SafeEventEmitterProvider);
    const privateKey = await rpc.getPrivateKey();
    console.log("infinity://?type=auth&hash="+encryptKey(privateKey,secretKey))
    window.open("infinity://?type=auth&hash="+encryptKey(privateKey,secretKey))
  };


  // const changeNetwork = async () => {
  //   if (!provider) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const privateKey = await rpc.getPrivateKey();
  //   uiConsole(privateKey);
  // };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <button onClick={async ()=>{

          const rpc = new RPC(provider as SafeEventEmitterProvider);
          const privateKey = await rpc.getPrivateKey();
          console.log("infinity://?type=auth&hash="+encryptKey(privateKey,secretKey))

          window.open("infinity://?type=auth&hash="+encryptKey(privateKey,secretKey))
        }}>Open InfinityWallet</button>
          <button onClick={logout}>Logout</button>
      </div>
      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>

  );

  return (
    <div className="container">
      <h1 className="title">
        <a target="_blank" href="http://web3auth.io/" rel="noreferrer">
          Web3Auth{" "}
        </a>
        & ReactJS Ethereum Example
      </h1>

      <div className="grid">{invalidKey ? "The petition has to be started from the wallet" : loggedIn ? loggedInView : unloggedInView}</div>

      <footer className="footer">
        <a
          href="https://github.com/Web3Auth/examples/tree/main/web-modal-sdk/evm/react-evm-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer>
    </div>
  );
}

export default App;
