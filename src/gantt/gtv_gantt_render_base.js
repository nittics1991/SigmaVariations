/**
*	チャート描画
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
*	@param Sigma.Gantt.Chart
**/
Sigma.Gantt.RenderBase = function(chart){
	this.chart = chart;
	this._dataset = null;
	this._record = null;
	this._colObj = null;
	this._grid = null;
	this._colNo = null;
	this._rowNo = null;
	this._sigmaColOption = null;
	this.rowHeight = 22;
	this.stoneSize= 16;
};

/**
*	描画
*
* 	@visibility public
* 	@param array
* 	@param array
* 	@param Sigma.Column
* 	@param Sigma.Grid
* 	@param int
* 	@param int
* 	@param Sigma.Gantt.ColOption
**/
Sigma.Gantt.RenderBase.prototype.render = function(
	dataset,
	record,
	colObj,
	grid,
	colNo,
	rowNo,
	sigmaColOption
) {
	this._dataset = dataset;
	this._record = record;
	this._colObj = colObj;
	this._grid = grid;
	this._colNo = colNo;
	this._rowNo = rowNo;
	this._sigmaColOption = sigmaColOption;
	
	if (!dataset || !Sigma.U.isArray(dataset) || dataset == []) {
		return;
	}
	var html = '<div style="position:relative;">';
	
	return html + Array.prototype.map.call(dataset, function(data, index, dataset) {
		if (data.type == 'stone') {
			return this._buildShapeStone.call(this, data);
		}
		return this._buildShapeBar.call(this, data);
	},this).join('') + '</div>';
};

/**
*	bar描画
*
*	@param Sigma.Gantt.Data
**/
Sigma.Gantt.RenderBase.prototype._buildShapeBar = function(data) {
	var left = this.calcLeft.call(this, data);
	var width = this.calcWidth.call(this, data);
	
	var id = 'gtv_gantt_' + this._grid.id + '_' + data.id;
	var classs = 'gtv-gantt-bar';
	classs += (this.chart.className)? ' '+this.chart.className:'';
	var text = (data.text)? data.text:'';
	var textColor = (data.textColor)?
		' color:' + data.textColor + ';':'';
	var borderColor = (data.borderColor)?
		' border-color:' + data.borderColor + ';':'';
	var backgroundColor = (data.backgroundColor)?
		' background-color:' + data.backgroundColor + ';':'';
	
	var html = '';
	html += '<div id="' + id + '" class="' + classs + '" style="width:' + width + 'px; left:' + left + 'px;';
	html += textColor + borderColor + backgroundColor + '">';
	html += text;
	html += '</div>';
	
	html += this._buildShapeProgress(data, left, width);
	return html;
};

/**
*	progressBar描画
*
*	@param Sigma.Gantt.Data
* 	@param float
**/
Sigma.Gantt.RenderBase.prototype._buildShapeProgress = function(data, left, width) {
	var w = (data.progress)? this.calcProgressLeft(data.progress, width):0;
	
	var id = 'gtv_gantt_' + this._grid.id + '_' + data.id + '_progress';
	var progressColor = (data.progressColor)?
		' background-color:' + data.progressColor + ';':'';
	
	var html = '';
	html += '<div id="' + id + '" class="gtv-gantt-progress" style="width:' + w + 'px; left:' + left + 'px;';
	html += progressColor + '">';
	html += '</div>';
	
	return html;
};

/**
*	stone描画
*
*	@param Sigma.Gantt.Data
**/
Sigma.Gantt.RenderBase.prototype._buildShapeStone = function(data) {
	var left = this.calcLeft.call(this, data) - (this.stoneSize/2) ;
	
	var id = 'gtv_gantt_' + this._grid.id + '_' + data.id;
	var classs = (data.progress && data.progress > 0)?
		'gtv-gantt-performed':'gtv-gantt-stone';
	classs += (this.chart.className)? ' '+this.chart.className:'';
	var text = (data.text)? data.text:'';
	var textColor = (data.textColor)?
		' color:' + data.textColor + ';':'';
	var borderColor = (data.borderColor)?
		' border-color:' + data.borderColor + ';':'';
		
	if (data.progress && data.progress > 0) {
		var backgroundColor = (data.performedColor)?
			' background-color:' + data.performedColor + ';':'';
	} else {
		var backgroundColor = (data.backgroundColor)?
			' background-color:' + data.backgroundColor + ';':'';
	}
	
	var html = '';
	html += '<div id="' + id + '" class="' + classs + '" style="width:' + this.stoneSize + 'px; left:' + left + 'px;';
	html += textColor + borderColor + backgroundColor + '">';
	html += text;
	html += '</div>';
	
	return html;
};

/**
*	計算(左位置)
*
* 	@visibility public
*	@param Sigma.Gantt.Data
*	@return int
**/
Sigma.Gantt.RenderBase.prototype.calcLeft = function(data) {
	return 0;
};

/**
*	計算(幅)
*
* 	@visibility public
*	@param Sigma.Gantt.Data
*	@return int
**/
Sigma.Gantt.RenderBase.prototype.calcWidth = function(data) {
	return 0;
};

/**
*	計算(実績左位置)
*
* 	@visibility public
*	@param Sigma.Gantt.Data
* 	@param int
*	@return int
**/
Sigma.Gantt.RenderBase.prototype.calcProgressLeft = function(progress, width) {
	return parseInt(width * progress / 100);
};
