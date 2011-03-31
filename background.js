/* Background class
	Draws and manages the background (hills and stuff.)
*/

classes.background = function(canvas, ctx) {
	var img = tools.Images['hills'];
	
	this.Render = function() {
		ctx.drawImage(img, 0, canvas.height - img.height);
	}
}

extend(classes.background, classes.entity);