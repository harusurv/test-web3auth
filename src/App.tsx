import { useEffect, useState } from "react";
import { getRedirectResult } from "firebase/auth";
import {auth} from './firebase.js'
import {encryptKey} from './utils.js'
import "./App.css";


function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [urlGo,setUrlGo] = useState('')
  useEffect(() => {
    const init = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const secretKey = urlParams.get('key') as string
        const loginRes = await getRedirectResult(auth)
        if(secretKey && loginRes){
          const idToken = (await loginRes?.user?.getIdToken(true)) as string;
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
