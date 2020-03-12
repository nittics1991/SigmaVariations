/**
*	dantt data collection
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
*	@param array
*	@param string
*	@param string
*		[
*			{
*				no:1,
*				user:'yamada',
*				section:'design-1',
*				startDay:'2018-01-23',
*				endDay:'2018-02-01',
*				task:'model design'
* 					//chart data
*				chart:[
*					{
*						id:1
*						start:'{startDay}',	//{field} do replaced
*						end:'{endDay}',		
*					},
*					{
*						id:21
*						start:'2018-02-01',
*						end:'2018-02-01',
*						type:'stone',
*					},
*				],
*				comment:'MVCC pattern',
*			},
*		]
**/
Sigma.Gantt.DataCollection = function(ar, ganttField){
	this.container = [];
	this.minStart = null;
	this.maxEnd = null;
	this.buildedDataset = [];
	this.ganttField = ganttField;

	this._init(ar);
};

/**
*	初期化
*
* 	@param array
**/
Sigma.Gantt.DataCollection.prototype._init = function(ar) {
	var ganttField = this.ganttField;
	var min = new Sigma.Date('2100-01-01').valueOf();
	var max = new Sigma.Date('1970-01-01').valueOf();
	
	if (!Sigma.U.isArray(ar)) {
		throw new Sigma.Gantt.Error.InvalidArgument(
			"dataset type must be array."
		);
	}
	
	this.container = ar.map(function(rowData, index) {
		var _min = min;
		var _max = max;
		
		if (typeof rowData != 'object') {
			throw new Sigma.Gantt.Error.InvalidArgument(
				"data type must be object. row=" + index
			);
		}
		
		var result = Sigma.$clone(rowData);
		
		if (!rowData[ganttField]) {
			return result;
		}
		
		if (!Sigma.U.isArray(rowData[ganttField])) {
			throw new Sigma.Gantt.Error.InvalidArgument(
				"chart data invalid. row=" + index
			);
		}
		
		result[ganttField] =
			rowData[ganttField].map(function(obj, index2) {
			
			Object.keys(obj).forEach(function(key) {
				if (typeof obj[key] == 'string' &&
					obj[key].match(/^{.+}$/) != null
				) {
					var fieldName = obj[key].replace(/({|})/g, '');
					obj[key] = rowData[fieldName];
				}
			});
			
			var data = new Sigma.Gantt.Data(obj);
			if (! data.isValid()) {
				throw new Sigma.Gantt.Error.InvalidArgument(
					"chart data invalid. row=" + index +
						"data no=" + index2
				);
			}
			
			if (_min > data.start.valueOf()) {
				_min = data.start.valueOf();
			}
			
			if (_max < data.end.valueOf()) {
				_max = data.end.valueOf();
			}
			return data;
		});
		
		if (min > _min) {
			min = _min;
		}
		
		if (max < _max) {
			max = _max;
		}
		return result;
	});
	
	this.minStart = new Sigma.Date(min);
	this.maxEnd = new Sigma.Date(max);
};

/**
*	イテレータ
*
* 	@visibility public
* 	@return array
**/
Sigma.Gantt.DataCollection.prototype.toArray = function() {
	var ganttField = this.ganttField;
	
	return this.container.map(function(ar) {
		ar[ganttField] = ar[ganttField].map(function(obj) {
			return obj.toObject();
		});
		return ar;
	});
};

/**
*	最小開始日
*
* 	@visibility public
* 	@return Sigma.Date
**/
Sigma.Gantt.DataCollection.prototype.getMinStart = function() {
	return this.minStart;
};

/**
*	最大終了日
*
* 	@visibility public
* 	@return Sigma.Date
**/
Sigma.Gantt.DataCollection.prototype.getMaxEnd = function() {
	return this.maxEnd;
};

