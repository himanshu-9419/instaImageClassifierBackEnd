const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const Clarifai = require('clarifai');
const ig = require('instagram-node').instagram();
const fetch = require('node-fetch');
var cors = require('cors')
let accessToken; let code;
const app = express();
//app.use(cors());
const CLIENT_ID = '37a34b51ffc0436e801f68b4dd5d5aaa';
const CLIENT_SECRET ='e36348e9d92d45e58a7f01a80e8886a4'; 
const CLIENT_ID2= 'c62dfd193eac4762a8098c5ee4fe7be3';
const  CLIENT_SECRET2= '3b86d71da923479da83f641849f1ffd2'; 
const redirect_uri='https://instaimgclas-himanshu9419.c9users.io/login/';

ig.use({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
});

const appC = new Clarifai.App({
    apiKey: 'db2c039c26ad46cc8f0d1ddbc846228c'
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    next();
});

app.get('/success',function(req,res){
    console.log('inside success');
});

app.get('/authcode',function(req,res){
    res.send(accessToken);
});

app.get('/main',function(req,res){
    res.redirect('https://classifier-frontend-himanshu9419.c9users.io/?accessToken='+accessToken);
});

app.get('/login',function(req,res){

ig.authorize_user(req.query.code,redirect_uri , function(err, result){
        if(err) res.send( err );
        accessToken = result.access_token;
        //res.write(accessToken);
        res.redirect('/main')
        //res.redirect('https://classifier-frontend-himanshu9419.c9users.io/?accessToken='+accessToken);
    });
})

app.get('/predict', function (req, res) {
  debugger;
    let image = req.query.image || 'https://scontent.cdninstagram.com/vp/b543d8fd8534237ac463181b8bae51a2/5AED60C6/t51.2885-15/s640x640/sh0.08/e35/26155597_158445821452581_181274798444249088_n.jpg';
    var text = "Categories: ";
    appC.models.predict(Clarifai.GENERAL_MODEL, image).then(
        function (response) {
            console.log(response.outputs[0].data.concepts);
            response.outputs[0].data.concepts.forEach(function (entry) {
                console.log(entry.name);
                text += entry.name + ", ";
            });
            textMessages = [{ text: text }];
            var message = { messages: textMessages };
            res.json(message);
        },
        function (err) {
            console.error(err);
        }
    );

});

app.set('port', process.env.PORT ||3000);
app.listen(app.get('port'));
app.use(bodyParser.json());


