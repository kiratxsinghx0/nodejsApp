let loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", validateLogin);

let registerBtn = document.getElementById("registerBtn");
registerBtn.addEventListener("click", registerUser);

//redirect to register page
function registerUser() {
    var url2 = "http://localhost:8080/resigterAdmin.html"
    location.href = url2;
    console.log("here now");
}
//validate login
function validateLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email == "" || password == "") {
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
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    var user = {
        email: email,
        password: password
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
            // console.log(data) ;
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
    document.getElementById('email').value = "";
    document.getElementById('password').value = "";
}