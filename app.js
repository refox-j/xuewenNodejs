const express=require("express");



const router=require("./router/user.js");

const bodyParser= require("body-parser");

const app = express();

app.listen(3000);


app.use(express.static("./public"));

app.use(bodyParser.urlencoded({
    extended:false
}));

app.use("/user",router);