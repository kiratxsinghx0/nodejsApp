var cartBtn = document.getElementById("cartBtn");
var netPriceDiv = document.getElementById("netPriceDiv");
cartBtn.addEventListener("click", showAddedProducts);
// var showCartProductsDiv = document.getElementById("showCartProductsId") ;


function showAddedProducts() {
    const url = window.location.href;
    const urlArray = url.split("?");
    if (urlArray.length > 2) {
        const userId = urlArray[1];
        var locationUrl = "http://localhost:8080/cart.html/?" + userId + "?";
    }
    else {
        alert("Please login first");
        // var locationUrl = "http://localhost:8080/cart.html"
    }
    location.href = locationUrl;
}


var showCartProductsDiv = document.getElementById("showCartProductsId");


var productNumbers = document.getElementById("productNumbers");
function showAddedProductsToCart(requestUrl) {
    return new Promise((resolve, reject) => {
        showAddedProductsToCart2(resolve, reject, requestUrl)
    })
}

function showAddedProductsToCart2(resolve, reject, requestUrl) {
    function reqListener(data) {
        resolve(data);
    }
    function reqError() {
        reject("error occured")
    }
    const xhr = new XMLHttpRequest();
    xhr.open("get", requestUrl, true);
    xhr.onload = reqListener;
    xhr.onerror = reqError;
    xhr.send(null);
}

var products ;
async function showAddedProductsToCart3() {
    const url = window.location.href;
    const urlArray = url.split("?");
    console.log(urlArray);
    if (urlArray.length > 2) {
        const userId = urlArray[1];
        const requestUrl = "http://localhost:5000/products/cartProductDetails/" + userId;
        const data = await showAddedProductsToCart(requestUrl);
        console.log(data);
        const result = JSON.parse(data.target.response);
         products = result.result;
        const productsLength = products.length;
        productNumbers.innerHTML = productsLength;
        console.log(products);
        var totalPrice = 0;
        var totalPriceAfterDiscount = 0;
        var totalSave = 0;
        showCartProductsDiv.innerHTML = "" ;
        const cartImage = "http://localhost:5000/images/cart.jpg"
        if(productsLength == 0){
            showCartProductsDiv.innerHTML = `<div class = "cartImageDiv"><img src = ${cartImage} height = "500px"></img></div>`
            document.getElementById("netPriceDiv").style.display = "none" ;
                }
else{
        for (let i = 0; i < products.length; i++) {

            const productName = products[i].productName;
            var productPrice = products[i].productPrice;
            var newPrice = parseInt(productPrice);
            const productDiscount = products[i].productDiscount;
            const productColour = products[i].productColour;
            const productManufacturer = products[i].productManufacturer;
            const productId = products[i].productId;
            var priceAfterDiscount = Math.floor(productPrice - (productPrice * productDiscount / 100));
            var productSave = products[i].productPrice - priceAfterDiscount;
            const productImage = "http://localhost:5000/images/" + products[i].productImage;
            var productQuantity = products[i].productQuantity;
            var userIdProductId = products[i].userIdProductId;
            const removeBtn = userIdProductId + "remove";
            const addToWishlistBtn = userIdProductId + "wishlist"
            var buyBtn = userIdProductId + "buyBtn"
            const divId = userIdProductId + "div";
            const url = window.location.href;
            const urlArray = url.split("?");
            if (urlArray.length > 2) {
                const userId = urlArray[1];
                var productUrl = "http://localhost:8080/singleProductDetails.html/?" + userId + "?" + productId;

            }
            else {
                var productUrl = "http://localhost:8080/singleProductDetails.html/?" + productId;
            };
            showCartProductsDiv.innerHTML += `<div class = "allCartProducts"><div class = "cartImageDiv"><a href = ${productUrl} target = _blank><img class = "imageDiv" src = ${productImage}></img></a></div><div class ="cartProductDetails" id = ${divId}><p class = "CP1">${productManufacturer} ${productName} </p><br> Price : RS.${productPrice}/- After Discount : RS.${priceAfterDiscount}/- <br> Colour : ${productColour} <br> Quantity : <select class = "productQuantity" id="productQuantity"><option value = "1">1</option><option value = "2">2</option><option value = "3">3</option><option value = "4">4</option><option value = "5">5</option><option value = "6">6</option><option value = "7">7</option><option value = "8">8</option><option value = "9">9</option><option value = "10">10</option></select><br> <button class = "removeProduct" id = ${removeBtn} >REMOVE</button><button class = "removeProduct" id = ${addToWishlistBtn} >Add To Wishlist</button></div></div>`
            // document.getElementById().addEventListener("click", removeProductFromCart);
            if (productQuantity > 1) {
                document.getElementById("productQuantity").value = productQuantity;
                totalPrice += newPrice * parseInt(productQuantity);
                totalPriceAfterDiscount += priceAfterDiscount * parseInt(productQuantity);
                totalSave += productSave * parseInt(productQuantity);
            }
            else {
                totalPrice += newPrice;
                totalPriceAfterDiscount += priceAfterDiscount;
                totalSave += productSave;

            }

        }

        netPriceDiv.innerHTML = `<div class = "netPriceCart">SubTotal : RS.${totalPrice}/- <br> <br> With Discount : RS.${totalPriceAfterDiscount}/- <br><br> Total Save : RS.${totalSave}/- <br> <br></div> <button class= "buyBtn" id = ${buyBtn}>Procced to Buy</button>`
    }
    }
    // document.getElementById(buyBtn).addEventListener("click", removeProductFromCart);



for(let i = 0 ;  i < products.length ; i++){
    const userIdProductId = products[i].userIdProductId;
    const wishlistBtn = userIdProductId + "wishlist" ;
    const removeBtn = userIdProductId + "remove";
   document.getElementById(removeBtn).addEventListener("click", removeProductFromCart);
   document.getElementById(wishlistBtn).addEventListener("click", addToWishlist);
}
}
window.onload = showAddedProductsToCart3();