/**
*	buildedDataset構築
*
* 	@visibility public
* 	@param Sigma.Gantt.Chart
* 	@return this
**/
Sigma.Gantt.DataCollection.prototype.buildDataset = function(chart) {
	if (this.buildedDataset.length > 0) {
		return this;
	}
	this.buildedDataset = this.toArray();
	
	var minDate = chart.getChartStart(this);
	var maxDate = chart.getChartEnd(this);
	
	var minTime = chart.getChartStart(this).valueOf();
	var maxTime = chart.getChartEnd(this).valueOf();
	
	var data, obj,start,startDate, end, endDate, columnNo;
	
	for (var i=0; i<this.buildedDataset.length; i++) {
		data = this.buildedDataset[i][this.ganttField];
		
		for (var j=0; j<data.length; j++) {
			obj = data[j];
			
			//adjust end date
			end = obj.end.valueOf();
			endDate = new Sigma.Date(end);
			
			if (endDate < minDate) {
				if (obj.type == 'stone') {
					continue;
				}
				end = minTime;
				obj.end = minDate.format(obj.format);
			}
			if (endDate > maxDate) {
				if (obj.type == 'stone') {
					continue;
				}
				end = maxTime;
				obj.end = maxDate.format(obj.format);
			}
			
			//start date position
			start = obj.start.valueOf();
			startDate = new Sigma.Date(start);
			
			if (startDate < minDate) {
				if (obj.type == 'stone') {
					continue;
				}
				start = minTime;
				obj.start = minDate.format(obj.format);
			}
			if (startDate > maxDate) {
				if (obj.type == 'stone') {
					continue;
				}
				start = maxTime;
				obj.start = maxDate.format(obj.format);
			}
			
			//adjust start date
			columnNo = this.calPosition(chart, minDate, start);
			if (columnNo < 0) continue;
			
			fieldName = this.ganttField + '_' + columnNo;
			
			if (!this.buildedDataset[i][fieldName]) {
				this.buildedDataset[i][fieldName] = [];
			}
			this.buildedDataset[i][fieldName].push(obj);
			
			//pline data
			this._setPlineData(i, columnNo, obj);
		}
	}
	return this;
};

/**
*	イナズマ線データ設定
*
* 	@param int
* 	@param int
* 	@param Sigma.Gantt.Data
**/
Sigma.Gantt.DataCollection.prototype._setPlineData = function(row, column, data) {
	this.buildedDataset[0]['pline'] = this.buildedDataset[0]['pline'] || [];
	this.buildedDataset[0]['pline'][row] = this.buildedDataset[0]['pline'][row] || [];
	this.buildedDataset[0]['pline'][row]['chart_' + column] = data.pline;
};

/**
*	移動先データカラム番号計算
*
*	@param Sigma.Gantt.Chart
* 	@param int
* 	@param int
* 	@return int
**/
Sigma.Gantt.DataCollection.prototype.calPosition = function(chart, baseDate, date) {
	if (chart.type == 'month') {
		return this._calPositionMonth(baseDate, date);
	}
	if (chart.type == 'week') {
		return this._calPositionWeek(baseDate, date);
	}
	return this._calPositionDay(baseDate, date);
};

/**
*	移動先データカラム番号(月表示)
*
* 	@param int
* 	@param int
* 	@return int
**/
Sigma.Gantt.DataCollection.prototype._calPositionMonth = function(baseDate, date) {
	var d1 = Sigma.Date(date).startOf('month');
	var d2 = Sigma.Date(baseDate).startOf('month');
	return d1.diff(d2, 'months');
};

/**
*	移動先データカラム番号(週表示)
*
* 	@param int
* 	@param int
* 	@return int
**/
Sigma.Gantt.DataCollection.prototype._calPositionWeek = function(baseDate, date) {
	var d1 = Sigma.Date(date).startOf('week');
	var d2 = Sigma.Date(baseDate).startOf('week');
	return d1.diff(d2, 'weeks');
};

/**
*	移動先データカラム番号(日表示)
*
* 	@param int
* 	@param int
* 	@return int
**/
Sigma.Gantt.DataCollection.prototype._calPositionDay = function(baseDate, date) {
	var d1 = Sigma.Date(date);
	var d2 = Sigma.Date(baseDate);
	return d1.diff(d2, 'days');
};

/**
*	オブジェクト化
*
* 	@visibility public
* 	@return object
**/
Sigma.Gantt.DataCollection.prototype.toSigmaObject = function() {
	return Sigma.$clone(this.buildedDataset);
};
