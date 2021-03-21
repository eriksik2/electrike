

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

async function addOrder(orderid, productid, quantity) {
    var db_ref = database.ref("/Order/" + orderid);
    var order = (await db_ref.get()).val();
    if(order != null) {
        alert("Changed order with orderid "+orderid);
    }
    await db_ref.set({
        OrderId: orderid,
        ProductId: productid,
        quantity: quantity
    });
}

async function addProduct(productId, productCode, quantity, price){
    var db_ref = database.ref("/Product/" + productId);
    var product = (await db_ref.get()).val();
    if(product != null) {
        alert("You changed product" + productId);
    }
    await db_ref.set({
        ProductId: productId,
        ProductCode: productCode,
        Quantity: quantity,
        Price: price
    })
}

async function addSupplier(supplierId, name, phone) {
    var db_ref = database.ref("/Supplier/" + supplierId);
    var supplier = (await db_ref.get()).val();
    if(supplier != null) {
        alert("Changed supplier with id: " + supplierId);
    }
    await db_ref.set({
        SupplierId: supplierId, 
        Name: name, 
        Phone: phone
    });
}

async function addProductSupplier(productId, supplierId) {
    var db_ref = database.ref("/ProductSupplier/" + supplierId);
    var prod_sup = (await db_ref.get()).val();
    if(prod_sup != null) {
        alert("Changed product supplier with id: " + supplierId);
    }
    await db_ref.set({
        SupplierId: supplierId, 
        ProductId: productId
    });
}