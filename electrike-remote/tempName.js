
function getProductFromId(id) {
    var list = getProductList();
    for(var prod of list) {
        if(prod.productid == id) return prod;
    }
    console.error("No product with id "+id);
    return null;
}

async function getProductList() {
    var products = await database.ref("Product").get();
    return products.val();
}

async function getNextId(dir_name) {
    var id_ref = database.ref("/"+dir_name+"/NextId");
    var id = null;
    await id_ref.transaction(nextid => {
        id = nextid || 0;
        return (nextid || 0) + 1;
    });
    if(id === null) throw "";
    return id;
}

async function addOrder(productid, quantity) {
    if(parseInt(productid) == NaN) return alert("The productId must be a number.");
    if(parseInt(quantity) == NaN) return alert("The quantity must be a number.");

    var NextId = await getNextId("Order");
    var db_ref = database.ref("/Order/" + NextId);
    db_ref.set({
        OrderId: NextId,
        ProductId: parseInt(productid),
        quantity: parseInt(quantity)
    });
}

async function addProduct(productCode, quantity, price){
    if(productCode.search(/[a-zA-Z0-9]{4}$/g) !== 0) return alert("The product code must be a 4-digit alphanumeric string.");
    if(parseInt(quantity) == NaN) return alert("The quantity must be a number.");
    if(parseInt(price) == NaN) return alert("The price must be a number.");

    var NextId = await getNextId("Product");
    var db_ref = database.ref("/Product/" + NextId);
    await db_ref.set({
        ProductId: NextId,
        ProductCode: productCode,
        Quantity: parseInt(quantity),
        Price: parseInt(price)
    })
}

async function addSupplier(name, phone) {
    if(parseInt(phone) == NaN) return alert("The phonenumber can't contain any letters.");

    var NextId = await getNextId("Supplier");
    var db_ref = database.ref("/Supplier/" + NextId);
    await db_ref.set({
        SupplierId: NextId, 
        Name: name, 
        Phone: parseInt(phone)
    });
}

async function addProductSupplier(productId, supplierId) {
    if(parseInt(productId) == NaN) return alert("The productId must be a number.");
    if(parseInt(supplierId) == NaN) return alert("The supplierId must be a number.");

    var NextId = await getNextId("ProductSupplier");
    var db_ref = database.ref("/ProductSupplier/" + NextId);
    await db_ref.set({
        ProductSupplierId: NextId, 
        SupplierId: parseInt(supplierId), 
        ProductId: parseInt(productId)
    });
}