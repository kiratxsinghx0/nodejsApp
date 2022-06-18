var allProducts;
var keyWordsArray = [];
var searchResults = [];
function getProducts() {
    var url = "http://localhost:5000/products";
    return new Promise((resolve, reject) => {
        fetchData(resolve, reject, url)
    });
}
function fetchData(resolve, reject, url) {
    function reqlistener(data) {
        var rawData = JSON.parse(data.target.responseText);
        resolve(rawData);
    }
    function reqError() {
        reject("data not fetched")
    }
    var xhr = new XMLHttpRequest;
    xhr.onload = reqlistener;
    xhr.onerror = reqError;
    xhr.open("get", url, true);
    xhr.send();
}

async function getAllProducts() {
    let data = await getProducts();
    allProducts = data.result;
    const url = window.location.href;
    const urlArray = url.split("?");
    if (urlArray[1].includes("+")) {
        keyWordsArray = urlArray[1].split("+");
    }
    else {
        keyWordsArray.push(urlArray[1]);
    }
    const keyWordsLength = keyWordsArray.length;

    for (let i = 0; i < keyWordsLength; i++) {
        let keyWord = keyWordsArray[i];
        for (let i = 0; i < allProducts.length; i++) {
            let productName = allProducts[i].productName.toLowerCase();
            if (productName.includes(keyWord)) {
                searchResults.push(allProducts[i]);
            }
        }
    }
    console.log(searchResults);
    showProducts();
}

function showProducts() {
    var boxDiv = document.getElementById("box");

    for (let i = 0; i < searchResults.length; i++) {
        const productName = searchResults[i].productName;
        const productPrice = searchResults[i].productPrice;
        const productDiscount = searchResults[i].productDiscount;
        const productColour = searchResults[i].productColour;
        const productManufacturer = searchResults[i].productManufacturer;
        const productMeasurements = searchResults[i].productMeasurements;
        const productId = searchResults[i].productId;
        const priceAfterDiscount = Math.floor(productPrice - (productPrice * productDiscount / 100));
        const productSave = searchResults[0].productPrice - priceAfterDiscount;
        const productImage ="http://localhost:5000/images/" + searchResults[i].productImage;
        const productUrl = "http://localhost:8080/singleProductDetails.html/?" + productId ;

        boxDiv.innerHTML += `<div class= "allSearchResultProductsDetailsDiv"><div class = "imageDiv"><a href=${productUrl} target = "_blank"><img class = "searchResultImages" src= ${productImage} ></a> </div><div class= "searchProductsDetailsDiv"><p class= "SRPD1">${productManufacturer} ${productName} ${productColour}</p><br> <br> <p class ="SRPD2">M.R.P. : <s>Rs.${productPrice}.00</s><br> Price : Rs.${priceAfterDiscount}.00 <br> You Save : Rs.${productSave}.00&nbsp(${productDiscount}%) <br> Inclusive of all taxes <br>Model : ${productName} <br> Brand : ${productManufacturer}<br>Size : ${productMeasurements}</p></div></div>`
    }
}
window.onload = getAllProducts();
















