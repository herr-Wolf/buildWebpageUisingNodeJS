const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();
const app = express();
let port  = process.env.PORT;
const users = [];
var idValue = 1;
var hashPassword;
app.set('view-engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended : false}));

app.get('/' , (req , res)=>{
   res.render('index.ejs',{message :' 001' });
})

app.get('/register' ,(req , res)=> {
    res.render('register.ejs');
})

app.post('/register' , async (req , res)=> {
    try{
        console.log('Password ' + req.body.password );
        hashPassword = await bcrypt.hash(req.body.password,10);
        console.log('Hash Password ' + hashPassword );
     
        users.push({
            id : idValue,
            date : Date.now().toString(),
            name : req.body.name,
            email : req.body.email,
            password : hashPassword
        })
        res.redirect('/login');
    }catch {
        res.redirect('/register');
    }
    console.log(users);
    idValue++;
})

app.get('/login' , (req , res)=>{
   res.render('login.ejs');
})

app.post('/login' , async (req , res)=>{
    try{    
        const inputEmail = req.body.email;
        const inputPass = req.body.password;
        const verified =await bcrypt.compare( req.body.password , hashPassword );
        console.log('verified '+ verified);

        console.log('email    - '+  inputEmail + '-  password   -  ' + inputPass);

        var result = users.filter(function(element){
            return (element.email == inputEmail && verified );
        })
        console.log('Final Output' + JSON.stringify(result));
        if(result.length > 0){
            res.render('index.ejs', {message :' Login Successfully , ' })
        }else {
            res.render('index.ejs',{message :' Auth Failed'});
        }  
    }catch{
        res.render('index.ejs',{message :' No user Found Catch'})
    }  
 })
app.listen(port)