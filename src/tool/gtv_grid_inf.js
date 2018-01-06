/**
*	Grid保存
**/
if (!window.Sigma) {
  window.Sigma = {};
}

if (!Sigma.Tool) {
  Sigma.Tool = {};
}

/**
*	construct
*
*	@param object
**/
Sigma.Tool.GridInf = function(grid) {
	this.grid = grid;
	this.id = location.pathname + "_Sigma.Tool.GridInf_" + grid.id;
}

/**
*	保存
*
**/
Sigma.Tool.GridInf.prototype.save = function() {
	var config = {};
	config.filter = this.grid.getFilterInfo();
	config.sort = this.grid.getSortInfo();
	
	config.columns = this.grid.columnList.map(function(colObj) {
		var obj = {};
		obj.id = colObj.id;
		obj.colIndex = colObj.colIndex;
		obj.width = parseInt(colObj.width);
		obj.frozen = colObj.frozen;
		obj.hidden = colObj.hidden;
		return obj;
	});
	
	var storage = new Sigma.LocalStorage();
	storage.set(this.id, JSON.stringify(config));
};

/**
*	適用
*
**/
Sigma.Tool.GridInf.prototype.apply = function() {
	var storage = new Sigma.LocalStorage();
	var config = storage.get(this.id);
	if (config == null) {
		return;
	}
	config = JSON.parse(config);
	var grid = this.grid;
	
	this.grid.columnList.forEach(function(colObj, idx) {
		var _grid = grid;
		config.columns.forEach(function(obj) {
			var __grid = _grid;
			if (colObj.id == obj.id) {
				if (parseInt(colObj.width) != obj.width) {
					colObj.setWidth(obj.width);
				}
				
				if (colObj.frozen != obj.frozen) {
					if (obj.width) {
						colObj.freeze();
					} else{
						colObj.unfreeze();
					}
				}
				
				if (colObj.hidden != obj.hidden) {
					if (obj.hidden) {
						colObj.hide();
					} else{
						colObj.show();
					}
				}
				
				if (colObj.colIndex != obj.colIndex) {
					__grid.moveColumn(colObj.colIndex, obj.colIndex, obj.frozen);
				}
			}
		});
	});
	
	this.grid.applyFilter(config.filter);
	this.grid.sortGrid(config.sort);
};

/**
*	削除
*
**/
Sigma.Tool.GridInf.prototype.del = function() {
	var storage = new Sigma.LocalStorage();
	storage.del(this.id);
};

/**
*	ダウンロード
*
**/
Sigma.Tool.GridInf.prototype.download = function() {
	var storage = new Sigma.LocalStorage();
	var config = storage.get(this.id);
	
	Sigma.HttpDownloader.execute(
		'config.json', 
		new Blob([config], {type: "text/json"})
	);
};

/**
*	アップロードダイアログ
*
**/
Sigma.Tool.GridInfDialog = {
	/**
	*	生成
	*
	**/
	create:function(grid) {
		var grifInf = new Sigma.Tool.GridInf(grid);
		var dialog = new Sigma.Tool.FileReaderDialog(grid);
		dialog.accept(".json, text/json");
		
		return dialog.create(function(event, reader, grid) {
			var storage = new Sigma.LocalStorage();
			storage.set(grifInf.id, reader.result);
			grifInf.apply();
		})
	},
};

