/**
*	Cookie
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
Sigma.Cookie = function (path, compressor) {
	this.expire = 1000*60*60*24*30*1;
	this.path = path || "";
	this.compressor = compressor || false;
};

/**
*	保存
*
*	@param string キー名
*	@param mixed 値
*	@param int 保存期間(sec)
*	@return array cookieリスト
**/
Sigma.Cookie.prototype.set = function(name, value, expire) {
	var now = new Date();
	var exp = expire || this.expire;
	now.setTime(now.getTime() + exp);
	var exday = now.toGMTString();
	
	var val = encodeURIComponent(value);
	val = (this.compressor)? this.compressor.compress(val):val;
	
	var path = (this.path)?	';path=' + this.path:';';
	return document.cookie = name + "=" + val + ";expires=" + exday + path;
};

/**
*	取得
*
*	@param string キー名
*	@param mixed
**/
Sigma.Cookie.prototype.get = function(name) {
	var cookies = document.cookie.split('; ');
	for (var i=0; i<cookies.length; i++) {
		if (cookies[i].substr(0, name.length+1) == (name+"=")) {
			var tmp = cookies[i].substr(name.length+1)
			return (this.compressor)?
				decodeURIComponent(this.compressor.decompress(tmp)):
				decodeURIComponent(tmp);
		}
	}
};

/**
*	削除
*
*	@param string キー名
*	@param array
**/
Sigma.Cookie.prototype.del = function(name) {
	var now = new Date();
	now.setTime(now.getTime() - 60);
	var exday = now.toGMTString();
	return document.cookie = name + "='';expires=" + exday;
};
