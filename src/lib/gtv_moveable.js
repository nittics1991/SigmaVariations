/**
*	Moveable
*       ver1.30.0
**/
if (!window.Sigma) {
  window.Sigma = {};
}

/**
*	construct
*
* @param Element
**/
Sigma.Moveable = {
	/**
	*	設定
	*
	*	@param Element
	**/
	attach:function(targetElement) {
        if (targetElement.getAttribute("draggable")) {
            return;
        }
        
		targetElement.setAttribute("draggable", true);
		Sigma.U.addEvent(targetElement, "dragstart", this._dragStartEvent);
		Sigma.U.addEvent(document.body, "dragenter", this._dragEnterEvent);
		Sigma.U.addEvent(document.body, "dragover", this._dragOverEvent);
		Sigma.U.addEvent(document.body, "drop", this._dropEvent);
	},
	
	_dragStartEvent:function(e) {
		var info = {
			id:e.target.id,
			left:e.target.offsetLeft,
			top:e.target.offsetTop,
			x:e.pageX,
			y:e.pageY,
		};
		e.dataTransfer.setData("text/plain", JSON.stringify(info));
	},
	
	_dragEnterEvent:function(e) {
		e.preventDefault();
	},
	
	_dragOverEvent:function(e) {
		e.dataTransfer.dropEffect="move";
		e.preventDefault();
	},
	
	_dropEvent:function(e) {
		var info = JSON.parse(e.dataTransfer.getData("text/plain"));
		var moveX = parseInt(e.pageX) - parseInt(info.x);
		var moveY = parseInt(e.pageY) - parseInt(info.y);
		
		var target = document.getElementById(info.id);
		var marginLeft = -1 * parseInt(target.style.marginLeft);
		var marginTop = -1 * parseInt(target.style.marginTop);
		var paddingLeft = -1 * parseInt(0+target.style.paddingLeft);
		var paddingTop = -1 * parseInt(0+target.style.paddingTop);
		var offsetLeft = parseInt(0+target.offsetLeft);
		var offsetTop = parseInt(0+target.offsetTop);
		
		target.style.left = offsetLeft + marginLeft + paddingLeft + moveX  + 'px';
		target.style.top = offsetTop + marginTop + paddingTop + moveY + 'px';
		
		e.preventDefault();
	},
};
