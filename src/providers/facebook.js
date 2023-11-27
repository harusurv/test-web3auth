import {auth} from '../firebase.js'
import { FacebookAuthProvider,signInWithRedirect,getRedirectResult } from "firebase/auth";
var provider = new FacebookAuthProvider();
export const loginWithFacebook = async () =>{
  const rt = await getRedirectResult(auth,provider)
  if(!rt)
    signInWithRedirect(auth,provider);
  return rt
}
