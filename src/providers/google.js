import {auth} from '../firebase.js'
import { GoogleAuthProvider,signInWithRedirect,getRedirectResult } from "firebase/auth";
var provider = new GoogleAuthProvider();

export const loginWithGoogle = async () =>{
  const rt = await getRedirectResult(auth,provider)
  if(!rt)
    signInWithRedirect(auth,provider);
  return rt
}
