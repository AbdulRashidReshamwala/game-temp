import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCgT6b2yWFNjBLmKm-XR4CjELqJbC1_iqs",
  authDomain: "board-game-co-test.firebaseapp.com",
  databaseURL: "https://board-game-co-test.firebaseio.com",
  projectId: "board-game-co-test",
  storageBucket: "board-game-co-test.appspot.com",
  messagingSenderId: "567495644095",
  appId: "1:567495644095:web:2a5fd82872c7569e11c70a",
  measurementId: "G-L2CK8BXWD6",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export default db;
