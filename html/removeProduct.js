
async function removeProductFromCart(event){
    console.log(event) ;
    const userIdProductId = event.target.id.split("remove")[0] ;
    console.log(userIdProductId) ;
    const requestUrl = "http://localhost:5000/products/removeFromCart/" + userIdProductId ;
    const result =  await removeProductFromCart2(requestUrl) ;
    console.log(result) ;
    showAddedProductsToCart3() ;

}

async function removeProductFromCartByAddingToWishlist(userIdProductId){
    const wishlistUserIdProductId = userIdProductId ;
    console.log(userIdProductId) ;
    const requestUrl = "http://localhost:5000/products/removeFromCart/" + wishlistUserIdProductId ;
    const result =  await removeProductFromCart2(requestUrl) ;
    console.log(result) ;
    showAddedProductsToCart3() ;

}



function removeProductFromCart2(requestUrl){
    return new Promise((resolve , reject) =>{
        removeProductFromCart3(resolve, reject , requestUrl)
    })
}


function removeProductFromCart3(resolve, reject, requestUrl){
    function reqListener(data){
        resolve(data);
    }
    function reqError(){
        reject("not able to delete product")
    }
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", requestUrl , true) ;
    xhr.onload = reqListener;
	xhr.onerror = reqError;
	xhr.send();
}