import { useEffect, useState } from "react";
import { getRedirectResult } from "firebase/auth";
import {auth} from './firebase.js'
import {encryptKey} from './utils.js'
import {loginWithGoogle,loginWithApple,loginWithTwitter,loginWithFacebook,loginWithEmail} from './providers'
import "./App.css";

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [urlGo,setUrlGo] = useState('')
  useEffect(() => {
    const init = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const provider = urlParams.get('provider') as string
        const key = urlParams.get('key') as string
        let loginRes = await getRedirectResult(auth)
        if(key && provider && loginRes === null && provider != "email"){
          localStorage.setItem('key',key);
          if(provider === "google")
            loginWithGoogle()
          else if(provider === "facebook")
            loginWithFacebook()
          else if(provider === "twitter")
            loginWithTwitter()
          else if(provider === "apple")
            loginWithApple()
        }
        else{
          const email = urlParams.get('email') as string
          if(provider === "email"){
            if(!email){
              console.error("Invalid request, missing email for email authentification")
              return
            }
            loginRes = await loginWithEmail(decodeURIComponent(email))
          }
          if(loginRes){
            const idToken = (await loginRes?.user?.getIdToken(true)) as string;
            let ws = new WebSocket('wss://infinitysocial.ddns.net:40510');
            ws.onopen = () => {
              var params = {
                 "type": "send",
                 "channel": key,
                 "data":encryptKey(idToken,key)
              }
              ws.send(JSON.stringify(params))
              setLoggedIn(true)
            }
          }
          else{
            console.error("cant login")
          }


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
