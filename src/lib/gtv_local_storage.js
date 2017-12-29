/**
*	Local Storage
**/
if (!window.Sigma) {
  window.Sigma = {};
}

/**
*	construct
*
*	@param string path
*	@param string 圧縮ツール
**/
Sigma.LocalStorage = function (compressor) {
	this.compressor = compressor || false;
};

/**
*	保存
*
*	@param string キー名
*	@param mixed 値
**/
Sigma.LocalStorage.prototype.set = function(name, value) {
	var val = (this.compressor)? this.compressor.compress(value):value;
	localStorage.setItem(name, val);
};

/**
*	取得
*
*	@param string キー名
*	@param string
**/
Sigma.LocalStorage.prototype.get = function(name) {
	var tmp = localStorage.getItem(name);
	return (this.compressor)? this.compressor.decompress(tmp):tmp;
};

/**
*	削除
*
*	@param string キー名
**/
Sigma.LocalStorage.prototype.del = function(name) {
	localStorage.removeItem(name);
};

/*v1120==>*/
/**
*	存在
*
*	@param string キー名
* 	@return bool
**/
Sigma.LocalStorage.prototype.has = function(name) {
	return localStorage.getItem(name) != null;
};

/**
*	長さ
*
* 	@return int
**/
Sigma.LocalStorage.prototype.length = function(fn) {
	return localStorage.length;
};

/**
*	キー一覧
*
* 	@return array
**/
Sigma.LocalStorage.prototype.keys = function(fn) {
	var result = [];
	for (var i=0; i<localStorage.length; i++) {
		result.push(localStorage.key(i));
	}
	return result;
};

/**
*	イテレータ
*
*	@param callback(val, key, keys)
* 	@return array
**/
Sigma.LocalStorage.prototype.map = function(fn) {
	return this.keys().map(function(val, key, ar) {
		return fn.call(this, val, key, ar);
	});
};
/*<==v1120*/
