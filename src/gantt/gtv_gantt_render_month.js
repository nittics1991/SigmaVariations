/**
*	render(month)
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
Sigma.Gantt.RenderMonth = function(chart){
	Sigma.Gantt.RenderBase.call(this, chart);
};
Object.setPrototypeOf(Sigma.Gantt.RenderMonth, Sigma.Gantt.RenderBase);
Sigma.Gantt.RenderMonth.prototype = Object.create(Sigma.Gantt.RenderBase.prototype);
Sigma.Gantt.RenderMonth.prototype.constructor = Sigma.Gantt.RenderMonth;

/**
*	計算(左位置)
*
*	@param Sigma.Gantt.Data
*	@return int
**/
Sigma.Gantt.RenderMonth.prototype.calcLeft = function(data) {
	var start = Sigma.Date(data.start, data.format);
	return parseInt(start.date() / start.daysInMonth() * this._colObj.width);
}

/**
*	計算(幅)
*
*	@param Sigma.Gantt.Data
*	@return int
**/
Sigma.Gantt.RenderMonth.prototype.calcWidth = function(data) {
	var start = Sigma.Date(data.start, data.format);
	var end = Sigma.Date(data.end, data.format);
	
	var ymS = start.format('YYYYMM');
	var ymE = end.format('YYYYMM');
	
	var posS = this.calcLeft(data);
	var posE = parseInt(end.date() / end.daysInMonth() * this._colObj.width);
	
	if (ymS == ymE) {
		return posE - posS;
	}
	
	var start1 = start.startOf('month');
	var end1 = end.startOf('month');
	var diffM = end1.diff(start1, 'months');
	
	return posE +
		this._colObj.width - posS +
		(diffM - 1) * this._colObj.width +
		diffM * 1;
}
