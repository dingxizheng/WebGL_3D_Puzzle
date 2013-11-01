/**
 *@Author Xizheng Ding (Eric)
 */

 var Box = Class.extend({
 	//vars
 	_width : 0,
 	_height : 0,
 	_image : null,
 	_img : null,
 	_anim : null,
 	_margin : 2,
 	_position_x : 0, 
 	_position_y : 0,
 	_resolution_x : 0,
 	_resolution_y : 0,
 	_dest_position_x : 0,
 	_dest_position_y : 0,
 	_dest_x : 0,
 	_dest_y : 0,
 	_current_x : 0,
 	_current_y : 0,
 	_videocanvas : null,
 	_videocanvas_ctx : null,
 	_video : null,
 	_running : true,
 	_speed : 4,
 	_isblank : false,

 	/*
 	 * constructor, initailize the class from here...
 	 */
 	init : function(params){

 		this.setUp(params);
 		/* get and set up the video content */
 		this._videocanvas_ctx = State.getInstance()._videocanvas_ctx;
 		this._videocanvas = State.getInstance()._videocanvas;
 		this._video = State.getInstance()._video;
 		this.draw();
 	},

 	setUp : function(params){
 		for(var attr in params)
 			this[attr] = params[attr];
 		this._height = State.getInstance()._height / this._resolution_y - this._margin * 2;
 		this._width = State.getInstance()._width / this._resolution_x - this._margin * 2;
 		this.setPosition(this._position_x, this._position_y);
 		this.setDestPosition(this._position_x, this._position_y);

 		if(this._position_x == this._resolution_x - 1 && this._position_y == this._resolution_y - 1)
 			this._isblank = true;
 	},

 	/**
 	 * binds event listeners to this thisect
 	 */
 	addEventListeners : function(){

 	},

 	/**
 	 * animate from current position to its next position...
 	 */
 	animate : function(){
 		if(Math.abs(this._current_x - this._dest_x) >= 1)
 			this._current_x += (this._dest_x - this._current_x) / this._speed;
 		else{
 			this._current_x = this._dest_x;
 			if(Math.abs(this._current_y - this._dest_y) >= 1)
 				this._current_y += (this._dest_y - this._current_y) / this._speed;
 			else
 				this._current_y = this._dest_y;
 		}
 	},

 	/**
 	 *
 	 */
 	onclick : function(i){
 		var boxes = State.getInstance()._boxes;
 		var indexes = State.getInstance()._indexes;
 		var index = this._dest_position_y * this._resolution_x + this._dest_position_x;
 		var left = this._dest_position_x == 0 ? false : true;
 		var right = this._dest_position_x == this._resolution_x - 1 ? false : true;
 		var top = this._dest_position_y == 0 ? false : true;
 		var bottom = this._dest_position_y == this._resolution_x - 1 ? false : true;

 		var temp = indexes[i]
 		if(top){
 			if(boxes[indexes[index - this._resolution_x]]._isblank){
 				this.switchPosition(boxes[indexes[index - this._resolution_x]]);
 				State.getInstance()._indexes[i] = indexes[index - this._resolution_x];
 				State.getInstance()._indexes[index - this._resolution_x] = temp;
 				return;
 			}
 		}

 		if(bottom){
 			if(boxes[indexes[index + this._resolution_x]]._isblank){
 				this.switchPosition(boxes[indexes[index + this._resolution_x]]);
 				State.getInstance()._indexes[i] = indexes[index + this._resolution_x];
 				State.getInstance()._indexes[index + this._resolution_x] = temp;
 				return;
 			}
 		}

 		if(left){
 			if(boxes[indexes[index - 1]]._isblank){
 				this.switchPosition(boxes[indexes[index - 1]]);
 				State.getInstance()._indexes[i] = indexes[index - 1];
 				State.getInstance()._indexes[index - 1] = temp;
 				return;
 			}
 		}

 		if(right){
 			if(boxes[indexes[index + 1]]._isblank){
 				this.switchPosition(boxes[indexes[index + 1]]);
 				State.getInstance()._indexes[i] = indexes[index + 1];
 				State.getInstance()._indexes[index + 1] = temp;
 				return;
 			}
 		}

 	},

 	/*
 	 * check whether it's clicked
 	 */ 	
 	isclick : function(mouse, vertices){

 		var crossMul = function(v1,v2){
        	return   v1.x*v2.y-v1.y*v2.x;
        }

    	var checkCross = function(p1,p2,p3,p4){
        	var v1={x:p1.x-p3.x,y:p1.y-p3.y},
        	v2={x:p2.x-p3.x,y:p2.y-p3.y},
        	v3={x:p4.x-p3.x,y:p4.y-p3.y},
        	v=crossMul(v1,v3)*crossMul(v2,v3)
        	v1={x:p3.x-p1.x,y:p3.y-p1.y}
        	v2={x:p4.x-p1.x,y:p4.y-p1.y}
        	v3={x:p2.x-p1.x,y:p2.y-p1.y}
        	return (v<=0&&crossMul(v1,v3)*crossMul(v2,v3)<=0)?true:false
    	}

        var  checkPP=function(point, polygon){
        	var p1,p2,p3,p4
        	p1=point
        	p2={x:-100,y:point.y}
        	var count=0

        	for(var i=0;i<polygon.length-1;i++){
           		p3=polygon[i]
            	p4=polygon[i+1]
            	if(checkCross(p1,p2,p3,p4)==true){
                	count++
            	}
        	}
       		p3=polygon[polygon.length-1]
        	p4=polygon[0]
        	if(checkCross(p1,p2,p3,p4)==true){
            	count++
        	}
        //  console.log(count)
        	return (count%2==0)?false:true
    	}

    	var points = [];
    	var pp1 = this._dest_position_y * (this._resolution_x + 1) + this._dest_position_x;
    	var pp2 = this._dest_position_y * (this._resolution_x + 1) + (this._resolution_x + 1) + this._dest_position_x;
    	points.push({x: vertices[pp1].x, y : vertices[pp1].y});
    	points.push({x: vertices[pp2].x, y: vertices[pp2].y});
    	points.push({x: vertices[pp2 + 1].x,y: vertices[pp2 + 1].y});
    	points.push({x: vertices[pp1 + 1].x,y: vertices[pp1 + 1].y});

    	return checkPP({x: mouse.x, y: mouse.y}, points);
 	},

 	/**
 	 * set up position from array order
 	 */
 	setInOrder : function(order){
 		var row = Math.floor(order/ this._resolution_x); 
 		var column = order - row * this._resolution_x;
 		this.setDestPosition(column, row);
 	},

    /*
     * switchPosition with anthor square.
     * @param box, a instance of Box
     */
 	switchPosition : function(box){
 		var x = box._dest_position_x;
 		var y = box._dest_position_y;
 		box.setDestPosition(this._dest_position_x, this._dest_position_y);
 		this.setDestPosition(x, y);
 	},

 	/**
 	 * set up position
 	 */
 	 setPosition : function(x, y){
 	 	this._position_x = x;
 	 	this._position_y = y;
 	 	this._current_x = this._position_x * (this._width + this._margin * 2) + this._margin;
 		this._current_y = this._position_y * (this._height + this._margin * 2) + this._margin;
 	 },

 	/**
 	 * set up the x and y values from its position
 	 */
 	setDestPosition : function(x, y){
 		this._dest_position_x = x;
 		this._dest_position_y = y;
 		this._dest_x = this._dest_position_x * (this._width + this._margin * 2) + this._margin;
 		this._dest_y = this._dest_position_y * (this._height + this._margin * 2) + this._margin;
 	},

 	/**
 	 * Update the box 
 	 * @param attribute, a name of this._image's atrribute
 	 * @param value, value of this attribute
 	 */
 	update : function(attribute, value){
 		var attr = {};
 		attr[attribute] = value;
 		if(this._image)
 			this._image.setAttrs(attr);
 		//console.log({attribute : value});
 	},


 	/**
 	 * create a image thisect
 	 */
 	draw : function(){
 		this.animate();
    	if (this._video.readyState === this._video.HAVE_ENOUGH_DATA) {
    		if(!this._isblank)
    			this._videocanvas_ctx.drawImage(this._video, 
    			                            this._position_x * (this._width + this._margin * 2) + this._margin + 500, 
 			                                this._position_y * (this._height + this._margin * 2) + this._margin + 100,
 			                                this._width, 
 			                                this._height,
    			                            this._current_x, 
 			                                this._current_y,
 			                                this._width, 
 			                                this._height);
    		else{
    			this._videocanvas_ctx.fillStyle = this.getRandomColor();
				this._videocanvas_ctx.fillRect( this._current_x, this._current_y, this._width, this._height );
    		}
    	}
 	},

 	/**
 	 * Create a color value randomly
 	 */
 	getRandomColor : function(){
		var arrHex = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
		var strHex = "#";
		var index;
		for(var i = 0; i < 6; i++) {
			index = Math.round(Math.random() * 15);
			strHex += arrHex[index];
		}
		return strHex;
 	},
 });