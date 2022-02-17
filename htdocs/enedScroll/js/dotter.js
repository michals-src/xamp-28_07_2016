(function( root, factory ){

	if( typeof define === 'function' && define.amd ){
		define( factory );
	}else if( typeof exports === 'commonJS' ){
		module.exports = factory();
	}else{
		root.dotter = factory( root.jQuery );
	}

})(this, function( $ ){

	var dotter = function( canvas ){

		this.element = canvas;

		

		this.colors = ['#93cedb', '#8ab8a4', '#7f9595', '#addcf0'];
		this.minSpeed = .05;
		this.maxSpeed = 1;

		this.minR = 5;
		this.maxR = 20;

		this.numDots = 45;

		this.canvas = document.getElementById( $( this.element ).attr('id') );
		this.ctx = this.canvas.getContext('2d');

		this.dots = [];

		$( this.element ).attr( 'width', $(document).width() );
		$( this.element ).attr( 'height', $(window).height() );

	}

	dotter.prototype._random = function(min,max){
		return Math.random() * (max - min) + min;
	}

	dotter.prototype.get = function(){
		this.create();
		this.move();
	}

	dotter.prototype.create = function(){

		for( var i = 0; i < this.numDots; i++ ){

			this.dots[i] = {
				x: this._random( 0, this.canvas.width ),
				y: this._random( 0, this.canvas.height ),
				speedx: this._random( this.minSpeed, this.maxSpeed ),
				speedy: this._random( this.minSpeed, this.maxSpeed ),
				radius: this._random( this.minR, this.maxR ),
				color: this.colors[ Math.floor( this._random(0, (this.colors.length - 1) ) ) ],
				opacity: this._random( 0.3, 1)
			};

		};

		this.render();

	}

	dotter.prototype.render = function(){

		for( key in this.dots ){

			this.ctx.beginPath();
			this.ctx.arc( this.dots[key].x, this.dots[key].y, this.dots[key].radius, 0, Math.PI * 2, false );
			this.ctx.globalAlpha = this.dots[key].opacity;
			this.ctx.fillStyle = this.dots[key].color;
			this.ctx.fill();

		}

	}

	dotter.prototype.move = function(){

		var self = this, ctx = this.ctx;

		setInterval(function(){

			ctx.clearRect(0,0, self.canvas.width, self.canvas.height );

			for( var a = 0; a < self.numDots; a++ ){

				self.dots[a].x += self.dots[a].speedx;
				self.dots[a].y -= self.dots[a].speedy;

				if( self.dots[a].x > ( self.canvas.width + self.dots[a].radius ) || self.dots[a].y > ( self.canvas.height + self.dots[a].radius ) ){

					var bone = self._random(0,1);

					if( bone > .5 ){
						self.dots[a].x = -self.dots[a].radius;
						self.dots[a].y = self._random(0, self.canvas.height);
					}else{
						self.dots[a].x = self._random(0, self.canvas.width);
						self.dots[a].y = self.canvas.height + self.dots[a].radius;
					}

				}

				self.render();

			}


		}, 1000 / 60);

	}

	return dotter;

});