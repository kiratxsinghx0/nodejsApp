
var searchInputProduct = document.getElementById("searchInput");

searchInputProduct.addEventListener("input", result);
searchInputProduct.addEventListener("keypress", getSearchProducts)

var value;
var newValue;

function result(event) {
    value = event.target.value.toLowerCase();
}

function getSearchProducts(event) {
    var valueArray;
    var newValueArray;
    var serachKeyWords = "";
    var distinctArray = [];
    if (event.key === "Enter") {
        if (value) {
            valueArray = value.split(" ");
            newValueArray = valueArray.filter(singleValue => singleValue.trim());
        }
        if (newValueArray.length > 1) {
            for (let i = 0; i < newValueArray.length; i++) {
                var left = i;
                var right = newValueArray.length;
                var newLeft = left + 1;
                while (left < right) {
                    if (newValueArray[left] == newValueArray[right]) {
                        break;
                    }
                    if (newValueArray[left] !== newValueArray[right] && right > left + 1) {
                        right--;
                    }
                    else if (newValueArray[left] !== newValueArray[left + 1]) {
                        serachKeyWords += newValueArray[left] + "+";
                        distinctArray.push(newValueArray[left]);
                        right--;
                    }
                }

            }
            console.log(distinctArray);
        }
        else {
            serachKeyWords = newValueArray[0];
        }

        if(serachKeyWords.includes("+")){
            serachKeyWords = serachKeyWords.slice(0, -1) ;
        }
        var url = "http://localhost:8080/searchProducts/searchProducts.html/?" + serachKeyWords ;
        location.href = url;
    }
}