// token handling in session
var token = require('./token');

//data management tree
var dm = require('./data.management.tree')
var fs = require('fs');
var qrDetails =require('./qr.details');


//path 
var path = require('path');


// web framework
var express = require('express');
var router = express.Router();
var app = express();
 

var pug = require('pug');
var doce = express();
 doce.locals.moment = require('moment');
 doce.set('view engine', 'pug'); 
 doce.set('views', path.join(__dirname, '../www/pug'));

doce.get('/',  function (req, res, err) {
    tokenSession = new token(req.session);
    if (!tokenSession.isAuthorized()) {
    req.session.redirectTo=req.originalUrl;    res.sendFile(path.join(__dirname,'../www/signIn.html'));    
  }
	
   doce.set('view engine', 'pug'); 
   versionCallback = function (data,res){ 
       //data = JSON.stringify(data);
       //data.replace(/\\"/g,"\uFFFF"); //U+ FFFF
       //data = data.replace(/\"([^"]+)\":/g,"$1:").replace(/\uFFFF/g,"\\\"");
	   if(data.createdUser!='' && data.createdUser!= undefined){
       		res.render('document', {createdUser: data.createdUser, modifiedUser:data.modifiedUser, modifiedAt:data.modifiedAt, itemName:data.itemName, update:data.update, designId:data.designId, itemId:data.itemId, projectId:data.projectId, currentVersion:data.currentVersion, latestVersion:data.latestVersion});
	   } else {
		   res.render('askAccess', {json:data})
	   }
    } 
    dm.studious(tokenSession, req.query.itemId, req.query.projectId, req.query.version, versionCallback, res);   
}); 
doce.get('/getusers',  function (req, res) { 
    tokenSession = new token(req.session);
    if (!tokenSession.isAuthorized()) {
    req.session.redirectTo=req.originalUrl;    res.sendFile(path.join(__dirname,'../www/signIn.html'));    
  } 
   callback = function (data,res){ 
       res.render('accessedUser', {json:data});
    } 
    dm.carnival(req, tokenSession, req.query.itemId, req.query.projectId, callback, res);
});

module.exports = doce;
