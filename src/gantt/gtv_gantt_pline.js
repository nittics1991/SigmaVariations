/**
*	performance line
*
* 	savedata = {data:{
* 		inserted:{date1:{id1:progress1, ...}, ...},
* 		deleted:[date1, ...]
* 	}}
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
**/
Sigma.Gantt.Pline = function(gantt){
	this.gantt = gantt;
	this.isShowed = false;
	
	this._canvasWidth = null;
	this._canvasHeight = null;
	this._columnWidth = null;
	this._canvasLeft = null;
	this._columnCount = null;
	this._columnPositions = {};
	this.updateData = {};
};

/**
*	描画
*
* 	@visibility public
* 	@param Sigma.Grid
* 	@return this
**/
Sigma.Gantt.Pline.prototype.drow = function(grid) {
	this._appendCanvas(grid);
	this._drowPline(grid);
	this.isShowed = true;
	return this;
};

/**
*	表示ON/OFF
*
* 	@visibility public
* 	@param Sigma.Grid
* 	@return this
**/
Sigma.Gantt.Pline.prototype.toggle = function(grid) {
	var elm = document.getElementById(this._getId(grid));
	if (!elm) {
		return this.drow(grid);
	}
	
	if (this.isShowed) {
		elm.style.visibility = 'hidden';
		this.isShowed = false;
	} else {
		elm.style.visibility = 'visible';
		this.isShowed = true;
	}
	return this;
};

/**
*	Canvasリセット
*
* 	@visibility public
* 	@return this
**/
Sigma.Gantt.Pline.prototype.resetCanvas = function(grid) {
	var elm = document.getElementById(this._getId(grid));
	if (elm) {
		elm.parentNode.removeChild(elm);
	}
	this.isShowed = false;
	return this;
};

/**
*	Canvas要素追加
*
* 	@param Sigma.Grid
* 	@return this
**/
Sigma.Gantt.Pline.prototype._appendCanvas = function(grid) {
	var html = '<canvas id="' + this._getId(grid) +
		'" class="gtv-gantt-pline-canvas' +
		'" width="' + this._getCanvasWidth(grid) +
		'px;" height="' + this._getCanvasHeight(grid) +
		'px;" style="left:' + this._getCanvasLeft(grid) +
		'px"></canvas>';
	
	var leftTopElm = document.querySelector(
		'#' + grid.id + '_bodyDiv > table > tbody > tr:first-child > td[class$="-pline"] > div'
	);
	
	if (!leftTopElm) {
		throw '';
	}
	
	leftTopElm.insertAdjacentHTML('beforeend', html);
	return this;
};

/**
*	Canvas ID 取得
*
* 	@param Sigma.Grid
* 	@return string
**/
Sigma.Gantt.Pline.prototype._getId = function(grid) {
	return 'gtv-gantt-' + grid.id + '_canvas';
};

/**
*	Canvas幅取得
*
* 	@param Sigma.Grid
* 	@return int
**/
Sigma.Gantt.Pline.prototype._getCanvasWidth = function(grid) {
	if (this._canvasWidth) {
		return this._canvasWidth;
	}
	
	this._canvasWidth = this._getColumnWidth(grid) * this._calColumnCount(grid);
	return this._canvasWidth;
};

/**
*	カラム幅取得
*
* 	@param Sigma.Grid
* 	@return int
**/
Sigma.Gantt.Pline.prototype._getColumnWidth = function(grid) {
	if (this._columnWidth) {
		return this._columnWidth;
	}
	
	for (var i=0; i<grid.columns.length; i++) {
		if (grid.columns[i].id.match(/^pline$/) == null) {
			continue;
		}
		
		if (!grid.columns[i+1].id || grid.columns[i+1].id.match(/^chart_.+$/) == null) {
			continue;
		}
		
		this._columnWidth = (grid.columns[i+1].width)?
			(grid.columns[i+1].width+1):
			0;
		return this._columnWidth;
	}
	this._columnWidth = 0;
	return this._columnWidth;
};

/**
*	Canvas高さ取得
*
* 	@param Sigma.Grid
* 	@return int
**/
Sigma.Gantt.Pline.prototype._getCanvasHeight = function(grid) {
	if (this._canvasHeight) {
		return this._canvasHeight;
	}
	
	this._canvasHeight = (this.gantt.render.rowHeight+1) * grid.dataset.data.length;
	return this._canvasHeight;
};

