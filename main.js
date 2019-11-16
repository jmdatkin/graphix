function main() {
	const canvas = document.querySelector("#glCanvas");
	const gl = canvas.getConctext("webgl");
	
	if (gl === null) {
		alter("Unable to initialize WebGL. Your browser or machien may not support it.");
		return;
	}
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(g1.COLOR_BUFFER_BIT);
}