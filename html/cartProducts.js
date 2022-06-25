var cartBtn = document.getElementById("cartBtn") ;
cartBtn.addEventListener("click" , showAddedProducts ) ;

function showAddedProducts(){
    const url = window.location.href ;
    const urlArray = url.split("?") ;
    if(urlArray.length > 2){
    const userId = urlArray[1] ;
    const locationUrl = "http://localhost:8080/cart.html/?" + userId + "?" ; 
    location.href = locationUrl ;
    
    }
    else{
        alert("Please login first")
    }
}

var productNumbers = document.getElementById("productNumbers") ;
console.log(productNumbers);

function getAddedProductsToCart(requestUrl){
    return new Promise((resolve, reject)=>{
        getAddedProductsToCart2(resolve,reject,requestUrl)
    })
}

function getAddedProductsToCart2(resolve,reject,requestUrl){
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

async function getAddedProductsToCart3(){
    const url = window.location.href ;
    const urlArray = url.split("?") ;
    console.log(urlArray) ;
    if(urlArray.length > 2){
    const userId = urlArray[1] ;
    const requestUrl = "http://localhost:5000/products/cartProducts/" + userId ;
     const data = await getAddedProductsToCart(requestUrl) ;
     console.log(data) ;
     const productsArray = JSON.parse(data.target.response) ;
     console.log(productsArray) ;
     const productsArrayLength = productsArray.length ;
     console.log(length) ;
     productNumbers.innerHTML = productsArrayLength ;
    }
}

window.onload = getAddedProductsToCart3() ;