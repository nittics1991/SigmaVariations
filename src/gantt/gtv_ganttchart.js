/**
*	ガントチャート
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
* 	@param Sigma.Gantt.Factory
**/
Sigma.Gantt.GanttChart = function(factory){
	this.factory = factory;
	
	this.originalOption = null;
	this.gridOption = null;
	this.sigmaDsOption = null;
	this.dataCollection = null;
	this.chart = null;
	this.render = null;
	this.sigmaColOption = null;
	this.grid = null;
	this.pline = null;
	this.setupedToolbar = false;
};

/**
*	作成
*
* 	@visibility public
*	@param object
**/
Sigma.Gantt.GanttChart.prototype.build = function(gridOption) {
	try {
		this.originalOption = gridOption;
		this.gridOption = Sigma.$clone(gridOption);
		
		this.sigmaDsOption = this.factory.get(
			'SigmaDsOption',
			this.gridOption.dataset
		);
		
		this._doBuild();
	} catch (e) {
		console.error(e);
		alert("failure");
	}
};

/**
*	_doBuild
*
**/
Sigma.Gantt.GanttChart.prototype._doBuild = function() {
	try {
		this.sigmaDsOption.loadDataset(
			this,
			this.gridOption.loadURL,
			{},
			this.loadCallback,
			function(message) {
				throw new Sigma.Gantt.Error.LoadFailure('url=' + this.gridOption.loadURL);
			}
		);
	} catch (e) {
		console.error(e);
		alert("failure");
	}
};

/**
*	loadCallback
*
* 	@visibility public
*	@param Sigma.Gantt.DataCollection
**/
Sigma.Gantt.GanttChart.prototype.loadCallback = function(dataCollection) {
	try {
		this.dataCollection = dataCollection;
		
		this.chart = this.factory.get(
			'Chart',
			this.gridOption.gantt
		);
	
		this.dataCollection.buildDataset(this.chart);

		this.render = this.factory.get(
			'Render',
			this.chart
		);
		
		this.sigmaColOption = this.factory.get(
			'SigmaColOption',
			this.render,
			this.gridOption.columns,
			this.sigmaDsOption.ganttFieldName()
		);

		this.sigmaColOption.buildColumns(this.chart);
		
		this.gridOption.dataset.data = this.dataCollection.toSigmaObject();
		this.gridOption.columns = this.sigmaColOption.toSigmaObject();
		this.gridOption.afterRender = this._chartEvent();
		this.gridOption.loadURL = null;
		
		this._setToolbar();
		
		this.grid = new Sigma.Grid(this.gridOption);
		
		if (this.originalOption.loadURL) {
			window.addEventListener('load', this.grid.render());
		} else {
			Sigma.Util.onLoad(Sigma.Grid.render(this.grid));
		}
	} catch (e) {
		console.error(e);
		alert("failure");
	}
};

/**
*	イベント設定
*
**/
Sigma.Gantt.GanttChart.prototype._chartEvent = function() {
	var _this = this;
	
	var isChartObject = function(elm) {
		return ['gtv-gantt-bar', 'gtv-gantt-stone', 'gtv-gantt-performed'].some(function(val) {
			return Sigma.U.hasClass(elm, val);
		});
	};
	
	return function(grid) {
		Sigma.U.addEvent(grid.gridDiv, 'click', function(event) {
			if (typeof _this.chart.eventClick != 'function') {
				return;
			}
			
			if (!isChartObject(event.target)) {
				return;
			}
			var targetObjectInfo = grid.getEventTargets(event);
			
			_this.chart.eventClick.call(
				event,
				targetObjectInfo.value,
				targetObjectInfo.record,
				targetObjectInfo.cell,
				targetObjectInfo.row,
				targetObjectInfo.colNo,
				targetObjectInfo.column,
				grid
			);
		});
		
		Sigma.U.addEvent(grid.gridDiv, 'mouseover', function(event) {
			if (typeof _this.chart.eventMouseover != 'function') {
				return;
			}
			
			if (!isChartObject(event.target)) {
				return;
			}
			var targetObjectInfo = grid.getEventTargets(event);
			
			_this.chart.eventMouseover.call(
				event,
				targetObjectInfo.value,
				targetObjectInfo.record,
				targetObjectInfo.cell,
				targetObjectInfo.row,
				targetObjectInfo.colNo,
				targetObjectInfo.column,
				grid
			);
		});
		
		Sigma.U.addEvent(grid.gridDiv, 'mouseout', function(event) {
			if (typeof _this.chart.eventMouseout != 'function') {
				return;
			}
			
			if (!isChartObject(event.target)) {
				return;
			}
			var targetObjectInfo = grid.getEventTargets(event);
			
			_this.chart.eventMouseout.call(
				event,
				targetObjectInfo.value,
				targetObjectInfo.record,
				targetObjectInfo.cell,
				targetObjectInfo.row,
				targetObjectInfo.colNo,
				targetObjectInfo.column,
				grid
			);
		});
	};
};

