import {auth} from '../firebase.ts'
import { FacebookAuthProvider,signInWithRedirect,getRedirectResult } from "firebase/auth";
var provider = new FacebookAuthProvider();
export const loginWithFacebook = () =>{
  const rt = await getRedirectResult(auth,provider)
  if(!rt)
    signInWithRedirect(auth,provider);
  return rt
}
