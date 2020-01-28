import {  Auth, UidKey, OrgKey, RoleKey } from '../Common/firebase';

export default () => {

  Auth.signOut().then(function() {
	
  }).catch(function(error) {
	// An error happened.
  });
  
  Auth.onAuthStateChanged(user => {
	if (user) {
		window.localStorage.setItem(UidKey, user.uid);
		window.location.href = "/startside";
	} else {
		window.localStorage.removeItem(UidKey);
		window.localStorage.removeItem(OrgKey);
		window.localStorage.removeItem(RoleKey);
		window.location.href = "/login";
	}
  });
}