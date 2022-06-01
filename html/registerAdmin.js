let registerUserBtn = document.getElementById("registerUserBtn");
registerUserBtn.addEventListener("click", validateRegisterUser);

function validateRegisterUser() {

    const email = document.getElementById("email").value;
    const userName = document.getElementById("userName").value;
    const gender = document.getElementById("gender").value;
    const password = document.getElementById("password").value;
    const confPassword = document.getElementById("confirmPassword").value;

    if (email == "" || userName == "" || gender == "" || password == "" || confPassword == "") {
        alert("fill all the required info");
    }
    else if (password != confPassword) {
        alert("passwords are not same")
    }
    else if (email !== "" && userName !== "" && gender !== "" && password !== "" && confPassword !== "" && password === confPassword) {
        registerNewAdmin();
    }

}

function sendNewAdminData(resolve, reject, user, url) {
    function reqlistener(data) {
        resolve(data);
    }
    function reqError(err) {
        reject("not able to add new admin")
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onload = reqlistener;
    xhr.onerror = reqError;
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(user))
}


function registerNewAdmin() {
    const email = document.getElementById("email").value;
    const userName = document.getElementById("userName").value;
    const gender = document.getElementById("gender").value;
    const password = document.getElementById("password").value;
    const confPassword = document.getElementById("confirmPassword").value;

    const newAdmin = {
        email,
        userName,
        gender,
        password
    }

    console.log(newAdmin);
    var url = "http://localhost:5000/api/members/registerAdmin";
    var p1 = new Promise((resolve, reject) => {
        sendNewAdminData(resolve, reject, newAdmin, url);
    });
    p1.then((result) => {
        var data = JSON.parse(result.target.responseText);
        let fullErrMsg = data.err.sqlMessage ;
        if(fullErrMsg){
            let errMsg = fullErrMsg.split("key ") ;
            if(errMsg[1] == "'auth.PRIMARY'"){
                alert("username not avaiable")
            }
            else if(errMsg[1] == "'auth.idx_email'"){
                alert("email is already registered")
            }
        }
        else{
        alert(data.msg) ;
        }
        // console.log(data.err.sqlMessage) ;
    })
    document.getElementById("email").value = "";
    document.getElementById("userName").value = "";
    document.getElementById("gender").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";

}


