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
		this.filterInfos[id] = null;
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
