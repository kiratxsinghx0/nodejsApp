var wishlistBtn = document.getElementById("wishlistBtnId") ;
wishlistBtn.addEventListener("click" , changeLocationToWishlist ) ;

function changeLocationToWishlist(){
    const url = window.location.href ;
    const urlArray = url.split("?") ;
    if(urlArray.length > 2){
    const userId = urlArray[1] ;
    const locationUrl = "http://localhost:8080/wishlist.html/?" + userId + "?" ; 
    location.href = locationUrl ;
    }
    else{
        alert("Please login first")
        // var locationUrl = "http://localhost:8080/userOrMerchantLogin.html"
    }
}