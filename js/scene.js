////////////////////////////////////////////////
//                  THREE JS RELATED VARIABLES
////////////////////////////////////////////////

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer,
    container,
    controls,
    mouseDown = false;
////////////////////////////////////////////////
//                      SCREEN & MOUSE VARIABLES
////////////////////////////////////////////////

var HEIGHT, WIDTH, windowHalfX, windowHalfY,
    mousePos = { x: 0, y: 0 },
    oldMousePos = {x:0, y:0};

////////////////////////////////////////////////
//                           3D MODELS VARIABLES
////////////////////////////////////////////////
var floor, tree,
    globalWind = 0,
    trees = [],
    waitingParticles = [],
    flyingParticles = [],
    foliages = [],
    foliagesComplex = [];

////////////////////////////////////////////////
//                                   STATS & GUI
////////////////////////////////////////////////
var stats;
var parameters = {
  truncHeight:100,
  truncThickness:4,
  truncColor:Colors.grey_d,
  truncNoise:.5,
  foliageColor:"yellows",
  foliageDensity:5,
  foliageNoise:.05,
  foliageSize : 10,
  animationSpeed: 2.5,
};

function initGUI(){
  var gui = new dat.GUI();
  gui.width = 250;
  gui.add(parameters, 'truncHeight').min(60).max(110).step(10).name('Trunc Height');
  gui.add(parameters, 'truncThickness').min(2).max(6).step(1).name('Trunc Thickness');
  gui.add(parameters, 'truncNoise').min(0).max(5).step(.5).name('Trunc Disp.');
  gui.add(parameters, 'truncColor', {
    "Light White":Colors.white_l,
    "Dark White":Colors.white_d,
    "Light Grey":Colors.grey_l,
    "Dark Grey":Colors.grey_d
  }).name('Trunc Color');
  gui.add(parameters, 'foliageColor', {
    "White":"whites",
    "Grey":"greys",
    "Pink":"pinks",
    "Yellow":"yellows",
    "Purple":"purples"
  }).name('Foliage Color');
  gui.add(parameters, 'foliageDensity').min(3).max(8).step(1).name('Foliage Density');
  gui.add(parameters, 'foliageNoise').min(0).max(.2).step(.01).name('Foliage Disp.');
  gui.add(parameters, 'foliageSize').min(5).max(30).step(1).name('Foliage Size.');
  gui.add(parameters, 'animationSpeed').min(1).max(4).step(.5).name('Anim. Speed');


  gui.add({generate:function(){createTree()}}, 'generate').name(">GENERATE");
}

////////////////////////////////////////////////
//                  MOUSE EVENTS / SCREEN EVENTS
////////////////////////////////////////////////

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function mouseDownHandler(event) {
  mouseDown = true;
}
function mouseUpHandler(event) {
  mouseDown = false;
}

function handleMouseMove(event) {
  mousePos = {x:event.clientX, y:event.clientY};
}

function handleTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
  }
}
////////////////////////////////////////////////
//                                        RENDER
////////////////////////////////////////////////

function render(){
  if (controls && controls.enabled) controls.update();
  renderer.render(scene, camera);
}

////////////////////////////////////////////////
//                                        LIGHTS
////////////////////////////////////////////////
var gobalLight, shadowLight, backLight;

function createLights() {

  var globalLight = new THREE.HemisphereLight(Colors.white_d, Colors.white_d, .8)
  /*
  var pointLight = new THREE.PointLight( Colors.pink_l, 1, 300 );
  pointLight.position.set( 35, 50, 30 );
  var sphereSize = 10;
  var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
  //*/
  shadowLight = new THREE.DirectionalLight(0xffffff, 1);
  shadowLight.position.set(100, 150, 100);
  shadowLight.castShadow = true;
  shadowLight.shadowDarkness = .2;
  shadowLight.shadowMapWidth = shadowLight.shadowMapHeight = 1024;
  scene.add(shadowLight);
  //scene.add(pointLight );
  scene.add(globalLight);
}
////////////////////////////////////////////////
//                                        FLOOR
////////////////////////////////////////////////
var Floor = function(){
  var floorCol = Colors.green_d;
  this.mesh =  new CustomMesh.PlaneMesh(1600,1600,12, floorCol);
  var vertices = this.mesh.geometry.vertices;
  for (var i=0; i<vertices.length; i++){
    var v = vertices[i];
    v.x += Math2.rangeRandom(-10,10);
    v.y += Math2.rangeRandom(-10,10);
    v.z += Math2.rangeRandom(-10,10);
  }
  this.mesh.geometry.computeFaceNormals();
  this.mesh.geometry.verticesNeedUpdate = true;
  this.mesh.geometry.colorsNeedUpdate = true;
  //
  //this.mesh.geometry.computeVertexNormals();
  this.mesh.rotation.x = -Math.PI / 2;
}

////////////////////////////////////////////////
//                  INIT THREE JS, MOUSE, SCREEN
////////////////////////////////////////////////

