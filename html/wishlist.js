var showWishlistProductsDiv = document.getElementById("showWishlistProductsId") ;

function showWishlishtProducts(requestUrl){
    return new Promise((resolve, reject)=>{
        showWishlishtProducts2(resolve,reject,requestUrl)
    })
}

function showWishlishtProducts2(resolve,reject,requestUrl){
    function reqListener(data){
        resolve(data);
    }
    function reqError(){
        reject("error occured")
    }
    const xhr = new XMLHttpRequest() ;
    xhr.open("get",requestUrl,true) ;
    xhr.onload = reqListener ;
    xhr.onerror = reqError ;
    xhr.send(null) ;
}

async function showWishlistProducts3(){
    const url = window.location.href ;
    const urlArray = url.split("?") ;
    console.log(urlArray) ;
    if(urlArray.length > 2){
    const userId = urlArray[1] ;
    const requestUrl = "http://localhost:5000/products/wishlist/" + userId ;
     const data = await showWishlishtProducts(requestUrl) ;
     console.log(data) ;
     const result = JSON.parse(data.target.response) ;
     const products = result.result ;
     const productsLength = products.length ;
     console.log(products) ;
     showWishlistProductsDiv.innerHTML = "" ;
    const wishlistImage = "http://localhost:5000/images/wishlist.jpg" ;
     if(productsLength == 0){
        showWishlistProductsDiv.innerHTML = `<div class = "emptyWishlist"><img height = "500px" width  = "700px" src = ${wishlistImage}></img></div>`
     }
     else{
     for(let i = 0 ; i < products.length ; i++){

        const productName = products[i].productName;
        var productPrice = products[i].productPrice;
        var newPrice = parseInt(productPrice) ;
        const productDiscount = products[i].productDiscount;
        const productColour = products[i].productColour;
        const productManufacturer = products[i].productManufacturer;
        const productId = products[i].productId;
        var priceAfterDiscount = Math.floor(productPrice - (productPrice * productDiscount / 100));
        const productImage ="http://localhost:5000/images/" + products[i].productImage;
        var userIdProductId = products[i].userIdProductId ;
        const removeBtn = userIdProductId + "remove";
        const addToCartBtn = userIdProductId + "addToCart" ;
        const url = window.location.href;
        const urlArray = url.split("?");
        if(urlArray.length > 2) {
            const userId = urlArray[1] ;
        var productUrl = "http://localhost:8080/singleProductDetails.html/?" + userId + "?" +  productId ;

        }
        else{
        var productUrl = "http://localhost:8080/singleProductDetails.html/?" + productId ;
        } ;

        showWishlistProductsDiv.innerHTML += `<div class = "allCartProducts"><div class = "cartImageDiv"><a href = ${productUrl} target = _blank><img class = "imageDiv" src = ${productImage}></img></a></div><div class=""cartProductDetails></div><div class ="cartProductDetails"><p class = "CP1">${productManufacturer} ${productName} </p><br> Price : RS.${productPrice}/-<br> After Discount : RS.${priceAfterDiscount}/- <br> Colour : ${productColour} <br><br> <button class = "removeProduct" id = ${removeBtn}>REMOVE</button><button class = "removeProduct" id = ${addToCartBtn}>Add To Cart</button></div></div>`    
     }
     for(let i = 0 ;  i < products.length ; i++){
        const userIdProductId = products[i].userIdProductId;
        const addToCartBtn = userIdProductId + "addToCart" ;
        const removeBtn = userIdProductId + "remove";
       document.getElementById(removeBtn).addEventListener("click", removeProductFromWishlist);
       document.getElementById(addToCartBtn).addEventListener("click", addToCartRemoveFromWishlist);
    }
    }     
    }
}

window.onload = showWishlistProducts3() ;


