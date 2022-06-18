const express = require("express") ;
 
const app = express() ;

const path = require("path");

const fs = require("fs");

const exphbs = require("express-handlebars");

const cors = require("cors") ;

const cookieParser = require("cookie-parser") ;

const dotenv = require('dotenv');
dotenv.config();

// app.use(cors({
//     origin: '*'
// }));

const bodyparser = require("body-parser") ;
//const logger = require("./middleware/logger")

let PORT = process.env.PORT ;
const cookieSecretKey = process.env.cookieSecretKey ;
//body parser middleware intialize
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended : false }));
app.use(bodyparser.text());
app.use(cookieParser(cookieSecretKey)) ;
app.use(cors({
    origin : "http://localhost:8080",
    credentials : true ,
    allowedHeaders : "Content-Type,Access-Control-Allow-Headers,Authorization,X-Requested-With"
})) ;

app.use("/api/members" , require("./routes/api/members"));

app.use("/products" , require("./routes/api/getProducts")) ;

//set static folder
app.use("/images",express.static(path.join(__dirname,"public"))) ;

app.listen(PORT,() =>{
	console.log(`Server Running.. on PORT ${PORT}`) 
}) ;