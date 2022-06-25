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

// router.use(cookieParser());



const mysql = require('mysql2');
// const { json } = require("body-parser");
// const Pool = require("mysql2/typings/mysql/lib/Pool");
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


//GET ALL PRODUCTS

router.get("/", (req, res) => {
    const sql = `select productcategories.categoryName , productdetails.productColour, productdetails.productName, productdetails.productCategoryId,productdetails.productPrice,productdetails.productDiscount,productdetails.productImage,productdetails.productManufacturer,productMeasurements,productdetails.productId
    from productcategories
    inner join productdetails on productdetails.productCategoryId= productcategories.categoryId ;`
    db.query(sql, (err, result) => {
        if (err) {
            res.json({ msg: "error occured", err });
            console.log(err);
        }
        else {
            res.json({ confmsg: "all products fetched", result });
            // res.send(result) ;
            console.log("all products fetched")
            // console.log(result);
        }
    })
})
//get one product
router.get("/singleProduct/:productId", (req, res) => {
    var productId = req.params.productId;
    const sql = `select * from productdetails where productId = ?`;
    db.query(sql, productId, (err, result) => {
        if (err) {
            res.json({ confMsg: "error occured while fetching" })
            console.log("erroe while fecthing")
        }
        else {
            res.json({ confMsg: "product fetched", result })
            console.log(`product with this Id ${productId} fetched`)
        }
    })
});

//merchantLogin
router.post("/merchantLogin", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const sql = `select * from merchant where email = ?`
    db.query(sql, email, async (err, result) => {
        if (err) {
            res.status(500).send("email not registered", err)
        }
        else {
            if (result == "") {
                res.json({ msg: "email not registered" })
            }
            else if (result[0].password == password) {
                res.json({ msg: "login successfully", result })
            }
        }
    }
    )
}
);


//MERCHANT ADDED PRODUCTS
router.get("/merchant/:merchantId", (req, res) => {
    var merchantId = req.params.merchantId;
    const sql = `select * from productdetails where merchantId = ?`;
    db.query(sql, merchantId, (err, result) => {
        if (err) {
            res.json({ confMsg: "error occured" });
        }
        else {
            res.status(200).json({ confMsg: "products fetched of associted merchant", result });
            console.log("products fetched of associted merchant");
        }
    })
});


//MERCHANT ADDING NEW PRODUCT 

router.post("/addNewProducts", (req, res) => {
    console.log(req.body);
    const productId = uuid.v4();
    const { productPrice, productColour, productName, productManufacturer, productMeasurements, productDiscount, productImage, merchantId } = req.body;
    const productCategoryId = req.body.productCategoryId;
    const productInventory = req.body.productInventory;
    const sql = `insert into productdetails (productCategoryId , productId,productName, productPrice , productDiscount, productManufacturer , productMeasurements, productImage , productColour, merchantId , productInventory) values ?`
    values = [[productCategoryId, productId, productName, productPrice, productDiscount, productManufacturer, productMeasurements, productImage, productColour, merchantId, productInventory]];

    db.query(sql, [values], (err, result) => {
        if (err) {
            res.json({ confMsg: "error occured while adding new product", err })
            console.log("error occured while adding new product", err);
        }
        else {
            res.json({ confMsg: "product Added", result });
            console.log("new product added", result);
        }
    })
})

//ADD PRODUCTS TO CART

router.post("/AddToCart", verification, (req, res) => {
    console.log(req.body);
    // const data = JSON.parse(req.body) ;
    const sendUserId = req.body.sendUserId;
    // const sendUserId = data.sendUserId ;
    // const sendProductId = data.sendProductId ;  
    const sendProductId = req.body.sendProductId;
    console.log(sendUserId);
    console.log(sendProductId);
    const userIdProductId = sendUserId + "+" + sendProductId;
    const productQuantity = "1";
    console.log(userIdProductId);

    const sql = `insert into cart (userIdProductId , userId, productId , productQuantity ) values  ?`
    values = [[userIdProductId, sendUserId, sendProductId, productQuantity]];
    db.query(sql, [values], (err, result) => {
        if (err) {
            res.status(400).json({ msg: "product is already added" })
            console.log(err)
        }
        else {
            res.status(200).json({ msg: "product added to cart" })
            console.log(result);
        }
    })
})

//GET PRODUCTS no.s ADDED BY THE USER IN THE CART

router.get("/cartProducts/:userId", (req, res) => {

    const sql = `select * from cart where userId  = ?`;
    const userId = req.params.userId;
    console.log(userId);
    db.query(sql, userId, (err, result) => {
        if (err) {
            res.status(400).json({ msg: "error iccured" })
            console.log(err);
        }
        else {
            res.send(result);
            console.log("no.s of products");    
            console.log(result);
        }
    })
})


// GET PRODUCTS DETAILS ADDED BY THE USER IN THE CART


router.get("/cartProductDetails/:userId", (req, res) => {
    const userId = req.params.userId;
    console.log(userId);
    const sql = `select cart.userIdProductId , cart.productQuantity , productdetails.productName ,productdetails.productId ,productdetails.productColour,
    productdetails.productPrice ,productdetails.productManufacturer , productdetails.productImage , productdetails.productDiscount
    from (cart 
    inner join productdetails on cart.productId = productdetails.productId )
    where cart.userId = "${userId}" ; `
    db.query(sql, (err, result) => {
        if (err) {
            res.status(400).json({ msg: "error occured" })
            console.log(err);
        }
        else {
            res.status(200).json({ msg: "products fetched", result })
            console.log("products fethced");
            console.log(result);
        }
    })
});

//REMOVE PRODUCT FROM CART

