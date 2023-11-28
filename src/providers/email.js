import {auth} from '../firebase.js'
import { GoogleAuthProvider,signInWithRedirect } from "firebase/auth";
var provider = new GoogleAuthProvider();
export const loginWithEmail = () =>{
  signInWithRedirect(auth, provider)
}
