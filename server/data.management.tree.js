// token handling in session
var token = require('./token');
var scanDetails =require('./scan.details');

// web framework
var express = require('express');
var path = require('path');
var timezone = require('moment-timezone');

//qr-code generator
var qrImage = require('qr-image');
var router = express.Router();
var app = express();
app.use(express.static('../index.html'));
app.locals.moment = require('moment');

var forgeSDK = require('forge-apis');
var versionResponse = {};
var old_url;




router.get('/dm/getTreeNode', function (req, res) {
   tokenSession = new token(req.session);
   if (!tokenSession.isAuthorized()) {
    req.session.redirectTo=req.originalUrl;    res.sendFile(path.join(__dirname,'../www/signIn.html')); 
  }   
    
 
  var href = decodeURIComponent(req.query.id);
  //("treeNode for " + href);   

  if (href === '#') {
    getHubs(tokenSession, res);
  } else {
    var params = href.split('/');
    var resourceName = params[params.length - 2];
    var resourceId = params[params.length - 1];
    switch (resourceName) {
      case 'hubs':
        getProjects(resourceId, tokenSession, res);
        break;
      case 'projects':
        // for a project, first we need the top/root folder
        var hubId = params[params.length - 3];
        getFolders(hubId, resourceId, tokenSession, res)
        break;
      case 'folders':
        var projectId = params[params.length - 3];
        getFolderContents(projectId, resourceId/*folder_id*/, tokenSession, res);
        break;
      case 'items':
       // console.log(req.query.id);
        var projectId = params[params.length - 3];
        getVersions(projectId, resourceId/*item_id*/, tokenSession,  res)
        break;
    }
  }   
})
function getFolders(hubId, projectId, tokenSession, res) {
        // if the caller is a project, then show folders
        var projects = new forgeSDK.ProjectsApi();
        projects.getProjectTopFolders(hubId, projectId, tokenSession.getInternalOAuth(), tokenSession.getInternalCredentials())
          .then(function (topFolders) {
            var folderItemsForTree = [];
            topFolders.body.data.forEach(function (item) {
              folderItemsForTree.push(prepareItemForTree(
                item.links.self.href,
                item.attributes.displayName == null ? item.attributes.name : item.attributes.displayName,
                item.type,
                true
              ))
            });
            res.json(folderItemsForTree);
          })
          .catch(function (error) {
            console.log(error);
            res.status(500).end();
          });
}
function getProjects(hubId, tokenSession, res) {
        // if the caller is a hub, then show projects
        var projects = new forgeSDK.ProjectsApi();

        //console.log(tokenSession.getInternalOAuth());
        //console.log(tokenSession.getInternalCredentials());

        projects.getHubProjects(hubId, {},
          tokenSession.getInternalOAuth(), tokenSession.getInternalCredentials())
        .then(function (projects) {
          var projectsForTree = [];
          projects.body.data.forEach(function (project) {
            var projectType = 'projects';
            switch (project.attributes.extension.type) {
              case 'projects:autodesk.core:Project':
                projectType = 'a360projects';
                break;
              case 'projects:autodesk.bim360:Project':
                projectType = 'bim360projects';
                break;
            }

            projectsForTree.push(prepareItemForTree(
              project.links.self.href,
              project.attributes.name,
              projectType,
              true
            ));
          });
          res.json(projectsForTree);
        })
        .catch(function (error) {
          console.log(error);
          res.status(500).end();
        });
}
function getHubs(tokenSession, res) {
   // # stands for ROOT 
    var hubs = new forgeSDK.HubsApi();

    hubs.getHubs({}, tokenSession.getInternalOAuth(), tokenSession.getInternalCredentials())
      .then(function (data) {
      var hubsForTree = [];
      data.body.data.forEach(function (hub) {
        var hubType;

        switch (hub.attributes.extension.type) {
          case "hubs:autodesk.core:Hub":
            hubType = "hubs";
            break;
          case "hubs:autodesk.a360:PersonalHub":
            hubType = "personalHub";
            break;
          case "hubs:autodesk.bim360:Account":
            hubType = "bim360hubs";
            break;
        }

        hubsForTree.push(prepareItemForTree(
          hub.links.self.href,
          hub.attributes.name,
          hubType,
          true
        ));
      });
      res.json(hubsForTree);
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).end();
    });
}
function getFolderContents(projectId, folderId, tokenSession, res) {
  var folders = new forgeSDK.FoldersApi();
  folders.getFolderContents(projectId, folderId, {}, tokenSession.getInternalOAuth(), tokenSession.getInternalCredentials())
    .then(function (folderContents) {
      var folderItemsForTree = [];
      folderContents.body.data.forEach(function (item) {

        var displayName = item.attributes.displayName == null ? item.attributes.name : item.attributes.displayName;
        if (displayName !== '') { // BIM 360 Items with no displayName also don't have storage, so not file to transfer
          folderItemsForTree.push(prepareItemForTree(
            item.links.self.href,
            displayName,
            item.type,
            true
          ));
        }
      });
      res.json(folderItemsForTree);
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).end();
    });
}
function getVersions(projectId, itemId, tokenSession,  res) {
  var items = new forgeSDK.ItemsApi();
  items.getItemVersions(projectId, itemId, {}, tokenSession.getInternalOAuth(), tokenSession.getInternalCredentials())
    .then(function (versions) {
      var versionsForTree = [];
      versions.body.data.forEach(function (version) {
        var lastModifiedTime = moment(version.attributes.lastModifiedTime);
        var days = moment().diff(lastModifiedTime, 'days');
        var fileType = version.attributes.fileType;
        var dateFormated = (versions.body.data.length > 1 || days > 7 ? lastModifiedTime.format('MMM D, YYYY, h:mm a') : lastModifiedTime.fromNow());
        var designId = (version.relationships != null && version.relationships.derivatives != null ? version.relationships.derivatives.data.id : null);
        /*Version details*/
        var versionDetails = 'projectId='+ projectId + '&itemId=' + itemId + '&version='+ version.attributes.versionNumber;
        versionsForTree.push(prepareItemForTree(
          designId,
          dateFormated + ' by ' + version.attributes.lastModifiedUserName,
          'versions',
          false,
          fileType,
          versionDetails
        ));
      });
      res.json(versionsForTree);
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).end();
    })
}
router.studious = function getLatestVersion( tokenSession, scannedItemId, scannedProjectId, currentVersion, callback, res){
    var items = new forgeSDK.ItemsApi(),
        userProfile = new forgeSDK.UserProfileApi(),
        versionNumber=[],
        versionDesign = [];
        
        versionResponse.itemId = scannedItemId;
        versionResponse.projectId = scannedProjectId;
        versionResponse.currentVersion = currentVersion;
        versionResponse.tokenSession = tokenSession;
    
    items.getItemVersions(scannedProjectId, scannedItemId, {}, tokenSession.getInternalOAuth(), tokenSession.getInternalCredentials())
        .then(function(versions) {
            versions.body.data.forEach(function (version) {     
            versionDesign.push({id:(version.relationships != null && version.relationships.derivatives != null?version.relationships.derivatives.data.id : null),versionNumber:version.attributes.versionNumber});    
            versionNumber.push(version.attributes.versionNumber);
            })
        var latestVersion=Math.max.apply(null,versionNumber); 
       
        var versionDesignId = versionDesign.filter(function(x){
            return x.versionNumber == latestVersion;
        });
        
        /* Version Design  */
        versionResponse.designId = versionDesignId[0].id;
        
        /* Check updates  */
        versionResponse.update = (currentVersion < latestVersion) ? ((latestVersion - currentVersion > 1)?('There are '+ (latestVersion - currentVersion) + ' version updates ' ):('There is a version update' )) : ('Current version is latest');
        versionResponse.latestVersion = latestVersion;
        if(versionResponse.createdUser != '' && versionResponse.createdUser != undefined) callback(versionResponse, res);
    }).catch(function(err){
            console.log(err);
    }) 
    
    items.getItemTip(scannedProjectId, scannedItemId, tokenSession.getInternalOAuth(), tokenSession.getInternalCredentials())
        .then(function(recentVersion){        
          /* Details of latest version  */
          versionResponse.itemName = recentVersion.body.data.attributes.displayName;
          versionResponse.link = recentVersion.body.data.links.self.href;
          versionResponse.createdUser = recentVersion.body.data.attributes.createUserName;
          versionResponse.modifiedUser = recentVersion.body.data.attributes.lastModifiedUserName;
          versionResponse.modifiedAt = timezone.tz(recentVersion.body.data.attributes.lastModifiedTime,timezone.tz.guess() ).format('LLLL');
          
          if(versionResponse.update != '' && versionResponse.update != undefined) callback(versionResponse, res);          
          
            userProfile.getUserProfile(tokenSession.getInternalOAuth(), tokenSession.getInternalCredentials())
            .then(function(user) {
                versionResponse.profileImage = user.body.profileImages.sizeX40;
                versionResponse.userName = user.body.userName;        
                versionResponse.emailId = user.body.emailId; 
                versionResponse.scannedAt=timezone.tz(moment(),timezone.tz.guess()).format('LLLL');
                console.log( versionResponse.scannedAt);
                if(versionResponse.createdUser != '' && versionResponse.createdUser != undefined && versionResponse.latestVersion != '' && versionResponse.latestVersion != undefined){
                    var scanToDb = new scanDetails({
                        itemId: scannedItemId,
                        projectId: scannedProjectId,
                        profileImage: versionResponse.profileImage,
                        userName: versionResponse.userName,
                        emailId: versionResponse.emailId,
                        currentVersion: versionResponse.currentVersion,
                        latestVersion: versionResponse.latestVersion,
                        scannedAt:versionResponse.scannedAt
                    })
                //save scan Details
                    scanToDb.save(function(err) {
                      if (err) throw err;
                    });
                }
            }).catch(function(err){
            console.log(err);
        })   

        }).catch(function(err){
            console.log(err);
    })
}
router.carnival = function getUserInformation(tokenSession, itemId, projectId, scannedVersion, latestVersion, callback, res){
    scanDetails.find({itemId:itemId, projectId:projectId},{itemId:0, projectId:0, _id:0, __v:0 }).sort({scannedAt:-1}).exec( function(err, users) {
      if (err) throw err;
      callback(users, res);
    });
}         
router.get('/qrEmbed',  function (req, res) {

    tokenSession = new token(req.session);
    if (!tokenSession.isAuthorized()) {
    req.session.redirectTo=req.originalUrl;    res.sendFile(path.join(__dirname,'../www/signIn.html')); 
  }   
         
    if(req.query.projectId!='' && req.query.projectId!=undefined){        
        var url_string = 'https://'+ req.headers.host + '/qr?projectId='+ req.query.projectId +'&itemId='+ req.query.itemId + '&version=' + req.query.version;
        old_url=url_string;
    }
    
    if(old_url!=''){
        console.log(old_url);
        var code = qrImage.image(old_url, { type: 'svg' });
        res.setHeader('Content-type', 'image/svg+xml');  //sent qr image to client 
        code.pipe(res);
    }
   
})
function prepareItemForTree(_id, _text, _type, _children, _fileType, _fileName) {
  return { id: _id, text: _text, type: _type, children: _children, fileType:_fileType, fileName: _fileName };
}
var moment = require('moment');
// Formats a list to JSTree structure
function prepareArrayForJSTree(listOf, canHaveChildren, data) {    
  if (listOf == null) return '';
  var treeList = [];
  listOf.forEach(function (item, index) {

    var szDate = item.attributes.lastModifiedTime;
    if (!canHaveChildren) {
      var lastModifiedTime = moment(item.attributes.lastModifiedTime);
      var days = moment().diff(lastModifiedTime, 'days')
      szDate = (listOf.length > 1 || days > 7 ? lastModifiedTime.format('MMM D, YYYY, h:mm a') : lastModifiedTime.fromNow());
    }

    var treeItem = {
      id: item.links.self.href,
      data: (item.relationships != null && item.relationships.derivatives != null ?
        item.relationships.derivatives.data.id : null),
      text: (item.type==='versions' ? szDate : item.attributes.displayName == null ? item.attributes.name : item.attributes.displayName),
      type: item.type,
      children: canHaveChildren
    };
    treeList.push(treeItem);
  });
  return treeList;
}
module.exports = router;


