// TREE

// Tree = function(complex){
// 	this.mesh = new THREE.Object3D();
// 	this.trunc = new Trunc(complex);
// 	this.mesh.add(this.trunc.mesh);
// }

Tree = function(complex, height){
	this.mesh = new THREE.Object3D();
	this.trunc = new Trunc(complex, height);
	this.mesh.add(this.trunc.mesh);
}

Tree.prototype.kill = function(){
  this.trunc.kill();
  this.mesh = null;
}

Tree.prototype.fly = function(callback){
  TweenMax.to(this.mesh.position, 1.5, {x:100, y:300, z:300, ease:Strong.easeIn, onComplete:function(){
    if (callback) callback();
  }});

  TweenMax.to(this.mesh.rotation, 2, {z:-Math.PI/6, y:Math.PI/2, ease:Strong.easeInOut});
  TweenMax.to(this.mesh.scale, 1.5, {y:1.1, x:.9, ease:Strong.easeInOut});
}

// TRUNC

Trunc = function(complex, height){
  this.type = "trunc";
	this.pointsTrunc = [];
	this.hierarchy = 1;

  this.truncHeight = height;
  this.truncStartRadius = 3 * (height/110);
  this.foliageDensity =  2;

  // this.truncStartRadius = (complex) ? parameters.truncThickness : Math2.rangeRandom(2,4);

	// parametrables
	this.truncColor = (complex) ? parameters.truncColor : Colors.getRandomFrom(Colors.trunc);
	// this.truncHeight = (complex) ? parameters.truncHeight : Math2.rangeRandom(70,100);
	// this.truncStartRadius = (complex) ? parameters.truncThickness : Math2.rangeRandom(2,4);
	this.verticalSegments = (complex)? Math2.rangeRandomInt(9,12) : Math2.rangeRandomInt(3,5);
	this.radiusSegments = (complex)? Math2.rangeRandomInt(6,10) : Math2.rangeRandomInt(4,6);
	this.shapeAngleStart = Math2.rangeRandom(Math.PI/4, Math.PI/2);
	this.shapeAmplitude = Math2.rangeRandom(this.truncStartRadius/4, this.truncStartRadius*6);
	this.noise = (complex)? parameters.truncNoise : Math2.rangeRandom(this.truncStartRadius/8, this.truncStartRadius/4);
  this.foliageDensity = (complex)? parameters.foliageDensity : 2;
	this.shapeAngle = Math.PI - this.shapeAngleStart;
	this.freq = this.shapeAngle/this.verticalSegments;
	this.segHeight = (this.truncHeight / this.verticalSegments);

	this.pointsTrunc.push( new THREE.Vector3( 0, 0, 0 ) );
  var ty,tx, tz, i;
  ty = 0;
	for ( i = 0; i < this.verticalSegments; i ++ ) {
		tx = Math.sin( this.shapeAngleStart + (i * this.freq) ) * this.shapeAmplitude + this.truncStartRadius;
		tz = 0;
		this.pointsTrunc.push( new THREE.Vector3( tx, ty, tz ) );
		if (i < this.verticalSegments -1) {
		  ty += this.segHeight;
		}else{
		  ty += this.segHeight/4;
		}
	}
	this.pointsTrunc.push( new THREE.Vector3( 0, ty, 0 ) );
	this.mesh = new CustomMesh.Lathe( this.pointsTrunc, this.radiusSegments, this.truncColor);
	this.mesh.userData.hierarchy = this.hierarchy;
  this.mesh.userData.refClass = this;
	var geom = this.mesh.geometry;

	var defAttachs;
  if (complex){
    defAttachs = [
			{
       type:"elbowBranch",
       count : this.foliageDensity,
       minH : this.truncHeight*.75,
       maxH:this.truncHeight*.95,
       minAngle:0,//-Math.PI*3/4,
       maxAngle:0,//-Math.PI/4
      },

			{
        type:"elbowBranch",
        count : 1,
        minH : this.truncHeight*.75,
        maxH:this.truncHeight*.95,
        minAngle:Math.PI/4,
        maxAngle:Math.PI*3/4
      },

      {
        type:"elbowBranch",
        count : 1,
        minH : this.truncHeight*.8,
        maxH:this.truncHeight*1,
        minAngle:-Math.PI/4,
        maxAngle:Math.PI/4
      },

			{
        type:"branch",
        count : 1,
        minH : this.truncHeight*.45,
        maxH:this.truncHeight*.75,
        minAngle:-Math.PI,
        maxAngle:0
      },
			{
        type:"branch",
        count : 1,
        minH : this.truncHeight*.35,
        maxH:this.truncHeight*.50,
        minAngle:Math.PI/4,
        maxAngle:Math.PI*3/4
      },
			{
        type:"leaf",
        count : 5,
        minH : this.truncHeight*.30,
        maxH:this.truncHeight*.90,
        minAngle:0,
        maxAngle:0
      },
			{
        type:"fruit",
        count : 4,
        minH : this.truncHeight*.30,
        maxH:this.truncHeight*.80,
        minAngle:0,
        maxAngle:0
      },
			{
        type:"spike",
        count : 6,
        minH : this.truncHeight*.10,
        maxH:this.truncHeight*.90,
        minAngle:0,
        maxAngle:0
      },
			{
        type:"moss",
        count : 6,
        minH : this.truncHeight*.10,
        maxH:this.truncHeight*.90,
        minAngle:0,
        maxAngle:0
      },
		];
  }else{
    defAttachs = [
			{
       type:"elbowBranch",
       count : 1,
       minH : this.truncHeight*.75,
       maxH:this.truncHeight*.9,
       minAngle:-Math.PI*3/4,
       maxAngle:-Math.PI/4
      },

			{
        type:"elbowBranch",
        count : 1,
        minH : this.truncHeight*.45,
        maxH:this.truncHeight*.7,
        minAngle:Math.PI/4,
        maxAngle:Math.PI*3/4
      },

			{
        type:"branch",
        count : 1,
        minH : this.truncHeight*.45,
        maxH:this.truncHeight*.75,
        minAngle:-Math.PI,
        maxAngle:0
      },
			{
        type:"branch",
        count : 1,
        minH : this.truncHeight*.15,
        maxH:this.truncHeight*.45,
        minAngle:Math.PI/4,
        maxAngle:Math.PI*3/4
      },

			{
        type:"fruit",
        count : 2,
        minH : this.truncHeight*.30,
        maxH:this.truncHeight*.80,
        minAngle:0,
        maxAngle:0
      },
		];
  }

	this.attachsVerts = GeometryHelpers.getAttachs(geom, defAttachs);
	if (this.noise) GeometryHelpers.makeNoise(geom, this.noise);
	this.verticesNormals = GeometryHelpers.getVerticesNormals(geom);

  CustomMesh.flatshadeGeometry(geom);

	var cols = [];
		cols["leaf"] = Colors.green_d;
		cols["branch"] = this.truncColor;
		cols["elbowBranch"] = this.truncColor;
		cols["moss"] = Colors.white_l;
		cols["spike"] = Colors.red_l;
		cols["fruit"] = Colors.red_d;

	var colorFoliagePalette = (complex)? Colors[parameters.foliageColor] : Colors.getRandomFrom([Colors.pinks, Colors.yellows, Colors.greens]);

	for (i=0; i<this.attachsVerts.length; i++){
		var attDef = this.attachsVerts[i];
		var v = geom.vertices[attDef.index];
		var type = attDef.type;
		var col = cols[type];
		var attach, s, r, th;

		if (type == "moss"){
			s = Math2.rangeRandom(1,2);
			attach = new CustomMesh.SphereMesh(s,5,3, col, true);
			attach.geometry.applyMatrix(new THREE.Matrix4().makeScale(.6,1,.3));
			attach.quaternion.setFromUnitVectors ( new THREE.Vector3( 0, 0, 1 ), this.verticesNormals[attDef.index] );
		}else if (type == "spike"){
			s = Math2.rangeRandom(1,3);
			attach = new CustomMesh.SphereMesh(s,2,2, col, true);
			attach.geometry.applyMatrix(new THREE.Matrix4().makeScale(.1,1,.1));
			attach.quaternion.setFromUnitVectors ( new THREE.Vector3( 0, 1, 0 ), this.verticesNormals[attDef.index] )
		}else if(type == "fruit"){
			s = Math2.rangeRandom(2,4);
			attach = new Tomatoe(s, Colors.getRandomFrom(Colors.pinks, complex), Colors.getRandomFrom(Colors.greens)).mesh;
			attach.quaternion.setFromUnitVectors ( new THREE.Vector3( 0, 1, 0 ), this.verticesNormals[attDef.index] )
			//attach.rotation.z += Math.PI/4 + Math.random()*Math.PI/4;
		}else if(type == "leaf"){
			s = Math2.rangeRandom(1,2);
			attach = new Leaf(s,col).mesh;
			attach.quaternion.setFromUnitVectors ( new THREE.Vector3( 0, 1, 0 ), this.verticesNormals[attDef.index] )
			//attach.rotation.z += Math.PI/4 + Math.random()*Math.PI/4;

		}else if(type == "elbowBranch"){
			r = Math2.rangeRandom(this.truncHeight*.05,this.truncHeight*.15);
			th = Math2.rangeRandom(this.truncStartRadius*40/(1+v.y),this.truncStartRadius*60/(1+v.y));
			attach = new ElbowBranch(r,th,col, colorFoliagePalette, this.hierarchy+1, complex).mesh;
			attach.quaternion.setFromUnitVectors ( new THREE.Vector3( -1, 0, 0 ), new THREE.Vector3( v.x, 0, v.z ).normalize() );
		}else if(type == "branch"){
			s = Math2.rangeRandom(this.truncHeight*.03,this.truncHeight*.06);
			th = Math2.rangeRandom(this.truncStartRadius*.2,this.truncStartRadius*.4);
			attach = new Branch(s,th,col, colorFoliagePalette, this.hierarchy+1, complex).mesh;
			attach.quaternion.setFromUnitVectors ( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( v.x, 0, v.z ).normalize() );
		}

		attach.position.copy(v);
		attach.userData.targetY = v.y;
		attach.userData.targetRotZ = attach.rotation.z;
		attach.userData.hierarchy = this.hierarchy+1;

		this.mesh.add(attach);
		attDef.mesh = attach;
	}
	geom.verticesNeedUpdate = true;
}

