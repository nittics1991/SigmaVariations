/**
*	factory
**/
if (!window.Sigma) {
  window.Sigma = {};
}

if (!Sigma.Gantt) {
  Sigma.Gantt = {};
}

/**
*
**/
Sigma.Gantt.Factory = {
	/**
	*	生成
	*
	* 	@return object
	**/
	get:function() {
		var args = Array.prototype.slice.call(arguments, 0);
		var id = args.shift();
		
		return this['_' + id.toLowerCase()].apply(this, args);
	},
	
	/**
	*	Chart
	*
	* 	@return object
	**/
	_chart:function(chartOption) {
		return new Sigma.Gantt.Chart(chartOption);
	},
	
	/**
	*	Request
	*
	* 	@return object
	**/
	_request:function() {
		return new Sigma.Gantt.Request();
	},
	
	/**
	*	Render
	*
	* 	@return Sigma.Gantt.Chart
	**/
	_render:function(chart) {
		if (chart.type == 'day') {
			return new Sigma.Gantt.RenderDay(chart);
		}
		if (chart.type == 'week') {
			return new Sigma.Gantt.RenderWeek(chart);
		}
		if (chart.type == 'month') {
			return new Sigma.Gantt.RenderMonth(chart);
		}
		throw new Sigma.Gantt.Error.InvalidArgument(
			'type require day,week,month:' + chart.type
		);
	},
	
	/**
	*	SigmaColOption
	*
	* 	@return object
	**/
	_sigmacoloption:function(render, colOption, ganttField) {
		return new Sigma.Gantt.SigmaColOption(
			render,
			colOption,
			ganttField
		);
	},
	
	/**
	*	SigmaDsOption
	*
	* 	@return object
	**/
	_sigmadsoption:function(dsOption) {
		return new Sigma.Gantt.SigmaDsOption(
			Sigma.Gantt.Factory.get('Request'),
			dsOption
		);
	},
};
