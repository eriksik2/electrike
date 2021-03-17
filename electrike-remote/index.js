
// Initialize Firebase. All these constants are public. 
var app = firebase.initializeApp({
    apiKey: "AIzaSyB1ZLwZrhZFqmubSkugV742VEwYkyaP7lg",
    authDomain: "electrike-42dd1.firebaseapp.com",
    databaseURL: "https://electrike-42dd1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "electrike-42dd1",
    storageBucket: "electrike-42dd1.appspot.com",
    messagingSenderId: "627698290546",
    appId: "1:627698290546:web:4e5575012299688d3d97eb",
    measurementId: "G-G4ZM3QDS8N"
});

// Get the database.
var db = app.database();

// Get the html node that will be changed.
var counter_node = document.getElementById("counter-node");

// We ref the "counter" value in the db, and then use the "on" function to modify counter_node whenever the db value changes.
db.ref("counter").on('value', counter => {

    counter_node.innerText = counter.val();
});