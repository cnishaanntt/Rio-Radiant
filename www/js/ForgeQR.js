/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

if (!window.jQuery) alert('jQuery is required for this sample');
function getQRImage(){
    afterQrload();
    jQuery.ajax({
    url: '/qrEmbed?' + new Date().getTime(),
    data: urlString(),
    dataType : 'json',
    success: function (res) {
        console.log(res);
    },
    async: true
  });
   
}
function afterQrload(){
    $('#toolbar-QRShowTool').hide();    
    $('#qrDocument').show();
    $('<img/>',{
        src:'/qrEmbed?' + new Date().getTime(),
        class:"qr",
        id:"qrImage"
    }).appendTo($('#qrDocument'));  

    
    //close button Animation
    $('.dockingPanel').hover(function () {
    $('.dockingPanelClose').css({opacity : 1});
      }, 
      function () {
        $('.dockingPanelClose').css({opacity : 0.0});
      });   
    
    
    $('.dockingPanelClose').click(function () {
       $('#toolbar-QRShowTool').show(); 
       $('#toolbar-QRPrintTool').hide();
       $('#dataManagementHubs').css('opacity','1');
       $('#dataManagementHubs').show();
       $('#guiviewer3d-toolbar').show();
       $('#forgeViewer').css('margin-left','300px'); 
       $('#forgeViewer').css('position','absolute');
    });   
    
}
function printPreview() {
    var canvas = $("#forgeViewer")[0];
    console.log(canvas);
    console.log(document.getElementById('docQR'));
   $('#qrImage').click(function () {
        $('#dataManagementHubs').css('opacity','1');
        $('#dataManagementHubs').show();
        $('#guiviewer3d-toolbar').show();
        $('#forgeViewer').css('margin-left','300px'); 
        $('#forgeViewer').css('position','absolute');
      }); 
    $('#dataManagementHubs').css('animation-name', 'fadeout');
    $('#dataManagementHubs').css('animation-duration', '1s');
    $('#forgeViewer').css('animation-name','moveleft');
    $('#forgeViewer').css('animation-duration','1s');
    setTimeout(function() {
          $('#dataManagementHubs').hide();
          $('#guiviewer3d-toolbar').hide();
          $('#forgeViewer').css('margin-left','0'); 
          $('#forgeViewer').css('position','absolute');
    }, 1000);     
}
function qrImageShow(){
     $('#qrDocument').show();
     $('#dataManagementHubs').show();
     $('#toolbar-QRPrintTool').show();
     $('#toolbar-QRShowTool').hide();    
}
function getUsers(){
   window.location.replace("https://"+window.location.host+'/qr/getusers/?'+urlString());    
}






