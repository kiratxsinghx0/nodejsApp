// function getUser(req, res) {
//     (req, res) => {

//         const found = members.some(member => member.id === (req.params.id))
//         if (found) {
//             res.json(members.filter(member => member.id === (req.params.id)))
//         }
//         else {
//             res.status(400).json({ msg: `No member with id : ${req.params.id} found` })
//             // res.status(400).sendFile(path.join(__dirname , "404.html"));
//         }
//     }
// }
const express = require("express");

// const router = express.Router();

const members = require("../Member.json");

const uuid = require("uuid");

const path = require("path");

const fs = require("fs");
function getAllMembers(req, res, next) {
	// const members = fs.readFileSync(__dirname + "../../Member.json", 'utf-8');
	// console.log(JSON.stringify(members));
	res.json(members);
}

module.exports = getAllMembers ;



// module.exports = {
//     method : getUser,
// }