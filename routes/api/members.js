const express = require("express");

const router = express.Router();

// const members = require("../../Member.json");

const uuid = require("uuid");

const path = require("path");

const fs = require("fs");

const cors = require("cors");

const jwt = require("jsonwebtoken");

const cookieParser = require("cookie-parser");

const bcrypt = require("bcrypt")

const dotenv = require("dotenv");
dotenv.config();

let JWTSecretKey = process.env.JWTSecretKey;
// console.log(JWTSecretKey) ;

router.use(cookieParser());



const mysql = require('mysql2');
// const req = require("express/lib/request");
// const { nextTick } = require("process");
const db = mysql.createConnection({
	host: process.env.host,
	user: process.env.user,
	password: process.env.password,
	database: process.env.database
})

db.connect((err) => {
	if (err) {
		console.log("error occured", err)
	}
	else {
		console.log("connection created")
	}
});
// console.log("members")
// console.log(members);
// const getAllMembers = require("../../controllers/index.js")

//get all members
router.get("/", verification, (req, res) => {
	const sql = 'SELECT * FROM merchant';
	db.query(sql, (err, result) => {
		if (err) {
			res.status(400).json({confMsg : "error occured while getting all merchant", err})
		}
		else {
			res.json({result});
		}

	})
});


//get one member
router.get("/:id", verification, (req, res) => {
	var id = req.params.id;
	const sql = 'SELECT * FROM merchant WHERE id = ?';
	db.query(sql, id, (err, result) => {
		if (err) {
			res.send(`error occured while getting user with this ${id}`, err)
		}
		else {
			res.send(result)
			console.log(result);
		}
	})
});

//create member
router.post('/', verification, (req, res) => {
	const id = uuid.v4();
	const name = req.body.name;
	const email = req.body.email;
	const gender = req.body.gender;
	const date = req.body.date;
	const phoneNumber = req.body.phoneNumber;
	const address = req.body.address;
	const status = "active";
	// const sql = 'INSERT INTO merchant (id,name,email,gender,date,phoneNumber,address,status) VALUES(id,name,email,gender,date,phoneNumber,address,status)' ;
	const sql = 'INSERT INTO merchant (id,name,email,gender,date,phoneNumber,address,status) VALUES ?';

	var value = [[id, name, email, gender, date, phoneNumber, address, status]];
	
	db.query(sql, [value], (err, result) => {
		if (err) {
			res.send("error occured", err);
		}
		else {
			// res.cookie("name",name) ;
			res.send(result);
			console.log(result)
		}
	})
});

router.put("/:id", verification, (req, res) => {   //update member
	var id = req.params.id;
	const { name, email, gender, date, phoneNumber, address } = req.body;
	var records = [name, email, gender, date, phoneNumber, address, id];
	const sql = `UPDATE merchant SET name = ?, 
					 email = ?,
					 gender = ?,
					 date = ?,
					 phoneNumber = ?,
					 address = ?
	                 WHERE id = ?` ;
	// const sql = 'UPDATE user SET name = ?, SET email = ?, SET gender = ?, SET date = ?,SET phoneNumber = ?, SET address = ? WHERE id = ?'
	db.query(sql, records, (err, result) => {
		if (err) throw err;
		res.status(200).send(result);
	})
});

router.delete("/:id", verification, (req, res) => {   //delete member
	var id = req.params.id;
	const sql = 'DELETE FROM merchant WHERE id = ?'
	db.query(sql, id, (err, result) => {
		if (err) {
			res.status(400).json({ msg : "error occured during deletion", err })
		}
		else {
			res.status(200).send(result);
			console.log("result", result)
		}
	})
});

//jwt post

