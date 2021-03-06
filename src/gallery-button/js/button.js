var YL = Y.Lang,
  YCM = Y.ClassNameManager,
  EVENTS = {
      DISABLE : 'disable'
  },
  CLASSES = {
      HOVER    : '-hover',
      PRESSED  : '-pressed',
      DEFAULT  : '-default',
      DISABLED : '-disabled',
      NO_LABEL : 'no-label'
  },
  BOUNDING_BOX = 'boundingBox';


Y.Button = Y.Base.create('button',Y.Widget, [Y.WidgetChild], {

  BOUNDING_TEMPLATE : '<button/>',

  CONTENT_TEMPLATE : '<span class="yui3-icon"/>',

  className : '',

  _mouseIsDown : false,

  _mouseListener : null,

  initializer : function(config) {
    Y.log('initializer', 'info', 'Y.Button');
    this.className = this.getClassName();
    this.publish('press', { defaultFn: this._defPressFn });
    this.after('defaultChange',this._afterDefaultChanged, this);
    this.after('enabledChange',this._afterEnabledChanged, this);
  },

  /**
   * Creates the button node
   */
  renderUI : function(){
    Y.log('renderUI', 'info', 'Y.Button');
    this.get('contentBox').set('text',this.get('label'));
  },

  bindUI : function(){
    Y.log('bindUI', 'info', 'Y.Button');
    var bb = this.get(BOUNDING_BOX);

    bb.on('click', function(e) {
      this.fire('press');
    }, this);

    bb.on('mouseup', this._mouseUp, this);
    bb.on('mousedown', this._mouseDown, this);
    bb.on('mouseenter', this._mouseEnter, this);
    bb.on('mouseleave', this._mouseLeave, this);
  },

  syncUI : function() {
    Y.log('syncUI', 'info', 'Y.Button');
    this._updateDefault(this.get('default'));
    this._updateEnabled(this.get('enabled'));
  },

  disable : function() {
    Y.log('disable', 'info', 'Y.Button');
    this.set('enabled', false);
  },

  enable : function() {
    Y.log('enable', 'info', 'Y.Button');
    this.set('enabled', true);
  },

  setTitle : function(title) {
    Y.log('setTitle', 'info', 'Y.Button');
    this.get('boundingBox').set('title', title);
    return this;
  },


  //  P R O T E C T E D  //

  _defPressFn : function(e) {
    Y.log('_defPressFn', 'info', 'Y.Button');
    this._executeCallback();
  },

  _mouseUp : function() {
    Y.log('_mouseUp', 'info', 'Y.Button');
    this.get(BOUNDING_BOX).removeClass(this.className + CLASSES.PRESSED);
    this._mouseIsDown = false;
  },

  _mouseDown : function() {
    Y.log('_mouseDown', 'info', 'Y.Button');
    if(this.get('enabled')) {
      this.get(BOUNDING_BOX).addClass(this.className + CLASSES.PRESSED);
      this._mouseIsDown = true;
    }
  },

  _mouseEnter : function(e) {
    Y.log('_mouseEnter', 'info', 'Y.Button');
    if(this.get('enabled')) {
      this.get(BOUNDING_BOX).addClass(this.className + CLASSES.HOVER);
      if(this._mouseIsDown) {
        this.get(BOUNDING_BOX).addClass(this.className + CLASSES.PRESSED);
      }
    }
  },

  _mouseLeave : function() {
    Y.log('_mouseLeave', 'info', 'Y.Button');
    var bb = this.get(BOUNDING_BOX),
        pressedClass = this.className + CLASSES.PRESSED;
    
    bb.removeClass(this.className + CLASSES.HOVER);

    if(bb.hasClass(pressedClass)) {
      bb.removeClass(pressedClass);
      if(this._mouseListener === null) {
        this._mouseListener = Y.on('mouseup',Y.bind(this._listenForMouseUp,this));
      }
    }else{
      this._mouseIsDown = false;
    }

  },

  _listenForMouseUp : function() {
    Y.log('_listenForMouseUp', 'info', 'Y.Button');
    this._mouseIsDown = false;
    this._mouseListener.detach();
    this._mouseListener = null;
  },

  _afterEnabledChanged : function(e) {
    Y.log('_afterEnabledChanged', 'info', 'Y.Button');
    this._updateEnabled(e.newVal);
  },

  _updateEnabled : function(status) {
    Y.log('_updateEnabled', 'info', 'Y.Button');
    var bb = this.get(BOUNDING_BOX),
        disableClass = this.className + CLASSES.DISABLED;

    if(status) {
      bb.removeClass(disableClass);
      bb.set('disabled','');
    }else{
      bb.addClass(disableClass);
      bb.removeClass(this.className + CLASSES.HOVER);
      bb.removeClass(this.className + CLASSES.PRESSED);
      bb.set('disabled','disabled');
    }

  },

  _afterDefaultChanged : function(e) {
    Y.log('_afterDefaultChanged', 'info', 'Y.Button');
    this._updateDefault(e.newVal);
  },

  _updateDefault : function(status) {
    Y.log('_updateDefault', 'info', 'Y.Button');
    var bb = this.get(BOUNDING_BOX),
        defaultClass = this.className + CLASSES.DEFAULT;
    if(status) {
      bb.addClass(defaultClass);
      bb.setAttribute('default','default');
    }else{
      bb.removeClass(defaultClass);
      bb.set('default','');
    }
  },

  /**
   * Used to fire the internal callback
   *
   * @method _executeCallback
   * @protected
   * @since 1.1.0
   */
  _executeCallback : function() {
     Y.log('_executeCallback','info','Y.Button');
    if(this.get('callback')) {
      (this.get('callback'))();
    }
  }

}, {
  EVENTS : EVENTS,
  ATTRS : {
      label : {
          value : '',
          validator : YL.isString,
          setter : function(val) {
              if(!val || val === '') {
                  this.get(BOUNDING_BOX).addClass(this.getClassName(CLASSES.NO_LABEL));
              }else{
                  this.get(BOUNDING_BOX).removeClass(this.getClassName(CLASSES.NO_LABEL));
              }
              this.get('contentBox').set('text', val);
              this.set('title',val);
              return val;
          },
          lazyAdd : false
      },
      callback : {
          validator : YL.isFunction
      },
      enabled : {
          value : true,
          validator : YL.isBoolean
      },
      'default' : {
          value : false,
          validator : YL.isBoolean
      },
      icon : {
        getter : function() {
          return this.get('type');
        },
        setter : function(val) {
          return this.set('type', val);
        }
      },
      title : {
          validator : YL.isString,
          setter : function(val) {
              this.get('boundingBox').set('title', val);
              return val;
          }
      },
      type : {
          validator : YL.isString,
          setter : function(val) {
              this.get(BOUNDING_BOX).replaceClass(
                  YCM.getClassName('type', this.get('type') || 'default'),
                  YCM.getClassName('type', val || 'default')
              );
              return val;
          },
          lazyAdd : false
      }
  }
});
