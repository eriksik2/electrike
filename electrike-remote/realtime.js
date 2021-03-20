
var _realtime_product_subscribers = [];

// This function is used to subscribe to realtime updates of Products.
// `func` is a callback function that takes two arguments: ProductId and value.
// If a product was removed then value will be null, otherwise value will be the
// product data of the product that was added or changed.
function onRealtimeProduct(func) {
    _realtime_product_subscribers.push(func);
    return func;
}

$(document).ready(() => {

    function notifyRealtimeProduct(ProductId, value) {
        for(var func of _realtime_product_subscribers) {
            func(ProductId, value);
        }
    }
    
    var prod_ref = database.ref("Product");

    prod_ref.on("child_added", (data) => {
        var ProductId = data.val().ProductId;
        notifyRealtimeProduct(ProductId, data.val());
    });

    prod_ref.on("child_changed", (data) => {
        var ProductId = data.val().ProductId;
        notifyRealtimeProduct(ProductId, data.val());
    });
    prod_ref.on("child_removed", (data) => {
        var ProductId = data.val().ProductId;
        notifyRealtimeProduct(ProductId, null);
    });

});