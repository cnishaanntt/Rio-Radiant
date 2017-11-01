function QRDockExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
}

QRDockExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
QRDockExtension.prototype.constructor = QRDockExtension;

function statusCallback(completed, message) {
    $.notify(message, { className: "info", position:"bottom right" });
    }

var _dockPanel;

function createDockPanel() {
    _dockPanel = new Autodesk.Viewing.UI.DockingPanel(viewer.container, 'qrDocument', 'QR');
    _dockPanel.title.style.background = "white";
    _dockPanel.title.style.border = "white";
    
    _dockPanel.title.style.opacity = 0;
    _dockPanel.closer.style.opacity = 0;
    _dockPanel.container.style.border.opacity = 0;
    
    _dockPanel.container.style.bottom = "100px";
    _dockPanel.container.style.right = "100px";
    

    _dockPanel.container.style.width = "auto";
    _dockPanel.container.style.height = "auto";
    _dockPanel.container.style.resize = "auto";
    _dockPanel.container.style.background = "white";
    _dockPanel.container.style.opacity = "0.5";
    
    _dockPanel.setTitle('');
    _dockPanel.setVisible(true);
  }

QRDockExtension.prototype.load = function () {
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
        createDockPanel();
    };
    createUI();
    return true;
};

QRDockExtension.prototype.unload = function () {
    _dockPanel.setVisible(false);
    //alert('QRDockExtension is now unloaded!');
    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.Viewing.QRDockExtension', QRDockExtension)
