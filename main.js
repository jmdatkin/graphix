//import glMatrix as "./glMatrix/dist/gl-matrix-min.js"

THREE.Math.lerp = function (a,  b,  c) {
    return a + c * (b - a);
}

var Engine = {
	util: {
	},
	main: function() {
		const width = window.innerWidth;
		const height = window.innerHeight;
		const canvas = document.querySelector("#glCanvas");
		canvas.setAttribute("width",width);
		canvas.setAttribute("height",height);
		
		var scene = new THREE.Scene();
		var camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
		var renderer = new THREE.WebGLRenderer( {
			canvas: canvas,
			antialias: true,
		});
		
	renderer.setSize( width, height );

	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light );
	var point = new THREE.PointLight( 0x222222 );
	point.position.set(5,0,7);
	point.power = 30;
	point.size = 50;
	scene.add(point);
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshNormalMaterial( {
		color: 0x88ffff,
        specular: 0x003344, 
        flatShading: true,
		shininess: 200, } );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

	camera.position.z = 5;
	
	//cube.rotation.x = 0.2;
	
	var clicked = false;
	
	var ix, iy;
	var px,pxh,py,pyh,qx,qxh,qy,qyh;
	var inertia = new THREE.Vector2(0.0,0.0);
	var inertiaFromMouse = new THREE.Vector2(0.0,0.0);
	var inertiaFromSpin = new THREE.Vector2(0.0,0.0);
	/*var targetRotationX = 0.5;
    var targetRotationOnMouseDownX = 0;
    var targetRotationY = 0.2;
    var targetRotationOnMouseDownY = 0;*/
	var mouseMove = function(e) {
		//every time mouse moves, set clicked to true and update 2nd mouse pos
		console.log("mouse moved");
		clicked = true;
		qx = (e.touches === undefined) ? e.clientX : e.touches[0].clientX;
		qxh = qx - window.innerWidth/2;
		qy = (e.touches === undefined) ? e.clientY : e.touches[0].clientY;
		qyh = qy - window.innerHeight/2;
		//consol-e.log("touch pos: x: "+e.clientX+", y: "+e.clientY);
	};
	var mouseUp = function(e) {
		px = py = qx = qy = ix = iy = 0;
		console.log("mouseup");
		clicked = false;
		document.removeEventListener("touchmove",mouseMove);
		document.removeEventListener("mousemove",mouseMove);
	};
	var mouseDown = function(e) {
		inertia.set(0,0,0);
		inertiaFromSpin.set(0,0,0);
		inertiaFromMouse.set(0,0,0);
		//qx = qy = ix = iy = 0;
		qx = px = (e.touches === undefined) ? e.clientX : e.touches[0].clientX;
		qy = py = (e.touches === undefined) ? e.clientY : e.touches[0].clientY;
		pxh = px-window.innerWidth;
		pyh = py-window.innerHeight;
		clicked = true;
		console.log("mousedown");
		document.addEventListener("touchmove",mouseMove);
		document.addEventListener("mousemove",mouseMove);
	};
	//document.addEventListener("mousedown",mouseDown);
	document.addEventListener("touchstart",mouseDown);
	document.addEventListener("mousedown",mouseDown);
	document.addEventListener("touchend",mouseUp);
	document.addEventListener("mouseup",mouseUp);
	
	//From Opher Vishnia
	function rotateAroundWorldAxis( object, axis, radians ) {
        var rotationMatrix = new THREE.Matrix4();

        rotationMatrix.makeRotationAxis( axis.normalize(), radians );
        rotationMatrix.multiply( object.matrix );                       // pre-multiply
        object.matrix = rotationMatrix;
        object.rotation.setFromRotationMatrix( object.matrix );
	}
	
	let i=0;
	let n = 720;
	var inertiaSlow = 0.93;
	var animate = function() {
		requestAnimationFrame( animate );
		
		//Normal action if mouse is not clicked
		if (!clicked) {
			//console.log(inertiaFromMouse);
			if (Math.sqrt(Math.pow(inertiaFromMouse.x,2) + Math.pow(inertiaFromMouse.y,2)) >= 0.005)
				inertiaFromMouse.multiplyScalar(inertiaSlow);
			else
				inertiaFromMouse.roundToZero();
			let r = (i/n*2*Math.PI);
			inertiaFromSpin.y = Math.sin(r)/40;
			inertiaFromSpin.x = Math.sin(r-3)/40;
			/*cube.rotation.y += Math.cos(i/50)/20;
			cube.rotation.z += 0.005;
			cube.rotation.x += Math.sin(i/500)/65;*/
			/*cube.material.color.r = 0.5+(Math.cos(r)*10)/2;
			cube.material.color.b = 0.5+(Math.sin(r)*10)/2;
			cube.material.color.g = 0.5+(Math.pow(Math.cos(r),2)*10)/2;*/
			i = (i >= n) ? 0 : i+1;
		}
		//If mouse is clicked
		else {
			inertiaFromSpin.roundToZero();
			//console.log(currRotX);
			mouseInputScalar = 1/10000;//('ontouchstart' in document.documentElement) ? 1/100000 : 1/10000;
			
			//console.log("qx-ix: "+(qx-ix));
			//console.log(new THREE.Vector3((qx-ix)*mouseInputScalar, (qy-iy)*mouseInputScalar));
			
			inertiaFromMouse.add(new THREE.Vector2((qx-px)*mouseInputScalar, (qy-py)*mouseInputScalar));
			
			console.log(inertiaFromMouse);
			console.log("x: "+(qx-ix)+", y: "+(qy-iy));
			
			ix = qx;
			iy = qy;
			
		}
		inertia.addVectors(inertiaFromMouse,inertiaFromSpin);
		//console.log(inertia);
		if (!inertia.equals(new THREE.Vector2(0,0))) {
			rotateAroundWorldAxis(cube, new THREE.Vector3(0,1,0), inertia.x);//(qx-px)/10000);//THREE.Math.lerp(currRotX, qx-px, 0.05));
			rotateAroundWorldAxis(cube, new THREE.Vector3(1,0,0), inertia.y);//(qy-py)/10000);//THREE.Math.lerp(currRotY, qy-py, 0.05));
		}
		currRotX = cube.rotation.x;
		currRotY = cube.rotation.y;
		//console.log(cube.rotation);
		renderer.render( scene, camera );
	}
	animate();
		//renderer.render(scene, camera);
		
		//gl.clearColor(0.0, 0.0, 0.0, 1.0);
		//gl.clear(gl.COLOR_BUFFER_BIT);
	}
};

window.onload = Engine.main;