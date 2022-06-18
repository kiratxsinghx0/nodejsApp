let loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", validateLogin);

let registerBtn = document.getElementById("registerBtn");
registerBtn.addEventListener("click", registerUser);

//redirect to register page
function registerUser() {
    var url2 = "http://localhost:8080/resigterAdmin.html";
    location.href = url2;
    console.log("here now");
}
//validate login
function validateLogin() {
    const email = document.getElementById("floatingInput").value;
    const password = document.getElementById("floatingPassword").value;

    var trimEmail = email.trim() ;
    var trimPassword = password.trim() ;

    if (trimEmail == "" || trimPassword == "") {
        alert("fill the required info")
    }
    else {
        sendUser();
    }
}

function sendUserData(resolve, reject, url, user) {
    function reqlistener(data) {
        var daa = data;
        resolve(daa);
    }
    function reqError(err) {
        reject("data is not found")
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    // xhr.withCredentials = true ;
    xhr.onload = reqlistener;
    xhr.onerror = reqError;
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(user));
}
function sendUser() {
    const email = document.getElementById("floatingInput").value;
    const password = document.getElementById("floatingPassword").value;

    var trimEmail = email.trim() ;
    var trimPassword = password.trim() ;

    var user = {
        email: trimEmail,
        password: trimPassword
    }
    console.log(user);
    var url = "http://localhost:5000/products/merchantLogin";

    var p1 = new Promise((resolve, reject) => {
        sendUserData(resolve, reject, url, user)
    });
    p1
        .then((result) => {
            var data = result.target.responseText;
            data = JSON.parse(data);
            console.log(data);
            alert(data.msg);
            const merchantInfo = data.result[0] ;
            console.log(merchantInfo) ;
            const merchantId = merchantInfo.id ;
            console.log(merchantId) ;
            var url1 = "http://localhost:8080/merchant/merchantProducts.html/?" + merchantId ;
            location.replace(url1);

        })
    document.getElementById('floatingInput').value = "";
    document.getElementById('floatingPassword').value = "";
}

// const ad =document. getElementById("email") ;
// ad.addEventListener("input", e =>{
//     // console.log(e) ;
//     const value = e.target.value ;
//     console.log(value) ;
// })