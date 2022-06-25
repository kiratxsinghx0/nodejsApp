async function addToCartRemoveFromWishlist(event){
        console.log(event) ;
        const userIdProductId = event.target.id.split("addToCart")[0] ;
        console.log(userIdProductId) ;
        const userIdProductIdArray = userIdProductId.split("+") ;
        const userId = userIdProductIdArray[0] ;
        const productId = userIdProductIdArray[1] ;
        const data = {
            userId,
            productId,
            userIdProductId
        } ;
        const requestUrl = "http://localhost:5000/products/wishlist/addToCart" ;
        console.log(userId)
        console.log(productId)
        const result =  await addToCart2(data,requestUrl) ;
        console.log(result) ;
        const msg = JSON.parse(result.target.responseText) ;
        console.log(msg)
    
        // if(msg.msg == "error occured"){
        //     console.log("here") ;
        //     removeProductFromCartByAddingToCart(userIdProductId);
        //     getAddedProductsToCart3();
        // }else{
            showWishlistProducts3() ;
            getAddedProductsToCart3();
        // }
    }
    
    function addToCart2(data, requestUrl){
        return new Promise((resolve, reject)=>{
            addToCart3(resolve,reject,data,requestUrl) ;
        })
    } ;
    
    function addToCart3(resolve,reject,data,requestUrl){
        function reqListener(result){
            resolve(result)
        }
        function reqError(){
            reject("not able to add to wishlist")
        }
    
        const xhr = new XMLHttpRequest();
        xhr.open("post",requestUrl,true) ;
        xhr.onload = reqListener ;
        xhr.onerror = reqError ;
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data)) ;
    }
    

