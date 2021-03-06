;(function(win){
	'use strict';
	
	//删除class
	function removeClass(el, className){
		if (el.classList){
  			el.classList.remove(className);
  		}else{
  			el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
  	}
	
	//添加class
	function addClass(el, className){
		if (el.classList){
			el.classList.add(className);
		}else{
			el.className += ' ' + className;
		}
	}
	
	//是否存在class
	function hasClass(el, className){
		if (el.classList){
  			return el.classList.contains(className);
		}else{
  			return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
		}
	}
	
	function Slider(options){
		if(!(this instanceof Slider)){
			return new Slider(options);
		}
		this.elem = document.querySelector(options.elem);
		this.list = this.elem.querySelectorAll('.list li');
		this.ind = this.elem.querySelectorAll('.ind li');
		this.total = this.list.length;
		this.currIndex = options.curr || 1;
		this.prevIndex = 1;
		this.width = options.width || 500;
		this.height = options.height || 300;
		this.duration = options.duration || 300;
		this.isPlaying = false;
		
		this.init();
	}
	
	Slider.prototype = {
		construtor: Slider,
		init: function(){
			this.renderSlider();
			this.bindEvent();
		},
		renderSlider: function(type){
			var _this = this,
				currElem = null,
				prevElem = null,
				currInd = null,
				prevInd = null,
				prevClass = type == 'next' ? 'prev' : 'next';
			
			_this.isPlaying = true;
			
			currElem = Array.prototype.filter.call(_this.list, function(item, index){
				return index == _this.currIndex - 1;
			})[0];
			
			prevElem = Array.prototype.filter.call(_this.list, function(item, index){
				return index == _this.prevIndex - 1 && _this.currIndex != _this.prevIndex;
			})[0];
			
			currInd = Array.prototype.filter.call(_this.ind, function(item, index){
				return index == _this.currIndex - 1;
			})[0];
			
			prevInd = Array.prototype.filter.call(_this.ind, function(item, index){
				return index == _this.prevIndex - 1 && _this.currIndex != _this.prevIndex;
			})[0];
			
			if(type){
				addClass(currElem, type);
				addClass(currElem, 'show');
				setTimeout(function(){
					addClass(currElem, 'transition');
					addClass(prevElem, 'transition');
					addClass(prevElem, prevClass);
					removeClass(currElem, type);
				}, 50);
			}
			
			setTimeout(function(){
				removeClass(currElem, 'show');
				removeClass(currElem, 'transition');
				addClass(currElem, 'active');
				prevElem && removeClass(prevElem, prevClass);
				prevElem && removeClass(prevElem, 'transition');
				prevElem && removeClass(prevElem, 'active');
				currInd && addClass(currInd, 'active');
				prevInd && removeClass(prevInd, 'active');
				_this.isPlaying = false;
			}, _this.currIndex - _this.prevIndex == 0 ? 0 : _this.duration);
		},
		prev: function(){
			if(this.isPlaying){ return }
			this.prevIndex = this.currIndex;
			this.currIndex = this.currIndex == 1 ? this.total : this.currIndex-1;
			this.renderSlider('prev');
		},
		next: function(){
			if(this.isPlaying){ return }
			this.prevIndex = this.currIndex;
			this.currIndex = this.currIndex == this.total ? 1 : this.currIndex+1;
			this.renderSlider('next');
		},
		jump: function(i){
			if(this.isPlaying){ return }
			this.prevIndex = this.currIndex;
			this.currIndex = i;
			this.renderSlider(this.currIndex - this.prevIndex > 0 ? 'next' : 'prev');
		},
		bindEvent: function(){
			var prev = this.elem.querySelector('.prev'),
				next = this.elem.querySelector('.next'),
				_this = this;
				
			prev && prev.addEventListener('click', function(e){
				_this.prev();
			});
			
			next && next.addEventListener('click', function(e){
				_this.next();
			});
			
			Array.prototype.forEach.call(_this.ind, function(item, index){
				item.addEventListener('click', function(){
					if(hasClass(item, 'active')){
						return
					}
					_this.jump(index + 1);
				});
			});
		}
	}
	
	win.Slider = Slider;
	
})(window);
