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
				/*v161==>*/
				var textarea = document.createElement("textarea");
				textarea.value= value;
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand('copy');
				textarea.parentElement.removeChild(textarea);
				/*<==v161*/
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
	/*v1130==>*/
	get:function() {
	/*<==v1130*/
		return this.value;
	}	
};
