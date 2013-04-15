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

var onImageLoad = function() {
  console.log("IMAGE!!!");
};

var clear_canvas = function(canvas) {
  var ctx = canvas.getContext("2d");
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "green";
  ctx.fill();
}
var setup = function() {
  body = document.getElementsByTagName('body')[0];
  canvas = document.getElementsByTagName('canvas')[0];
  gRenderEngine.setup();
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

  var i, j = assets.length;
  for ( i = 0; i < j; i++) {
    var img = new Image();
    img.src = assets[i];
    frames.push(img);
  }
  //setInterval(animate, 33);
};

var animate = function() {
  var gMap = gGameEngine.gMap;
  //context.clearRect(0, 0, canvas.width, canvas.height);
  //gGameEngine.draw(context);
  var currentSSC = gSpriteSheets['./media/js/standalone/libs/gamedev_assets/texture.png'];
  var velocity = gGameEngine.gPlayer0.physBody.m_linearVelocity;
  var y_offset = 5;
  var x_offset = 5;
  var frame = 0;
  if (velocity.x != 0 || velocity.y != 0) {
    if (frame < 10) {
      drawSprite("image00" + frame + ".png", gGameEngine.gPlayer0.pos.x - gMap.viewRect.x + x_offset, gGameEngine.gPlayer0.pos.y - gMap.viewRect.y - y_offset);
    } else {
      drawSprite("image0" + frame + ".png", gGameEngine.gPlayer0.pos.x - gMap.viewRect.x + x_offset, gGameEngine.gPlayer0.pos.y - gMap.viewRect.y - y_offset);
    }
    frame = (frame + 1) % (currentSSC.sprites.length);
  } else {
    drawSprite("image005.png", gGameEngine.gPlayer0.pos.x - gMap.viewRect.x + x_offset, gGameEngine.gPlayer0.pos.y - gMap.viewRect.y - y_offset);
  }
};


var gMap = null;

var play_game = function() {
  Logger = console;
  setup();

  gGameEngine.setup();
  
  var spawnPoint = "Team0Spawn0";
  myloop = {};
  myloop.entity = gGameEngine.spawnPlayer("0", 0, spawnPoint, "Player", "Dacity", "Dacity");
  gGameEngine.gPlayer0 = myloop.entity;
  
  setInterval(function() {
    window.requestAnimFrame(function() {
      gGameEngine.run();
      animate();
    });
  }, 33);
}

