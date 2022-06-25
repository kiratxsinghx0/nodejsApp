var divWoodenFurnitureProducts = document.getElementById("woodenFurnituresProductsId");
var divElectronicProducts = document.getElementById("electronicProductsId");
var divClothingProducts = document.getElementById("clothingProductsId")


function getProducts() {
    const locationUrl = window.location.href ;
    const locationUrlArray = locationUrl.split("?") ;
    // const userId = locationUrlArray[1] ;
    // console.log(locationUrlArray) ;
    // console.log(userId) ;

    var url = "http://localhost:5000/products";
    var p1 = new Promise((resolve, reject) => {
        getAllProducts(resolve, reject, url);
    });
    p1.then((data) => {
        divWoodenFurnitureProducts.innerHTML = "" ;
        if (data.msg) {
            alert(data.msg)
        }
        var AllProducts = data.result ;
        var woodenFurnituresProducts = [] ;
        var electronicProducts = [] ;
        var clothingProducts = [] ;
        for(let i = 0 ; i < AllProducts.length ; i++){
            let productCategoryId = AllProducts[i].productCategoryId ;
            if(productCategoryId == 1){
                woodenFurnituresProducts.push(AllProducts[i]) 
            }
            else if(productCategoryId == 2){
                electronicProducts.push(AllProducts[i])
            }
            else if(productCategoryId == 3){
                clothingProducts.push(AllProducts[i]) ;
            }
        }
        for (let i = 0; i < woodenFurnituresProducts.length; i++) {
            const wfName = woodenFurnituresProducts[i].productName;
            const wfDiscount = woodenFurnituresProducts[i].productDiscount;
            const wfId = woodenFurnituresProducts[i].productId;
            const wfManufacturer = woodenFurnituresProducts[i].productManufacturer;
            const wfMeasurements = woodenFurnituresProducts[i].productMeasurements;
            const wfPrice = woodenFurnituresProducts[i].productPrice;
            const wfDiscountedPrice = Math.floor(wfPrice - (wfPrice * wfDiscount /100)) ;
            const wfColour = woodenFurnituresProducts[i].productColour ;
            const divId = wfId + "div";
            const fieldsetId = wfId + "field";
            const a = wfId + "a";
            const wfImageUrl = "http://localhost:5000/images/" + woodenFurnituresProducts[i].productImage;
            if(locationUrlArray.length > 1){
                const userId = locationUrlArray[1] ;
                var wfUrl = "http://localhost:8080/singleProductDetails.html/?" + userId + "?" + wfId ;
            }
            else {
            var wfUrl = "http://localhost:8080/singleProductDetails.html/?" + wfId ;
            }
            // console.log(wfUrl) ;
            divWoodenFurnitureProducts.innerHTML += `<div id = ${divId} class= "singleWFProductDiv"><fieldset id = ${fieldsetId} > <a  id= ${a} href= ${wfUrl} target = "_blank"><img class="wfProductsImages" src= ${wfImageUrl}></a> <br><p class= "wfPD1">${wfManufacturer} ${wfName} ${wfColour}</p><br><p class= "wfPD2"> M.R.P. : Rs.<s>${wfPrice}</s>/-<br> Price : Rs.${wfDiscountedPrice}/- &nbsp(${wfDiscount}% OFF)<br> Brand : ${wfManufacturer}</p> </fieldset> </div>`
        }
        for (let i = 0; i < electronicProducts.length; i++) {
            const productName = electronicProducts[i].productName;
            const productPrice = electronicProducts[i].productPrice;
            const productDiscount = electronicProducts[i].productDiscount;
            const discountedPrice = Math.floor(productPrice - (productPrice * productDiscount / 100));
            const productId = electronicProducts[i].productId ;
            const productManufacturer = electronicProducts[i].productManufacturer ;
            const productMeasurements = electronicProducts[i].productMeasurements ;
            const productColour = electronicProducts[i].productColour ;
            const divId = productId + "elecProdiv";
            const fieldsetId = productId + "field";
            const a = productId + "a";
            // const productUrl = "http://localhost:8080/singleProductDetails.html/?" + productId ;
            if(locationUrlArray.length > 1){
                const userId = locationUrlArray[1] ;
                var productUrl = "http://localhost:8080/singleProductDetails.html/?" + userId + "?" + productId ;
            }
            else {
            var productUrl = "http://localhost:8080/singleProductDetails.html/?" + productId ;
            }
            // console.log(productUrl) ;
            const imageUrl = "http://localhost:5000/images/" + electronicProducts[i].productImage ;
            divElectronicProducts.innerHTML += `<div id = ${divId} class= "singleElectronicProductDiv"> <fieldset id=${fieldsetId}>  <a id= ${a} href=${productUrl} target = "_blank"><img class = "elecProductsImages" src= ${imageUrl} ></a> <br><p class= "elecPD1">${productManufacturer} ${productName} ${productColour}</p><br> <p class = "elecPD2"> Model: ${productName} <br> M.R.P. : Rs.<s>${productPrice}</s>/- <br>Price : Rs.${discountedPrice}/- &nbsp(${productDiscount}% OFF)</p></fieldset> </div>`
        }
          for (let i = 0; i < electronicProducts.length; i++) {
            const productName = electronicProducts[i].productName;
            const productPrice = electronicProducts[i].productPrice;
            const productDiscount = electronicProducts[i].productDiscount;
            const discountedPrice = Math.floor(productPrice - (productPrice * productDiscount / 100));
            const productId = electronicProducts[i].productId ;
            const productManufacturer = electronicProducts[i].productManufacturer ;
            const productMeasurements = electronicProducts[i].productMeasurements ;
            const productColour = electronicProducts[i].productColour ;
            const divId = productId + "elecProdiv";
            const fieldsetId = productId + "field";
            const a = productId + "a";
            // const productUrl = "http://localhost:8080/singleProductDetails.html/?" + productId ;
            if(locationUrlArray.length > 1){
                const userId = locationUrlArray[1] ;
                var productUrl = "http://localhost:8080/singleProductDetails.html/?" + userId + "?" + productId ;
            }
            else {
            var productUrl = "http://localhost:8080/singleProductDetails.html/?" + productId ;
            }
            // console.log(productUrl) ;
            const imageUrl = "http://localhost:5000/images/" + electronicProducts[i].productImage ;
            divElectronicProducts.innerHTML += `<div id = ${divId} class= "singleElectronicProductDiv"> <fieldset id=${fieldsetId}>  <a id= ${a} href=${productUrl} target = "_blank"><img class = "elecProductsImages" src= ${imageUrl} ></a> <br><p class= "elecPD1">${productManufacturer} ${productName} ${productColour}</p><br> <p class = "elecPD2"> Model: ${productName} <br> M.R.P. : Rs.<s>${productPrice}</s>/- <br>Price : Rs.${discountedPrice}/- &nbsp(${productDiscount}% OFF)</p></fieldset> </div>`
        }
        for (let i = 0; i < clothingProducts.length; i++) {
            const productName = clothingProducts[i].productName;
            const productPrice = clothingProducts[i].productPrice;
            const productDiscount = clothingProducts[i].productDiscount;
            const discountedPrice = Math.floor(productPrice - (productPrice * productDiscount / 100));
            const productId = clothingProducts[i].productId ;
            const productManufacturer = clothingProducts[i].productManufacturer ;
            const productMeasurements = clothingProducts[i].productMeasurements ;
            const productColour = clothingProducts[i].productColour ;
            const divId = productId + "elecProdiv";
            const fieldsetId = productId + "field";
            const a = productId + "a";
            // const productUrl = "http://localhost:8080/singleProductDetails.html/?" + productId ;
            if(locationUrlArray.length > 1){
                const userId = locationUrlArray[1] ;
                var productUrl = "http://localhost:8080/singleProductDetails.html/?" + userId + "?" + productId ;
            }
            else {
            var productUrl = "http://localhost:8080/singleProductDetails.html/?" + productId ;
            }
            // console.log(productUrl) ;
            const imageUrl = "http://localhost:5000/images/" + clothingProducts[i].productImage ;
            divClothingProducts.innerHTML += `<div id = ${divId} class= "singleElectronicProductDiv"> <fieldset id=${fieldsetId}>  <a id= ${a} href=${productUrl} target = "_blank"><img class = "elecProductsImages" src= ${imageUrl} ></a> <br><p class= "elecPD1">${productManufacturer} ${productName} ${productColour}</p><br> <p class = "elecPD2"> Model: ${productName} <br> M.R.P. : Rs.<s>${productPrice}</s>/- <br>Price : Rs.${discountedPrice}/- &nbsp(${productDiscount}% OFF)</p></fieldset> </div>`
        }
    })
}

function getAllProducts(resolve, reject, url) {
    function reqlistener(result) {

        let data = JSON.parse(result.target.responseText);
        resolve(data);
    }
    function reqError() {
        reject("data is not fetched")
    }
    var xhr = new XMLHttpRequest();
    xhr.onload = reqlistener;
    xhr.onerror = reqError;
    xhr.open("get", url, true);
    xhr.send();
}

window.onload = getProducts();