/**
*	Canvas左位置
*
* 	@param Sigma.Grid
* 	@return int
**/
Sigma.Gantt.Pline.prototype._getCanvasLeft = function(grid) {
	if (this._canvasLeft) {
		return this._canvasLeft;
	}
	
	this._canvasLeft = (grid.columnMap.pline.width)?
		grid.columnMap.pline.width:
		0;
	return this._canvasLeft;
};

/**
*	chartカラム数算出
*
* 	@param Sigma.Grid
* 	@return int
**/
Sigma.Gantt.Pline.prototype._calColumnCount = function(grid) {
	if (this._columnCount) {
		return this._columnCount;
	}
	
	var count = 0;
	
	Object.keys(grid.columnMap).forEach(function(name) {
		if (name.substr(0, 6) == 'chart_') {
			count++;
		}
	});
	this._columnCount = count;
	return this._columnCount;
};

/**
*	pline描画
*
* 	@param Sigma.Grid
* 	@return string
**/
Sigma.Gantt.Pline.prototype._drowPline = function(grid) {
	var dataset = grid.dataset.data[0].pline || [];
	var leftPosSet = {};
	
	for (var i=0; i<dataset.length; i++) {
		for (var name in dataset[i]) {
			if (Object.keys(dataset[i][name]).length == 0) {
				continue;
			}
			
			for (var dt in dataset[i][name]) {
				if (!leftPosSet[dt]) {
					leftPosSet[dt] = [];
				}
				
				var columnPosition = this._calColumnPosition(name, grid);
				
				leftPosSet[dt].push(
					this._calLineLeftPosition(
						dt,
						grid.dataset.data[i][name][0],
						columnPosition
					)
				);
			}
		}
	}
	
	if (Object.keys(leftPosSet).length == 0) {
		return;
	}
	
	this._render(grid, leftPosSet);
};

/**
*	カラム相対x座標算出
*
* 	@param string
* 	@param Sigma.Grid
* 	@return int
**/
Sigma.Gantt.Pline.prototype._calColumnPosition = function(name, grid) {
	if (this._columnPositions[name]) {
		return this._columnPositions[name];
	}
	
	var columnWidth = this._getColumnWidth(grid);
	var chartColNo = 1 * (name.split('_'))[1] || 0;
	return chartColNo * columnWidth;
};

/**
*	pline線相対x座標算出
*
* 	@param Sigma.Grid
* 	@param int
* 	@return string
**/
Sigma.Gantt.Pline.prototype._calLineLeftPosition = function(id, data, columnPosition) {
	var progress = data['pline'][id];
	
	//開始前or終了済み対策
	var baseDate = new Sigma.Date(id);
	var startDate = new Sigma.Date(data.start, data.format);
	var endDate = new Sigma.Date(data.end, data.format);
	if ((progress == 100 && endDate < baseDate) ||
		(progress == 0 && startDate > baseDate)
	) {
		return -1;
	}
	
	return this.gantt.render.calcProgressLeft(
		progress,
		this.gantt.render.calcWidth(data)
	)
	+ this.gantt.render.calcLeft(data) + columnPosition;
};

/**
*	イナズマ描画
*
* 	@param Sigma.Grid
* 	@param array
**/
Sigma.Gantt.Pline.prototype._render = function(grid, leftPosSet) {
	var startDate = new Sigma.Date(
		this.gantt.chart.getChartStart(this.gantt.dataCollection)
	);
	
	var rowHeight  = this.gantt.render.rowHeight;
	var colWidth = this._getColumnWidth(grid);
	
	var canvas = document.getElementById(
		this._getId(grid)
	);
	
	if (!canvas || !canvas.getContext) {
		return;
	}
	var ctx = canvas.getContext('2d');
	ctx.beginPath();
	ctx.strokeStyle = this.gantt.chart.progressLineColor;
	ctx.lineWidth = 2;
	
	for (id in leftPosSet) {
		var columnNo = this.gantt.dataCollection.calPosition(
			this.gantt.chart,
			startDate,
			id
		);
		
		var left = this.gantt.render.calcLeft({
				start:id,
				format:'YYYY-MM-DD',
		});
		
		var homeX = colWidth * columnNo + left;
		ctx.moveTo(homeX, 0);
		var x, y = 0;
		
		for (var i=0; i<leftPosSet[id].length; i++) {
			y = rowHeight * i;
			ctx.lineTo(homeX, y);
			
			//開始前or終了済み対策
			x = (leftPosSet[id][i] < 0)? homeX:leftPosSet[id][i];
			y = (rowHeight * i) + (rowHeight / 2);
			
			ctx.lineTo(x, y);
		}
		y = rowHeight * i;
		ctx.lineTo(homeX, y);
	}
	
	ctx.stroke();
};

