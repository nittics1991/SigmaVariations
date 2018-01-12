/**
*	ファイル読み込み
**/
if (!window.Sigma) {
  window.Sigma = {};
}

/*v1240==>*/
if (!Sigma.Tool) {
  Sigma.Tool = {};
}
/*<==v1240*/

/**
*	ダイアログ
* 
**/
Sigma.Tool.FileReaderDialog = function(grid){
	this.grid = grid;
	this.mime = [];
	this.ext = [];
};

/**
*	accept設定
* 
* 	@param string
* 	@return this
**/
Sigma.Tool.FileReaderDialog.prototype.accept = function(mimes) {
	var splited = mimes.split(',');
	var _this = this;
	
	splited.forEach(function(val) {
		if (val.substr(0, 1) == '.') {
			_this.ext.push(val.substr(1));
		} else {
			_this.mime.push(val);
		}
	});
	return this;
};


/**
*	生成
*
* 	@param function fn(fileElement, grid)
**/
Sigma.Tool.FileReaderDialog.prototype.create = function(fn) {
	var _grid = this.grid;
	var _fn = fn;
	var dialogId = _grid.id + '_filereader';
	var _this = this;
	
	/*v1230==>*/
	var outW = 300;
	var outH = 120;
	/*<==v1230*/
	
	var inW = outW - 2;
	var inH = outH - 60;
	var fileW = 200;

	var cancelFn = function(){Sigma.WidgetCache[dialogId].close();};
	
	var execFn = function() {
		var __grid = _grid;
		var __this = _this;
		
		if (typeof _fn == 'function') {
			var elm = document.querySelector('#' + dialogId + '_div input[type="file"]');
			var reader = new FileReader();
			
			Sigma.U.addEvent(reader ,"load", function(event) {
				return _fn(event, reader, __grid);
			});
			
			var names = elm.files[0].name.split('.');
			
			if ((__this.mime.length == 0 && __this.ext.length == 0) || 
				__this.mime.indexOf(elm.files[0].type) > -1 ||
				__this.ext.indexOf(names[names.length-1]) > -1
			) {
				reader.readAsText(elm.files[0]);
			}
		}
		cancelFn();
	};
	
	var _bodyTemplate = function(param) {
		var tmp = '\
			<div id="${dialogId}_div" style="width:${width}px; height:${height}px;">\
				<input type="file" style="width:${fileW};">\
			</div>\
		';
		return Sigma.Template.expand(tmp, param);
	};
	
	var dialog = new Sigma.Dialog({
		id:dialogId,
		gridId:_grid.id ,
		title:_grid.getMsg('DIAG_TITLE_FILEREADER') || 'FileReader',
		width:outW,
		height:outH ,
		buttonLayout:'h',
		body:_bodyTemplate({
			dialogId:dialogId,
			width:inW,
			height:inH,
			fileW:fileW,
		}),
		buttons : [
			{text:_grid.getMsg('TEXT_OK'), onclick:execFn},
			{text:_grid.getMsg('TEXT_CANCEL'), onclick:cancelFn},
		],
		
		_this:this,
		
		afterShow : function(){
			var file = document.querySelector('#' + dialogId + '_div input[type="file"]');
			if (this._this.accept != null) {
				file.accept = this._this.accept;
			}
		}
	});
	return  dialog;
};

