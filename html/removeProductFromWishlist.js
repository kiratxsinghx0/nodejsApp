async function removeProductFromWishlist(event){
        console.log(event) ;
        const userIdProductId = event.target.id.split("remove")[0] ;
        console.log(userIdProductId) ;
        const requestUrl = "http://localhost:5000/products/wishlist/removeFromWishlist/" + userIdProductId ;
        const result =  await removeProductFromWishlist2(requestUrl) ;
        console.log(result) ;
        showWishlistProducts3() ;
    }
    
    // async function removeProductFromCartByAddingToCart(userIdProductId){
    //     const cartUserIdProductId = userIdProductId ;
    //     console.log(userIdProductId) ;
    //     const requestUrl = "http://localhost:5000/products/wishlist/removeFromWishlist/" + cartUserIdProductId ;
    //     const result =  await removeProductFromWishlist2(requestUrl) ;
    //     console.log(result) ;
    //     showWishlistProducts3() ;
    
    // }
    
    
    
    function removeProductFromWishlist2(requestUrl){
        return new Promise((resolve , reject) =>{
            removeProductFromWishlist3(resolve, reject , requestUrl)
        })
    }
    
    
    function removeProductFromWishlist3(resolve, reject, requestUrl){
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
        xhr.send(null);
    }
