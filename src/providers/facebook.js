import {auth} from '../firebase.js'
import { FacebookAuthProvider,signInWithRedirect } from "firebase/auth";
var provider = new FacebookAuthProvider();
export const loginWithFacebook = async () =>{
  signInWithRedirect(auth,provider);
}
