/**
 * Minimally modified from the GRITS code as provided in Udacity's HTML5 Game Development class
 * @author Scott
 */

GameEngineClass = Class.extend({

  move_dir : new Vec2(0, 0),
  dirVec : new Vec2(0, 0),

  entities : [],
  factory : {},
  _deferredKill : [],

  gPlayer0 : {
    pos : {
      x : 100,
      y : 100
    },

    walkSpeed : 1,

    // This is hooking into the Box2D Physics
    // library. We'll be going over this in
    // more detail later.
    mpPhysBody : new BodyDef()
  },

  //-----------------------------
  setup : function() {
    //create physics
    gPhysicsEngine.create(Constants.PHYSICS_UPDATES_PER_SEC, false);
    gPhysicsEngine.addContactListener({
      BeginContact : function(idA, idB) {
        // log('bc');
      },

      PostSolve : function(bodyA, bodyB, impulse) {

        if (impulse < 0.1)
          return;

        var u = [bodyA.GetUserData(), bodyB.GetUserData()];
        var nm = ['', ''];
        var typ = [-1, -1];
        //0,1,2 = player, projectile, wall

        //figure out what our player names are,and what types they are
        for (var i = 0; i < 2; i++) {
          if (u[i] != null) {
            if (u[i].ent != null) {
              nm[i] = u[i].ent.name || '';
              if (u[i].ent.walkSpeed != null)
                typ[i] = 0;
              //player
              else
                typ[i] = 1;
              //projectile / object
            } else {
              typ[i] = 2;
              //wall
            }

          }
        }

        //if this is player/player, or player/wall, ignore it!
        if (typ[0] == 0)
          if (typ[1] == 0 || typ[1] == 2)
            return;

        if (typ[1] == 0)
          if (typ[0] == 0 || typ[0] == 2)
            return;

        if (IS_SERVER) {
          //we care about sending this along, so do such.
          Server.broadcaster.q_collision({
            ent0 : nm[0],
            ent1 : nm[1],
            impulse : impulse,
          });
        } else {
          //if we're client ignore the collision unless it's projectile/wall
          if (typ[0] == 1)
            if (typ[1] != 2)
              return;

          if (typ[1] == 1)
            if (typ[0] != 2)
              return;
        }
        gGameEngine.onCollisionTouch(bodyA, bodyB, impulse);

      }
    });

    gMap = new TILEDMapClass();
    //TileMapLoaderClass();
    this.gMap = gMap;
    gMap.load("img/fantasy.json");

    gInputEngine.setup();

  },

  spawnEntity : function(typename) {
    var ent = new (gGameEngine.factory[typename])();

    gGameEngine.entities.push(ent);

    return ent;
  },

  removeEntity : function(removeEnt) {
    // We don't do anything with this right now.
    // We'll fill it in later this unit.
  },

  update : function() {
    gGameEngine.draw();
    gGameEngine.updatePlayer();

    // Loop through the entities and call that entity's
    // 'update' method, but only do it if that entity's
    // '_killed' flag is set to true.
    //
    // Otherwise, push that entity onto the '_deferredKill'
    // list defined above.
    for (var i = 0; i < gGameEngine.entities.length; i++) {
      var ent = gGameEngine.entities[i];
      if (!ent._killed) {
        ent.update();
      } else {
        gGameEngine._deferredKill.push(ent);
      }
    }

    // Loop through the '_deferredKill' list and remove each
    // entity in it from the 'entities' list.
    //
    // Once you're done looping through '_deferredKill', set
    // it back to the empty array, indicating all entities
    // in it have been removed from the 'entities' list.
    for (var j = 0; j < gGameEngine._deferredKill.length; j++) {
      gGameEngine.entities.erase(gGameEngine._deferredKill[j]);
    }

    gGameEngine._deferredKill = [];

    gPhysicsEngine.update();

  },

  updatePlayer : function() {

    // move_dir is a Vec2 object from the Box2d
    // physics library, which is of the form
    // {
    //     x: 0,
    //     y: 0
    // }
    //
    // We'll be going more into Box2D later in
    // the course. The Vec2 constructor takes
    // an initial x and y value to set the
    // vector to.
    //var move_dir = new Vec2(0, 0);

    if (gInputEngine.actions['move-up']) {
      // adjust the move_dir by 1 in the
      // y direction. Remember, in our
      // coordinate system, up is the
      // negative-y direction, and down
      // is the positive-y direction!
      gGameEngine.move_dir.y -= 1;
    }
    if (gInputEngine.actions['move-down']) {
      // adjust the move_dir by 1 in the
      // y direction. Remember, in our
      // coordinate system, up is the
      // negative-y direction, and down
      // is the positive-y direction!
      gGameEngine.move_dir.y += 1;
    }
    if (gInputEngine.actions['move-left']) {
      // adjust the move_dir by 1 in the
      // x direction.
      gGameEngine.move_dir.x -= 1;
    }
    if (gInputEngine.actions['move-right']) {
      // adjust the move_dir by 1 in the
      // x direction.
      gGameEngine.move_dir.x += 1;
    }

    // After modifying the move_dir above, we check
    // if the vector is non-zero. If it is, we adjust
    // the vector length based on the player's walk
    // speed.
    if (gGameEngine.move_dir.LengthSquared()) {
      // First set 'move_dir' to a unit vector in
      // the same direction it's currently pointing.
      gGameEngine.move_dir.Normalize();

      // Next, multiply 'move_dir' by the player's
      // set 'walkSpeed'. We do this in case we might
      // want to change the player's walk speed due
      // to a power-up, etc.
      gGameEngine.move_dir.Multiply(gGameEngine.gPlayer0.walkSpeed);
    }
    //console.log(gGameEngine.gPlayer0.mpPhysBody.linearVelocity);
    gGameEngine.gPlayer0.mpPhysBody.linearVelocity.Set(gGameEngine.move_dir.x, gGameEngine.move_dir.y);

    // Keyboard based facing & firing direction
    if (gInputEngine.actions['fire0'] || gInputEngine.actions['fire1']) {

      var playerInScreenSpace = {
        x : gRenderEngine.getScreenPosition(this.gPlayer0.pos).x,
        y : gRenderEngine.getScreenPosition(this.gPlayer0.pos).y
      };

      gGameEngine.dirVec.x = gInputEngine.mouse.x - playerInScreenSpace.x;
      gGameEngine.dirVec.y = gInputEngine.mouse.y - playerInScreenSpace.y;

      gGameEngine.dirVec.normalize();
    }

    // Modify dirVec based on the current state of the 'fire-up',
    // 'fire-down', 'fire-left', 'fire-right'.
    if (gInputEngine.actions['fire-up']) {
      gGameEngine.dirVec.y--;
    } else if (gInputEngine.actions['fire-down']) {
      gGameEngine.dirVec.y++;
    }

    if (gInputEngine.actions['fire-left']) {
      gGameEngine.dirVec.x--;
    } else if (gInputEngine.actions['fire-right']) {
      gGameEngine.dirVec.x++;
    }

  },
  //-----------------------------
  run : function() {
    this.parent();

    var fractionOfNextPhysicsUpdate = this.timeSincePhysicsUpdate / Constants.PHYSICS_LOOP_HZ;

    this.update();

    //gGuiEngine.draw();

    this.draw(fractionOfNextPhysicsUpdate);
    gInputEngine.clearPressed();
  },
  draw : function() {
    // Draw map. Note that we're passing a canvas context
    // of 'null' in. This would normally be our game context,
    // but we don't need to grade this here.
    gMap.draw(context);

    // Bucket entities by zIndex
    var fudgeVariance = 128;
    var zIndex_array = [];
    var entities_bucketed_by_zIndex = {};
    gGameEngine.entities.forEach(function(entity) {
      //don't draw entities that are off screen
      if (entity.pos.x >= gMap.viewRect.x - fudgeVariance && entity.pos.x < gMap.viewRect.x + gMap.viewRect.w + fudgeVariance && entity.pos.y >= gMap.viewRect.y - fudgeVariance && entity.pos.y < gMap.viewRect.y + gMap.viewRect.h + fudgeVariance) {
        // Bucket the entities in the entities list by their zindex
        // property.
        // YOUR CODE HERE
        entities_bucketed_by_zIndex[entity.zIndex].push(entity);
      }
    });

    // Draw entities sorted by zIndex

  },
});

var gGameEngine = new GameEngineClass();

