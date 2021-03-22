const productId = document.getElementById('productId');
const addOrderProductId = document.getElementById('addOrderProductId');
const quantity = document.getElementById('quantity');

const addProdCode = document.getElementById('addProdCode');
const addProdQuantity = document.getElementById('addProdQuantity');
const addProdPrice = document.getElementById('addProdPrice');

const supplierName = document.getElementById('supplierName');
const supplierNumber = document.getElementById('supplierNumber');

const productSupplierProductId = document.getElementById('productSupplierProductId');
const productSupplierSupplierId = document.getElementById('productSupplierSupplierId');

$("#addOrderBtn").on('click', async (e) => {
    e.preventDefault();
    addOrder(addOrderProductId.value, quantity.value);
});

$("#editOrderBtn").on('click', async (e) => {
    e.preventDefault();
    var id = $("#editOrderId").get(0).value;
    modify("Order", id, { ProductId: addOrderProductId.value, quantity: quantity.value});
});
$("#editOrderId").click((e) => { e.preventDefault(); e.stopPropagation(); });

$("#rmvOrderBtn").on('click', async (e) => {
    e.preventDefault();
    var id = $("#rmvOrderId").get(0).value;
    remove("Order", id);
});
$("#rmvOrderId").click((e) => { e.preventDefault(); e.stopPropagation(); });




$("#addProductBtn").on('click', async (e) => {
    e.preventDefault();
    addProduct(addProdCode.value, addProdQuantity.value, addProdPrice.value);
});

$("#EditProductBtn").on('click', async (e) => {
    e.preventDefault();
    var id = $("#EditProductId").get(0).value;
    modify("Product", id, { ProductCode: addProdCode.value, Quantity: addProdQuantity.value, Price: addProdPrice.value });
});
$("#EditProductId").click((e) => { e.preventDefault(); e.stopPropagation(); });

$("#RmvProductBtn").on('click', async (e) => {
    e.preventDefault();
    var id = $("#RmvProductId").get(0).value;
    remove("Product", id);
});
$("#RmvProductId").click((e) => { e.preventDefault(); e.stopPropagation(); });




$("#addSupplierBtn").on('click' , async (e) => {
    e.preventDefault();
    addSupplier(supplierName.value, supplierNumber.value);
});

$("#EditSupplierBtn").on('click', async (e) => {
    e.preventDefault();
    var id = $("#EditSupplierId").get(0).value;
    modify("Supplier", id, { Name: supplierName.value, Phone: supplierNumber.value });
});
$("#EditSupplierId").click((e) => { e.preventDefault(); e.stopPropagation(); });

$("#RmvSupplierBtn").on('click', async (e) => {
    e.preventDefault();
    var id = $("#RmvSupplierId").get(0).value;
    remove("Supplier", id);
});
$("#RmvSupplierId").click((e) => { e.preventDefault(); e.stopPropagation(); });




$("#addProductSupplierBtn").on('click' , async (e) => {
    e.preventDefault();
    addProductSupplier(productSupplierProductId.value, productSupplierSupplierId.value);
});

$("#EditProductSupplierBtn").on('click', async (e) => {
    e.preventDefault();
    var id = $("#EditProductSupplierId").get(0).value;
    modify("ProductSupplier", id, { ProductId: productSupplierProductId.value, SupplierId: productSupplierSupplierId.value });
});
$("#EditProductSupplierId").click((e) => { e.preventDefault(); e.stopPropagation(); });

$("#RmvProductSupplierBtn").on('click', async (e) => {
    e.preventDefault();
    var id = $("#RmvProductSupplierId").get(0).value;
    remove("ProductSupplier", id);
});
$("#RmvProductSupplierId").click((e) => { e.preventDefault(); e.stopPropagation(); });

//addProduct.addEventListener('click', async (e) => {
//    e.preventDefault();
//    if(addProdCode.length() != 4 ){
//        window.alert("Product code must be 4 digits")
//    }
//    //database 
//});