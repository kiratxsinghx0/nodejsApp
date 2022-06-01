const express = require("express") ;
 
const app = express() ;

const path = require("path");

const fs = require("fs");

const exphbs = require("express-handlebars");

const cors = require("cors") ;
//const members = require("./Members.json");

const cookieParser = require("cookie-parser") ;

const dotenv = require('dotenv');
dotenv.config();

// app.use(cors({
//     origin: '*'
// }));

const bodyparser = require("body-parser") ;
//const logger = require("./middleware/logger")

let PORT = process.env.PORT ;//|| 5000 ;
// let HOST = process.env.HOST ;

//handleabars middleware
// app.engine('handlebars', exphbs.engine({defaultLayout : 'main'}));
// app.set('view engine', 'handlebars');
// //creating a router for rendering the template
// //homepage route
// app.get('/' , (req,res) =>
// 	res.render('index' , {
// 		title : "members app",
// 		members
// 	}));
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

// xhr.withCredentials = true ;
// //member api routes
app.use("/api/members" , require("./routes/api/members"));
// const cookieConfig = {
// 	httpOnly: true, // to disable accessing cookie via client side js
// 	secure: true, // to force https (if you use it)
// 	maxAge: 1000000, // ttl in seconds (remove this option and cookie will die when browser is closed)
// 	signed: false // if you use the secret with cookieParser
//   };
// app.get('/set', (req, res) => {
// 	// MAIN CODE HERE :
// 	res.cookie('test', 'somevalue',cookieConfig);
// 	res.send('set cookie');
//   });



//intitalize middlewar
//app.use(logger);

//set static folder
// app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT,() =>{
	console.log(`Server Running.. on PORT ${PORT}`) 
}) ;