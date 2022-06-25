const url = window.location.href ;
const urlArray = url.split("?") ;
const productId = urlArray[2] ;

var leftSideDiv = document.getElementById("leftSide")
var centerSideDiv = document.getElementById("centerSide")
var rightSideDiv = document.getElementById("rightSide")
function getProduct(){
    var productUrl = "http://localhost:5000/products/singleProduct/" + productId ;
    return new Promise((resolve,reject)=>{
        getProductData(resolve,reject,productUrl) ;
    })
}

function getProductData(resolve,reject,productUrl){
    function reqListener(data){
        // console.log(data) ;
        let result = JSON.parse(data.target.responseText) ;
        resolve(result) ;
    }
    function reqError(){
        reject("Product not found")
    }
   var xhr = new XMLHttpRequest() ;
    xhr.onload = reqListener ;
    xhr.onerror = reqError ;
    xhr.open("get", productUrl ,true) ;
    xhr.send(null);
}

async function getProductData2(){
    var data = await getProduct() ;
    var productData = data.result ;
    console.log(productData) ;    
    const jof = productData[0].productName ;
    const productPrice = productData[0].productPrice ;
    const productDiscount = productData[0].productDiscount ;
    const productManufacturer = productData[0].productManufacturer ;
    const productColour = productData[0].productColour ;
    const productMeasurements = productData[0].productMeasurements ;
    const priceAfterDiscount = Math.floor(productPrice - (productPrice * productDiscount / 100) );
    const productSave = productData[0].productPrice - priceAfterDiscount ;
    const productEmi = Math.floor(priceAfterDiscount / 12)
    const productImage = productData[0].productImage ;
    const productImageUrl = "http://localhost:5000/images/" + productImage ; 
    leftSideDiv.innerHTML = `<img src = ${productImageUrl} width ="300" height = "400" >`
    centerSideDiv.innerHTML = `<p class= "p1">${productManufacturer} ${jof} ${productColour}</p><br> <br> <p class ="p2">M.R.P. : <s>Rs.${productPrice}.00</s><br> Price : Rs.${priceAfterDiscount}.00 <br> You Save : Rs.${productSave}.00&nbsp(${productDiscount}%) <br> Inclusive of all taxes <br>Model : ${jof} <br> Brand : ${productManufacturer}<br>Size : ${productMeasurements}</p><br><br><p class = "p3"><b>EMI</b> starts at Rs.${productEmi} Only. No Cost EMI available</p>`

}


window.onload  = getProductData2() ;