router.post("/login", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const sql = `select * from auth where email = ?`
	db.query(sql, email, async (err, result) => {
		if (err) {
			res.send("email not registered", err)
		}
		else {
			if (result == "") {
				res.json({ msg: "email not registered" })
			}
			else if (result[0].password) {
				const checkPassword = await bcrypt.compare(password,result[0].password) ;
				console.log(checkPassword) ;
				console.log(result) ;
				if(checkPassword == true){
				var orgUser = result[0];
				console.log(orgUser)
				console.log(orgUser, "using form as an admin");
				jwt.sign({ orgUser }, JWTSecretKey, (err, token) => {
					if (err) {
						res.json({ msg: "error occured during generating key", err });
					}
					else {
						const cookieConfig = {
							httpOnly: true, // to disable accessing cookie via client side js
							secure: true, // to force https (if you use it)
							maxAge: 1000000, // ttl in seconds (remove this option and cookie will die when browser is closed)
							signed: true // if you use the secret with cookieParser
						};
						res.cookie("token", token, cookieConfig);
						// console.log(req.cookies);
						res.json({ msg: "login successfully", token });
						// res.set("Authorization" , "Bearer " + token).json({ msg: "email and password does match", token, });
					}
				})
			}
			else  {
				res.json({ msg: "Password is incorrect" })
				console.log("password and email does not match")
			}
		}
		}
	})
});

// / const cookieConfig = {
// 	httpOnly: true, // to disable accessing cookie via client side js
// 	//secure: true, // to force https (if you use it)
// 	maxAge: 1000000, // ttl in seconds (remove this option and cookie will die when browser is closed)
// 	signed: true // if you use the secret with cookieParser
//   };/
// router.get('/set', (req, res) => {
// MAIN CODE HERE :
// 	res.cookie('test', 'some value', cookieConfig);
// 	res.send('set cookie');
//   });

function verification(req, res, next) {
	const token = req.signedCookies.token;
	// const unsignedToken = req.Cookie.token ;
	// console.log(token);
	// console.log(unsignedToken)
	if (!token) {
		console.log("no token");
		res.status(403).json({ msg: "no authorized user found for this page" });
	}
	else if (token) {
		jwt.verify(token, JWTSecretKey, (err, authUser) => {
			if (err) {
				console.log("not authorizeed user fro this request")
				res.status(403).json({ msg: "user not authorized for this request" })
			}
			else {
				// console.log(authUser);
				console.log("verified request");
				next();
			}
		})
		// const reqBearer = req.getHeader["Auhtorization"] ;
		// console.log(reqBearer) ;
		// console.log("verified");
		// next();
	}
}

//new register user for admin 
router.post("/registerAdmin", async (req, res) => {
	const email = req.body.email;
	const userName = req.body.userName;
	const gender = req.body.gender;
	const password = req.body.password;
	const saltRounds = 10;
	const hashPassword = await bcrypt.hash(password, saltRounds);
	const sql = 'INSERT INTO auth (email,userName,gender,password) VALUES ?';
	var value = [[email, userName, gender, hashPassword]];

	db.query(sql, [value], (err, result) => {
		if (err) {
			res.json({ msg: "error occured", err })
			console.log(err)
		}
		else {
			res.json({ msg: "New Admin added", result });
			console.log(result)
		}
	})
});



//register new merchant

router.post('/registerMerchant', (req, res) => {
	const id = uuid.v4();
	const { userName, email, gender, date , phoneNumber, address, password} = JSON.parse(req.body) ;
	const status = "active";
	// const userName = req.body.userName ;
	// console.log(req.body) ;
	// const sql = 'INSERT INTO merchant (id,name,email,gender,date,phoneNumber,address,status) VALUES(id,name,email,gender,date,phoneNumber,address,status)' ;
	const sql = 'INSERT INTO merchant (id,name,email,gender,date,phoneNumber,address,status, merchantPassword) VALUES ?';

	const value = [[id, userName, email, gender, date, phoneNumber, address, status , password]];

	// console.log(value)
	db.query(sql, [value], (err, result) => {
		if (err) {
			res.status(400).json({msg : "error occured", err})
		}
		else {
			res.status(200).json({msg : "welcome Merchant", result})
			console.log(result)
		}
	})
});

//	REGISTER NEW USER

