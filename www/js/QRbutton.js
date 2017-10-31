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
        
    //var toolbarUserButton = new Autodesk.Viewing.UI.Button('toolbar-QRUserTool');
    //toolbarUserButton.onClick = function (e) {
    //  getUsers();
   // };
   // toolbarUserButton.addClass('QRcodeUserButton');
   // toolbarUserButton.setToolTip('List');
      
    var toolbarShowButton = new Autodesk.Viewing.UI.Button('toolbar-QRShowTool');
    toolbarShowButton.onClick = function (e) {
       qrImageShow();
    };
    toolbarShowButton.addClass('QRcodeDocButton');
    toolbarShowButton.setToolTip('QR');

    // Grouping Button
    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('qrTools');
    this.subToolbar.addControl(toolbarPrintButton);
    //this.subToolbar.addControl(toolbarUserButton);
    this.subToolbar.addControl(toolbarShowButton);
    

    _viewer.toolbar.addControl(this.subToolbar);
  };

  createUI();
  return true;
};


QRButtonExtension.prototype.unload = function () {
  alert('QRButtonExtension is now unloaded!');
  return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.Viewing.QRButtonExtension', QRButtonExtension);
