import { firebaseApp, DB, Auth, UidKey, OrgKey, OrgNameKey, RoleKey, CalKey } from '../Common/firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import $ from 'jquery';

export default (state) => {
	

	Auth.onAuthStateChanged(user => {
		if (user) {
			var uid = user.uid;
			window.localStorage.setItem(UidKey, uid);
			
			window.location.href = "/framside";
			
		} else {
			window.localStorage.removeItem(UidKey);
			window.localStorage.removeItem(OrgKey);
			window.localStorage.removeItem(OrgNameKey);
		}
	});
	
	var loginform = $("#loginForm");
	
	loginform.submit(function( event ) {
		event.preventDefault();
		
		if($("#fbEmail").val().length > 0 && $("#fbPass").val()){
			state.setState({
				showLoginLoading: true
			});
			Auth.signInWithEmailAndPassword($("#fbEmail").val(), $("#fbPass").val()).then(() => {
				state.setState({
					showLoginError: false
				});
			}).catch(err => {
				state.setState({
					showLoginLoading: false,
					showLoginError: true
				});
			});
		}
	});

}