/**
*	イナズマ基準日リスト取得
*
* 	@visibility public
* 	@param Sigma.Grid
* 	@return array
**/
Sigma.Gantt.Pline.prototype.getBseDates = function(grid) {
	var plines = [];
	
	grid.dataset.data.some(function(dataset) {
		var chartColumns = Object.keys(dataset).filter(function(prop) {
			return prop.substr(0, 6) == 'chart_';
		}).map(function(prop) {
			return dataset[prop];
		});
		
		return chartColumns.some(function(ar) {
			return ar.some(function(obj) {
				if (!obj.pline) {
					return false;
				}
				plines = Object.keys(obj.pline);
				return true;
			});
		});
	});
	return plines;
};

/**
*	イナズマ基準日追加
*
* 	@visibility public
* 	@param Sigma.Grid
* 	@param string
**/
Sigma.Gantt.Pline.prototype.attach = function(grid, date) {
	var plines = {};
	
	grid.dataset.data.forEach(function(dataset) {
		var _plines = plines;
		var targetColumnName = null;
		var targetId = null;
		var targetIndex = null;
		var targetProgress = Infinity;
		
		var chartColumnNames = Object.keys(dataset).filter(function(prop) {
			return prop.substr(0, 6) == 'chart_';
		});
		
		for (var i=0; i<chartColumnNames.length; i++) {
			var columnDataset = dataset[chartColumnNames[i]]
			
			for (var j=0; j<columnDataset.length; j++) {
				if (columnDataset[j].progress < targetProgress) {
					targetProgress = columnDataset[j].progress;
					targetId = columnDataset[j].id;
					targetColumnName = chartColumnNames[i];
					targetIndex = j;
				}
			}
		}
		
		dataset[targetColumnName][targetIndex]['pline'][date] = targetProgress;
		plines[targetId] = targetProgress;
	});
	
	if (!this.updateData['inserted']) {
		this.updateData['inserted'] = [];
	}
	this.updateData['inserted'][date] = plines;
	this.resetCanvas(grid);
};

/**
*	イナズマ基準日削除
*
* 	@visibility public
* 	@param Sigma.Grid
* 	@param string
**/
Sigma.Gantt.Pline.prototype.detach = function(grid, date) {
	grid.dataset.data.forEach(function(dataset) {
		var id = date;
		
		Object.keys(dataset).filter(function(prop) {
			return prop.substr(0, 6) == 'chart_';
		}).map(function(prop) {
			return dataset[prop];
		}).forEach(function(ar) {
			var _id = id;
			ar.forEach(function(obj) {
				delete(obj.pline[_id]);
			});
		});
	});
	if (!this.updateData['deleted']) {
		this.updateData['deleted'] = [];
	}
	this.updateData['deleted'].push(date);
	this.resetCanvas(grid);
};

/**
*	イナズマ保存
*
* 	@visibility public
* 	@param Sigma.Grid
* 	@return bool
**/
Sigma.Gantt.Pline.prototype.save = function(grid) {
	if (!this.gantt.savePlineURL) {
		return false;
	}
	
	var request = new XMLHttpRequest();
	request.open('POST', grid.gantt.savePlineURL);
	request.addEventListener("load", function(event) {
		alert(grid.getMsg('TEXT_SUCCESS_PLINE') || 'Success');
	});
	request.addEventListener("error", function(event) {
		alert(grid.getMsg('TEXT_FAILED_PLINE') || 'Failed');
	});
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify({data:this.updateData}));
	return true;
};

