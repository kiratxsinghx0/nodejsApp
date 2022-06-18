let output = document.getElementById("output");
var btn = document.getElementById("btn");
btn.addEventListener("click", validateForm);
function validateForm() {
	let n = document.getElementById("name");
	let p = document.getElementById("phoneNumber");
	let a = document.getElementById("address");
	let e = document.getElementById("email");
	if (n.value == "" || p.value == "" || a.value == "" || e.value == "") {
		alert("fill all the required info");
	}
	else {
		saveData();
	}
}
//creating New User
function createNewUser(resolve, reject, url, data) {
	function reqlistener(data) {
		var daa = data;
		resolve(daa);
	}
	function reqError(err) {
		reject("data is not found")
	}
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.onload = reqlistener;
	xhr.onerror = reqError;
	xhr.withCredentials = true ;
	xhr.setRequestHeader('Content-Type', 'application/json')
	xhr.send(JSON.stringify(data));
}
var name, phoneNumber, Gender, date, address, email;
function saveData() {
	var id = document.getElementById('id').value;
	if (id != "") {
		submitEditUserData();
	}
	else {
		submitMember();
	}
}
function submitMember() {
	name = document.getElementById('name').value;
	phoneNumber = document.getElementById('phoneNumber').value;
	gender = document.getElementById('gender').value;
	date = document.getElementById('date').value;
	address = document.getElementById('address').value;
	email = document.getElementById('email').value;
	var user = {
		name: name,
		phoneNumber: phoneNumber,
		gender: gender,
		date: date,
		address: address,
		email: email
	}
	console.log("submitted User", user);
	var url = "http://localhost:5000/api/members";
	var p1 = new Promise((resolve, reject) => {
		createNewUser(resolve, reject, url, user);
	});

	p1
		.then((result) => {
			getDataAll();
		})
	document.getElementById('name').value = "";
	document.getElementById('phoneNumber').value = "";
	document.getElementById('gender').value = "";
	document.getElementById('date').value = "";
	document.getElementById('address').value = "";
	document.getElementById('email').value = "";
};
window.onload = getDataAll;

//getting data
function getDataAll() {
	function getData(resolve, reject, url) {
		function reqListener(result) {
			var data = JSON.parse(result.target.responseText);
			// console.log(data) ;
			resolve(data.result);
		}
		function reqError(err) {
			reject("data is not fetched");
		}
		var xhr = new XMLHttpRequest();
		xhr.onload = reqListener;
		xhr.onerror = reqError;
		xhr.withCredentials = true ;
		xhr.open('get', url, true);
		xhr.send();
	}
	var url1 = "http://localhost:5000/api/members";
	var p2 = new Promise((resolve, reject) => {
		getData(resolve, reject, url1);
	});
	p2.then((result = []) => {
		// console.log(result) ;
		output.innerHTML = "";
		// var data = JSON.parse(result);
		var data = (result);
		if(data.msg){
			alert(data.msg)
		}
		for (let i = 0; i < data.length; i++) {
			const Name = data[i].name;
			const ph = data[i].phoneNumber;
			const gender = data[i].gender;
			const date = data[i].date;
			const address = data[i].address;
			const email = data[i].email;
			const id = data[i].id;
			const divId = id + "div";
			const fieldId = id + "field";
			const merchantUrl = "http://localhost:8080/merchant/merchantProducts.html/?" + id ;
			output.innerHTML += ` <div id = ${divId} class = "myDiv"><fieldset id = "${fieldId}"> Name : ${Name} <br> Id : ${id} <br>Ph : ${ph} <br> Gender : ${gender} <br> Date : ${date}<br>Address : ${address} <br> Email : ${email} <br> <a href = ${merchantUrl}>CLICK HERE TO GO TO THE MERHCNAT ID</a> <br> <br> </fieldset> <br> </div>`
			let deleteUserId = document.createElement("button");
			deleteUserId.id = id + 'delete';
			deleteUserId.innerHTML = "Delete";
			let field = document.getElementById(fieldId);
			field.appendChild(deleteUserId);
			let editUserId = document.createElement("button");
			editUserId.id = id + 'edit';
			editUserId.innerHTML = "Edit";
			field.appendChild(editUserId);
		}
		for (let i = 0; i < data.length; i++) {
			document.getElementById(data[i].id + 'delete').addEventListener("click", deleteMember);
			document.getElementById(data[i].id + 'edit').addEventListener("click", getEditUserData);
		}
	})
}


