// token handling in session
var token = require('./token');

//data management
var dm = require('./data.management.tree')

// web framework
var express = require('express');

var fs = require('fs');

//path 
var path = require('path');
var router = express.Router();
var pug = require('pug');
var doce = express();
 doce.set('view engine', 'pug'); 
 doce.get('/',  function (req, res) {  
    tokenSession = new token(req.session);
    if (!tokenSession.isAuthorized()) {
    res.status(401).end('Please login first');
    return;
  } 
   versionCallback = function (data,res){       
      // data=JSON.stringify(data);
      // console.log(data);
       res.render('document' );
    } 
    
    dm.studious(tokenSession, req.query.itemId, req.query.projectId, req.query.version, versionCallback, res);
    
    //response 
   // res.render('document',{ title: 'Hey', message: 'Hello there!' } );

}); 

/* app.get('/', function (req, res) {
   tokenSession = new token(req.session);
   if (!tokenSession.isAuthorized()) {
    res.status(401).end('Please login first');
    return;
   }     
  dm.studious(tokenSession, req.query.itemId, req.query.projectId, req.query.version,res)
    .then(function(data){
        /*if(err){
            console.log(err);
        }  else {
            console.log(data);
      /*  }  
  })
  });*/
     // console.log(data);
    //res.render('index',{ title: 'Hey', message: 'Hello there!' } );
  //res.render('document',versionResponse);
//})   var alpha = dm.rio(req.query.a,dm.cio);
  // if(alpha!=undefined) console.log(dm.cio(alpha));
  



//var dzeren = dm.studious();


//console.log(dzeren);



//template engine
//app.engine('pug', require('pug').__express);



//run
//app.listen('3000', function(){
  //  console.log('App is listening at 3000');
//});

module.exports = doce;