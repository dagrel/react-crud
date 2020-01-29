import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';


const config = {
   apiKey: "AIzaSyBi3bI1SYnVcHJGRAlTa5SMCwUCch3hpaQ",
    authDomain: "test1-10fe4.firebaseapp.com",
    databaseURL: "https://test1-10fe4.firebaseio.com",
    projectId: "test1-10fe4",
    storageBucket: "test1-10fe4.appspot.com",
    messagingSenderId: "712307666399",
    appId: "1:712307666399:web:e40194294bd16178c7686a",
    measurementId: "G-1EY3J89D6B",
    timestampsInSnapshots: true
  };

  /*const config = {
    apiKey: "AIzaSyAPiGSOlobmiekwazYLiX9SDKUWnzj-ArE",
    authDomain: "demo2019-abc.firebaseapp.com",
    databaseURL: "https://demo2019-abc.firebaseio.com",
    projectId: "demo2019-abc",
    storageBucket: "demo2019-abc.appspot.com",
    messagingSenderId: "145431894793",
    timestampsInSnapshots: true
};*/

export const firebaseTimestamp = firebase.firestore.Timestamp;
export const firebaseFieldValue = firebase.firestore.FieldValue;

export const firebaseApp = firebase.initializeApp(config);

const fbdb = firebaseApp.firestore();

export const DB = fbdb;

export const Storage = firebaseApp.storage().ref();
export const Auth = firebaseApp.auth();

export const UidKey = 'test';
export const OrgKey = 'test1';
export const OrgNameKey = 'test2';
export const RoleKey = 'test3';
export const CalKey = 'test4';
export const PinKey = 'test5';
export const PinFilterKey = 'test6';

export const isAuthenticated = () => {
    return !!Auth.currentUser || !!localStorage.getItem(UidKey);
}

export const hasRole = (reqRoles) => {
    let roles = localStorage.getItem(RoleKey);
    if(roles){
        roles = roles.split(",");

        if(roles.indexOf(reqRoles) >= 0){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}