Trunc.prototype.kill = function(){
  var mesh = this.mesh;
  var geom = this.mesh.geometry;
	var l = geom.vertices.length;
  for (var i=0; i<l; i++){
		var v = geom.vertices[i];
		TweenMax.killTweensOf(v);
	}
  killGrow(mesh);
  mesh = null;
}

function killGrow(mesh){
  for (var i=0; i<mesh.children.length; i++){
		var child = mesh.children[i];
    TweenMax.killTweensOf(child.scale);
    TweenMax.killTweensOf(child.rotation);
		killGrow(child);
    child = null;
	}
}


Trunc.prototype.grow = function(){
	var scope = this;
	var geom = this.mesh.geometry;
	var l = geom.vertices.length;
	for (var i=0; i<l; i++){
		var v = geom.vertices[i];
		var d = v.y/100;//Math.abs(this.truncHeight - v.y) /100;
		var s = 30/parameters.animationSpeed;// + (Math.abs(this.truncHeight - v.y)/100);
		TweenMax.from(v, s*.5, {x:0,z:0, delay:d*2, ease:Strong.easeInOut, onUpdate:scope.replaceAttachs, onUpdateScope:scope});
		TweenMax.from(v, s, {y:0, delay:d, ease:Strong.easeOut});
	}
	grow(this.mesh);
}

