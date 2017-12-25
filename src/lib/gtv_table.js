/**
*	Object Table
**/
if (!window.Sigma) {
  window.Sigma = {};
}

/**
*	construct
*
*	@param array
**/
Sigma.Table = function (array) {
	this.data = Array.isArray(array)? array:[];
	this.transverse = null;
};

/**
*	空判定
*
*	@return bool
**/
Sigma.Table.prototype.isEmpty = function() {
	return Object.keys(this.data).length == 0;
};

/**
*	キー一覧
*
*	@return array
**/
Sigma.Table.prototype.keys = function() {
	if (this.isEmpty()) {
		return [];
	}
	return Object.keys(this.data[0]);
};

/**
*	キー存在
*
*	@param string
*	@return bool
**/
Sigma.Table.prototype.hasKey = function(key) {
	return this.keys().indexOf(key) !== -1;
};

/**
*	テーブル判定
*
*	@return bool
**/
Sigma.Table.prototype.isTable = function() {
	if (this.isEmpty()) {
		return false;
	}
	return this.data.reduce(function(prev, obj) {
			return JSON.stringify(prev) == JSON.stringify(Object.keys(obj));
		},
		this.keys()
	);
};

/**
*	行長さ
*
*	@return int
**/
Sigma.Table.prototype.length = function() {
	return this.data.length;
};

/**
*	行存在
*
*	@param int
*	@return int
**/
Sigma.Table.prototype.hasRow = function(rowNo) {
	return this.length() > rowNo;
};

/**
*	行取得
*
*	@param int
*	@return object
**/
Sigma.Table.prototype.getRow = function(rowNo) {
	return (this.hasRow(rowNo))? this.data[rowNo]:null;
};

/**
*	行列変換
*
*	@return object
**/
Sigma.Table.prototype.transpose = function() {
	if (this.transverse != null) {
		return this.transverse;
	}
	
	if (this.isEmpty()) {
		return null;
	}
	
	var keys = this.keys();
	var container = {};
	
	keys.forEach(function(key) {
		container[key] = [];
	});
	
	this.data.forEach(function(obj) {
		_container = container;
		keys.forEach(function(key) {
			_container[key].push(obj[key]);
		});
	});
	
	return this.transverse = container;
};

/**
*	列取得
*
*	@param string|int
*	@return array
**/
Sigma.Table.prototype.getColumn = function(colId) {
	if (this.transverse == null) {
		return null;
	}
	return (this.hasKey(colId))? this.transverse[colId]:null;
};

/**
*	合計
*
*	@param string|int
*	@return mixed
**/
Sigma.Table.prototype.sum = function(colId) {
	if (!this.hasKey(colId)) {
		return null;
	}
	
	return this.getColumn(colId).filter(function(val) {
		return isFinite(val);
	})
	.reduce(function(prev, val) {
			return prev + val;
		},
		0
	);
};

/**
*	平均
*
*	@param string|int
*	@return mixed
**/
Sigma.Table.prototype.avg = function(colId) {
	if (!this.hasKey(colId)) {
		return null;
	}
	
	var ar = this.getColumn(colId).filter(function(val) {
		return isFinite(val);
	});
	
	if (ar.length == 0) {
		return 0;
	}
	
	return ar.reduce(function(prev, val) {
			return prev + val;
		},
		0
	) / ar.length;
};

/**
*	最大値
*
*	@param string|int
*	@return mixed
**/
Sigma.Table.prototype.max = function(colId) {
	if (!this.hasKey(colId)) {
		return null;
	}
	
	var ar = this.getColumn(colId).filter(function(val) {
		return isFinite(val);
	});
	return Math.max.apply(null, ar);
};

/**
*	最小値
*
*	@param string|int
*	@return mixed
**/
Sigma.Table.prototype.min = function(colId) {
	if (!this.hasKey(colId)) {
		return null;
	}
	
	var ar = this.getColumn(colId).filter(function(val) {
		return isFinite(val);
	});
	return Math.min.apply(null, ar);
};

/**
*	配列化
*
*	@return array
**/
Sigma.Table.prototype.toArray = function() {
	if (this.isEmpty()) {
		return [];
	}
	
	var _this = this;
	var keys = this.keys();
	
	return this.data.map(function(obj) {
		return keys.map(function(key) {
			return obj[key];
		});
	});
};

/**
*	データコピー
*
**/
Sigma.Table.prototype.copy = function() {
	if (this.isEmpty()) {
		return [];
	}
	var keys = this.keys();
	
	return this.data.map(function(obj) {
		if (Array.isArray(obj)) {
			return [].concat.apply(null, obj);
		}
		
		var container = {};
		keys.forEach(function(key) {
			container[key] = obj[key];
		});
		return container;
	});
};

/**
*	ソート
*
*	@param string|array 
*	@return mixed
*	@example
*		sort(['colId1', Sigma.Sorter.DESC] ['colId2'])
*			colId1を降順辞書ソート後、colId1を昇順辞書ソート
*		sort(['colId1', Sigma.Sorter.DESC, func1] ['colId2', null, func2])
*			colId1を降順func1ソート後、colId1を昇順func2ソート
**/
Sigma.Table.prototype.sort = function() {
	var target = this.copy();
	var argv = [].slice.call(arguments);
	
	var compare = function (a, b, order) {
		if (a > b) {
			return 1 * order;
		}
		if (a < b) {
			return -1 * order;
		}
		return 0;
	};
	
	target.sort(function (a, b) {
		var result = 0;
		argv.some(function(condition) {
			var key = condition[0];
			var fn = (condition[2] == null)? compare:condition[2];
			result = fn(a[key], b[key], condition[1]);
			return result != 0;
		});
		return result;
	});
	return new Sigma.Table(target);
};
