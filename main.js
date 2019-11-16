//import glMatrix as "./glMatrix/dist/gl-matrix-min.js"

var Engine = {
	util: {
	},
	main: function() {
		const width = window.innerWidth;
		const height = window.innerHeight;
		const canvas = document.querySelector("#glCanvas");
		canvas.setAttribute("width",width);
		canvas.setAttribute("height",height);
		
		/*const gl = canvas.getContext("webgl");
		
		if (gl === null) {
			alert("Unable to initialize WebGL. Your browser or machien may not support it.");
			return;
		}*/
		
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
		var renderer = new THREE.WebGLRenderer( {
			canvas: canvas,
			antialias: true,
		});
		
	renderer.setSize( width, height );
		
		/*var mat = new THREE.MeshPhongMaterial( {
       color: 0x0088aa, 
       specular: 0x003344, 
       shininess: 100,
       flatShading: true,  // for flat-looking sides
       side: THREE.DoubleSide  // for drawing the inside of the tube
    } );
var geom = new THREE.CylinderGeometry(3,3,10,5,1,true);
var obj = new THREE.Mesh(geom,mat);
scene.add(obj);*/

	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light );
	var point = new THREE.PointLight( 0x222222 );
	point.position.set(5,0,7);
	point.power = 30;
	point.size = 50;
	scene.add(point);
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshStandardMaterial( {
		color: 0x88ffff,
        specular: 0x003344, 
        flatShading: true,
		shininess: 100, } );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

	camera.position.z = 5;
	
	cube.rotation.x = 0.2;
	
	var clicked = false;
	
	var px,py,qx,qy;
	var mouseMove = function(e) {
		clicked = true;
		qx = e.clientX;
		qy = e.clientY;
		cube.rotation.x = px-qx;
		cube.rotation.y = py-qy;
	};
	var mouseUp = function(e) {
		console.log("mouseup");
		clicked = false;
		document.removeEventListener("mousemove",mouseMove);
	};
	var mouseDown = function(e) {
		px = e.clientX;
		py = e.clientY;
		clicked = true;
		document.addEventListener("mousemove",mouseMove);
	};
	document.addEventListener("mousedown",mouseDown);
	document.addEventListener("mouseup",mouseUp);
	
	
		
	let i=0;
	let n = 720;
	var animate = function() {
		requestAnimationFrame( animate );
		//if (clicked) {
			cube.rotation.y += Math.cos(i/50)/20;
			cube.rotation.z += 0.005;
			cube.rotation.x = 0.6+Math.sin(i/500)/65;
			cube.material.color.r += (i/(n*10));
			cube.material.color.b -= (i/(n*5));
			//cube.rotation.y += 0.01;
			i = (i >= n) ? 0 : i+1;
		//}
		renderer.render( scene, camera );
	}
	animate();
		//renderer.render(scene, camera);
		
		//gl.clearColor(0.0, 0.0, 0.0, 1.0);
		//gl.clear(gl.COLOR_BUFFER_BIT);
	}
};

window.onload = Engine.main;