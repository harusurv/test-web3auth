import {auth} from '../firebase.ts'
import { GoogleAuthProvider,signInWithRedirect } from "firebase/auth";
var provider = new GoogleAuthProvider();
export const loginWithEmail = () =>{
  return signInWithRedirect(auth, provider)
}
