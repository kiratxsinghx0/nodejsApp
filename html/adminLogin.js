let loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", validateLogin);

//redirect to register page
function registerUser() {
    var url2 = "http://localhost:8080/resigterAdmin.html" ;
    location.href = url2;
    console.log("here now");
}
//validate login
function validateLogin() {
    var email = document.getElementById("floatingInput").value;
    var password = document.getElementById("floatingPassword").value;

    var trimEmail = email.trim() ;
    var trimPassword = password.trim() ;
    console.log(trimEmail, trimPassword)

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
    var url = "http://localhost:5000/api/members/login";

    var p1 = new Promise((resolve, reject) => {
        sendUserData(resolve, reject, url, user)
    });
    p1
        .then((result) => {
            var data = result.target.responseText;
            data = JSON.parse(data);
            console.log(data) ;
            if (data.token) {
                alert(data.msg);
                var url1 = "http://localhost:8080/form.html"
                location.replace(url1);
            }
            else {
                alert(data.msg)
            }
            // console.log(result.target.response)
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