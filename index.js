const request = require('request');

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();

var express = require("express");
var app = express()

app.set("view engine", "ejs");

app.get("/", (req, res)=>{
    res.render('login')
});

app.get("/login", (req, res)=>{
    res.render('login')
});

app.get("/signup", (req, res)=>{
    res.render('signup')
});

app.get("/searchpage", (req, res)=>{
    res.render('searchpage')
});

app.get("/blog", (req, res)=>{
    res.render('blog')
});

app.get('/submitsignup', (req, res) => {
    
    const username = req.query.username;
    const email = req.query.emailaddress;
    const password = req.query.password;
    const confirm_pswd = req.query.confirm;

    if(password == confirm_pswd){
        db.collection('userdetails')
        .add({
            username: username,
            email:email,
            password: password,
        })
        .then(() => {
            res.render("login.ejs");
        });
    }else{
        res.send("Make sure boths passwords match!");
    }
});

app.get('/submitlogin', (req, res) => {
    const username = req.query.uname;
    const password = req.query.pswd;

    db.collection("userdetails")
        .where("username", '==', username)
        .where("password", '==', password)
        .get()
        .then((docs) => {
            if(docs.size>0){
                res.render("searchpage");
            }
            else{
                res.send("Incorrect username or password");
            }
        });
    
 });

app.get('/search', (req, res) => {
    const place = req.query.wanderSearch;
    const options = {
        method: 'GET',
        url: 'https://trueway-places.p.rapidapi.com/FindPlaceByText',
        qs: {text: place, language: 'en'},
        headers: {
            'X-RapidAPI-Key': 'YOUR-API-KEY',
            'X-RapidAPI-Host': 'trueway-places.p.rapidapi.com',
            useQueryString: true
        }
    };    
    request(options, function (error, response, body) {
    var data = JSON.parse(body).results;
        res.render('searchresults', {userData: data});
    if (error) throw new Error(error);
    
        console.log(body);
    });
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});