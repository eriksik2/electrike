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

$("#addProductBtn").on('click', async (e) => {
    e.preventDefault();
    addProduct(addProdCode.value, addProdQuantity.value, addProdPrice.value);
});

$("#addSupplierBtn").on('click' , async (e) => {
    e.preventDefault();
    addSupplier(supplierName.value, supplierNumber.value);
});

$("#addProductSupplierBtn").on('click' , async (e) => {
    e.preventDefault();
    addProductSupplier(productSupplierProductId.value, productSupplierSupplierId.value);
});

//addProduct.addEventListener('click', async (e) => {
//    e.preventDefault();
//    if(addProdCode.length() != 4 ){
//        window.alert("Product code must be 4 digits")
//    }
//    //database 
//});