Trunc.prototype.replaceAttachs = function(){
	for (i=0; i<this.attachsVerts.length; i++){
		var attDef = this.attachsVerts[i];
		var v = this.mesh.geometry.vertices[attDef.index];
		attDef.mesh.position.copy(v);
	}
	this.mesh.geometry.verticesNeedUpdate = true;
}

//Trunc.prototype.growAttachs = grow;

/*
BottleTrunc.prototype.updateWind = function(power){
	this.mesh.rotation.z = (power/1000);
	for (var i=0; i<this.mesh.children.length; i++){
		var child = this.mesh.children[i];
		child.rotation.z = child.userData.targetRotZ + Math.random()*power/1000;
	}
}
//*/

// BRANCH

ElbowBranch = function(radius, thickness, color, colorFoliagePalette, hierarchy, complex){
  this.type = "elbowBranch";
	var radSegs = (complex)?5:3;
	var tubSegs = (complex)?10:4;

	this.mesh = new CustomMesh.QuarterTorusMesh(radius,thickness,radSegs,tubSegs,Math.PI/2,color);
	this.mesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(thickness,-thickness*2,0));
	this.mesh.userData.hierarchy = hierarchy;
  this.mesh.userData.refClass = this;

	var folThick = (complex)? parameters.foliageSize*(1+Math.random()*.5) : Math2.rangeRandom(8,24);
	this.attach = new Foliage(folThick, colorFoliagePalette, hierarchy+1,complex).mesh;

	this.attach.position.x = -radius;
	this.attach.position.y = radius - (thickness*3);
	this.mesh.add(this.attach);
}

