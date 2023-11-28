import {auth} from '../firebase.js'
import { GoogleAuthProvider,signInWithRedirect } from "firebase/auth";
var provider = new GoogleAuthProvider();

export const loginWithGoogle = async () =>{
  signInWithRedirect(auth,provider);
}
