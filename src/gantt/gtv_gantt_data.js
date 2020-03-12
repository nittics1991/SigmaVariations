/**
*	dantt data
**/
if (!window.Sigma) {
  window.Sigma = {};
}

if (!Sigma.Gantt) {
  Sigma.Gantt = {};
}

/**
*	construct
*
* 	@visibility public
*	@param object
*			id:string|int
*			start:string
*			end:string|null
*			type:string|null|'bar'|'stone'
*			progress:int|null 0-100
*			format:string|null ISO8601 format
*			text:string|null
*			className:string|null
*			textColor:string|null #xxxxxx
*			borderColor:string|null #xxxxxx
*			backgroundColor:string|null #xxxxxx
*			progressColor:string|null #xxxxxx	//bar
* 			performedColor:string|null #xxxxxx	//stone
*			pline:object key:ISO8601 date format value:progress {"18-03-04":20, "18-03-04":90}
**/
Sigma.Gantt.Data = function(data){
	this.id = null;
	this.start = null;
	this.end = null;
	this.type = 'bar';
	this.progress = 0;
	this.format = 'YYYY-MM-DD';
	this.text = null;
	this.className = null;
	this.textColor = null;
	this.borderColor = null;
	this.backgroundColor = null;
	this.progressColor = null;
	this.performedColor = null;
	this.pline = {};
	
	var _data = data || {};
	this._init(_data);
};

/**
*	初期化
*
* 	@param object
**/
Sigma.Gantt.Data.prototype._init = function(data) {
	if (data.id) {
		this.id = data.id;
	}
	
	if (data.format) {
		this.format = data.format;
	}
	
	if (data.start) {
		this.start = Sigma.Date(data.start, this.format);
	}
	
	if (data.end) {
		this.end = Sigma.Date(data.end, this.format);
	}
	
	if (data.type) {
		this.type = data.type;
	}
	
	if (data.progress) {
		this.progress = data.progress;
	}
	
	if (data.text) {
		this.text = data.text;
	}
	
	if (data.className) {
		this.className = data.className;
	}
	
	if (data.textColor) {
		this.textColor = data.textColor;
	}
	
	if (data.borderColor) {
		this.borderColor = data.borderColor;
	}
	
	if (data.backgroundColor) {
		this.backgroundColor = data.backgroundColor;
	}
	
	if (data.progressColor) {
		this.progressColor = data.progressColor;
	}
	
	if (data.performedColor) {
		this.performedColor = data.performedColor;
	}
	
	if (data.pline) {
		this.pline = data.pline;
	}
};

/**
*	バリデート
*
* 	@visibility public
* 	@return bool
**/
Sigma.Gantt.Data.prototype.isValid = function() {
	if (! this.id) {
		return false;
	}
	
	if (! this.start || !this.start.isValid()) {
		return false;
	}
	
	if (! this.end || !this.end.isValid()) {
		return false;
	}
	
	if (! isFinite(this.progress) ||
		parseInt(this.progress) !== this.progress
	) {
		return false;
	}
	
	if (this.progress < 0 || this.progress > 100) {
		return false;
	}
	
	if (['bar', 'stone'].indexOf(this.type) == -1) {
		return false;
	}
	
	if (this.textColor && this.textColor.match(/#([0-9a-fA-F]){6}/) == null) {
		return false;
	}
	
	if (this.borderColor && this.borderColor.match(/#([0-9a-fA-F]){6}/) == null) {
		return false;
	}
	
	if (this.backgroundColor && this.backgroundColor.match(/#([0-9a-fA-F]){6}/) == null) {
		return false;
	}
	
	if (this.progressColor && this.progressColor.match(/#([0-9a-fA-F]){6}/) == null) {
		return false;
	}
	
	if (this.performedColor && this.performedColor.match(/#([0-9a-fA-F]){6}/) == null) {
		return false;
	}
	
	var _pline = this.pline;
	if (Object.keys(this.pline).length > 0) {
		if (!Object.keys(_pline).every(function(name) {
				if (name.match(/^\d{4}-\d{2}-\d{2}$/) == null) {
					return false;
				}
				return isFinite(_pline[name]);
			})
		) {
			return false;
		}
	}
	
	return true;
};

/**
*	オブジェクト化
*
* 	@visibility public
* 	@return object
**/
Sigma.Gantt.Data.prototype.toObject = function() {
	return {
		id:this.id,
		start:(this.start)? this.start.format(this.format):null,
		end:(this.end)? this.end.format(this.format):null,
		type:this.type,
		progress:this.progress,
		format:this.format,
		text:this.text,
		className:this.className,
		textColor:this.textColor,
		borderColor:this.borderColor,
		backgroundColor:this.backgroundColor,
		progressColor:this.progressColor,
		pline:this.pline,
	};
};
