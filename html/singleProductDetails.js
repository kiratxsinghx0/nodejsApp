const url = window.location.href ;
const urlArray = url.split("?") ;
// const productId = urlArray[1] ;
// console.log(urlArray) ;
if(urlArray.length > 2){
    var productId = urlArray[2] ;
    var userId = urlArray[1] ;
    var btnId = userId + "?" + productId + "?" +"btn" ;  

}
else{
    var productId = urlArray[1] ;
    var btnId = productId + "?" + "btn" ;

}

console.log(btnId) ;

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
    // console.log(productData) ;    
    const productName = productData[0].productName ;
    const productPrice = productData[0].productPrice ;
    const productDiscount = productData[0].productDiscount ;
    const productManufacturer = productData[0].productManufacturer ;
    const productColour = productData[0].productColour ;
    const productMeasurements = productData[0].productMeasurements ;
    const priceAfterDiscount = Math.floor(productPrice - (productPrice * productDiscount / 100) );
    const productSave = productData[0].productPrice - priceAfterDiscount ;
    const productEmi = Math.floor(priceAfterDiscount / 12)
    const productId = productData[0].productId ;
    const productImage = productData[0].productImage ;
    const productImageUrl = "http://localhost:5000/images/" + productImage ; 
    const date = Date() ;
    const dateArray = date.split(" ") ;
    const day = dateArray[0]  ;
    const month = dateArray[1] ;
    const currentDate= parseInt(dateArray[2]) + 2 ;
    var givenQuantity = 1 ;
    var priceWithQuantity = givenQuantity * priceAfterDiscount ;
    const shippingCharges = 100 ;
    var totalCost = priceWithQuantity + 100 ;
    leftSideDiv.innerHTML = `<img src = ${productImageUrl} width ="300" height = "400" >`
    centerSideDiv.innerHTML = `<p class= "p1">${productManufacturer} ${productName} ${productColour}</p><br> <br> <p class ="p2">M.R.P. : <s>Rs.${productPrice}.00</s><br> Price : Rs.${priceAfterDiscount}.00 <br> You Save : Rs.${productSave}.00&nbsp(${productDiscount}%) <br> Inclusive of all taxes <br>Model : ${productName} <br> Brand : ${productManufacturer}<br>Size : ${productMeasurements}</p><br><br><p class = "p3"><b>EMI</b> starts at Rs.${productEmi} Only. No Cost EMI available</p>`
    rightSideDiv.innerHTML = `<div class = "addCartDiv" ><p class = "p4">Price : ${priceAfterDiscount}/-</p><br><p class = "p5" >Fastest delivery After Two days, on ${month} ${currentDate}. </p><p class = "p6">In Stock.</p><p class= "p7">Sold by ${productManufacturer} and fulfilled by ShopCrazi</p> <br><p class = "p8"><form action = "http://localhost:8080/products.html/" target = "_blank"><label for = "quanity">Quantity : </lable><select name = "quantity" class = "quantity" id="quantity"><option>1</option><option>2</option><option>3</option></select><p/></form><br><p class = "p9">Price : Rs.${priceAfterDiscount}/- <br>No. of Quantity : ${givenQuantity} <br>Net Product cost : Rs.${priceWithQuantity}/- <br> shipping cost : Rs.${shippingCharges} <br> Net Cost : Rs.${totalCost}/-</p><br><button class = "addToCartBtn" id =${btnId}>Add To Cart</button></div>`

    var quantityId  = document.getElementById("quantity") ;
    var quantityValue = document.getElementById("quantity").value ;
        quantityId.addEventListener("input",updateQuantity) ;
    function updateQuantity(event){
        givenQuantity = document.getElementById("quantity").value ;
        var newQuantityId = document.getElementById("quantity") ;
         priceWithQuantity = givenQuantity * priceAfterDiscount ;
         totalCost = priceWithQuantity + 100 ;
        rightSideDiv.innerHTML = `<div class = "addCartDiv" ><p class = "p4">Price : ${priceAfterDiscount}/-</p><br><p class = "p5" >Fastest delivery After Two days, on ${month} ${currentDate}. </p><p class = "p6">In Stock.</p><p class= "p7">Sold by ${productManufacturer} and fulfilled by ShopCrazi</p> <br><p class = "p8"><form action = "http://localhost:8080/products.html/" target = "_blank"><label for = "quanity">Quantity : </lable><select name = "quantity" class = "quantity" id="quantity"><option>1</option><option>2</option><option>3</option></select><p/></form><br><p class = "p9">Price : Rs.${priceAfterDiscount}/- <br>No. of Quantity : ${givenQuantity} <br>Net Product cost : Rs.${priceWithQuantity}/- <br> shipping cost : Rs.${shippingCharges} <br> Net Cost : Rs.${totalCost}/-</p><br><button class = "addToCartBtn" id =${btnId}>Add To Cart</button></div>`
        var newQuantityId = document.getElementById("quantity") ;
        newQuantityId.addEventListener("input", updateQuantity) ;
        document.getElementById("quantity").value = givenQuantity;
    var newBtnEvent = document.getElementById(btnId) ;
        newBtnEvent.addEventListener("click", stopAction) ;
    }
    var btnEvent = document.getElementById(btnId) ;
    btnEvent.addEventListener("click", stopAction );
    function stopAction(event){
       var btnIdArray = btnId.split("?") ;
       console.log(btnIdArray) ;
       if(btnIdArray.length > 2){
            var sendProductId = btnIdArray[1] ;
            var sendUserId = btnIdArray[0] ;
            console.log(btnIdArray)
            const addToCartDetails ={
                sendProductId,
                sendUserId
            } ;
            addToCart3(addToCartDetails) ;
       }
       else{
        alert("Please login First")
        const url = "http://localhost:8080/userOrMerchantLogin.html" ;
        location.href = url ;
        var sendProductId = btnIdArray[0] 
       }

        console.log("action stopped") ;
        event.preventDefault() ;
    }

}

    function addToCart1(addToCartDetails){ 
        let addToCartUrl = "http://localhost:5000/products/AddToCart" ; ;
        return new Promise((resolve, reject)=>{
            addToCart2(resolve, reject, addToCartUrl , addToCartDetails) ;
        })
    }


    function addToCart2(resolve, reject, addToCartUrl, addToCartDetails){
        function reqListener(data){
            resolve(data)
        }
        function reqError(){
            reject("product not added to cart")
        }
        const xhr = new XMLHttpRequest() ;
        xhr.open("post", addToCartUrl,true) ;
        xhr.onload = reqListener ;
        xhr.onerror = reqError ;
        xhr.withCredentials = true;
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(addToCartDetails)) ;
    }

    async function addToCart3(sendData){
        const addToCartDetails = sendData ;
        const result = await addToCart1(addToCartDetails) ;
        console.log(result) 
        const data = JSON.parse(result.target.responseText) ;
        console.log(data) ;
        if(data.msg == "product added to cart"){
            console.log("here") ;
            getAddedProductsToCart5() ;
            console.log("here2")

        }
        else{
            alert(data.msg) ;
        }
        // console.log(result) ;
    }

    
    //gett products added by user ;
    var productNumbers1 = document.getElementById("productNumbers") ;
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
    
    async function getAddedProductsToCart5(){
        console.log("here2")
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
         productNumbers1.innerHTML = productsArrayLength ;
        }
    }



window.onload  = getProductData2() ;