function initCore() {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;

  scene = new THREE.Scene();
  var fogcol = 0xcefaeb;//0x1c0403
  scene.fog = new THREE.FogExp2( fogcol, 0.0028 ); //new THREE.Fog(fogcol, 300, 1000);
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = .1;
  farPlane = 3000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );
  camera.position.x = 0;
  camera.position.z = 150;
  camera.position.y = 100;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
  document.addEventListener('mousemove', handleMouseMove, false);
  document.addEventListener('touchmove', handleTouchMove, false);
  document.addEventListener('touchmove', handleTouchMove, false);
  document.addEventListener('mousedown', mouseDownHandler, false);
  document.addEventListener('mouseup', mouseUpHandler, false);

  //*
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target = new THREE.Vector3(0,60,0);
  controls.minPolarAngle = -Math.PI*.45;
  controls.maxPolarAngle = Math.PI*.45;
  controls.minDistance = 130;
  controls.maxDistance = 500;
  //controls.enabled = false;
  //controls.noZoom = true;
  //controls.noPan = true;
  //*/

  console.log(controls);
}

////////////////////////////////////////////////
//                                 CREATE MODELS
////////////////////////////////////////////////

// FLOOR

function createFloor(){
  floor = new Floor();
  scene.add(floor.mesh);
}

// FOREST
// function createForest(){
//   var nTrees = 25;
//   var treesDist = 25;
//   for (var i = 0; i< nTrees; i++){
//     var tree = new Tree(false, 3);
//     tree.mesh.position.y = -5;
//     tree.mesh.position.x = -((nTrees/2)*treesDist) + (i*treesDist);
//     tree.mesh.position.z = -Math.random()*150 -150;
//     scene.add(tree.mesh);
//     trees.push(tree);
//   }
// }

function createForest(){
  chrome.storage.sync.get(['messages'], function(results) {
    // var treesDist  = 25;
    var messages = results.messages;
    var treeNum = messages.length;
    console.log(treeNum);
    if(treeNum > 0){
      for(var i = 0; i < treeNum; i++){
        treesDist = Math2.rangeRandomInt(10, 50);
        console.log("treesDist: " + treesDist);
        console.log("messages: " + messages[i] + " i: "+ i + " length: " + messages[i].length);
        var tree = new Tree(false, messages[i].length*10);
        tree.mesh.position.y = -5;
        tree.mesh.position.x = -((treeNum/2)*treesDist) + (i*treesDist);
        tree.mesh.position.z = -Math.random()*150 -150;
        scene.add(tree.mesh);
        trees.push(tree);
      }
    }
  });
}
// TREE
function createTree(height){
  var tree = new Tree(true, height);
  tree.mesh.position.y = -10;
  scene.add(tree.mesh);
  tree.trunc.grow();
  updateShadows();
}

function grow(mesh){
	//console.log("new grow");
	for (var i=0; i<mesh.children.length; i++){
		var child = mesh.children[i];
    if (child.userData.refClass && child.userData.refClass.type == "foliage"){
      child.userData.refClass.grow();
    }else{
      var d = (child.position.y / 200) + child.userData.hierarchy;
      var s = 10+child.userData.hierarchy*2;
      s = s/parameters.animationSpeed;
      TweenMax.from(child.scale, s, {x:0.01, y:0.01, z:0.01, delay:d, ease:Back.easeInOut});
      TweenMax.from(child.rotation, s, {x:0, y:0, z:0, delay:d, ease:Back.easeInOut});
      grow(child);
    }
	}
}

window.addEventListener('load', init, false);

var sky;
function createSky(){
  var scale = (Math.floor(Math.random()*20)+5) *(1+Math.random()*.5);
  var particlePalette =  Colors.getRandomFrom([Colors.pinks, Colors.yellows, Colors.greens, Colors.purples]);
  // var particlePalette = Colors.yellows;
	sky = new Sky(particlePalette, scale);
	sky.mesh.position.y = -600;
	scene.add(sky.mesh);
}

function init(event){
  initCore();
  // initGUI();
  createLights();
  createFloor();
  createSky();
  createForest();
  loop();
}

function updateShadows(){
  scene.traverse( function ( object ) {
    if ( object instanceof THREE.Mesh ) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
}

function loop(){
  var frustum = new THREE.Frustum();
  frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse ) );
  // sky.launchParticle();

  // if (Math.random()>.5){
  //   var fol = foliages[Math.floor(Math.random()*foliages.length)];
  //   fol.launchParticle();
  // }
  //
  //  if (Math.random()>.9){
  //   var fol = foliagesComplex[Math.floor(Math.random()*foliagesComplex.length)];
  //   fol.launchParticle();
  // }

  // for (var i=0; i<flyingParticles.length; i++){
  //   var p = flyingParticles[i];
  //   p.position.x += p.userData.speedX + Math.random()/10;
  //   p.position.y += p.userData.speedY + Math.random()/20;
  //
  //   p.rotation.x += .01 + Math.random()/100;
  //   p.rotation.y += .01 + Math.random()/10;
  //   p.rotation.z += .1 + Math.random()/20;
  //
  //   if(!frustum.containsPoint( p.position )){
  //     p.visible = false;
  //     waitingParticles.push(flyingParticles.splice(i,1)[0]);
  //   }
  // }

  render();
  requestAnimationFrame(loop);
}
