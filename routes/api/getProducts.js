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
            res.json({ msg: "error occured" ,err });
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
                res.json({msg : "login successfully" , result})
            }
        }
    }
    )
}
);


//MERCHANT ADDED PRODUCTS
router.get("/merchant/:merchantId" , (req,res) =>{
    var merchantId = req.params.merchantId ;
    const sql = `select * from productdetails where merchantId = ?` ;
    db.query(sql ,merchantId, (err, result)=>{
        if(err){
            res.json({confMsg : "error occured" }) ;
        }
        else{
            res.status(200).json({confMsg : "products fetched of associted merchant", result}) ;
            console.log("products fetched of associted merchant") ;
        }
    })
})


//MERCHANT ADDING NEW PRODUCT 

router.post("/addNewProducts" , (req,res)=>{
    console.log(req.body) ;
     const productId = uuid.v4() ;
     const { productPrice , productColour , productName , productManufacturer , productMeasurements , productDiscount ,productImage , merchantId } = req.body ;
     const productCategoryId = req.body.productCategoryId ;
     const productInventory = req.body.productInventory ;
    const sql = `insert into productdetails (productCategoryId , productId,productName, productPrice , productDiscount, productManufacturer , productMeasurements, productImage , productColour, merchantId , productInventory) values ?`
                                   values = [[ productCategoryId , productId , productName , productPrice ,productDiscount, productManufacturer , productMeasurements, productImage , productColour , merchantId , productInventory]] ;

    db.query(sql , [values] , (err , result)=>{
        if(err){
            res.json({confMsg : "error occured while adding new product" , err})
            console.log("error occured while adding new product", err) ;
        }
        else{
            res.json({confMsg : "product Added" , result}) ;
            console.log("new product added" , result); 
        }
    })
})

module.exports = router;