/**
*	ダイアログ
*
**/
Sigma.Gantt.PlineDialog = {
	/**
	*	生成
	*
	* 	@visibility public
	* 	@param Sigma.Grid
	* 	@return Sigma.Dialog
	**/
	create:function(grid) {
		var _grid = grid;
		var Pline = new Sigma.Gantt.Pline(grid);
		var dialogId = grid.id + '_Pline';
		
		var outW = 250;
		var outH = 300;
		var inW = outW - 2;
		var inH = outH - 60;
		var listW = inW - 4;
		var listH = inH - 30;
		var inputW = 130;
		
		var closeFn = function(){Sigma.WidgetCache[dialogId].close();};
		
		var saveFn = function(event) {
			var message = event.target.childNodes[0].textContent || 'Save';
			if (!confirm(message + '?')) {
				return;
			}
			
			var _Pline = Pline;
			if (!_Pline.save(_grid)) {
				alert(grid.getMsg('TEXT_FAILED_PLINE') || 'Failed!!!!');
			}
		};
		
		var addFn = function() {
			var _Pline = Pline;
			var id = document.querySelector(
				'#' + dialogId + '_input input[type="date"]'
			);
			
			if (id == null ||
				id.value.trim().length == 0 ||
				! id.validity.valid
			) {
				return;
			}
			_Pline.attach(_grid, id.value);
			viewList();
		};
		
		var delFn = function(event) {
			var message = event.target.childNodes[0].textContent || 'Del';
			if (!confirm(message + '?')) {
				return;
			}
			
			var _Pline = Pline;
			_Pline.detach(_grid, event.target.value);
			viewList();
		};
		
		var viewList = function() {
			var parent = Sigma.$(dialogId + '_lists');
			while (parent.firstChild) parent.removeChild(parent.firstChild);
			
			var _Pline = Pline;
			var baseDates = Pline.getBseDates(_grid);
			
			var list = baseDates.reverse().map(function(id, index, ar){
				return Sigma.Template.expand('\
					<ol style="list-style:none; margin:0; padding:0; width:100%; display:flex;">\
						<li><button class="gt-input-button" name="del" value="${id}">${btnDel}</button></li>\
						<li style="padding:3px; overflow:hidden; width:${inputW}px;">${id}</li>\
					</ol>\
					',
					{
						inputW:inputW,
						btnDel:grid.getMsg('TEXT_DEL_PLINE') || 'Del',
						id:id,
					}
				);
			})
			.join("");
			
			if (list.length > 0) {
				var div = document.createElement("div");
				div.innerHTML = list;
				parent.appendChild(div);
			}
		};
		
		var dialog = new Sigma.Dialog({
			id:dialogId,
			gridId:grid.id ,
			title:grid.getMsg('DIAG_TITLE_PLINE') || 'Pline',
			width:outW,
			height:outH ,
			buttonLayout:'h',
			body:this._bodyTemplate({
				dialogId:dialogId,
				width:inW,
				height:inH,
				listW:listW,
				listH:listH,
				inputW:inputW,
				today:(new Sigma.Date()).format('YYYY-MM-DD'),
				btnAdd:grid.getMsg('TEXT_ADD_PLINE') || 'Add',
				btnDel:grid.getMsg('TEXT_DEL_PLINE') || 'Del',
			}),
			buttons : [
				{text:grid.getMsg('TEXT_SAVE_PLINE'), onclick:saveFn},
				{text:grid.getMsg('TEXT_CLOSE'), onclick:closeFn},
			],
			afterShow : function(){
				var addBtn = document.querySelector(
					'#' + dialogId + '_input button'
				);
			
				Sigma.U.addEvent(addBtn ,"click", addFn);
				
				var lists = document.querySelector(
					'#' + dialogId + '_lists'
				);
				
				viewList();
				
				Sigma.U.addEvent(lists ,"click", function(event) {
					if (event.target.name == "del") {
						delFn(event);
					} else if (event.target.name == "exec") {
						execFn(event);
					}
				});
			}
		});
		return  dialog;
	},
	
	_bodyTemplate:function(param) {
		var tmp = '\
			<div id="${dialogId}_div" style="display:flex; flex-direction:column; width:${width}px; height:${height}px;">\
				<div id="${dialogId}_lists" style="overflow-y:scroll; padding-left:4px; width:${listW}px; height:${listH}px;">\
				</div>\
				<div id="${dialogId}_input" style="padding-left:4px; width:${listW}px;">\
					<input type="date" name="newName" style="width:${inputW}px;" value="${today}">\
					<button class="gt-input-button">${btnAdd}</button>\
				</div>\
			</div>\
		';
		return Sigma.Template.expand(tmp, param);
	},
};