router.delete("/removeFromCart/:userIdProductId", (req, res) => {
    const userIdProductId = req.params.userIdProductId;
    const sql = `DELETE FROM cart where userIdProductId = ?`;

    console.log(userIdProductId)
    console.log("hello")
    db.query(sql, userIdProductId, (err, result) => {
        if (err) {
            res.status(400).json({ msg: "error occured" })
            console.log(err);
        }
        else {
            res.status(200).json({ msg: "products deleted from cart", result });
            console.log(result);
            console.log("product deleted from cart")
        }
    })
})

//ADD PRODUCTS TO USER'S WISHLIST AND REMOVE FORM CART

router.post("/cart/addToWishlist", (req, res) => {
    console.log(req.body);
    const userId = req.body.userId ;
    const productId = req.body.productId ;
    const userIdProductId = req.body.userIdProductId ;
    db.query(`call SP_addToWishlist("${userId}" , "${productId}" , "${userIdProductId}")`, (err, result) => {
        if (err) {
            res.status(400).json({msg : "error occured"})
        }
        else {
            res.status(200).json({msg : "product added to wishlist"})
        }
    })
})

// REMOVE PRODUCTS FROM WISHLIST

router.delete("/wishlist/removeFromWishlist/:userIdProductId" ,(req,res) =>{
    const userIdProductId = req.params.userIdProductId ;
    const sql = `DELETE FROM wishlist WHERE userIdProductId = ?` ;
    db.query(sql , userIdProductId , (err ,result)=>{
        if(err){
            res.status(400).json({msg : "error occured"});
        }
        else{
            res.status(200).json({msg : "product removed from wishlist"}) ;
        }
    })

})
//GET USER WISHLIST PRODUCTSDETAILS ;

router.get("/wishlist/:userId" , (req,res)=>{
    const userId  = req.params.userId ;
    const sql = `select wishlist.userIdProductId , productdetails.productName ,productdetails.productId ,productdetails.productColour,
    productdetails.productPrice ,productdetails.productManufacturer , productdetails.productImage , productdetails.productDiscount
    from (wishlist 
    inner join productdetails on wishlist.productId = productdetails.productId )
    where wishlist.userId = ? `;

    db.query(sql , userId , (err , result)=>{
        if(err){
            res.status(400).json({msg : "error occured"})
            console.log(err);
        }
        else{
            res.status(200).json({msg : "all products fetched" , result});
            console.log("users wishlist product details")
            console.log(result) ;
        }
    })
})



//REMOVE PRODUCTS FROM WISHLIST AND ADD TO CART 

router.post("/wishlist/addToCart" , (req,res)=>{
    console.log(req.body);
    const userId = req.body.userId ;
    const productId = req.body.productId ;
    const userIdProductId = req.body.userIdProductId ;
    db.query(`call SP_addToCart("${userId}" , "${productId}" , "${userIdProductId}")`, (err, result) => {
        if (err) {
            res.status(400).json({msg : "error occured"})
        }
        else {
            res.status(200).json({msg : "product added to cart"})
        }
    })

})


//GET USER INFO FOR THE MYPROFILE

router.get("/userInfo/:userId" , (req,res)=>{
    const sql = `SELECT * FROM users where id = ?` ;
    const userId = req.params.userId ;

    db.query(sql, userId ,(err, result)=>{
        if(err){
            res.status(400).json({msg : "not able to fetch the user info"})
        }
        else{
            res.status(200).json({msg : "user info fethced" , result})
        }
    })
})

router.put("/updateUserInfo/:userId" , (req,res)=>{
    console.log(req.body)
    const userId = req.params.userId ;
	const { name, email, gender, phoneNumber, address,password } = req.body;
    const userInfo = [name , email, gender , phoneNumber , address , password , userId] ;
    const sql = `UPDATE users SET name = ?, 
					 email = ?,
					 gender = ?,
					 phoneNumber = ?,
					 address = ?,
                     userPassword = ?
	                 WHERE id = ?` ;

    db.query(sql, userInfo ,(err, result)=>{
        if(err){
            res.status(400).json({msg : "not able to update user info"})
            console.log(err);
        }
        else{
            res.status(200).json({msg : "user updated" , result})
        }
    })
})


router.put("/updateMerchantInfo/:merchantId",  (req, res) => {   //update member
	const merchantId = req.params.merchantId;
    console.log(req.body) ;
	const { name, email, gender, phoneNumber, address , password } = req.body;
	const merchantInfo = [name, email, gender,phoneNumber, address, password , merchantId];
	const sql = `UPDATE merchant SET name = ?, 
					 email = ?,
					 gender = ?,
					 phoneNumber = ?,
					 address = ?,
                     merchantPassword = ?
	                 WHERE id = ?` ;
	// const sql = 'UPDATE user SET name = ?, SET email = ?, SET gender = ?, SET date = ?,SET phoneNumber = ?, SET address = ? WHERE id = ?'
	db.query(sql, merchantInfo, (err, result) => {
		if(err){
            res.status(400).json({msg : "not able to update merchant info"})
            console.log(err);
        }
        else{
            res.status(200).json({msg : "merchant updated" , result})
        }
	})
});



router.get("/merchantInfo/:merchantId" , (req,res)=>{
    const sql = `SELECT * FROM merchant where id = ?` ;
    const merchantId = req.params.merchantId ;

    db.query(sql, merchantId ,(err, result)=>{
        if(err){
            res.status(400).json({msg : "not able to fetch the mercahnt info"})
        }
        else{
            res.status(200).json({msg : "merchant info fethced" , result})
        }
    })
})



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


module.exports = router;

