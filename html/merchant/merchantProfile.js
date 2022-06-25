
const profileUrl = window.location.href ;
const profileUrlArray = profileUrl.split("?") ;
console.log(profileUrlArray) ;

const userId = profileUrlArray[1] ;
console.log(userId) ;

async function getMerchantInfo1(){
    const requestUrl = "http://localhost:5000/products/merchantInfo/" + userId ;
    const result = await getMerchantInfo2(requestUrl) ;
    const merchantDetails = result.result ;
    console.log(merchantDetails) ;
    document.getElementById("email").value = merchantDetails[0].email;
    document.getElementById("userName").value = merchantDetails[0].name;
    document.getElementById("gender").value = merchantDetails[0].gender ; 
    document.getElementById("phoneNumber").value = merchantDetails[0].phoneNumber ;
    document.getElementById("status").value = merchantDetails[0].status ;
    document.getElementById("address").value = merchantDetails[0].address ;
    document.getElementById("password").value = merchantDetails[0].merchantPassword ;
    // console.log(result) ;
}



function getMerchantInfo2(requestUrl){
    return new Promise((resolve,reject)=>{
        getMerchantInfo3(resolve,reject,requestUrl)
    })
}

function getMerchantInfo3(resolve,reject,requestUrl){
    function reqListener(data){
        const daa = JSON.parse(data.target.responseText)
        resolve(daa);
    }
    function reqError(){
        reject("not able to fetch")
    }

    const xhr = new XMLHttpRequest();
    xhr.open("get", requestUrl , true) ;
    xhr.onload = reqListener ;
    xhr.onerror = reqError ;
    xhr.send() ;
}

window.onload = getMerchantInfo1();
document.getElementById("emailBtn").addEventListener("click" , editEmail) ;
document.getElementById("userNameBtn").addEventListener("click" ,editUserName ) ;
document.getElementById("genderBtn").addEventListener("click" ,editGender ) ;
document.getElementById("addressBtn").addEventListener("click" ,editAddress ) ;
document.getElementById("passwordBtn").addEventListener("click" ,editPassword ) ;
document.getElementById("phoneBtn").addEventListener("click" , editPhoneNumber) ;

function editEmail(event){
    document.getElementById("email").removeAttribute("readonly") ;
document.getElementById("submitBtnId").style.display = "block" ;

    event.preventDefault();
}
function editUserName(event){
    document.getElementById("userName").removeAttribute("readonly") ;
document.getElementById("submitBtnId").style.display = "block" ;
    event.preventDefault();
}
function editGender(event){
document.getElementById("submitBtnId").style.display = "block" ;
document.getElementById("gender").removeAttribute("readonly") ;
    event.preventDefault();
}
function editPhoneNumber(event){
document.getElementById("submitBtnId").style.display = "block" ;
document.getElementById("phoneNumber").removeAttribute("readonly") ;
    event.preventDefault();
}
function editAddress(event){
document.getElementById("submitBtnId").style.display = "block" ;
document.getElementById("address").removeAttribute("readonly") ;
    event.preventDefault();
}
function editPassword(event){
    document.getElementById("password").removeAttribute("readonly") ;
document.getElementById("submitBtnId").style.display = "block" ;
document.getElementById("password").setAttribute( "type" ,"text") ;
    event.preventDefault();
}
document.getElementById("submitBtnId").addEventListener("click",submitEditUser) ;

async function submitEditUser(event){
    event.preventDefault() ;

   const email =  document.getElementById("email").value ;
  const name =   document.getElementById("userName").value ;
   const gender =  document.getElementById("gender").value ; 
  const phoneNumber =  document.getElementById("phoneNumber").value ;
  const address =   document.getElementById("address").value ;
   const password =  document.getElementById("password").value  ;
   const editedUserInfo = {
    email,
    name,
    gender,
    phoneNumber,
    address,
    password
   }
document.getElementById("submitBtnId").style.display = "none" ;
   console.log(editedUserInfo);
    const requestUrl = "http://localhost:5000/products/updateMerchantInfo/" + userId ;
    const result = await submitEditUser2(requestUrl, editedUserInfo) ;
  if(result.msg == "merchant updated"){
    alert("Profile Updated") ;
    getMerchantInfo1() ;
  }else{
    alert("Not Able To Update Profile")
  }
  document.getElementById("userName").setAttribute("readonly" , true) ;
  document.getElementById("phoneNumber").setAttribute("readonly" , true) ;
  document.getElementById("address").setAttribute("readonly" , true) ;
  document.getElementById("password").setAttribute("readonly" , true) ;
  document.getElementById("gender").setAttribute("readonly" , true) ;
  document.getElementById("email").setAttribute("readonly" , true) ;
}



function submitEditUser2(requestUrl,editedUserInfo){
    return new Promise((resolve,reject)=>{
        submitEditUser3(resolve,reject,requestUrl,editedUserInfo)
    })
}

function submitEditUser3(resolve,reject,requestUrl,editedUserInfo){
    function reqListener(data){
        const daa = JSON.parse(data.target.responseText)
        resolve(daa);
    }
    function reqError(){
        reject("not able to edit user")
    }

    const xhr = new XMLHttpRequest();
    xhr.open("put", requestUrl , true) ;
    xhr.setRequestHeader("Content-Type" , 'application/json')
    xhr.onload = reqListener ;
    xhr.onerror = reqError ;
    xhr.send(JSON.stringify(editedUserInfo)) ;
}