/**
 * Starting the game
 * 
 * @author Scott
 */

var canvas = null;
var context = null;
var assets = ['img/magic/magic_firelion_big.png'];
var frames = [];

var Constants = {
  PHYSICS_UPDATES_PER_SEC : 60,
}

var onImageLoad = function(){
  console.log("IMAGE!!!");
};

var clear_canvas = function(canvas) {
  var ctx=canvas.getContext("2d");
  ctx.rect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="green";
  ctx.fill();
}

var setup = function() {
  body = document.getElementsByTagName('body')[0];
  canvas = document.getElementsByTagName('canvas')[0];
  canvas.width = "800";
  canvas.height = "640";
  canvas.style.display = "block";
  clear_canvas(canvas);
  document.getElementById("play_button").style.display = "none";

  context = canvas.getContext('2d');

  // Load each image URL from the assets array into the frames array 
  // in the correct order.
  // Afterwards, call setInterval to run at a framerate of 30 frames 
  // per second, calling the animate function each time.
  // YOUR CODE HERE
    var i, j = assets.length;
    for (i = 0; i < j; i++) {
        var img = new Image();
        img.src = assets[i];
        frames.push(img);        
    }
    //setInterval(animate, 33);
};

var animate = function(){
  // Draw each frame in order, looping back around to the 
  // beginning of the animation once you reach the end.
    // Draw each frame at a position of (0,0) on the canvas.
  // YOUR CODE HERE
    canvas = document.getElementsByTagName('canvas')[0];

    context = canvas.getContext('2d');
    context.drawImage(frames[0], 0, 0);
    
};

//setup();
var gMap = null;

var play_game = function() {
  Logger = console;
  setup();

  gGameEngine.setup();
  setInterval(function() { window.requestAnimFrame(function() { gGameEngine.update(); }); }, 33);
}

