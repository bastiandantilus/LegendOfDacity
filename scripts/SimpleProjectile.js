SimpleProjectileClass = WeaponInstanceClass.extend({
  physBody : null,
  speed : 800,

  init : function(x, y, settings) {
    this.parent(x, y, settings);

    var startPos = settings.pos;

    this.lifetime = 2;

    // Create physics body
    
    var guid = new Date().getTime();
    var entityDef = {
      id : 'projectile' + guid,
      x : startPos.x,
      y : startPos.y,
      halfHeight : 5 * 0.5,
      halfWidth : 5 * 0.5,
      damping : 0,
      userData: {
        id : "wpnSimpleProjectile" + guid,
        ent : this
      }
    };

    // Call our physics engine's addBody method
    // with the constructed entityDef.
    this.physBody = gPhysicsEngine.addBody(entityDef);

    var vel = new Vec2(this.dir.x * this.speed, this.dir.y * this.speed);

    this.physBody.SetLinearVelocity(vel);
  },
  update : function() {
    this.lifetime -= 0.05;
    if (this.lifetime <= 0) {
      this.kill();
      return;
    }

    var vel = new Vec2(this.dir.x * this.speed, this.dir.y * this.speed);

    this.physBody.SetLinearVelocity(vel);

    if (this.physBody !== null) {
      this.pos = this.physBody.GetPosition();
    }

    this.parent();
  }
});

gGameEngine.factory.SimpleProjectile = SimpleProjectileClass;

