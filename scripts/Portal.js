// Adopted from open source code by https://forums.udacity.com/users/111431492/lok-sang#cs255

PortalClass = EntityClass.extend({
    physBody: null,
    _killed: false,
    nextRoom: "",
    _touched: false,

    init: function (x, y, settings) {
        this.parent(x, y, settings);
        
        var startPos = {
            x: x,
            y: y
        };

        // Create our physics body;
        var entityDef = {
            id: "Portal",
            type: 'dynamic',
            x: startPos.x,
            y: startPos.y,
            halfHeight: settings.h * 0.5,
            halfWidth: settings.w * 0.5,
            damping: 0,
            angle: 0,
            categories: ['portal'],
            collidesWith: ['player'],
            userData: {
                "id": "Portal",
                "ent": this
            }
        };
        
        this.nextRoom = settings.nextRoom;

        this.physBody = gPhysicsEngine.addBody(entityDef);
        this.physBody.SetLinearVelocity(new Vec2(0, 0));
    },

  update: function () {
    this.pos = this.physBody.GetPosition();
    //console.log(this.physBody.GetPosition());
  },

    //-----------------------------------------
    kill: function () {
        // Remove my physics body
        gPhysicsEngine.removeBody(this.physBody);
        this.physBody = null;

        // Destroy me as an entity
        this._killed = true;
    },

    //-----------------------------------------
    onTouch: function (otherBody, point, impulse) {
    
        if(!this.physBody) return false;
        if(!otherBody.GetUserData()) return false;

        var physOwner = otherBody.GetUserData().ent;
        

        if(physOwner !== null) {
            if(physOwner._killed) return false;

            // Increase the 'energy' property of 'physOwner' by
            // 10 when it touches this EnergyCanister.
            //
            // YOUR CODE HERE
            //if(physOwner.energy < physOwner.MaxEnergy) {
            //    physOwner.energy = Math.min(physOwner.MaxEnergy, physOwner.energy + 10);
            //}
            //physOwner.energy += 10;
            //this.markForDeath = true;
            //console.log(otherBody.GetUserData().id);
            var nextRoom = this.nextRoom;
            if(!this._touched) {
              setTimeout(function(){
          if(otherBody.GetUserData().id == "player0") {
                  for(var i=0; i<gGameEngine.entities.length; i++) {
                    gGameEngine.entities[i].kill();
                  }
                  //console.log(nextRoom);
                  
                  //var canvas = document.getElementById("my_canvas");
                  //var ctx = canvas.getContext('2d');
                  //ctx.clearRect(0,0,canvas.width, canvas.height);
            gGameEngine._disableMoving = true;
            gGameEngine.gPlayer0.mpPhysBody.SetPosition(new Vec2(100,100)); 
                  loadLevel(nextRoom);
                }
              }, 10);
            
              this._touched = true;
            }
        }

        return true;
    }

});

gGameEngine.factory['Portal'] = PortalClass;

