import { firebaseApp, DB, Auth, UidKey, OrgKey, OrgNameKey, RoleKey, CalKey } from '../Common/firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import $ from 'jquery';

export default (state) => {
	window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('submitLoginMobile', {
		'size': 'invisible',
		'callback': function(response) {
			// reCAPTCHA solved, allow signInWithPhoneNumber.
		}
	});

	Auth.onAuthStateChanged(user => {
		if (user) {
			var uid = user.uid;
			window.localStorage.setItem(UidKey, uid);
			
			var userRef = DB.collection("users").doc(uid);
			var logRef = DB.collection("statistics/users/login").doc();
			var userLogRef = userRef.collection("userlog").doc();
			
			userRef.get().then(function(user) {
				if (user.exists) {
					var userBatch = DB.batch();
					var userObj = user.data();
					var last_logged_in = new Date();

					userObj.last_logged_in = last_logged_in;

					var logObj = {
						uid: user.id,
						username: userObj.username,
						name: userObj.name,
						timestamp: last_logged_in
					};

					var userLogObj = {
						timestamp: last_logged_in
					};
					
					userBatch.set(userRef, userObj);
					
					
					userBatch.commit().then(function () {
						var favOrgId = user.data().fav_org;
						var userRolesRef = DB.collection("users").doc(uid+"/styreportalen/"+favOrgId);
						var userOrgTablesRef = DB.collection(`users/${uid}/styreportalen/${favOrgId}/tables`);
						var orgTablesRef = DB.collection(`organizations/${favOrgId}/tables`);

						Promise.all([userRolesRef.get(), userOrgTablesRef.get(), orgTablesRef.get()]).then(function(results) {
							let userRoles = results[0];
							let userOrgTables = results[1];
							let orgTables = results[2];

							userOrgTables.forEach((tableRef) => {
								const table = tableRef.data();
								window.localStorage.setItem(tableRef.id+"_columns", JSON.stringify(table));
							});

							orgTables.forEach((tableRef) => {
								const table = tableRef.data();
								window.localStorage.setItem(tableRef.id, JSON.stringify(table));
							});

							if(userRoles.data().roles !== undefined){
								window.localStorage.setItem(RoleKey, userRoles.data().roles.join(","));
							} else {
								window.localStorage.setItem(RoleKey, "");
							}

							if(userRoles.data().event_tags !== undefined){
								window.localStorage.setItem(CalKey, userRoles.data().event_tags.join(","));
							} else {
								window.localStorage.setItem(CalKey, "");
							}

							window.localStorage.setItem(OrgKey, favOrgId);
							window.localStorage.setItem(OrgNameKey, userRoles.data().name);
							
							if (userObj.organizations[favOrgId]) {
								window.location.href = "/styrearbeid";
							}
						});
					}).catch(function(error) {
						console.log(error);
					});
				}
			});
			
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