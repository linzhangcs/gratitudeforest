// FOLIAGE
Foliage = function(scale, colorPalette, hierarchy,complex){

  this.type="foliage";
	var sw = (complex)? Math2.rangeRandomInt(3,10):Math2.rangeRandomInt(3,5);
	var sh = Math2.rangeRandomInt(3,6);
	var noise = (complex)? parameters.foliageNoise*scale : Math2.rangeRandom(scale/20,scale/5);
	this.colPalette = colorPalette;
	this.col = Colors.getRandomFrom(this.colPalette);
	this.scale = scale;

  this.mesh = new CustomMesh.SphereMesh(scale,sw,sh,this.col, false);
  this.mesh.userData.refClass = this;
	this.mesh.userData.hierarchy = hierarchy;

	var geom = this.mesh.geometry;
	geom.mergeVertices();
	var h = scale*2;
	var defAttachs;
  if (complex){
    defAttachs = [
			{type:"subFol", 	count : 6, 	minH : h*.2, 	maxH:h*.9, 	minAngle:0, 	maxAngle:0	},
		];
  }else{
    defAttachs = [];
  }

	this.attachsVerts = GeometryHelpers.getAttachs(geom, defAttachs);

	GeometryHelpers.makeNoise(geom, noise);

  CustomMesh.flatshadeGeometry(geom);

	for (var i=0;i<this.attachsVerts.length;i++){
		var attDef = this.attachsVerts[i];
		var v = geom.vertices[attDef.index];
		var s = Math2.rangeRandom(scale*.05, scale*.2);
		var subFol = new SubFoliage(s, hierarchy+1).mesh;
    attDef.mesh = subFol;
		subFol.position.copy(v);
		subFol.rotation.z = Math2.rangeRandom(-Math.PI/8, Math.PI/8);
		subFol.rotation.x = Math2.rangeRandom(-Math.PI/8, Math.PI/8);
		this.mesh.add(subFol);
	}
	if (complex) foliagesComplex.push(this);
  else foliages.push(this);
}

SubFoliage = function(scale, hierarchy){
  this.type = "subfoliage";
	var sw = Math2.rangeRandomInt(2,4);
	var sh = Math2.rangeRandomInt(2,4);
	this.mesh = new CustomMesh.SphereMesh(scale,sw,sh,Colors.getRandomFrom(Colors.leaves), true);
	this.mesh.userData.hierarchy = hierarchy;
  this.mesh.userData.refClass = this;
}

Foliage.prototype.launchParticle = function(){
  var p;
	var col = Colors.getRandomFrom(this.colPalette);
	if (waitingParticles.length){
		p = waitingParticles.pop();
		p.material.color.setHex(col);
	}else {
		p = new FlyingParticle(col, this.scale);
	}
	p.visible = true;
	p.scale.x = p.scale.y = p.scale.z = this.scale/20;
	p.userData.speedX = Math2.rangeRandom(1,3);
	p.userData.speedY = Math2.rangeRandom(.5,1);

	var vIndex = Math.floor(Math.random()*this.mesh.geometry.vertices.length);
	var pos = this.mesh.geometry.vertices[vIndex].clone();
	pos = this.mesh.localToWorld( pos );
	p.position.copy(pos);
	flyingParticles.push(p);
	scene.add(p);
}

Foliage.prototype.grow = function(){
  console.log("grow foliage");
	var scope = this;
	var geom = this.mesh.geometry;
	var l = geom.vertices.length;
	for (var i=0; i<l; i++){
		var v = geom.vertices[i];
		var d =  Math.random()*.5 + v.y/25;
		var s = Math.random() + 20/parameters.animationSpeed;
    var sx = Math2.rangeRandom(-2,2);
    var sy = Math2.rangeRandom(-2,2);
    var sz = Math2.rangeRandom(-2,2);
		TweenMax.from(v, s, {x:0,z:0, y:0, delay:d, ease:Strong.easeInOut, onUpdate:scope.replaceAttachs, onUpdateScope:scope});
  }
	grow(this.mesh);
}

Foliage.prototype.replaceAttachs = function(){
	for (i=0; i<this.attachsVerts.length; i++){
		var attDef = this.attachsVerts[i];
		var v = this.mesh.geometry.vertices[attDef.index];
		attDef.mesh.position.copy(v);
	}
	this.mesh.geometry.verticesNeedUpdate = true;
}
