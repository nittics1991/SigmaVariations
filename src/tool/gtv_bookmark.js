/**
*	フィルターブックマーク
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
* @param object
**/
Sigma.Tool.Bookmark = function(grid){
	this.grid = grid;
	this.filterInfos = {};
	this.id = location.pathname + "_Sigma.Tool.Bookmark_" + grid.id;
};

/**
*	フィルター実行
*
* @param string
* @return array filterDataProxy
**/
Sigma.Tool.Bookmark.prototype.apply = function(id) {
	if (this.filterInfos[id] != null) {
		return this.grid.applyFilter.call(this.grid, this.filterInfos[id]);
	}
	return null;
};

/**
*	フィルター追加
*
* @param string
* @param object
* @return this
**/
Sigma.Tool.Bookmark.prototype.attach = function(id, filterInfo) {
	if (this.filterInfos[id] == null) {
		this.filterInfos[id] = filterInfo;
	}
	return this;
};

/**
*	フィルター削除
*
* @param string
* @return this
**/
Sigma.Tool.Bookmark.prototype.detach = function(id) {
	if (this.filterInfos[id] != null) {
		delete this.filterInfos[id];
	}
	return this;
};

/**
*	保存
*
* @return this
**/
Sigma.Tool.Bookmark.prototype.save = function() {
	var storage = new Sigma.LocalStorage();
	
	try {
		storage.set(this.id, JSON.stringify(this.filterInfos));
	} catch(e) {
		throw "local storage can't be used.";
	}
	return this;
};

/**
*	読み込み
*
* @return this
**/
Sigma.Tool.Bookmark.prototype.load = function() {
	var storage = new Sigma.LocalStorage();
	
	try {
		var filter = storage.get(this.id);
		this.filterInfos = (filter == null)? {}:JSON.parse(filter);
		
	} catch(e) {
		throw "local storage can't be used.";
	}
	return this;
};

/**
*	削除
*
* @return this
**/
Sigma.Tool.Bookmark.prototype.remove = function() {
	var storage = new Sigma.LocalStorage();
	
	try {
		this.filterInfos = storage.del(this.id);
	} catch(e) {
		throw "local storage can't be used.";
	}
	return this;
};

/*v1150==>*/
/**
*	存在
*
*	@param string キー名
* 	@return bool
**/
Sigma.Tool.Bookmark.prototype.has = function(name) {
	return Object.keys(this.filterInfos).indexOf(name) > -1
};


/**
*	長さ
*
* 	@return int
**/
Sigma.Tool.Bookmark.prototype.length = function() {
	return Object.keys(this.filterInfos).length;
};

/**
*	キー一覧
*
* 	@return array
**/
Sigma.Tool.Bookmark.prototype.keys = function() {
	return Object.keys(this.filterInfos)
};

/**
*	イテレータ
*
*	@param callback(key, key, keys)
* 	@return array
**/
Sigma.Tool.Bookmark.prototype.map = function(fn) {
	var _this = this;
	return this.keys().map(function(key, idx, keys) {
		return fn.call(_this, _this.filterInfos[key], key, keys);
	});
};

/**
*	ダイアログ
*
**/
Sigma.Tool.BookmarkDialog = {
	/**
	*	生成
	*
	**/
	create:function(grid) {
		var _grid = grid;
		var bookmark = new Sigma.Tool.Bookmark(grid);
		var dialogId = grid.id + '_bookmark';
		
		var outW = 250;
		var outH = 300;
		var inW = outW - 2;
		var inH = outH - 60;
		var listW = inW - 4;
		var listH = inH - 30;
		var inputW = 130;
		
		var closeFn = function(){Sigma.WidgetCache[dialogId].close();};
		
		var addFn = function() {
			var _bookmark = bookmark;
			var id = document.querySelector(
				'#' + dialogId + '_input input[type="text"]'
			);
			
			if (id == null ||
				id.value.trim().length == 0 ||
				! id.validity.valid
			) {
				return;
			}
			_bookmark.attach(id.value, _grid.getFilterInfo());
			_bookmark.save();
			viewList();
		};
		
		var delFn = function(event) {
			var _bookmark = bookmark;
			_bookmark.detach(event.target.value);
			_bookmark.save();
			viewList();
		};
		
		var execFn = function(event) {
			var _bookmark = bookmark;
			_bookmark.apply(event.target.value);
			closeFn();
		};
		
		var viewList = function() {
			var parent = Sigma.$(dialogId + '_lists');
			while (parent.firstChild) parent.removeChild(parent.firstChild);
			
			var _bookmark = bookmark;
			bookmark = bookmark.load();
			
			var list = bookmark.map(function(filter, key, ar){
				return Sigma.Template.expand('\
					<ol style="list-style:none; margin:0; padding:0; width:100%; display:flex;">\
						<li style="overflow:hidden; width:${inputW}px;">${key}</li>\
						<li><button class="gt-input-button" name="exec" value="${key}">${btnExec}</button></li>\
						<li><button class="gt-input-button" name="del" value="${key}">${btnDel}</button></li>\
					</ol>\
					',
					{
						inputW:inputW,
						btnDel:grid.getMsg('TEXT_DEL_BOOKMARK') || 'Del',
						btnExec:grid.getMsg('TEXT_EXEC_BOOKMARK') || 'Exec',
						dialogId:dialogId,
						key:key,
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
			title:grid.getMsg('DIAG_TITLE_BOOKMARK') || 'Bookmark',
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
				btnAdd:grid.getMsg('TEXT_ADD_BOOKMARK') || 'Add',
				btnDel:grid.getMsg('TEXT_DEL_BOOKMARK') || 'Del',
				btnExec:grid.getMsg('TEXT_EXEC_BOOKMARK') || 'Exec',
			}),
			buttons : [
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
					<input type="text" name="newName" style="width:${inputW}px;" pattern="^\\w+$">\
					<button class="gt-input-button">${btnAdd}</button>\
				</div>\
			</div>\
		';
		return Sigma.Template.expand(tmp, param);
	},
};

/*<==v1150*/
