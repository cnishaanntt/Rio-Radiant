///////////////////////////////////////////////////////////////////////////////
// Autodesk.ADN.Viewing.Extension.ResizeManager
// by Philippe Leefsma, May 2015
//
///////////////////////////////////////////////////////////////////////////////
AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.ResizeManager = function (viewer, options) {

  Autodesk.Viewing.Extension.call(this, viewer, options);

  var _panelBaseId = 'resizer';

  var _viewer = viewer;

  var _panel = null;

  var _this = this;

  /////////////////////////////////////////////////////////
  // load callback
  //
  //////////////////////////////////////////////////////////
  _this.load = function () {

    _panel = new Autodesk.ADN.Viewing.Extension.ResizeManager.Panel(
      _viewer.container,
      _panelBaseId);

    // creates controls if specified in
    // options: {createControls: true}
    if(options && options.createControls) {

      var ctrlGroup = getControlGroup();

      createControls(ctrlGroup);
    }
    else {

      _panel.setVisible(true);
    }

    console.log('Autodesk.ADN.Viewing.Extension.ResizeManager loaded');

    return true;
  };

  /////////////////////////////////////////////////////////
  // unload callback
  //
  /////////////////////////////////////////////////////////
  _this.unload = function () {

    _panel.setVisible(false);

    // remove controls if created
    if(options && options.createControls) {

      try {

        var toolbar = viewer.getToolbar(true);

        toolbar.removeControl(
          'Autodesk.ADN.ResizeManager.ControlGroup');
      }
      catch (ex) {

        $('#divResizeMngToolbar').remove();
      }
    }

    console.log('Autodesk.ADN.Viewing.Extension.ResizeManager unloaded');

    return true;
  };

  /////////////////////////////////////////////////////////
  // return control group or create if doesn't exist
  //
  /////////////////////////////////////////////////////////
  function getControlGroup() {

    var toolbar = null;

    try {
      toolbar = viewer.getToolbar(true);

      if(!toolbar) {
        toolbar = createDivToolbar();
      }
    }
    catch (ex) {
      toolbar = createDivToolbar();
    }

    var control = toolbar.getControl(
      'Autodesk.ADN.ResizeManager.ControlGroup');

    if(!control) {

      control = new Autodesk.Viewing.UI.ControlGroup(
        'Autodesk.ADN.ResizeManager.ControlGroup');

      toolbar.addControl(control);
    }

    return control;
  }

  /////////////////////////////////////////////////////////
  // create a div toolbar when Viewer3D used
  //
  /////////////////////////////////////////////////////////
  function createDivToolbar() {

    var toolbarDivHtml =
      '<div id="divResizeMngToolbar"> </div>';

    $(viewer.container).append(toolbarDivHtml);

    $('#divResizeMngToolbar').css({
      'bottom': '0%',
      'left': '50%',
      'z-index': '100',
      'position': 'absolute'
    });

    var toolbar = new Autodesk.Viewing.UI.ToolBar(true);

    $('#divResizeMngToolbar')[0].appendChild(
      toolbar.container);

    return toolbar;
  }

  /////////////////////////////////////////////////////////
  // creates controls for the extension
  //
  /////////////////////////////////////////////////////////
  function createControls(parentGroup) {

    var btn = createButton(
      'Autodesk.ADN.ResizeManager.Button',
      'glyphicon glyphicon-qrcode',
      'Manage Resizes',
      onShowPanelClicked);

    parentGroup.addControl(btn);
  }

  /////////////////////////////////////////////////////////
  // show panel handler
  //
  /////////////////////////////////////////////////////////
  function onShowPanelClicked() {

    _panel.setVisible(true);
  }

  /////////////////////////////////////////////////////////
  // create button util
  //
  /////////////////////////////////////////////////////////
  function createButton(id, className, tooltip, handler) {

    var button = new Autodesk.Viewing.UI.Button(id);

    //button.icon.style.backgroundImage = imgUrl;
    button.icon.className = className;

    button.icon.style.fontSize = "20px";

    button.setToolTip(tooltip);

    button.onClick = handler;

    return button;
  }


  /////////////////////////////////////////////////////////
  // Panel implementation
  //
  /////////////////////////////////////////////////////////
  Autodesk.ADN.Viewing.Extension.ResizeManager.Panel = function(
    parentContainer,
    baseId)
  {
    this.content = document.createElement('div');

    this.content.id = baseId + 'PanelContentId';
    this.content.className = 'Resize-manager-panel-content';

    Autodesk.Viewing.UI.DockingPanel.call(
      this,
      parentContainer,
      baseId,
      "QR Resize",
      {shadow:true});

    this.container.style.top = "0px";
    this.container.style.left = "0px";

    this.container.style.width = "150px";
    this.container.style.height = "100px";
    this.container.style.background = "white";
    this.container.style.opacity = "0.9";
    this.title.style.background = "orange";
    this.title.style.border = "white";
    
    this.title.style.opacity = "0.9";
    this.closer.style.opacity = 0;
    this.container.style.border.opacity = 0;

    this.container.style.resize = "auto";
  
    var html = [
      '<div class="Resize-manager-panel-container">',
        '<div class="Resize-manager-panel-controls-container">',
          '<div>',
            '<input class="Resize-manager-panel-input" type="text" placeholder=" Size (px)" id="' + baseId + 'width">',
            '<button class="btn btn-default" id="' + baseId + 'ResizeBtn">',
              '<span class="glyphicon glyphicon-qrcode" aria-hidden="true"></span>',
            '</button>',
          '</div>',
        '</div>',
        '<div id="' + baseId + 'PanelContainerId" class="list-group Resize-manager-panel-list-container">',
        '</div>',
      '</div>'
    ].join('\n');

    $('#' + baseId + 'PanelContentId').html(html);

    ///////////////////////////////////////////////////////
    // Adds a new Resize item
    //
    ///////////////////////////////////////////////////////
    /*function addShotItem(blobUrl, width, height) {

      var item = {
        id: newGUID(),
        imgId: newGUID(),
        linkId: newGUID(),
        deleteBtnId: newGUID(),
        name: new Date().toString('d/M/yyyy H:mm:ss')
      }

      var html = [

        '<div class="list-group-item Resize-manager-panel-item" id="' + item.id + '">',
        '<div class="row">',
          '<div class="col-sm-4" style="width: 128px">',
            '<a id="' + item.linkId + '" href="' + blobUrl + '" download="' + item.name + '">',
              '<img id="' + item.imgId + '"width="128" height="128" src=' + blobUrl + '> </img>',
            '</a>',
          '</div>',
          '<div>',
            '<label> Width:' + width + ' px</label>',
            '<br>',
            '<label> Height:' + height + ' px</label>',
            '<br>',
            '<br>',
            '<button class="btn btn-sm btn-danger" id="' + item.deleteBtnId + '">',
              '<span class="glyphicon glyphicon-remove-sign" style="vertical-align:text-top"></span> Delete',
            '</button>',
          '</div>',
        '</div>',
        '</div>'

      ].join('\n');

      $('#' + baseId + 'PanelContainerId').append(html);

      $('#' + item.deleteBtnId).click(function() {

        $('#' + item.id).remove();

        // The URL.revokeObjectURL() static method releases
        // an existing object URL which was previously
        // created by calling window.URL.createObjectURL().
        // Call this method when you've finished using
        // a object URL, in order to let the browser know
        // it doesn't need to keep the reference to the file any longer.
        window.URL.revokeObjectURL(blobUrl);
      });
    }   */   

  


   ///////////////////////////////////////////////////////
    // new Resize button handler
    //
    ///////////////////////////////////////////////////////
    $('#' + baseId + 'ResizeBtn').click(function() {
		
     var propertyPanel = document.getElementById('qrImage');
        
      var size = parseInt($('#' + baseId + 'width').val());
      size = (isNaN(size) ? propertyPanel.width : size);

      console.log(size);

      
           if( !propertyPanel ){
                alert('QR code is not attached');
                return;
            }

            //check if property panel is displayed
            var isPropertyPanelVisible = propertyPanel.style.visibility;
            var isPropertyPanelNone = propertyPanel.style.display;
            if(isPropertyPanelVisible == 'hidden'  ||
                isPropertyPanelNone== 'none' )  {
                alert('property panel is hidden!');
                return;
            }

            
                    
           
                    propertyPanel.setAttribute('viewport','0 0 2000 2000');
                    propertyPanel.setAttribute('viewBox','0 0 2000 2000');
                    propertyPanel.setAttribute('width',size);
                    propertyPanel.setAttribute('height',size);
                    propertyPanel.setAttribute('x','100');
                    propertyPanel.setAttribute('y','100');
              
                
        });
  };

  Autodesk.ADN.Viewing.Extension.ResizeManager.Panel.prototype = Object.create(
    Autodesk.Viewing.UI.DockingPanel.prototype);

  Autodesk.ADN.Viewing.Extension.ResizeManager.Panel.prototype.constructor =
    Autodesk.ADN.Viewing.Extension.ResizeManager.Panel;

  Autodesk.ADN.Viewing.Extension.ResizeManager.Panel.prototype.initialize = function()
  {
    // Override DockingPanel initialize() to:
    // - create a standard title bar
    // - click anywhere on the panel to move

    this.title = this.createTitleBar(
      this.titleLabel ||
      this.container.id);

    this.closer = this.createCloseButton();

    this.container.appendChild(this.title);
    this.title.appendChild(this.closer);
    this.container.appendChild(this.content);

    this.initializeMoveHandlers(this.title);
    this.initializeCloseHandler(this.closer);
  };

  var css = [
  
    'div.Resize-manager-panel-content {',
      'height: calc(100% - 40px);',
    '}',
  
    'div.Resize-manager-panel-container {',
      'height: calc(100% - 40px);',
      'margin: 10px;',
    '}',
  
    'div.Resize-manager-panel-controls-container {',
      'margin-bottom: 10px;',
    '}',
  
    'div.Resize-manager-panel-list-container {',
      'height: calc(100% - 40px);',
      'overflow-y: auto;',
    '}',
  
    'div.Resize-manager-panel-item {',
      'margin-left: 0;',
      'margin-right: 0;',
      'color: #FFFFFF;',
      'background-color: #3F4244;',
      'margin-bottom: 5px;',
      'border-radius: 4px;',
    '}',
  
    'div.Resize-manager-panel-item:hover {',
      //'background-color: #5BC0DE;',
    '}',
  
    'label.Resize-manager-panel-label {',
      'color: #FFFFFF;',
    '}',
  
    'input.Resize-manager-panel-input {',
      'height: 30px;',
      'width: 75px;',
      'border-radius: 5px;',
    '}'

  ].join('\n');

  ///////////////////////////////////////////////////////
  // Checks if css is loaded
  //
  ///////////////////////////////////////////////////////
  function isCssLoaded(name) {

    for(var i=0; i < document.styleSheets.length; ++i){

      var styleSheet = document.styleSheets[i];

      if(styleSheet.href && styleSheet.href.indexOf(name) > -1)
        return true;
    };

    return false;
  }

  // loads bootstrap css if needed
  if(!isCssLoaded("bootstrap.css") && !isCssLoaded("bootstrap.min.css")) {

    $('<link rel="stylesheet" type="text/css" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.css"/>').appendTo('head');
  }

  $('<style type="text/css">' + css + '</style>').appendTo('head');
};

Autodesk.ADN.Viewing.Extension.ResizeManager.prototype =
  Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.ResizeManager.prototype.constructor =
  Autodesk.ADN.Viewing.Extension.ResizeManager;

Autodesk.Viewing.theExtensionManager.registerExtension(
  'Autodesk.ADN.Viewing.Extension.ResizeManager',
  Autodesk.ADN.Viewing.Extension.ResizeManager);
