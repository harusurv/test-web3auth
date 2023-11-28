import {auth} from '../firebase.js'
import { OAuthProvider ,signInWithRedirect } from "firebase/auth";
var provider = new OAuthProvider('apple.com');
export const loginWithApple = () =>{
  signInWithRedirect(auth,provider);
}