Branch =function(h, thickness, color, colorFoliagePalette, hierarchy,complex){
  this.type = "branch";
	var radSegs = (complex)?5:3;

	this.mesh = new CustomMesh.CylinderMesh(thickness,thickness,h,radSegs, 1, color, false);
  this.mesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-1,0));
	this.mesh.userData.hierarchy = hierarchy;
  this.mesh.userData.refClass = this;

	var folThick = thickness*Math2.rangeRandom(3,8);
	this.attach = new Foliage(folThick, colorFoliagePalette, hierarchy+1,complex).mesh;
	this.attach.position.y = h-2;
	this.mesh.add(this.attach);
}

// FRUIT

Tomatoe = function(scale, colorFruit, colorLeaves,complex){
  this.type = "fruit";
	this.mesh = new THREE.Object3D();
  this.mesh.userData.refClass = this;
	this.core = new THREE.Object3D();

	this.stem = new Stem(scale, colorLeaves,complex);
	this.line = this.stem.mesh;

	var sw = (complex)?5:3;
	var sh = (complex)?5:3;

	this.fruit = new CustomMesh.SphereMesh(scale,sw,sh, colorFruit, false);
	this.fruit.position.y = 1;

	this.crown = new THREE.Object3D();

	var stepAngle = Math.PI*2 / 5;
	var crownCount = Math2.rangeRandomInt(3,6);
	for (var i=0;i<5; i++){
    var leaf = new CustomMesh.DiamondMesh(scale,scale*1.5,.33,scale*.2,colorLeaves);
    leaf.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/4));
    leaf.position.x = Math.cos( stepAngle*i)*.3;
    leaf.position.z = Math.sin( stepAngle*i)*.3;
    leaf.rotation.y = Math.PI/2 - stepAngle*i;
    this.crown.add(leaf);
  }
	this.core.position.x = this.stem.endPoint.x;
	this.core.position.y = this.stem.endPoint.y;
	this.core.position.z = this.stem.endPoint.z;
	this.core.quaternion.setFromUnitVectors ( new THREE.Vector3( 0, 1, 0 ), this.stem.lastDirection);
	this.core.add(this.crown);
	this.core.add(this.fruit);
	this.mesh.add(this.line);
	this.mesh.add(this.core);
}

// LEAF
Leaf = function(scale, color){
  this.type = "leaf";
	this.mesh = new THREE.Object3D();
  this.mesh.userData.refClass = this;
	this.core = new CustomMesh.DiamondMesh(scale*2,scale*3,.33,scale*.1,color);
	this.stem = new Stem(scale, color);
	this.line = this.stem.mesh;
	this.mesh.add(this.line);
	this.core.position.x = this.stem.endPoint.x;
	this.core.position.y = this.stem.endPoint.y;
	this.core.position.z = this.stem.endPoint.z;
	this.core.quaternion.setFromUnitVectors ( new THREE.Vector3( 0, 1, 0 ), this.stem.lastDirection);
	this.mesh.add(this.core);
}

// STEM
Stem  = function(scale, color, complex){
  this.type = "stem";
	this.lastDirection = new THREE.Vector3();
	this.endPoint = new THREE.Vector3();
	var linePoints = [];
	var sl = scale/50;
	var nHandlers = (complex)?6:3;
	var i, a=0,
		tx = 0, ty=0, tz=0,
		pStartPoint = new THREE.Vector3(),
		v;
	for (i=0; i<nHandlers; i++){
		v = new THREE.Vector3( tx, ty, tz );
		linePoints.push(v);
		if (i==nHandlers-2){
			pStartPoint.x = tx;
			pStartPoint.y = ty;
			pStartPoint.z = tz;
		}

		if (i<nHandlers-1){
			tx += Math2.rangeRandom(-2,2);
			ty += sl*20;
			tz += Math2.rangeRandom(-2,2);
		}else{
			this.endPoint.x = tx;
			this.endPoint.y = ty;
			this.endPoint.z = tz;
			this.lastDirection.subVectors( this.endPoint, pStartPoint )
		}
	}
	this.mesh =  CustomMesh.CurvedPath(linePoints, scale/10, color);
  this.mesh.userData.refClass = this;
}
