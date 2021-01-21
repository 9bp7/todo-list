import { Project } from "./project.js";
import { AllProjects } from "./allProjects.js";
import { PopupModal } from "./modals.js";
import { ViewHandler } from "./viewHandler.js";

var firebaseConfig = {
  apiKey: "AIzaSyBZMqcndRXDHrNsYQBHj4YnLP-IlRn15uM",
  authDomain: "todo-list-d2226.firebaseapp.com",
  projectId: "todo-list-d2226",
  storageBucket: "todo-list-d2226.appspot.com",
  messagingSenderId: "238799904864",
  appId: "1:238799904864:web:9f391f654f49b778432305"
};
firebase.initializeApp(firebaseConfig);


if (isSignedIn()) {
  let popup = PopupModal("You're signed in!", 'Great stuff.', 'Continue');
  popup.show();
} else {
  let popup = PopupModal('User must be signed in', 'Please sign in with Google to continue.', 'Sign in with Google', signIn, false);
  popup.show();
}

function signIn() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    console.log(result);
    // ...
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

function isSignedIn() {
  return firebase.auth().currentUser ? true : false;
}

/*if (!AllProjects.saveExists()) {
  let inboxProject = Project("Inbox", true);
  AllProjects.addProject(inboxProject);
} else {
  AllProjects.load();
}*/

ViewHandler.displayAllProjects();
