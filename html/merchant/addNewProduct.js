const addProductBtn = document.getElementById("addProductBtn");
addProductBtn.addEventListener("click", validateProduct);

function validateProduct() {

    const url = window.location.href ;
    const urlArray = url.split("?") ;
    const merchantId = urlArray[1] ;

    const productName = document.getElementById("filledProductName").value;
    const productCategoryId = document.getElementById("filledProductCategory").value;
    const productPrice = document.getElementById("filledProductPrice").value;
    const productColour = document.getElementById("filledProductColour").value;
    const productManufacturer = document.getElementById("filledProductManufacturer").value;
    const productDiscount = document.getElementById("filledProductDiscount").value;
    const productMeasurements = document.getElementById("filledProductMeasurements").value
    const productImage = document.getElementById("filledProductImage").value;
    const productInventory = document.getElementById("filledProductInventory").value;

    const trimProductName = productName.trim();
    const trimProductPrice = productPrice.trim();
    const trimProductColour = productColour.trim();
    const trimProductManufacturer = productManufacturer.trim();
    const trimProductDiscount = productDiscount.trim();
    const trimProductMeasurements = productMeasurements.trim();
    const trimProductImage = productImage.trim();
    const trimProductInventory = productInventory.trim();

    const productInfo = {
        productName,
        productCategoryId,
        productPrice,
        productColour,
        productManufacturer,
        productDiscount,
        productMeasurements,
        productImage,
        productInventory,
        merchantId
    }
    console.log(productInfo);


    if (trimProductInventory == "" || trimProductName == "" || trimProductPrice == "" || trimProductColour == "" || trimProductManufacturer == "" || trimProductMeasurements == "" || trimProductImage == "" || trimProductDiscount == "") {
        alert("fill in all the required info");
    }
    else {
        sendFilledProductData2(productInfo) ;
    }
}


function sendFilledProductData(productData) {
    const productInfo = productData ;
    console.log(productInfo.merchantId) ;
    const merchantId = productInfo.merchantId ;
    const requestUrl = "http://localhost:5000/products/addNewProducts" ;

    return new Promise((resolve, reject) =>{
        sendFilledProductData1(resolve, reject, requestUrl, productInfo);
    })
}

function sendFilledProductData1(resolve , reject , requestUrl ,productInfo ) {
    function reqlistener(result){
        var data = result ;
        resolve(data) ;
    }
    function reqError(){
        reject("error occured")
    }
     const xhr = new XMLHttpRequest() ;
    xhr.open("post",requestUrl ,true) ;
     xhr.onload = reqlistener ;
     xhr.onerror = reqError ;
	xhr.setRequestHeader('Content-Type', 'application/json')
     xhr.send(JSON.stringify(productInfo)) ;
}

async function sendFilledProductData2(productData){
    const result = await sendFilledProductData(productData) ;
    console.log(result) ;
    const data = JSON.parse(result.target.responseText)
    console.log(data) ;
    if(data.confMsg){
        alert(data.confMsg) ;
    }
    document.getElementById("filledProductName").value = "" ;
     document.getElementById("filledProductCategory").value = "" ;
    document.getElementById("filledProductPrice").value = "" ;
    document.getElementById("filledProductColour").value = "" ;
     document.getElementById("filledProductManufacturer").value = "" ;
    document.getElementById("filledProductDiscount").value = "" ;
    document.getElementById("filledProductMeasurements").value = "" ;
    document.getElementById("filledProductImage").value = "" ;
    document.getElementById("filledProductInventory").value = "" ;
}