/*Copyright 2012 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
#limitations under the License.*/

SwordClass = WeaponClass.extend({
  itemID: "4124",
   // ABCD format ,hex
  SwordInstance:null,
  onInit: function (owningPlayer) {},
//-----------------------------------
  onUpdate: function (owningPlayer) 
  {
	if(this.SwordInstance == null)return;
	
	if(owningPlayer.pInput && owningPlayer.pInput.fire2_off || owningPlayer.energy<=0)
	{
		this.SwordInstance.kill();
		this.SwordInstance = null;
	}
  },
  //-----------------------------------
    onDraw: function (owningPlayer) {

	var sheet =gSpriteSheets['grits_effects']; 
    //BEWARE MAGIC NUMBERS HERE!!
    var attachPts = {
      "x0": 2,
      "y0": 0,
      
    };
	var ctx = gGameEngine.colorTintCanvasContext;//gRenderEngine.context
	
	drawSprite("offensive_shield.png", attachPts.x0, attachPts.y0, {noMapTrans:true});
  },
  //-----------------------------------
  onFire: function (owningPlayer) {
	this.parent(owningPlayer);
    if (this.SwordInstance != null)
	{
		return;
	}
    
	this.fireParody = 0;
    

    var gMap = gGameEngine.gMap;

    //plop the landmine down right behind us
    var point1 = new Vec2(owningPlayer.pos.x, owningPlayer.pos.y);

    this.SwordInstance = gGameEngine.spawnEntity("SwordInstance", point1.x - gMap.viewRect.x, point1.y - gMap.viewRect.y,{
		name:owningPlayer.name+"_SIC_"+gGameEngine.nextSpawnId(),
		owner:owningPlayer.name,
		pos:point1
		});
  },
  
});

//exports.Class = SwordClass
Factory.nameClassMap['Sword'] = SwordClass;
