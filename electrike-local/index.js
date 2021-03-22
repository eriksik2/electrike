
var firebase = require('firebase-admin');
var readline = require('readline');


function randomRange(min, max) {
    return Math.floor(min + Math.random()*Math.floor(max - min));
}

function genRandomProductCode() {
    return Math.random().toString(36).replace(/[^a-zA-Z0-9]/g, "").substr(0, 4);
}

function genRandomName() {
    return Math.random().toString(36).replace(/[^a-zA-Z]/g, "");
}


function genRandomOrder() {
    var product = randomRange(0, 999999);
    var quantity = randomRange(1, 200);
    return {
        ProductId: product,
        quantity: quantity
    };
}

function genRandomProduct() {
    var price = randomRange(0, 10000);
    var quantity = randomRange(0, 200);
    var code = genRandomProductCode();
    return {
        ProductCode: code,
        Price: price,
        Quantity: quantity,
    };
}

function genRandomSupplier() {
    var name = genRandomName();
    var phone = randomRange(1111111, 9999999);
    return {
        Name: name,
        Phone: phone,
    };
}

function genRandomProductSupplier() {
    var product = randomRange(0, 999999);
    var supplier = randomRange(0, 999999);
    return {
        ProductId: product,
        SupplierId: supplier,
    };
}

function genRandom(dir_name) {
    switch(dir_name) {
        case "Order": return genRandomOrder();
        case "Product": return genRandomProduct();
        case "Supplier": return genRandomSupplier();
        case "ProductSupplier": return genRandomProductSupplier();
        default: throw dir_name;
    }
}

async function add(db, dir_name, value) {
    var id_ref = db.ref("/"+dir_name+"/NextId");
    var id = null;
    await id_ref.transaction(nextid => {
        id = nextid || 0;
        return (nextid || 0) + 1;
    });
    if(id === null) throw "";

    value[dir_name + "Id"] = id;
    var db_ref = db.ref("/"+dir_name+"/"+id);
    await db_ref.set(value);
}


async function main() {
    console.log("Starting...");
    // Initialize the app with the url to our database and a private key.
    // The private key is never committed to the repo. See the README.
    var app = firebase.initializeApp({
        credential: firebase.credential.cert(require("../private-key.json")),
        databaseURL: "https://electrike-42dd1-default-rtdb.europe-west1.firebasedatabase.app",
    });
    
    // Get the database.
    var db = app.database();

    const rl = readline.createInterface(process.stdin);

    var extra_prompt = [];
    var promptNext = (...args) => {
        if(extra_prompt.length > 0) extra_prompt.push("\n");
        extra_prompt.push(...args);
    };
    var doPrompt = () => {
        console.log(...extra_prompt);
        extra_prompt = [];
        process.stdout.write(">> ");
    };
    var doInitPrompt = () => {
        console.log("Avaliable actions:");
        console.log(" help");
        console.log("\t Show this screen.");
        console.log(" new [item]");
        console.log("\t Add a random new item.");
        console.log(" remove [item]");
        console.log("\t Remove a random item.");
        console.log(" watch new [item]");
        console.log("\t Print out the next item that gets added.");
        console.log(" [item] can be one of:");
        console.log("\t order | product | supplier | product supplier");
        console.log("\t ord   | prod    | supp     | ps");
        console.log("\t o     | p       | s        |");
    };
    var doFailPrompt = () => {
        doInitPrompt();
        console.log("Try again");
    };
    console.clear();
    doInitPrompt();
    doPrompt();
    for await(var line of rl) {
        line = line.toLowerCase();
        var regex = line.match(/^\s*(?:(new|remove|watch new)\s*(order|product|supplier|product supplier|ord|prod|supp|ps|o|p|s)|help)\s*$/);
        if(regex === null) {
            console.clear();
            doFailPrompt();
            doPrompt();
            continue;
        }
        if(regex[0] == "help") {
            console.clear();
            doInitPrompt();
            doPrompt();
            continue;
        }
        var action = regex[1];
        var item = regex[2];
        var dir_name;
        switch(item) {
            case "order":
            case "ord":
            case "o": dir_name = "Order"; break;
            case "product":
            case "prod":
            case "p": dir_name = "Product"; break;
            case "supplier":
            case "supp":
            case "s": dir_name = "Supplier"; break;
            case "product supplier":
            case "ps": dir_name = "ProductSupplier"; break;
            default: throw item;
        }
        var awaitable = null;
        switch(action) {
            case "new": {
                var value = genRandom(dir_name);
                awaitable = add(db, dir_name, value);
                console.log("Adding");
                promptNext("Added", dir_name, value);
            } break;
            case "watch new": {
                console.log("Watching...");
                var nextid = (await db.ref("/"+dir_name+"/NextId").get()).val();
                var new_item = await new Promise(resolve => {
                    var ref = db.ref("/"+dir_name+"/"+nextid);
                    var cb = ref.on('value', data => {
                        if(data.val() === null) return;
                        ref.off('value', cb);
                        resolve(data.val());
                    });
                });
                promptNext("Someone added", dir_name, new_item);
            } break;
            //case "remove": removeRandom(db, dir_name); break;
        }
        if(awaitable !== null) {
            console.log("...");
            await awaitable;
        }
        console.clear();
        doPrompt();
    }
}

main();