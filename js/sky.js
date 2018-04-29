// Define Sky Object
// manage the flying particles and clouds
Sky = function(colorPalette, scale){

  // Create an empty container
	this.mesh = new THREE.Object3D();

	// choose a number of clouds to be scattered in the sky
	this.nClouds = 30;

  //colorPalette, scale, this.mesh.geometry.vertices.length
  this.colorPalette = colorPalette;
  this.scale = scale;

	// To distribute the clouds consistently,
	// we need to place them according to a uniform angle
	var stepAngle = Math.PI*2 / this.nClouds;

	// create the clouds
	for(var i=0; i<this.nClouds; i++){
		var c = new Cloud();

		// set the rotation and the position of each cloud;
		// for that we use a bit of trigonometry
		var a = stepAngle*i; // this is the final angle of the cloud
		var h = 900 + Math.random()*200; // this is the distance between the center of the axis and the cloud itself

		// we are simply converting polar coordinates (angle, distance) into Cartesian coordinates (x, y)
		// c.mesh.position.y = Math.sin(a)*h;
		// c.mesh.position.x = Math.cos(a)*h;
    c.mesh.position.y = Math.sin(a)*h;
		c.mesh.position.x = Math.cos(a)*h;
		// rotate the cloud according to its position
		// c.mesh.rotation.z = a + Math.PI/2;

		// for a better result, we position the clouds
		// at random depths inside of the scene
		c.mesh.position.z = -400-Math.random()*400;

		// we also set a random scale for each cloud
		var s = 1+Math.random()*2;
		c.mesh.scale.set(s,s,s);

		// do not forget to add the mesh of each cloud in the scene
		this.mesh.add(c.mesh);
	}

  // create flyingParticles
  Sky.prototype.launchParticle = function(){
    var p;
    var col = Colors.getRandomFrom(this.colorPalette);
    if (waitingParticles.length){
      p = waitingParticles.pop();
      p.material.color.setHex(col);
    }else {
      p = new FlyingParticle(col, this.scale);
    }
    p = new FlyingParticle(col, this.scale);
    p.visible = true;
    p.scale.x = p.scale.y = p.scale.z = this.scale/20;
    p.userData.speedX = Math2.rangeRandom(1,3);
    p.userData.speedY = Math2.rangeRandom(.5,1);
    // var origin = new THREE.Vector3(2.1319660571721757, 2.2975878027347423, 2.1128115555176867);
    // var vIndex = Math.floor(Math.random()*20);
    // var pos = this.mesh.geometry.vertices[vIndex].clone();
    // var pos = origin;
    // pos = this.mesh.localToWorld( pos );
    // p.position.copy(pos);
    flyingParticles.push(p);
    scene.add(p);
  }
}
