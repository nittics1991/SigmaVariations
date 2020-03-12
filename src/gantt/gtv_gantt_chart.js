/**
*	ガントチャート設定
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
*			type:string day|week|month
*			startDate:string ISO8601
*			endDate:string ISO8601
*			headerFormatDay ISO8601+α (@seeSigma.Date)
*			headerFormatWeek ISO8601+α (@seeSigma.Date)
*			headerFormatMonth ISO8601+α (@seeSigma.Date)
*			maxColumnCount int
* 			progressLineColor:string|null #xxxxxx
*			eventClick:callbacl|null fn(eventObj, cellObj, record, cellElm, rowElm, colNo, columnObj, grid) //this=event
*			eventMouseover:callbacl|null fn(eventObj, cellObj, record, cellElm, rowElm, colNo, columnObj, grid) //this=event
*			eventMouseout:callbacl|null fn(eventObj, cellObj, record, cellElm, rowElm, colNo, columnObj, grid) //this=event
*			
**/
Sigma.Gantt.Chart = function(chartOption){
	this.type = 'day';
	this.startDate = null;
	this.endDate = null;
	this.headerFormatDay = 'YYYY-MM-DD';
	this.headerFormatWeek = 'YYYY-MM-B';
	this.headerFormatMonth = 'YYYY-MM';
	this.maxColumnCount = 36;
	this.progressLineColor = '#ff0000';
	this.eventClick = null;
	this.eventMouseover = null;
	this.eventMouseout = null;
	
	this._chartStart = null
	this._chartEnd = null
	this._chartMaxEnd = null
	
	chartOption = chartOption || {};
	this._init(chartOption);
};

