/**
 *@Author Xizheng Ding (Eric)
 */

/**
 * This is piece of code was inpired by 
 * @ http://lab.aerotwist.com/webgl/surface/
 */
var Puzzle = Class.extend({
	container : null,
	camera : null,
	scene : null,
	renderer : null,
	video : null,
	textcanvas : null,
	image : null,
	imageContext : null,
	imageReflection : null,
	imageReflectionContext : null,
	imageReflectionGradient : null,
	preview : null,
	previewContext : null,
	texturePreview : null,
	text : null,
	textContext : null,
	textureText : null,
	msg : null,
	msgContext : null,
	textureMsg : null,
	texture : null,
	textureReflection : null,
	mesh : null,
	mesh2 : null,
	mouseX : 0,
	mouseY : 0,
	windowHalfX : window.innerWidth / 2,
	windowHalfY : window.innerHeight / 2,
	projector : null,
	plane : null,
	mouseP_x : 0,
	mouseP_y : 0,
	vertices : [],

	init : function(){
		this.container = $("#container")[0];
		this.video = $("#video")[0];
		this.videocanvas = $("#videocanvas")[0];
		this.textcanvas = $("#textcanvas canvas")[0];

		this.camera = new THREE.PerspectiveCamera( 45, 800 / 600, 1, 10000 );
		this.camera.position.z = 1100;
		this.camera.position.y = 100;

		this.scene = new THREE.Scene();
		this.image = document.createElement( 'canvas' );
		this.image.width = 400;
		this.image.height = 400;
		this.imageContext = this.image.getContext( '2d' );
		this.imageContext.fillStyle = '#000000';
		this.imageContext.fillRect( 0, 0, 400, 400 );
        this.texture = new THREE.Texture( this.image );
		this.texture.minFilter = THREE.LinearFilter;
		this.texture.magFilter = THREE.LinearFilter;
        var material = new THREE.MeshBasicMaterial( { map: this.texture, overdraw: true, shading: THREE.SmoothShading } );

        this.imageReflection = document.createElement( 'canvas' );
		this.imageReflection.width = 400;
		this.imageReflection.height = 400;
        this.imageReflectionContext = this.imageReflection.getContext( '2d' );
		this.imageReflectionContext.fillStyle = '#000000';
		this.imageReflectionContext.fillRect( 0, 0, 400, 400 );
        this.imageReflectionGradient = this.imageReflectionContext.createLinearGradient( 0, 0, 0, 400 );
		this.imageReflectionGradient.addColorStop( 0.2, 'rgba(240, 240, 240, 1)' );
		this.imageReflectionGradient.addColorStop( 1, 'rgba(240, 240, 240, 0.8)' );
       	this.textureReflection = new THREE.Texture( this.imageReflection );
		this.textureReflection.minFilter = THREE.LinearFilter;
		this.textureReflection.magFilter = THREE.LinearFilter;
        var materialReflection = new THREE.MeshBasicMaterial( { map: this.textureReflection, side: THREE.BackSide, overdraw: true, shading: THREE.SmoothShading} );
        
        this.preview = document.createElement( 'canvas' );
        this.preview.width = 200;
        this.preview.height = 200;
        this.previewContext = this.preview.getContext('2d');
        this.previewContext.fillStyle = '#000000';
		this.previewContext.fillRect( 0, 0, 200, 200 );
		this.texturePreview = new THREE.Texture( this.preview );
		this.texturePreview.minFilter = THREE.LinearFilter;
		this.texturePreview.magFilter = THREE.LinearFilter;
		var materialPreview = new THREE.MeshBasicMaterial( { map: this.texturePreview, overdraw: true, shading: THREE.SmoothShading } );


        this.plane = new THREE.PlaneGeometry( 400, 400, 4, 4 );
        this.mesh = new THREE.Mesh( this.plane, material );
		this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = 1;
		this.scene.add(this.mesh);

		var plane2 = new THREE.PlaneGeometry( 400, 400, 4, 4 );
		this.mesh2 = new THREE.Mesh( plane2, materialReflection );
		this.mesh2.position.y = - 400;
		this.mesh2.rotation.x = - Math.PI;
		this.mesh2.scale.y  = this.mesh.scale.z = 1;
		this.mesh2.scale.x = 1;
		this.scene.add( this.mesh2 );

		var plane3 = new THREE.PlaneGeometry(200, 200, 4, 4);
		var mesh3 = new THREE.Mesh( plane3, materialPreview);
		mesh3.position.x = 0;
		mesh3.position.y = - 200;
		mesh3.position.z = 400;
		mesh3.rotation.x = - Math.PI / 2;
		this.scene.add( mesh3 );

        this.text = document.createElement( 'canvas' );
        this.text.width = 200;
        this.text.height = 200;
        this.textContext = this.text.getContext('2d');
        this.textContext.fillStyle = '#000';
		this.textContext.fillRect( 0, 0, 200, 200 );

		this.textureText = new THREE.Texture( this.text );
		this.textureText.minFilter = THREE.LinearFilter;
		this.textureText.magFilter = THREE.LinearFilter;
		var materialText = new THREE.MeshBasicMaterial( { map: this.textureText, overdraw: true, shading: THREE.SmoothShading } );


        var plane4 = new THREE.PlaneGeometry( 200, 200, 4, 4);
        var mesh4 = new THREE.Mesh( plane4, materialText );
		mesh4.position.x = -350;
		mesh4.position.y = -250;
		this.scene.add(mesh4);

		this.msg = document.createElement( 'canvas' );
        this.msg.width = 400;
        this.msg.height = 300;
        this.msgContext = this.msg.getContext('2d');
        this.msgContext.fillStyle = '#000';
		this.msgContext.fillRect( 0, 0, 400, 300 );

		this.textureMsg = new THREE.Texture( this.msg );
		this.textureMsg.minFilter = THREE.LinearFilter;
		this.textureMsg.magFilter = THREE.LinearFilter;
		var materialMsg = new THREE.MeshBasicMaterial( { map: this.textureMsg, overdraw: true, shading: THREE.SmoothShading } );


        var plane5 = new THREE.PlaneGeometry( 400, 300, 4, 4);
        var mesh5 = new THREE.Mesh( plane5, materialMsg );
		mesh5.position.y = - 200;
		mesh5.position.z = 250;
		mesh5.rotation.x = - Math.PI / 2;
		mesh5.scale.y  = mesh5.scale.x = 1.5;
		this.scene.add(mesh5);

		this.scene.position.z = 200;

		this.projector = new THREE.Projector();
		//create particles from the floor
		var separation = 150;
		var amountx = 15;
		var amounty = 15;

		var PI2 = Math.PI * 2;
		var material = new THREE.ParticleCanvasMaterial( {

			color: 0x0808080,
			program: function ( context ) {

				context.beginPath();
				context.arc( 0, 0, 2, 0, PI2, true );
				context.closePath();
				context.fill();

			}

		} );

		for ( var ix = 0; ix < amountx; ix++ ) {
			for ( var iy = 0; iy < amounty; iy++ ) {
				particle = new THREE.Particle( material );
				particle.position.x = ix * separation - ( ( amountx * separation ) / 2 );
				particle.position.y = - 200
				particle.position.z = iy * separation - ( ( amounty * separation ) / 2 );
				this.scene.add( particle );
			}
		}


		// var loader = new THREE.SceneLoader();
		// loader.load( 'LeatherCouch/LeatherCouch.obj', function ( object ) {
  //                   console.log(object);
  //        } );
		// console.log(loader);

		this.renderer = new THREE.CanvasRenderer();
		this.renderer.setSize( 800, 600);

		this.container.appendChild( this.renderer.domElement );
		this.addEventListeners();
	},

	addEventListeners : function(){
		$(this.container).bind("mousemove", onContainerMouseMove);
		$(this.container).bind("click", onContainerMouseDown);
		$(this.container).bind("resize", onWindowResize);
		var obj = this;

		function onWindowResize(){
			obj.camera.aspect = 800 / 600;
			obj.camera.updateProjectionMatrix();
			obj.renderer.setSize( 800, 600 );
		}

		function onContainerMouseMove( event ) {
		 	obj.mouseX = ( event.clientX - ($("#container").offset().left + 400));
		 	obj.mouseY = ( event.clientY - (300 + 400)) * 0.5;
		 	var vector = new THREE.Vector3(  obj.mouseX, obj.mouseY, 0.5);
		 	obj.mouseP_x = event.clientX - 400;
		 	obj.mouseP_y = event.clientY - 50;
		 	//console.log(obj.mouseX);
	    }

	    function onContainerMouseDown( event ){
	    	var size = State.getInstance()._resolution_x;
	    	event.preventDefault();
	    	obj.vertices = [];
	    	for(var i = 0; i < size + 1; i ++)
	    		for(var j = 0; j < size + 1; j++)
	    			obj.vertices.push(obj.get2dPoint(j, i));	

	    	State.getInstance().clickSimulate({x: event.pageX - $("#container").offset().left , y: event.pageY - $("#container").offset().top}, obj.vertices);
	    }
	},

	switchNext : function(size){	
 	},

 	switchPrev : function(size){
 	},

	get2dPoint : function(x, y){
		var obj = this;
		var width = 800, height = 600;
		var size = State.getInstance()._resolution_x;
		var length = State.getInstance()._width / size;
        var widthHalf = width / 2, heightHalf = height / 2;
        var projector = new THREE.Projector();
        var vector3 = new THREE.Vector3(obj.mesh.matrixWorld.getPosition().clone().x + (-200 + length * x),
          								obj.mesh.matrixWorld.getPosition().clone().y + (200 - length * y),
          								obj.mesh.matrixWorld.getPosition().clone().z);
        var vector = projector.projectVector(vector3, obj.camera );
        vector.x = ( vector.x * widthHalf ) + widthHalf;
        vector.y = - ( vector.y * heightHalf ) + heightHalf;
          //console.log("vectorx_:" + (obj.mouseP_x - 400) + " vectory_:" + (obj.mouseP_y - 50));
          //console.log("vectorx:" + vector.x + " vectory:" + vector.y);
        return vector;
	},

	animate : function () {
 	 	window.requestAnimationFrame(inner);
 	 	var obj = this;
 	 	function inner(){
 	 		obj.animate();
 	 	}
 	  	this.render();	
	},

	render : function() {

		this.camera.position.x += ( this.mouseX - this.camera.position.x ) * 0.4;
		this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * 0.4;
		//console.log({x:this.camera.position.x, y:this.camera.position.y});
		this.camera.lookAt( this.scene.position );
		if ( this.video.readyState === this.video.HAVE_ENOUGH_DATA ) {
			this.imageContext.clearRect(0, 0, 400, 400);
			this.imageContext.drawImage( this.videocanvas, 0, 0 );

			this.previewContext.clearRect(0, 0, 200, 200);
			this.previewContext.drawImage( this.video, 500, 100, 400, 400, 0, 0, 200, 200);

			if ( this.texture ) this.texture.needsUpdate = true;
			if ( this.textureReflection ) this.textureReflection.needsUpdate = true;
			if ( this.texturePreview ) this.texturePreview.needsUpdate = true;
			if ( this.textureText ) this.textureText.needsUpdate = true;
			if ( this.textureMsg ) this.textureMsg.needsUpdate = true;

		}

		this.imageReflectionContext.clearRect(0, 0, 400, 400);
		this.imageReflectionContext.drawImage( this.image, 0, 0 );
		this.imageReflectionContext.fillStyle = this.imageReflectionGradient;
		this.imageReflectionContext.fillRect( 0, 0, 400, 400 );

		if(this.textcanvas){
			this.textContext.clearRect(0, 0, 200, 200);
			this.textContext.drawImage(this.textcanvas, 0, 0, 200, 100, 0, 0, 200, 100);
			this.msgContext.clearRect(0, 0, 400, 300);
			this.msgContext.drawImage(this.textcanvas, 200, 0, 400, 300, 0, 0, 400, 300);
		}else{
			this.textcanvas = $("#textcanvas canvas")[0];
		}

		this.renderer.render( this.scene, this.camera );
	},
});

 /* Static method; can be used to get the instance of this class*/
 Puzzle.getInstance = function(){
 	if(!this._instance)
 		this._instance =  new Puzzle();
 	return this._instance;
 };
