
var firebase = require('firebase-admin');


async function main() {
    // Initialize the app with the url to our database and a private key.
    // The private key is never committed to the repo. See the README.
    var app = firebase.initializeApp({
        credential: firebase.credential.cert(require("../private-key.json")),
        databaseURL: "https://electrike-42dd1-default-rtdb.europe-west1.firebasedatabase.app",
    });
    
    // Get the database.
    var db = app.database();

    // Print out the rules just to make sure we are connected.
    var rules = await db.getRules();
    console.log(rules);

    // Example usage: Increment the "counter" value in the db by 1 in an infinite loop.
    // Look at the database console while this is running to see the value go up.
    while(true) {
        var counter_ref = db.ref("counter");
        var counter = await counter_ref.get();

        var value = counter.val();
        if(value === undefined) value = 0;

        await counter_ref.set(value + 1);
    }
}

main();