/**
*	リロード
*
* 	@visibility public
**/
Sigma.Gantt.GanttChart.prototype.reload = function() {
	if (this.grid) {
		document.getElementById(this.grid.gridDiv.id)
			.insertAdjacentHTML(
				'beforebegin',
				'<div id="' + this.gridOption.container + '"></div>'
			);
		this.grid.destroy();
		this.pline = null;
		
		this.gridOption.dataset.data = Sigma.$clone(this.originalOption.dataset.data);
		this.gridOption.columns = Sigma.$clone(this.originalOption.columns);
		this.gridOption.pageSize = this.originalOption.pageSize;
		this._doBuild();
		var render = Sigma.Grid.render(this.grid);
		render();
	}
};

/**
*	type:day表示
*
* 	@visibility public
**/
Sigma.Gantt.GanttChart.prototype.changeDay = function() {
	this.gridOption.gantt.type = 'day';
	this.reload();
};

/**
*	type:week表示
*
* 	@visibility public
**/
Sigma.Gantt.GanttChart.prototype.changeWeek = function() {
	this.gridOption.gantt.type = 'week';
	this.reload();
};

/**
*	type:month表示
*
* 	@visibility public
**/
Sigma.Gantt.GanttChart.prototype.changeMonth = function() {
	this.gridOption.gantt.type = 'month';
	this.reload();
};

/**
*	イナズマ線表示切り替え
*
* 	@visibility public
* 	@param Sigma.Grid
**/
Sigma.Gantt.GanttChart.prototype.togglePline = function(grid) {
	if (this.pline == null) {
		this.pline = new Sigma.Gantt.Pline(this);
		this.pline.drow(grid);
		return;
	}
	this.pline.toggle(grid);
};

/**
*	ダイアログ
*
* 	@visibility public
**/
Sigma.Gantt.GanttChart.prototype.showDialog = function(grid) {
	this.dialog =
		this.dialog ||
		Sigma.Gantt.PlineDialog.create(grid);
	
	if (this.dialog) {
		this.dialog.show();
	}
};

/**
*	ツールバー
*
**/
Sigma.Gantt.GanttChart.prototype._setToolbar = function() {
	if (this.setupedToolbar) {
		return;
	}
	var _this = this;
	
	Sigma.ToolFactroy.register(
		'ganttday',
		{
			cls:'ganttday-cls',
			tooltip:'',
			action:function(event, grid) {
				_this.changeDay();
			}
		}
	);
	
	Sigma.ToolFactroy.register(
		'ganttweek',
		{
			cls:'ganttweek-cls',
			tooltip:'',
			action:function(event, grid) {
				_this.changeWeek();
			}
		}
	);
	
	Sigma.ToolFactroy.register(
		'ganttmonth',
		{
			cls:'ganttmonth-cls',
			tooltip:'',
			action:function(event, grid) {
				_this.changeMonth();
			}
		}
	);
	
	Sigma.ToolFactroy.register(
		'ganttreload',
		{
			cls:'ganttreload-cls',
			tooltip:'',
			action:function(event, grid) {
				_this.reload();
			}
		}
	);
	
	Sigma.ToolFactroy.register(
		'ganttpline',
		{
			cls:'ganttpline-cls',
			tooltip:'',
			action:function(event, grid) {
				_this.togglePline(grid);
			}
		}
	);
	
	Sigma.ToolFactroy.register(
		'ganttplinedialog',
		{
			cls:'ganttplinedialog-cls',
			tooltip:'',
			action:function(event, grid) {
				_this.showDialog(grid);
			}
		}
	);
	
	this.setupedToolbar = true;
};
