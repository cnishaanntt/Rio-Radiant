function QRButtonExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
}

QRButtonExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
QRButtonExtension.prototype.constructor = QRButtonExtension;


  function statusCallback(completed, message) {
    $.notify(message, { className: "info", position:"bottom right" });
    }

QRButtonExtension.prototype.load = function () {
    var _viewer = this.viewer;
    function getForgeToken(callback) {
    jQuery.ajax({
      url: '/forge/oauth/token',
      success: function (oauth) {
        if (callback)
          callback(oauth.access_token, oauth.expires_in);
      }
    });
  }

  createUI = function () {    
    // QR-doc button         
    var toolbarPrintButton = new Autodesk.Viewing.UI.Button('toolbar-QRPrintTool');
    toolbarPrintButton.onClick = function (e) {
       printPreview();
    };
    toolbarPrintButton.addClass('QRcodePrintButton');
    toolbarPrintButton.setToolTip('Print Preview');
        
    var toolbarNextButton = new Autodesk.Viewing.UI.Button('toolbar-NextTool');
    toolbarNextButton.onClick = function (e) {
      loadNextModel();
    };
    toolbarNextButton.addClass('NextButton');
    toolbarNextButton.setToolTip('Next');
    
    var toolbarUserButton = new Autodesk.Viewing.UI.Button('toolbar-UserTool');
    toolbarUserButton.onClick = function (e) {
      getUsers();
    };
    toolbarUserButton.addClass('NextButton');
    toolbarUserButton.setToolTip('List');
      
    var toolbarShowButton = new Autodesk.Viewing.UI.Button('toolbar-QRShowTool');
    toolbarShowButton.onClick = function (e) {
       qrImageShow();
    };
    toolbarShowButton.addClass('QRcodeDocButton');
    toolbarShowButton.setToolTip('QR');

    // Grouping Button
    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('qrTools');
    this.subToolbar.addControl(toolbarPrintButton);
    this.subToolbar.addControl(toolbarShowButton);
    this.subToolbar.addControl(toolbarNextButton);
    this.subToolbar.addControl(toolbarUserButton);

    _viewer.toolbar.addControl(this.subToolbar);
  };

  createUI();
  return true;
};


QRButtonExtension.prototype.unload = function () {
  //alert('QRButtonExtension is now unloaded!');
  $('#qrDocument').remove();
  $('#qrImage').remove();
  $('#resizer').remove();
  return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.Viewing.QRButtonExtension', QRButtonExtension);
