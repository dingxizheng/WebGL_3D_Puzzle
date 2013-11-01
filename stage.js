/**
 *@Author Xizheng Ding (Eric)
 */

/**
 * This is piece of code was inpired by 
 * @ http://lab.aerotwist.com/webgl/surface/
 */

 var State = Class.extend({
 	//unique instancce
 	_instance : null,
 	//stage
 	_stage : null,
 	//vide
 	_video : null,
 	//videocanvas
 	_videocanvas : null, 
 	//videocanvas context
 	_videocanvas_ctx : null,
 	//layer
 	_layer : null,
 	//stageContainner 
 	_stageContainner : "puzzle",
 	//stageContainner id
 	_stageContainnerid : "#puzzle",

 	//box vars
 	_resolution_x : 4,
 	_resolution_y : 4,
 	_margin : 2,

 	//stage width
 	_width : 400,
 	//stage height
 	_height : 400,
 	//boxes
 	_boxes : [],
 	_indexes : [],

 	_timeboard : null,
 	_msgboard : null,

 	_se : null,
 	_time : {m : 0, s : 0, ms: 0, ss : 0},

 	_win_msg : '\nYOU WIN\nCLICK TO PLAY AGAIN',
 	_lose_msg : '\nTIME IS OUT\nCLICK TO TRY AGAIN',
 	_playing_msg : '\nPLAYING... \n\n',

 	_playing : false,

 	init : function(){
 		if(!this._instance){
 			this.setUpStage();
 			console.log("setup");
 		}else{
 			console.log("none setup");
 		}
 	},	

 	setUpStage : function(){
 		//get video content
 		this._video = document.getElementById("video");
 		console.log(this._video.currentTime);
 		//get video canvas context
 		this._videocanvas = document.getElementById("videocanvas");	
 		this._videocanvas_ctx = this._videocanvas.getContext('2d');

 		this._stage = new Kinetic.Stage({
        	container: 'textcanvas',
        	width: 600,
        	height: 300
      	});

      	this._layer = new Kinetic.Layer();

      	this._timeboard = new Kinetic.Text({
        	x: 0,
        	y: 0,
        	text: '00:00:00',
        	fontSize: 50,
        	fontFamily: 'Calibri',
        	fill: '#555'
      	});

      	this._msgboard = new Kinetic.Text({
        	x: 200,
        	y: 0,
        	text: 'VIDEO PUZZLE\nBY XIZHENG DING @ LAKEHEAD\nCLICK TO START',
        	fontSize: 35,
        	fontFamily: 'Calibri',
        	fill: "#555",
        	width: 400,
        	padding: 25,
        	align: 'center'
      	});

      	this._layer.add(this._timeboard);
      	this._layer.add(this._msgboard);
      	this._stage.add(this._layer);

      	this.bindSwitch();
 	},

 	reset : function(){
 		this._playing = false;
 		clearInterval(this._se);
 		if(this._boxes.length < 10)
 			this.initBoxes();
 		else
 			this.goback();
 		var obj = this;
 		$("#video").bind("ended", function(){
 			$("#video").unbind("ended");
 			obj.reset();
 			obj.setMsg(obj._lose_msg);
 		});
 		$("#video").bind("loadeddata", function() {
    		this.currentTime = 5;
    		this.pause();
		});
 	},

 	/**
 	 * switch from easy, normal and crazy!!!
 	 */
 	bindSwitch : function(){
 		var obj = this;
 		$(document).bind("keydown", function(e){
 			if(!obj._playing)
 				if(e.keyCode == 37){
 					if(obj._resolution_x > 3)
 					{
 						obj._boxes = [];
 						obj._resolution_x --;
 						obj._resolution_y = obj._resolution_x;
 						obj.reset();
 					}
 				}
 				else if(e.keyCode == 39){
 					if(obj._resolution_x < 5){
 						obj._boxes = [];
 						obj._resolution_x ++;
 						obj._resolution_y = obj._resolution_x;
 						obj.reset();
 					}
 				}
 		});
 	},



 	play : function(){
 		$("#video")[0].play();
 		this._playing = true;
 		this.setMsg(this._playing_msg);
 		this.initBoxes();
 		this.timerRun();
 		for(var i = 0; i < this._boxes.length; i++){
 			this._boxes[i].setInOrder(i);
 			this._indexes[i] = i;
 		}
 	},

 	timerRun : function(){
 		var obj = this;
 		this._time.m = 0;
 		this._time.s = 0;
 		this._time.ms = 0;
 		this._time.ss = 0;
 		this._se = setInterval(run,5);
        function run(){
        	obj._time.ms += 5;
 			if((obj._time.ms % 100) == 0){
 				obj._time.s += 1;
 				obj._time.ms = 0;
 			} 
			if(obj._time.s>0 && (obj._time.s%60)==0){
				obj._time.m += 1;
				obj._time.s = 0;
			} 
		}
 	},

 	/**
 	 * set msg to the stage
 	 */
 	setMsg : function(msg){
 		this._msgboard.setAttrs({"text" : msg});
 	},


 	/**
 	 * set up timer
 	 */
 	setTime : function(){
 		var time = this._time.m < 10 ? "0"+this._time.m : this._time.m;
 			time +=  ":";
 			time +=  this._time.s < 10 ? "0"+this._time.s : this._time.s;
 			time +=  ":" + this._time.ms;
 	    this._timeboard.setAttrs({"text" : time});
 	},

 	/**
 	 * is win
	 */
 	isWin : function(){
 		var i = this._boxes.length;
 		while(i--)
 			if(this._boxes[i]._position_x != this._boxes[i]._dest_position_x 
 				|| this._boxes[i]._position_y != this._boxes[i]._dest_position_y)
 				return false;
 		this.reset();
 		this.setMsg(this._win_msg);
 		return true;
 	},

 	/*
 	 * simulate click from the 3d stage
 	 */
 	clickSimulate : function(mouse, vertices){
 		if(!this._playing){
 			this.play();
 			return;
 		}
 		for(var i = 0; i < this._boxes.length; i++)
 			if(this._boxes[this._indexes[i]].isclick(mouse, vertices)){
 				console.log(i);
 				this._boxes[this._indexes[i]].onclick(i);
 				this.isWin();
 				break;
 			}
 	},

 	goback : function(){
 		for(var i = 0; i < this._boxes.length; i++)
 			this._boxes[i].setDestPosition(this._boxes[i]._position_x, this._boxes[i]._position_y);
 	},

 	/*
 	 * init boxes
 	 */
 	initBoxes : function(){
 		this._boxes = [];
 		this._indexes = [];
 		// //console.log("params");
 		for(var i = 0; i < this._resolution_x; i ++){
 			for(var j = 0; j < this._resolution_y; j ++){
 				//create a new box
 				var _box = new Box({
 					"_resolution_y" : this._resolution_x,
 					"_resolution_x" : this._resolution_y,
 					"_margin" : this._margin,
 					"_position_x" : j,
 					"_position_y" : i,
 				});	
 				this._boxes.push(_box);
 				this._indexes.push(this._boxes.length - 1);
 			}
 		}
 		this.sortBoxes();
 	},

 	/*
 	* sort boxes randomly
 	*/
 	sortBoxes : function(){
       for(var i = 0; i < this._boxes.length; i ++){
       	   var index = 0 + Math.floor(Math.random() * (this._boxes.length + 1));
       	   this._boxes.splice(index,0,this._boxes[0]);
       	   this._boxes.shift();
       }

       for(var i = 0; i < this._boxes.length; i++){
 			//this._boxes[i].setInOrder(i);
 			console.log(this._indexes[i]);
 			this._indexes[i] = i;
 		}
 		while(!this.isSolvable())
 			this.sortBoxes();
 	},

 	isSolvable : function() {
			var result = 0;
			for(var i = 0; i < this._boxes.length ; i ++){
				for(var j = 0; j < this._boxes.length; j ++){
					if((this._boxes[i]._position_y * this._resolution_x + this._boxes[i]._position_x) 
						- (this._boxes[j]._position_y * this._resolution_y + this._boxes[j]._position_x) > 0 )
						result ++;
				}
			}
			if(result%2 != 0)
				return false;
			else
				return true;
	},

 	/**
 	 * sort method
 	 */
 	randomSort : function(a, b){
		var tmp = Math.random();
		if(tmp  < 0.5) tmp = 0;
		else tmp = 1;
		return tmp ? a - b : b - a;
 	},

 	animate : function () {
 	 	window.requestAnimationFrame(inner);
 	 	var obj = this;
 	 	function inner(){
 	 		obj.animate();
 	 	}

 	  	this.render();	
	},

 	/**
 	 * render the canvas and its adding boxes
 	 */
 	render : function(){
 		//this._videocanvas_ctx.drawImage( this._video, (this._video.width - 400) / 2, 0 );
 		this._videocanvas_ctx.clearRect(0, 0, 400, 400);
 		for(var i = 0; i < this._boxes.length; i++)
 			this._boxes[i].draw();
 		this.setTime();
 		this.layerUpdate();
 	},

 	layerUpdate : function(){
 		this._layer.draw();
 	},	

 	/*
 	 * add img to the stage
 	 */
 	addImage : function(image){
 		this._layer.add(image);
 		//this.layerUpdate();
 	},
 });

 /* Static method; can be used to get the instance of this class*/
 State.getInstance = function(){
 	if(!this._instance)
 		this._instance =  new State();
 	return this._instance;
 };
