import {auth} from '../firebase.js'
import { TwitterAuthProvider,signInWithRedirect,getRedirectResult } from "firebase/auth";
var provider = new TwitterAuthProvider();
export const loginWithTwitter = async () =>{
  const rt = await getRedirectResult(auth,provider)
  if(!rt)
    signInWithRedirect(auth,provider);
  return rt
}
