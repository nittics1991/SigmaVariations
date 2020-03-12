/**
*	render(day)
**/
if (!window.Sigma) {
  window.Sigma = {};
}

if (!Sigma.Gantt) {
  Sigma.Gantt = {};
}

/**
*	{inherit}
*
**/
Sigma.Gantt.RenderDay = function(chart){
	Sigma.Gantt.RenderBase.call(this, chart);
};
Object.setPrototypeOf(Sigma.Gantt.RenderDay, Sigma.Gantt.RenderBase);
Sigma.Gantt.RenderDay.prototype = Object.create(Sigma.Gantt.RenderBase.prototype);
Sigma.Gantt.RenderDay.prototype.constructor = Sigma.Gantt.RenderDay;

/**
*	計算(左位置)
*
*	@param Sigma.Gantt.Data
*	@return int
**/
Sigma.Gantt.RenderDay.prototype.calcLeft = function(data) {
	return 0;
}

/**
*	計算(幅)
*
*	@param Sigma.Gantt.Data
*	@return int
**/
Sigma.Gantt.RenderDay.prototype.calcWidth = function(data) {
	var start = Sigma.Date(data.start, data.format);
	var end = Sigma.Date(data.end, data.format);
	var diff = end.diff(start, 'days');
	return parseInt((diff + 1) * this._colObj.width + diff *1);
}
