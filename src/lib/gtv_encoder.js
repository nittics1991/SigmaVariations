/**
*	文字コードエンコーダ(encoding.js)
*
*	@see https://github.com/polygonplanet/encoding.js
**/
if (!window.Sigma) {
  window.Sigma = {};
}

/**
*	construct
*
**/
Sigma.Encoder = function() {
	if (typeof Encoding != "object") {
		throw "require encoding.js";
	}
};

/**
*	変換
*
*	@param string 値
*	@param string 変換先エンコード
*	@param string 変換元エンコード(省略可能)
*	@return array 変換後データ
**/
Sigma.Encoder.prototype.convert = function(text, toCode, fromCode) {
	if (fromCode == null) {
		fromCode = 'AUTO';
	}
	return Encoding.convert(
		Encoding.stringToCode(text),
		toCode,
		fromCode
	);
};
