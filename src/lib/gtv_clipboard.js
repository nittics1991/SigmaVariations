/**
*	テキストクリップボード
**/
if (!window.Sigma) {
  window.Sigma = {};
}

/**
*
*
**/
Sigma.Clipboard = {
	value:"",
	
	/**
	*	保存
	*
	*	@param string 値
	**/
	set:function(value) {
		if (typeof value == "number") {
			value = value.toString();
		} else if (typeof value != "string") {
			return;
		}
		
		try {
			try {
				clipboardData.setData('text', value);
			} catch (e) {
				document.execCommand('copy');
			}
			this.value = value;
		} catch (e) {
			throw "can not use clipboard";
		}
	},
	
	/**
	*	内部保存値取得
	*
	**/
	get:function(value) {
		return this.value;
	}	
};
