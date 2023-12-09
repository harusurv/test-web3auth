import {auth} from '../firebase.js'
import { sendSignInLinkToEmail,isSignInWithEmailLink,signInWithEmailLink } from "firebase/auth";
import {sleep} from '../utils.js'

export const loginWithEmail = (email) =>{
  const actionCodeSettings = {
    url: document.location.href,
    // This must be true.
    handleCodeInApp: true
  };
  return new Promise(async (resolve)=>{
    if (isSignInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, email, window.location.href)
      .then((result) => {
        console.log(result)
        resolve(result)
      })
      .catch((error) => {
        console.error(error)
        resolve()
      });
    }
    else{
      resolve()
    }

  })
}
