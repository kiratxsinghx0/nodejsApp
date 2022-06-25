var homeSelect = document.getElementById("homeSelect");
homeSelect.addEventListener("change", switchPages);
// homeSelect.addEventListener("change", switchPages2);
        const locurl = window.location.href;
        const locurlArray = locurl.split("?");
         const urlLength = locurlArray.length ; 

function switchPages(event) {
    console.log(event);
    console.log(event.target.value);
    console.log("here");
    var pageName = event.target.value ;
    if(urlLength > 2){
        var userId = locurlArray[1] ;
        if(pageName == "myProducts"){
            const locationUrl = "http://localhost:8080/merchant/merchantProducts.html/?" + userId + "?" ;
            // const locationUrl = "http://localhost:8080/userOrMerchantLogin.html" ;
            location.href = locationUrl ;
        }
        else if(pageName == "addNewProducts"){
            const locationUrl3 = "http://localhost:8080/merchant/merchantAddProduct.html/?" + userId + "?" ;
            location.href = locationUrl3 ;
        }
        else if(pageName == "myProfile"){
            const locationUrl3 = "http://localhost:8080/merchant/merchantProfile.html/?" + userId + "?" ;
            location.href = locationUrl3 ;
        }
        else if(pageName == "logOut"){
            const locationUrl4 = "http://localhost:8080/userOrMerchantLogin.html" ;
            location.replace(locationUrl4) ;
        }
    }
    if(urlLength <= 2){
        if(pageName == "home"){
            const locationUrl6 = "http://localhost:8080/products.html" ;
            location.href = locationUrl6 ;
        }
        else if(pageName == "shoppingCart"){
            alert("Please Login First") ;
            // const locationUrl7 = "http://localhost:8080/userOrMerchantLogin.html" ;
            // location.replace(locationUrl7) ;
        }
        else if(pageName == "wishlist"){
            alert("Please Login First") ;
            // const locationUrl8 = "http://localhost:8080/userOrMerchantLogin.html" ;
            // location.replace(locationUrl8)
        }
        else if(pageName == "logOut"){
            const locationUrl9 = "http://localhost:8080/userOrMerchantLogin.html" ;
            location.replace(locationUrl9)
        }

    }

}
