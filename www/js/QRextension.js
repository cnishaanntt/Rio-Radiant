function QRExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
}

QRExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
QRExtension.prototype.constructor = QRExtension;


  function statusCallback(completed, message) {
    $.notify(message, { className: "info", position:"bottom right" });
    }

QRExtension.prototype.load = function () {
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
    // Button 1
    var button1 = new Autodesk.Viewing.UI.Button('toolbarQR');
    button1.onClick = function (e) {
       getQRImage();
    };
    button1.addClass('toolbarQRButton');
    button1.setToolTip('Embed QR');

    // SubToolbar
    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('myAppGroup1');
    this.subToolbar.addControl(button1);

    _viewer.toolbar.addControl(this.subToolbar);
  };

  createUI();

  return true;
};


QRExtension.prototype.unload = function () {
  alert('QRExtension is now unloaded!');
  return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.Sample.QRExtension', QRExtension);