
var searchInputProduct = document.getElementById("searchInput");
var searchBarSuggestions = document.getElementById("searchResult");
// console.log(searchBarSuggestions)
searchInputProduct.addEventListener("input", searchInput => {
    const value = searchInput.target.value.toLowerCase();
    // console.log(value);
    var searchProducts = [];
    searchBarSuggestions.innerHTML = "" ;
    for (let i = 0; i < allProducts.length; i++) {
        var productName = allProducts[i].productName;
        let productExists = allProducts[i].productName.toLowerCase();
        if (productExists.includes(value)) {
            if (searchProducts.length < 5) {
                if (value !== " " && value !== "") {        
                    let productId = allProducts[i].productId;
                    let url = "http://localhost:8080/singleProductDetails.html/?" + productId ;
                    searchProducts.push(allProducts[i].productId);
                    searchBarSuggestions.innerHTML += `<li><i class="fa fa-search"></i><a href=${url} target = "_blank">${productName}</a></li>`
            }
        }
    }
}
    for(let i = 0 ; i < allProducts.length ; i++){
        let productExists = allProducts[i].productName.toLowerCase();
     if(value !== " " && value !== "" && !productExists.includes(value) && searchProducts.length == 0){
        searchBarSuggestions.innerHTML = `<li><i class="fa fa-search"></i><a href=nowhere target = "_blank" id = notFound>product not available</a></li>`
    }    
}
});



var allProducts;

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
    // console.log(allProducts);
}

window.onload = getAllProducts();