/**
*	chartOption初期化
*
* 	@param object
* 	@throws Sigma.Gantt.Error.InvalidArgument
**/
Sigma.Gantt.Chart.prototype._init = function(chartOption) {
	if (chartOption.type) {
		if (['day','week','month'].indexOf(chartOption.type) == -1) {
			throw new Sigma.Gantt.Error.InvalidArgument(
				'type require day,week,month:' + chartOption.type
			);
		}
		this.type = chartOption.type;
	}
	
	if (chartOption.startDate) {
		this.startDate = Sigma.Date(chartOption.startDate);
		if (!this.startDate.isValid()) {
			throw new Sigma.Gantt.Error.InvalidArgument(
				'startDate invalid'
			);
		}
	}
	
	if (chartOption.endDate) {
		this.endDate = Sigma.Date(chartOption.endDate);
		if (!this.endDate.isValid()) {
			throw new Sigma.Gantt.Error.InvalidArgument(
				'endDate invalid'
			);
		}
	}
	
	if (chartOption.headerFormatDay) {
		this.headerFormatDay = chartOption.headerFormatDay;
	}
	
	if (chartOption.headerFormatWeek) {
		this.headerFormatWeek = chartOption.headerFormatWeek;
	}
	
	if (chartOption.headerFormatMonth) {
		this.headerFormatMonth = chartOption.headerFormatMonth;
	}
	
	if (chartOption.maxColumnCount) {
		if (!isFinite(chartOption.maxColumnCount) ||
			parseInt(chartOption.maxColumnCount) !== chartOption.maxColumnCount ||
			chartOption.maxColumnCount <= 0
		) {
			throw new Sigma.Gantt.Error.InvalidArgument(
				'maxColumnCount require int'
			);
		}
		this.maxColumnCount = chartOption.maxColumnCount;
	}
	
	if (this.progressLineColor && this.progressLineColor.match(/#([0-9a-fA-F]){6}/) == null) {
		return false;
	}
	
	if (typeof chartOption.eventClick == 'function') {
		this.eventClick = chartOption.eventClick;
	}
	
	if (typeof chartOption.eventMouseover == 'function') {
		this.eventMouseover = chartOption.eventMouseover;
	}
	
	if (typeof chartOption.eventMouseout == 'function') {
		this.eventMouseout = chartOption.eventMouseout;
	}
};

/**
*	オブジェクト化
*
* 	@visibility public
* 	@return object
**/
Sigma.Gantt.Chart.prototype.toObject = function() {
	return {
		type:this.type,
		startDate:(this.startDate)? this.startDate.format('YYYY-MM-DD'):null,
		endDate:(this.endDate)? this.endDate.format('YYYY-MM-DD'):null,
		headerFormatDay:this.headerFormatDay,
		headerFormatWeek:this.headerFormatWeek,
		headerFormatMonth:this.headerFormatMonth,
		maxColumnCount:this.maxColumnCount,
		progressLineColor:this.progressLineColor,
		eventClick:this.eventClick,
		eventMouseover:this.eventMouseover,
		eventMouseout:this.eventMouseout,
	};
};

/**
*	日付フォーマット
*
* 	@visibility public
* 	@param string
**/
Sigma.Gantt.Chart.prototype.toDateFormat = function(date) {
	switch (this.type) {
		case 'day':
			return this._toDayFormat(date);
		case 'week':
			return this._toWeekFormat(date);
		case 'month':
			return this._toMonthFormat(date);
	}
};

/**
*	type:dayの日付フォーマット
*
* 	@param object
**/
Sigma.Gantt.Chart.prototype._toDayFormat = function(date) {
	return Sigma.Date(date).format(this.headerFormatDay);
};

/**
*	type:weekの日付フォーマット
*
* 	@param object
**/
Sigma.Gantt.Chart.prototype._toWeekFormat = function(date) {
	return Sigma.Date(date).exFormat(this.headerFormatWeek);
};

/**
*	type:monthの日付フォーマット
*
* 	@param object
**/
Sigma.Gantt.Chart.prototype._toMonthFormat = function(date) {
	return Sigma.Date(date).format(this.headerFormatMonth);
};

/**
*	チャート開始日
*
* 	@param Sigma.Gantt.DataCollection
* 	@return Date
**/
Sigma.Gantt.Chart.prototype.getChartStart = function(dataCollection) {
	if (this._chartStart) {
		return this._chartStart;
	}
	
	this._chartStart = (this.startDate)?
		new Sigma.Date(this.startDate):
		new Sigma.Date(dataCollection.getMinStart());
	return this._chartStart;
};

/**
*	チャート終了日
*
* 	@param Sigma.Gantt.DataCollection
* 	@return Date
**/
Sigma.Gantt.Chart.prototype.getChartEnd = function(dataCollection) {
	if (this._chartEnd) {
		return this._chartEnd;
	}
	
	var max = this.getMaxChartEnd(dataCollection);
	
	if (this.endDate) {
		this._chartEnd = (this.endDate.valueOf() <= max.valueOf())?
			this.endDate:max;
	} else {
		this._chartEnd = (dataCollection.getMaxEnd().valueOf() <= max.valueOf())?
			dataCollection.getMaxEnd():max;
	}
	return this._chartEnd;
};

/**
*	最大チャート終了日
*
* 	@param Sigma.Gantt.DataCollection
* 	@return Date
**/
Sigma.Gantt.Chart.prototype.getMaxChartEnd = function(dataCollection) {
	if (this._chartEnd) {
		return this._chartMaxEnd;
	}
	
	var start = new Sigma.Date(this.getChartStart(dataCollection));
	
	if (this.type == 'month') {
		this._chartMaxEnd = start.add(this.maxColumnCount-1, 'months');
	} else if (this.type == 'week') {
		this._chartMaxEnd = start.add((this.maxColumnCount -1) * 7, 'days');
	} else {
		this._chartMaxEnd = start.add(this.maxColumnCount-1, 'days');
	}
	return this._chartMaxEnd;
};

/**
*	カラム数取得
*
* 	@return int
**/
Sigma.Gantt.Chart.prototype.getColumnCount = function() {
	if (this.startDate == null || this.endDate == null) {
		return this.maxColumnCount;
	}
	
	if (this._chartStart && this._chartEnd) {
		var start = this._chartStart;
		var end = this._chartEnd;
	} else {
		var start = this.startDate;
		var end = this.endDate;
	}
	
	if (this.type == 'month') {
		var type = 'months';
	} else if (this.type == 'week') {
		var type = 'weeks';
	} else {
		var type = 'days';
	}
	return end.diff(start, type) + 1;
};
