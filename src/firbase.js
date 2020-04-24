import * as firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyAPqRs4bdxKc8XztjT_hjMs2jPOXpVqWEw",
  authDomain: "board-game-co.firebaseapp.com",
  databaseURL: "https://board-game-co.firebaseio.com",
  projectId: "board-game-co",
  storageBucket: "board-game-co.appspot.com",
  messagingSenderId: "950092828575",
  appId: "1:950092828575:web:32031340551e348dffb7aa",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export default db;
