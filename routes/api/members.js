const express = require("express");

const router = express.Router();

const members = require("../../Member.json");

const uuid = require("uuid");

const path = require("path");

const fs = require("fs");

const cors = require("cors");

const jwt = require("jsonwebtoken");

const cookieParser = require("cookie-parser");

const dotenv = require("dotenv") ;
dotenv.config() ;

let JWTSecretKey = process.env.JWTSecretKey ;
	// console.log(JWTSecretKey) ;

router.use(cookieParser());



const mysql = require('mysql2');
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

router.get("/users", (req, res) => {
	const sql = 'SELECT * FROM users';

	db.query(sql, (err, result) => {
		if (err) throw err;
		// res.cookie("names","kirat") ;
		const token = req.cookies.token;
		// console.log(token) ;
		// res.set("Authorization", "Bearer" + token).send(result);
		console.log(token);
	})
})

//get all members
router.get("/", verification, (req, res) => {
	const sql = 'SELECT * FROM users';
	db.query(sql, (err, result) => {
		if (err) {
			res.send("error occured while getting all users", err)
		}
		else {
			// res.cookie("names","kirat") ;
			// const cookie = req.cookies.token ;
			// console.log("token : " , cookie) ;
			// res.set("Authorization" , "Bearer " + cookie).send(result);
			// const reqBearer = req.headers["Auhtorization"] ;
			// console.log(reqBearer) ;
			res.send(result);
		}

	})
});


//get one member
router.get("/:id", verification, (req, res) => {
	var id = req.params.id;
	const sql = 'SELECT * FROM users WHERE id = ?';
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
	const Gender = req.body.Gender;
	const date = req.body.date;
	const phoneNumber = req.body.phoneNumber;
	const address = req.body.address;
	const status = "active";
	// const sql = 'INSERT INTO users (id,name,email,Gender,date,phoneNumber,address,status) VALUES(id,name,email,Gender,date,phoneNumber,address,status)' ;
	const sql = 'INSERT INTO users (id,name,email,Gender,date,phoneNumber,address,status) VALUES ?';

	var value = [[id, name, email, Gender, date, phoneNumber, address, status]];

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
	const { name, email, Gender, date, phoneNumber, address } = req.body;
	var records = [name, email, Gender, date, phoneNumber, address, id];
	const sql = `UPDATE users SET name = ?, 
					 email = ?,
					 Gender = ?,
					 date = ?,
					 phoneNumber = ?,
					 address = ?
	                 WHERE id = ?` ;
	// const sql = 'UPDATE user SET name = ?, SET email = ?, SET Gender = ?, SET date = ?,SET phoneNumber = ?, SET address = ? WHERE id = ?'
	db.query(sql, records, (err, result) => {
		if (err) throw err;
		res.status(200).send(result);
	})
});

router.delete("/:id", verification, (req, res) => {   //delete member
	var id = req.params.id;
	const sql = 'DELETE FROM users WHERE id = ?'
	db.query(sql, id, (err, result) => {
		if (err) {
			res.send("error occured during deletion", err)
		}
		else {
			res.send(result);
			console.log("result", result)
		}
	})
});

//jwt post

router.post("/login", (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const sql = `select * from auth where email = ?`
	db.query(sql, email, (err, result) => {
		if (err) {
			res.send("email not registered", err)
		}
		else {
			if (result == "") {
				res.json({ msg: "email not registered" })
			}
			else if (password === result[0].password) {
				var orgUser = result[0];
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
						res.cookie("token", token , cookieConfig);
						// console.log(req.cookies);
						res.json({ msg: "email and password does match", token });
						// res.set("Authorization" , "Bearer " + token).json({ msg: "email and password does match", token, });
					}
				})
			}
			else if (password != result[0].password) {
				res.json({ msg: "password and email does not match" })
				console.log("password and email does not match")
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
	// console.log(token);
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
router.post("/registerAdmin", (req, res) => {
	const email = req.body.email;
	const userName = req.body.userName;
	const gender = req.body.gender;
	const password = req.body.password;

	const sql = 'INSERT INTO auth (email,userName,gender,password) VALUES ?';
	var value = [[email, userName, gender, password]];

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



module.exports = router;

// db.end()

