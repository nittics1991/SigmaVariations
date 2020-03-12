/**
*	sigmagrid columns buildedColumns collection
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
* 	@param Sigma.Gantt.Render
*	@param array
* 	@param string
**/
Sigma.Gantt.SigmaColOption = function (render, colOption, ganttField) {
	this.render = render;
	this.colOption = colOption;
	this.ganttField = ganttField;
	this.buildedColumns = [];
	this._today = null;
	
	if (!this.isValid()) {
		throw new Sigma.Gantt.Error.InvalidArgument(
			"not define gantt data."
		);
	}
};

/**
*	バリデート
*
* 	@visibility public
* 	@return bool
**/
Sigma.Gantt.SigmaColOption.prototype.isValid = function() {
	var _this = this;
	return this.colOption.some(function(obj) {
		return obj.id == _this.ganttField;
	});
};

/**
*	オブジェクト化
*
* 	@visibility public
* 	@return object
**/
Sigma.Gantt.SigmaColOption.prototype.toSigmaObject = function() {
	return Sigma.$clone(this.buildedColumns);
};

/**
*	chart columns構築
*
* 	@visibility public
* 	@param Sigma.Gantt.Chart
* 	@return this
**/
Sigma.Gantt.SigmaColOption.prototype.buildColumns = function(chart) {
	if (this.buildedColumns.length > 0) {
		return this;
	}
	
	var isPline = false;
		
	for (var i=0; i<this.colOption.length; i++) {
		if (this.colOption[i]['id'] == this.ganttField) {
			
			if (!isPline) {
				this.buildedColumns.push(
					this._plineColumn(chart)
				);
				isPline = true;
			}
			
			this.buildedColumns = this.buildedColumns.concat(
				this._buildChartColumns(chart, this.colOption[i])
			);
		} else {
			this.buildedColumns.push(this.colOption[i]);
		}
	}
	return this;
};

/**
*	pline column追加
*
* 	@param Sigma.gantt.Chart
* 	@return object
**/
Sigma.Gantt.SigmaColOption.prototype._plineColumn = function(chart) {
	return {
		id:'pline',
		header:' ',
		width:5,
		resizable:false,
		sortable:false,
		filterable:false,
		freezeable:false,
		moveable:false,
		renderer:function(value, record, colObj, grid, colNo, rowNo) {
			return '';
		},
	};
}

/**
*	chart columns構築
*
* 	@param Sigma.Gantt.Chart
* 	@param Sigma.Column
* 	@return array
**/
Sigma.Gantt.SigmaColOption.prototype._buildChartColumns = function(chart, colObj) {
	var start = chart.getChartStart();
	var chartColumns = [];
	var column, date, rederer;
	
	for (var i=0; i<chart.getColumnCount(); i++) {
		column = Sigma.$clone(colObj);
		column.id = this.ganttField + '_' + i;
		
		if (chart.type == 'month') {
			date = start.clone().add(i, 'months');
		} else if (chart.type == 'week') {
			date = start.clone().add(i*7, 'days');
		} else {
			date = start.clone().add(i, 'days');
			
			if (date.day() == 0) {
				column.headerStyle = 'gtv-gantt-sunday';
			}
		}
		
		if (this._isToday(chart, date)) {
			column.headerStyle = 'gtv-gantt-today';
		}
		
		column.header = chart.toDateFormat(date);
		userRender = (colObj.renderer)? colObj.renderer:null;
		var _render = this.render;
		
		column.renderer = function(value, record, colObj, grid, colNo, rowNo) {
			var element = _render.render(value, record, colObj, grid, colNo, rowNo, this);
			if (userRender) {
				return userRender.call(this, value, record, colObj, grid, colNo, rowNo);
			}
			return element || '';
		};
		chartColumns.push(column);
	}
	return chartColumns;
};

/**
*	本日カラム判定
*
* 	@param Sigma.Gantt.Chart
* 	@param Sigma.Date
* 	@return bool
**/
Sigma.Gantt.SigmaColOption.prototype._isToday = function(chart, date) {
	if (!this._today) {
		this._today = new Sigma.Date().startOf(chart.type);
	}
	return this._today.isSame(date, chart.type);
};
