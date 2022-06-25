const submitRegisterBtn = document.getElementById("submitRegisterBtn");
submitRegisterBtn.addEventListener("click", validateRegisterData);
// console.log("here") ;
function validateRegisterData() {
    const email = document.getElementById("email").value;
    const userName = document.getElementById("userName").value;
    const registerCategory = document.getElementById("registerCategory").value;
    const gender = document.getElementById("gender").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const password = document.getElementById("password").value;
    const confPassword = document.getElementById("confirmPassword").value;
    const date = document.getElementById("date").value;
    const address = document.getElementById("address").value;

    const registerData = {
        email,
        userName,
        registerCategory,
        gender,
        phoneNumber,
        password,
        date,
        address
    }

    if (email.trim() == "" || userName.trim() == "" || address.trim() == "" || password.trim() == "" || confPassword.trim() == "" || date.trim() == "" || phoneNumber.trim() == "") {
        alert("fill all the reqiured info");
    }
    else {
        if (password == confPassword) {
            if (registerCategory == "user") {
                sendUserData(registerData)
            }
            else if (registerCategory == "merchant") {
                sendMerchantData(registerData)
            }
        }
        else {
            alert("Please Enter the Same Password")
        }
    }

}

function sendRegisterData1(registerData, requestUrl) {
    return new Promise((resolve, reject) => {
        sendRegisterData2(resolve, reject, registerData, requestUrl);
    })
}

function sendRegisterData2(resolve, reject, registerData, requestUrl) {
    function reqlistener(data) {
        // console.log(data) ;
        resolve(data);
    }
    function reqError(err) {
        console.log(err);
        reject(err)
    }

    const xhr = new XMLHttpRequest();
    xhr.open("post", requestUrl, true);
    xhr.onload = reqlistener;
    xhr.onerror = reqError;
    xhr.send(JSON.stringify(registerData));
}

async function sendMerchantData(registerData) {
    const registerAdminData = registerData;
    const merchantRequestUrl = "http://localhost:5000/api/members/registerMerchant"
    const result = await sendRegisterData1(registerAdminData, merchantRequestUrl);
    const data = JSON.parse(result.target.responseText);
    if (data.err) {
        let fullErrMsg = data.err.sqlMessage;
        let errMsg = fullErrMsg.split("key ");
        if (errMsg[1] == "'merchant.UI_Email'") {
            alert("email is already registered")
        }
    }
    else {
        alert(data.msg);
        const loginUrl = "http://localhost:8080/userOrMerchantlogin.html" ;
        location.replace(loginUrl)
    }
    document.getElementById("email").value = "";
    document.getElementById("userName").value = "";
    document.getElementById("registerCategory").value = "";
    document.getElementById("gender").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
    document.getElementById("date").value = "";
    document.getElementById("address").value = "";

}

async function sendUserData(registerData) {
    const registerUserData = registerData;
    const userRequestUrl = "http://localhost:5000/api/members/registerUser";
    const result = await sendRegisterData1(registerUserData, userRequestUrl)
    console.log(result)
    const data = JSON.parse(result.target.responseText);
    if (data.err) {
        let fullErrMsg = data.err.sqlMessage;
        let errMsg = fullErrMsg.split("key ");
        if (errMsg[1] == "'users.UI_email'") {
            alert("email is already registered")
        }
    }
    else {
        alert(data.msg);
        const loginUrl = "http://localhost:8080/userOrMerchantLogin.html" ;
        location.replace(loginUrl) ;
    }

    document.getElementById("email").value = "";
    document.getElementById("userName").value = "";
    document.getElementById("registerCategory").value = "";
    document.getElementById("gender").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
    document.getElementById("date").value = "";
    document.getElementById("address").value = "";

}