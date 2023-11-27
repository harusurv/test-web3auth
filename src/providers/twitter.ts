import {auth} from '../firebase.ts'
import { TwitterAuthProvider,signInWithRedirect,getRedirectResult } from "firebase/auth";
var provider = new TwitterAuthProvider();
export const loginWithTwitter = () =>{
  const rt = await getRedirectResult(auth,provider)
  if(!rt)
    signInWithRedirect(auth,provider);
  return rt
}
