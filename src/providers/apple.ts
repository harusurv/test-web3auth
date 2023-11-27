import {auth} from '../firebase.ts'
import { OAuthProvider ,signInWithRedirect } from "firebase/auth";
var provider = new OAuthProvider('apple.com');
export const loginWithApple = async () =>{
  const rt = await getRedirectResult(auth,provider)
  if(!rt)
    signInWithRedirect(auth,provider);
  return rt
}