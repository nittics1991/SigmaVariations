/**
*	圧縮ツール(lzbase62)
*
*	@see https://github.com/polygonplanet/lzbase62
**/
if (!window.Sigma) {
  window.Sigma = {};
}

/**
*	construct
*
**/
Sigma.Compressor = function() {
	if (typeof lzbase62 != "object") {
		throw "require lzbase62";
	}
};

/**
*	圧縮
*
*	@param string 値
*	@return string 圧縮値
**/
Sigma.Compressor.prototype.compress = function(value) {
	return lzbase62.compress(value);
};

/**
*	解凍
*
*	@param string 圧縮値
*	@return string 値
**/
Sigma.Compressor.prototype.decompress = function(value) {
	return lzbase62.decompress(value);
};
