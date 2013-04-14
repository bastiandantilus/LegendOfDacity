/**
 * Minimally modified from the GRITS code as provided in Udacity's HTML5 Game Development class
 * @author Scott
 */




InputEngineClass = Class.extend({

  // A dictionary mapping ASCII key codes to string values
  // describing the action we want to take when that key is
  // pressed.
  bindings: {},

  // A dictionary mapping actions that might be taken in our
  // game to a boolean value indicating whether that action
  // is currently being performed.
  actions: {},
    keyState: [],

  mouse: {
    x: 0,
    y: 0
  },

  //-----------------------------
  setup: function () {
    // Example usage of bind, where we're setting up
    // the W, A, S, and D keys in that order.
    gInputEngine.bind(87, 'move-up');
    gInputEngine.bind(65, 'move-left');
    gInputEngine.bind(83, 'move-down');
    gInputEngine.bind(68, 'move-right');
    gInputEngine.bind(38, 'move-up');
    gInputEngine.bind(37, 'move-left');
    gInputEngine.bind(39, 'move-down');
    gInputEngine.bind(40, 'move-right');

    // Adding the event listeners for the appropriate DOM events.
    document.getElementById('dacity').addEventListener('mousemove', gInputEngine.onMouseMove);
    document.getElementById('dacity').addEventListener('keydown', gInputEngine.onKeyDown);
    document.getElementById('dacity').addEventListener('keyup', gInputEngine.onKeyUp);
  },

  //-----------------------------
  onMouseMove: function (event) {
    gInputEngine.mouse.x = event.clientX;
    gInputEngine.mouse.y = event.clientY;
  },

  //-----------------------------
  onKeyDown: function (event) {
    // Grab the keyID property of the event object parameter,
    // then set the equivalent element in the 'actions' object
    // to true.
    // 
    // You'll need to use the bindings object you set in 'bind'
    // in order to do this.
    var action = gInputEngine.bindings[event.keyID];

    if (action) {
      gInputEngine.actions[action] = true;
    }
  },

  //-----------------------------
  onKeyUp: function (event) {
    // Grab the keyID property of the event object parameter,
    // then set the equivalent element in the 'actions' object
    // to false.
    // 
    // You'll need to use the bindings object you set in 'bind'
    // in order to do this.
    var action = gInputEngine.bindings[event.keyID];

    if (action) {
      gInputEngine.actions[action] = false;
    }
  },

  // The bind function takes an ASCII keycode
  // and a string representing the action to
  // take when that key is pressed.
  // 
  // Fill in the bind function so that it
  // sets the element at the 'key'th value
  // of the 'bindings' object to be the
  // provided 'action'.
  bind: function (key, action) {
    gInputEngine.bindings[key] = action;
  }

});

gInputEngine = new InputEngineClass();