router.post('/registerUser', (req, res) => {
	const id = uuid.v4();
	const { userName, email, gender, date , phoneNumber, address, password} = JSON.parse(req.body) ;
	const status = "active";
	// const userName = req.body.userName ;
	// console.log(req.body) ;
	// const sql = 'INSERT INTO merchant (id,name,email,gender,date,phoneNumber,address,status) VALUES(id,name,email,gender,date,phoneNumber,address,status)' ;
	const sql = 'INSERT INTO users (id,name,email,gender,date,phoneNumber,address,status, userPassword) VALUES ?';

	const value = [[id, userName, email, gender, date, phoneNumber, address, status , password]];

	// console.log(value)
	db.query(sql, [value], (err, result) => {
		if (err) {
			res.status(400).json({msg : "error occured", err})
			console.log("error occured", err) ;
		}
		else {
			res.status(200).json({msg : "Welcome User", result})
			console.log(result)
		}
	})
});


router.post("/userOr/MerchantLogin" , (req,res)=>{
	const email = req.body.email ;
	const enteredPassword = req.body.password ;
	const sql = `CALL sp_getPassword ( ? , @pass , @getUserType, @getId)` ;
	const sql2 = `SELECT @pass , @getUserType , @getId`  ;
	db.query(sql, email , (err, result) =>{
		if(err){
			console.log( "eerr1",err) ;
		}
		else{
			console.log("reuslt1",result) ;
		}
	})
	db.query( sql2 , (err, result) =>{
		if(err){
			res.status(400).json({msg : "error occured"})
			console.log("err2",err) ;
		}
		else{
			console.log(result) ;
			const userType = result[0]["@getUserType"] ;
			const realPassword = result[0]["@pass"] ;
			const id = result[0]["@getId"]
			console.log(realPassword)
			if(realPassword == enteredPassword){
				res.status(200).json({msg : "welcome to SHOPCRAZI" , userType , id })
			}
				else if(!realPassword){
					res.status(400).json({msg : "User Does not exists"})
				}
				else if(realPassword != enteredPassword){
					res.status(400).json({msg : "Incorrect Password"})
				}
		}
	})
	
});


router.post("/userOrMerchantLogin" , (req,res)=>{
	const email = req.body.email ;
	const enteredPassword = req.body.password ;
	const sql = `CALL sp_getPassword ( ? , @pass , @getUserType, @getId)` ;
	const sql2 = `SELECT @pass , @getUserType , @getId`  ;
	db.query(sql, email , (err, result) =>{
		if(err){
			console.log( "eerr1",err) ;
		}
		else{
			console.log("reuslt1",result) ;
		}
	})
	db.query( sql2 , (err, result) =>{
		if(err){
			res.status(400).json({msg : "error occured"})
			console.log("err2",err) ;
		}
		else{
			console.log(result) ;
			const userType = result[0]["@getUserType"] ;
			const realPassword = result[0]["@pass"] ;
			const id = result[0]["@getId"]
			console.log(realPassword)
			if(realPassword == enteredPassword){
				const orgUser = {
					email,
					realPassword 
				} ;
				jwt.sign({ orgUser }, JWTSecretKey, (err, token) => {
					if (err) {
						res.json({ msg: "error occured during generating key", err });
					}
					else {
						const cookieConfig = {
							httpOnly: true, // to disable accessing cookie via client side js
							secure: true, // to force https (if you use it)
							maxAge: 10000000, // ttl in seconds (remove this option and cookie will die when browser is closed)
							signed: true // if you use the secret with cookieParser
						};
						res.cookie("token", token, cookieConfig);
						// console.log(req.cookies);
				res.status(200).json({msg : "welcome to SHOPCRAZI" , userType , id })
				console.log("cookie created")
					
						// res.set("Authorization" , "Bearer " + token).json({ msg: "email and password does match", token, });
					}
				})
			}
				else if(!realPassword){
					res.status(400).json({msg : "User Does not exists"})
				}
				else if(realPassword != enteredPassword){
					res.status(400).json({msg : "Incorrect Password"})
				}
		}
	})
	
});





module.exports = router;

// db.end()

