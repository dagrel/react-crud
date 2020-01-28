import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const config = {
    apiKey: "AIzaSyAPiGSOlobmiekwazYLiX9SDKUWnzj-ArE",
    authDomain: "demo2019-abc.firebaseapp.com",
    databaseURL: "https://demo2019-abc.firebaseio.com",
    projectId: "demo2019-abc",
    storageBucket: "demo2019-abc.appspot.com",
    messagingSenderId: "145431894793",
    timestampsInSnapshots: true
};

export const firebaseTimestamp = firebase.firestore.Timestamp;
export const firebaseFieldValue = firebase.firestore.FieldValue;

export const firebaseApp = firebase.initializeApp(config);

const fbdb = firebaseApp.firestore();

export const DB = fbdb;

export const Storage = firebaseApp.storage().ref();
export const Auth = firebaseApp.auth();

export const UidKey = 'styrearbeid-uid-key';
export const OrgKey = 'styrearbeid-org-key';
export const OrgNameKey = 'styrearbeid-org-name-key';
export const RoleKey = 'styrearbeid-role-key';
export const CalKey = 'styrearbeid-calendar-key';
export const PinKey = 'styrearbeid-pin-key';
export const PinFilterKey = 'styrearbeid-pin-filter-key';

export const isAuthenticated = () => {
    return !!Auth.currentUser || !!localStorage.getItem(UidKey);
}

export const hasRole = (reqRoles) => {
    let roles = localStorage.getItem(RoleKey);
    if(roles){
        roles = roles.split(",");

        /*
        var reqRole = reqRoles.split(",");
        var intRole = roles.reduce((r, a) => reqRole.includes(a) && r.concat(a) || r, []);

        if(intRole.length){
            return true;
        } else {
            return false;
        }
        */
        
        if(roles.indexOf(reqRoles) >= 0){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}