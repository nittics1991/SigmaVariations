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
