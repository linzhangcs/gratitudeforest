FlyingParticle = function(color){
	var mesh;
	var s = Math2.rangeRandom(1,4);
	var segs = Math2.rangeRandomInt(3,5);
	var segs2 = Math2.rangeRandomInt(2,5);

	if (Math.random()<.25){
		mesh = new CustomMesh.TriMesh(s,s,.2,color,"top");
	}else if (Math.random()<.5){
		mesh = new CustomMesh.RegPolyMesh(s,segs,1,color,false);
	}else if (Math.random()<.75){
		mesh = new CustomMesh.SphereMesh(s,segs,segs2,color,false);
	}else{
		mesh = new CustomMesh.CylinderMesh(0,s,s,segs, 1, color,true);
	}
	return mesh;
}
