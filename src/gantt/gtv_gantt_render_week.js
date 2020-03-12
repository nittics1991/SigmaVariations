/**
*	render(week)
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
Sigma.Gantt.RenderWeek = function(chart){
	Sigma.Gantt.RenderBase.call(this, chart);
};
Object.setPrototypeOf(Sigma.Gantt.RenderWeek, Sigma.Gantt.RenderBase);
Sigma.Gantt.RenderWeek.prototype = Object.create(Sigma.Gantt.RenderBase.prototype);
Sigma.Gantt.RenderWeek.prototype.constructor = Sigma.Gantt.RenderWeek;

/**
*	計算(左位置)
*
*	@param Sigma.Gantt.Data
*	@return int
**/
Sigma.Gantt.RenderWeek.prototype.calcLeft = function(data) {
	var start = Sigma.Date(data.start, data.format);
	return parseInt((start.day() + 1) / 7 * this._colObj.width);
}

/**
*	計算(幅)
*
*	@param Sigma.Gantt.Data
*	@return int
**/
Sigma.Gantt.RenderWeek.prototype.calcWidth = function(data) {
	var start = Sigma.Date(data.start, data.format);
	var end = Sigma.Date(data.end, data.format);
	
	var weekS = start.week();
	var weekE = end.week();
	
	var posS = this.calcLeft(data);
	var posE = parseInt((end.day() + 1) / 7 * this._colObj.width);
	
	if (weekS == weekE) {
		return posE - posS;
	}
	
	var diffW = weekE - weekS - 1;
	if (diffW < 0) {
		diffW = 0;
	}
	
	return posE +
		this._colObj.width - posS +
		diffW * this._colObj.width +
		(diffW + 1) * 1;
}
