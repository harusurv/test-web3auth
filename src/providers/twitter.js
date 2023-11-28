import {auth} from '../firebase.js'
import { TwitterAuthProvider,signInWithRedirect,getRedirectResult } from "firebase/auth";
var provider = new TwitterAuthProvider();
export const loginWithTwitter = async () =>{
  signInWithRedirect(auth,provider);
}
