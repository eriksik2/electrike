
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

async function getRandomId(db, dir_name) {
    var items = (await db.ref("/"+dir_name).limitToFirst(10).get()).val();
    var keys = Object.keys(items).filter(key => key !== "NextId");
    return keys[randomRange(0, keys.length)];
}

async function remove(db, dir_name, id) {
    await db.ref("/"+dir_name+"/"+id).set(null);
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
    var flushExtra = () => {
        console.log(...extra_prompt);
        extra_prompt = [];
    };
    var promptNext = (...args) => {
        if(extra_prompt.length > 0) extra_prompt.push("\n");
        extra_prompt.push(...args);
    };
    var doPrompt = () => {
        flushExtra();
        process.stdout.write(">> ");
    };
    var doInitPrompt = () => {
        console.log("Avaliable actions:");
        console.log(" help");
        console.log("\t Show this screen.");
        console.log(" new [item] [reps]");
        console.log("\t Add a random new item.");
        console.log(" remove [item] [reps]");
        console.log("\t Remove a random item [reps] times.");
        console.log(" watch new [item] [reps]");
        console.log("\t Print out the next [reps] items that gets added.");
        console.log(" watch remove [item] [reps]");
        console.log("\t Print out the next [reps] items that gets removed.");
        console.log(" [item] can be one of:");
        console.log("\t | order | product | supplier | product supplier |");
        console.log("\t | o     | p       | s        | ps               |");
        console.log(" [reps] can be either \"forever\", \"N times\", (N is an arbitrary number)");
        console.log("\t or not specified, in which case it defaults to \"1 times\".");
    };
    var doFailPrompt = () => {
        doInitPrompt();
        console.log("Try again");
    };
    console.clear();
    doInitPrompt();
    doPrompt();
    var did_batch_last = false;
    for await(var line of rl) {
        line = line.toLowerCase();
        var regex = line.match(/^\s*(?:(new|remove|watch new|watch remove)\s*(order|product|supplier|product supplier|o|p|s|ps)|help)\s*(forever|[0-9]+\s*times)?\s*$/);
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
        var reps = regex[3] || 1;
        var do_forever = reps === "forever";
        reps = parseInt(reps);
        var interactive = reps == 1;
        var dir_name;
        switch(item) {
            case "order":
            case "o": dir_name = "Order"; break;
            case "product":
            case "p": dir_name = "Product"; break;
            case "supplier":
            case "s": dir_name = "Supplier"; break;
            case "product supplier":
            case "ps": dir_name = "ProductSupplier"; break;
            default: throw item;
        }
        for(var i = 0; i < (do_forever ? i + 1 : reps); ++i) {
            flushExtra();
            var awaitable = null;
            switch(action) {
                case "new": {
                    if(interactive) console.log("Adding");
                    var value = genRandom(dir_name);
                    awaitable = add(db, dir_name, value);
                    promptNext("Added", dir_name, value);
                } break;
                case "remove": {
                    if(interactive) console.log("Removing");
                    var id = await getRandomId(db, dir_name);
                    awaitable = remove(db, dir_name, id);
                    promptNext("Removed", dir_name, "with id", id);
                } break;
                case "watch new": {
                    if(interactive) console.log("Watching...");
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
                case "watch remove": {
                    if(interactive) console.log("Watching...");
                    var old_item = await new Promise(resolve => {
                        var ref = db.ref("/"+dir_name);
                        var cb = ref.on('child_removed', data => {
                            if(data.val() === null) return;
                            ref.off('child_removed', cb);
                            resolve(data.val());
                        });
                    });
                    promptNext("Someone removed", dir_name, old_item);
                } break;
            }
            if(awaitable !== null) {
                if(interactive) console.log("...");
                await awaitable;
            }
        }
        if(interactive) console.clear();
        doPrompt();
    }
}

main();