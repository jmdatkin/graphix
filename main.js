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
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshPhongMaterial( {
		color: 0x00ff00,
        specular: 0x003344, 
        flatShading: true,
		shininess: 100, } );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

	camera.position.z = 5;
	
	cube.rotation.x = 0.2;
		
	let i=0;
	var animate = function() {
		requestAnimationFrame( animate );
		cube.rotation.y += Math.cos(Math.PI*i/180/3);
		cube.material.color.r = i/3610;
		//cube.rotation.y += 0.01;
		i = (i >= 360) ? 0 : i+1;
		renderer.render( scene, camera );
	}
	animate();
		//renderer.render(scene, camera);
		
		//gl.clearColor(0.0, 0.0, 0.0, 1.0);
		//gl.clear(gl.COLOR_BUFFER_BIT);
	}
};

window.onload = Engine.main;