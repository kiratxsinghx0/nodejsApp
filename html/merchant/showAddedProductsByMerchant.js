const showAddedProductsDiv = document.getElementById("showAddedProducts") ;
console.log(showAddedProductsDiv)
function getAddedProducts(){
    const url = window.location.href ;
    const urlArray = url.split("?") ;
    const requestUrl = "http://localhost:5000/products/merchant/" + urlArray[1] ;

    return new Promise((resolve, reject)=>{
        getAddedProducts1(resolve, reject, requestUrl) ;
    })
}

function getAddedProducts1(resolve,reject, requestUrl){
    function reqListener(data){
        const result = JSON.parse(data.target.responseText)
    console.log(result) ;
        resolve(result) ;
    }
    function reqError(){
        reject("error occured")
    }
    const xhr = new XMLHttpRequest() ;
    xhr.open("get" , requestUrl , true) ;
    xhr.onload = reqListener ;
    xhr.onerror = reqError ;
    xhr.send() ;
}

async function getAddedProducts2(){
    const data = await getAddedProducts() ;
    const productDetails = data.result ;
    console.log(productDetails) ;
    console.log("ok") ;
    for(let i = 0; i < productDetails.length ; i++){
        // console.log(here) ;
    const productName = productDetails[0].productName ;
    const productPrice = productDetails[0].productPrice ;
    const productDiscount = productDetails[0].productDiscount ;
    const productManufacturer = productDetails[0].productManufacturer ;
    const productColour = productDetails[0].productColour ;
    const productMeasurements = productDetails[0].productMeasurements ;
    const priceAfterDiscount = Math.floor(productPrice - (productPrice * productDiscount / 100) );
    const productSave = productDetails[0].productPrice - priceAfterDiscount ;
    const productEmi = Math.floor(priceAfterDiscount / 12)
    const productId = productDetails[0].productId ;
    // const productImage = productDetails[0].productImage ;
    const productImage ="http://localhost:5000/images/" + productDetails[i].productImage;
    const productUrl = "http://localhost:8080/merchant/merchantSingleProductDetails.html/?" + productId ;

    showAddedProductsDiv.innerHTML += `<div class= "allAddedProductsDetailsDiv"><div class = "addedProductsimageDiv"><a href=${productUrl} target = "_blank"><img class = "addedProductsImages" src= ${productImage} ></a> </div><div class= "addedProductsDetailsDiv"><p class= "APD1">${productManufacturer} ${productName} ${productColour}</p><br> <br> <p class ="APD2">M.R.P. : <s>Rs.${productPrice}.00</s><br> Price : Rs.${priceAfterDiscount}.00 <br> You Save : Rs.${productSave}.00&nbsp(${productDiscount}%) <br> Inclusive of all taxes <br>Model : ${productName} <br> Brand : ${productManufacturer}<br>Size : ${productMeasurements}</p></div></div>`
    }
}


window.onload = getAddedProducts2() ;