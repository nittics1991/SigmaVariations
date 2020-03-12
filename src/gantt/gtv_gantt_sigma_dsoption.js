/**
*	sigmagrid dataset dsOption
*
*	dsOption = {
*		fields:[
*			{name:'id'},
*			{name:'money', type:'int'},
*			{name:'chart', type:'gantt'},	//chart data type
*			{name:'comment'},
*		],	
*		recordType:'object',	//must be 'object'
* 		data:[...],	//dsOptional parameter
*	}
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
*	@param Sigma.Gantt.Request
* 	@param object
* 	@throws Sigma.Gantt.Error.InvalidArgument
**/
Sigma.Gantt.SigmaDsOption = function (sigmaGanttRequest, dsOption) {
	this.sigmaGanttRequest = sigmaGanttRequest;
	this.dsOption = Sigma.$clone(dsOption) || {};
	this.ganttField = null;
	
	if (!this.isValid()) {
		throw new Sigma.Gantt.Error.InvalidArgument(
			'invalid parameter'
		);
	}
};

/**
*	バリデート
*
* 	@visibility public
* 	@return bool
**/
Sigma.Gantt.SigmaDsOption.prototype.isValid = function() {
	if (!this.dsOption.recordType || this.dsOption.recordType != 'object') {
		return false;
	}
	
	if (!this.dsOption.fields || !Sigma.U.isArray(this.dsOption.fields)) {
		return false;
	}
	
	return this.dsOption.fields.every(function(obj) {
		if (typeof obj != 'object') {
			return false;
		}
		return !!obj.name;
	});
};

/**
*	オブジェクト化
*
* 	@visibility public
* 	@return object
**/
Sigma.Gantt.SigmaDsOption.prototype.toSigmaObject = function() {
	return Sigma.$clone(this.dsOption);
};

/**
*	type:ganttフィールド名取得
*
* 	@visibility public
*	@return Sigma.Date
*	@throw
**/
Sigma.Gantt.SigmaDsOption.prototype.ganttFieldName = function() {
	if (this.ganttField != null) {
		return this.ganttField;
	}
	
	var field = null;
	this.dsOption.fields.some(function(obj) {
		if (obj.type == 'gantt') {
			field = obj.name;
			return true;
		}
	});
	
	if (field == null) {
		throw new Sigma.Gantt.Error.InvalidArgument(
			"not found gantt field"
		);
	}
	return this.ganttField = field;
};

/**
*	データセット読み込み
*
* 	@visibility public
* 	@param string
* 	@param object
* 	@param callback fn(Sigma.Gantt.DataCollection dataCollection)
* 	@param callback fn(text message)
*	@throw
**/
Sigma.Gantt.SigmaDsOption.prototype.loadDataset = function(chart, url, params, success, failure) {
	if (this.dsOption.data) {
		return success.call(
			chart,
			new Sigma.Gantt.DataCollection(this.dsOption.data, this.ganttFieldName())
		);
	}
	
	var _this = this;
	var fn = function(responce) {
		var _chart = chart;
		_this.dsOption.data = responce['data'];
		return success.call(
			_chart,
			new Sigma.Gantt.DataCollection(_this.dsOption.data, _this.ganttFieldName())
		);
	}
	this.sigmaGanttRequest.load(url, params, fn, failure);
};
