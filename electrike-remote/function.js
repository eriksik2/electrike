const orderId = document.getElementById('orderId');
const productId = document.getElementById('productId');
const quantity = document.getElementById('quantity');

const addBtn = document.getElementById('addBtn');

const database = app.database();


addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    database.ref('/Orders/' + orderId.value).set({
        orderId: orderId.value,
        productId: productId.value,
        quantity: quantity.value
    });
});