// member deletion ;
function deleteUser(resolve, reject, url) {
	function reqListener() {
		let data = (this.responseText)
		resolve(data);
	}
	function reqError(err) {
		reject("data is not fetched");
	}
	var xhr2 = new XMLHttpRequest();
	xhr2.onload = reqListener;
	xhr2.onerror = reqError;
	xhr2.withCredentials = true ;
	xhr2.open('DELETE', url, true);
	xhr2.send(null);
}
function deleteMember(event) {
	var id = event.target.id.split('delete')[0];
	console.log(id) ;
	console.log("print delte");
	var api = "http://localhost:5000/api/members/" + id ;
	var p3 = new Promise((resolve, reject) => {
		deleteUser(resolve, reject, api)
	})
	p3.then((result) => {
		console.log("member with this id :" + id +  " deleted successfully")
		getDataAll();
	})
		.catch((error) => {
			console.log(error);
		});
}


//put request 
function getEditUserData(event) {
	let id = event.target.id.split('edit')[0];
	console.log(id) ;
	let fieldId = event.path[1] ;
	// console.log(fieldId) ;
	fieldId.style["background-color"] = "yellow";
	// console.log(event) ;

	function getOneMemberForUpdate(resolve, reject, url) {
		function reqListener() {
			// console.log(this.responseText)
			var data = JSON.parse(this.responseText);
			// console.log(data);
			resolve(data);
		}
		function reqError(err) {
			reject("data is not fetched");
		}
		var xhr = new XMLHttpRequest();
		xhr.onload = reqListener;
		xhr.onerror = reqError;
		xhr.withCredentials = true ;
		xhr.open('get', url, true);
		xhr.send(null);
	}

	var url = "http://localhost:5000/api/members/" + id;
	var p4 = new Promise((resolve, reject) => {
		getOneMemberForUpdate(resolve, reject, url);
	});
	p4.then((result) => {
		var data = result;
		document.getElementById('name').value = data[0].name;
		document.getElementById('phoneNumber').value = data[0].phoneNumber;
		document.getElementById('gender').value = data[0].gender;
		document.getElementById('date').value = data[0].date;
		document.getElementById('address').value = data[0].address;
		document.getElementById('email').value = data[0].email;
		document.getElementById('id').value = data[0].id;
	})
		.catch((error) => {
			err = error;
			console.log(error)
		});
}
//submit edited data ;
function submitEditUserData(event) {
	function submitEditUserData1(resolve, reject, url, data) {
		function reqListener() {
			var daa = JSON.parse(this.responseText);
			resolve(daa);
		}
		function reqError(err) {
			reject("data is not changed")
		}
		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true ;
		xhr.onload = reqListener;
		xhr.onerror = reqError;
		xhr.open('PUT', url, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(JSON.stringify(data));
		// xhr.send(data);

	}
	var id = document.getElementById('id').value;
	var url = "http://localhost:5000/api/members/" + id;
	var name, phoneNumber, Gender, date, address, email;

	name = document.getElementById('name').value;
	phoneNumber = document.getElementById('phoneNumber').value;
	gender = document.getElementById('gender').value;
	date = document.getElementById('date').value;
	address = document.getElementById('address').value;
	email = document.getElementById('email').value;
	var user = {
		name: name,
		phoneNumber: phoneNumber,
		gender: gender,
		date: date,
		address: address,
		email: email
	}
	var p5 = new Promise((resolve, reject) => {
		submitEditUserData1(resolve, reject, url, user);
	});
	p5
		.then((result) => {
			console.log("member with this id : " +  id +" edited successfully")
			getDataAll();
		})
		.catch((error) => {
			err = error;
			console.log(error);
		})
	document.getElementById('name').value = "";
	document.getElementById('phoneNumber').value = "";
	document.getElementById('gender').value = "";
	document.getElementById('date').value = "";
	document.getElementById('address').value = "";
	document.getElementById('email').value = "";
	document.getElementById('id').value = "";
}