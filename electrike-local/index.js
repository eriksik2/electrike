
var firebase = require('firebase-admin');


function randomRange(min, max) {
    return Math.floor(min + Math.random()*Math.floor(max - min));
}

function genRandomProductCode() {
    return Math.random().toString(36).replace(/[^a-zA-Z0-9]/g, "").substr(0, 4);
}

function genRandomName() {
    return Math.random().toString(36).replace(/[^a-zA-Z]/g, "");
}


async function addRandomOrder(db) {
    var product = randomRange(0, 999999);
    var quantity = randomRange(1, 200);
    await addRandom(db, "Order", {
        ProductId: product,
        quantity: quantity
    });
}

async function addRandomProduct(db) {
    var price = randomRange(0, 10000);
    var quantity = randomRange(0, 200);
    var code = genRandomProductCode();
    await addRandom(db, "Product", {
        ProductCode: code,
        Price: price,
        Quantity: quantity,
    });
}

async function addRandomSupplier(db) {
    var name = genRandomName();
    var phone = randomRange(1111111, 9999999);
    await addRandom(db, "Supplier", {
        Name: name,
        Phone: phone,
    });
}

async function addRandomProductSupplier(db) {
    var product = randomRange(0, 999999);
    var supplier = randomRange(0, 999999);
    await addRandom(db, "ProductSupplier", {
        ProductId: product,
        SupplierId: supplier,
    });
}

async function addRandom(db, dir_name, value) {
    var id = randomRange(0, 999999);
    value[dir_name + "Id"] = id;
    var db_ref = db.ref("/"+dir_name+"/"+id);
    await db_ref.set(value);
}


async function main() {
    // Initialize the app with the url to our database and a private key.
    // The private key is never committed to the repo. See the README.
    var app = firebase.initializeApp({
        credential: firebase.credential.cert(require("../private-key.json")),
        databaseURL: "https://electrike-42dd1-default-rtdb.europe-west1.firebasedatabase.app",
    });
    
    // Get the database.
    var db = app.database();

    console.log("Started.");

    while(true) {
        switch(randomRange(0, 4)) {
            case 0: await addRandomOrder(db); break;
            case 1: await addRandomProduct(db); break;
            case 2: await addRandomSupplier(db); break;
            case 3: await addRandomProductSupplier(db); break;
            //case 4: await removeRandom(db, "Order"); break;
            //case 5: await removeRandom(db, "Product"); break;
            //case 6: await removeRandom(db, "Supplier"); break;
            //case 7: await removeRandom(db, "ProductSupplier"); break;
        }
    }
}

main();