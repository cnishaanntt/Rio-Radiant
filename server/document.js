// token handling in session
var token = require('./token');

//data management tree
var dm = require('./data.management.tree')
var fs = require('fs');

// web framework
var express = require('express');
var app = express();
app.locals.moment = require('moment');

 
//path 
var path = require('path');
var router = express.Router();
var pug = require('pug');
var doce = express();
 doce.set('view engine', 'pug'); 
 doce.set('views', path.join(__dirname, '../www/pug'));
 
doce.get('/',  function (req, res) { 
    tokenSession = new token(req.session);
    if (!tokenSession.isAuthorized()) {
    req.session.redirectTo=req.originalUrl;    res.sendFile(path.join(__dirname,'../www/signIn.html'));    
  } 
   versionCallback = function (data,res){ 
       //data = JSON.stringify(data);
       //data.replace(/\\"/g,"\uFFFF"); //U+ FFFF
       //data = data.replace(/\"([^"]+)\":/g,"$1:").replace(/\uFFFF/g,"\\\"");
       res.render('document', {createdUser: data.createdUser, modifiedUser:data.modifiedUser, modifiedAt:data.modifiedAt, itemName:data.itemName, update:data.update, designId:data.designId, itemId:data.itemId, projectId:data.projectId, currentVersion:data.currentVersion, latestVersion:data.latestVersion});
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
    dm.carnival(tokenSession, req.query.itemId, req.query.projectId, req.query.scannedVersion, req.query.latestVersionThen, callback, res);
});

module.exports = doce;