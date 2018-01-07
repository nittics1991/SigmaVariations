/**
*	Jquery Ui Skin
**/
if (!window.Sigma) {
  window.Sigma = {};
}

if (!Sigma.Tool) {
  Sigma.Tool = {};
}

/**
*
*
**/
Sigma.Tool.SkinJqui = {
	/**
	*	適用
	*
	**/
	apply:function() {
		var tmp = '<div class="gt-jqui" style="disabled=true; width:0; height:0;"></div>';
		document.body.insertAdjacentHTML('beforeend', tmp);
		var elm = document.querySelector("body .gt-jqui");
		
		try {
			var stylesheet = this._addStyleSheet();
			var hvColor = this._getStyleValue(elm, 'ui-state-hover', 'background-color');
			var bgColor = this._getStyleValue(elm, 'ui-widget-header', 'background-color');
			
			if (hvColor.replace(/\s+/g, '') != "rgba(0,0,0,0)" ||
				bgColor.replace(/\s+/g, '') != "rgba(0,0,0,0)"
			) {
				stylesheet.insertRule(
					'.gt-head-div{ background-image:url(""); background-color:' + bgColor + '; }',
					stylesheet.cssRules.length
				);
				
				stylesheet.insertRule(
					'.gt-hd-row td{ background-image:url(""); background-color:' + bgColor + '; }',
					stylesheet.cssRules.length
				);
				
				stylesheet.insertRule(
					'.gt-row-selected{ background-image:url(""); background-color:' + hvColor + '; }',
					stylesheet.cssRules.length
				);
				
				stylesheet.insertRule(
					'.gt-row-selected td{ background-image:url(""); background-color:' + hvColor + '; }',
					stylesheet.cssRules.length
				);
				
				stylesheet.insertRule(
					'.gt-hd-row .gt-hd-row-over{ background-image:url(""); background-color:' + hvColor + '; }',
					stylesheet.cssRules.length
				);
				
				stylesheet.insertRule(
					'td.gt-cell-actived{ background-image:url(""); background-color:' + bgColor + '; }',
					stylesheet.cssRules.length
				);
				
				stylesheet.insertRule(
					'.gt-input-button{ background-image:url(""); background-color:' + bgColor + '; }',
					stylesheet.cssRules.length
				);
				
				stylesheet.insertRule(
					'.gt-input-button:hover{ background-image:url(""); background-color:' + hvColor + '; }',
					stylesheet.cssRules.length
				);
				
				stylesheet.insertRule(
					'.gt-toolbar-box{ background-image:url(""); background-color:' + bgColor + '; }',
					stylesheet.cssRules.length
				);
				
				stylesheet.insertRule(
					'.gt-cell-tooltip{ background-image:url(""); background-color:' + hvColor + '; }',
					stylesheet.cssRules.length
				);
				
				stylesheet.insertRule(
					'.gt-dialog-head{ background-image:url(""); background-color:' + bgColor + '; }',
					stylesheet.cssRules.length
				);
				
			}
		} finally {
			while (elm.firstChild) elm.removeChild(elm.firstChild);
		}
	},
	
	/**
	*	インラインスタイルシート作成
	*
	* @return CSSStyleSheet
	**/
	_addStyleSheet:function() {
		var newStyle = document.createElement('style');
		newStyle.type = "text/css";
		document.getElementsByTagName('head')[0].appendChild(newStyle);
		return newStyle.sheet;
	},
	
	/**
	*	classスタイル属性値取得
	*
	* @param HtmlEmenemt
	* @param string
	* @param string
	* @return string
	**/
	_getStyleValue:function(elm, cls, attr) {
		elm.classList.add(cls);
		var result = window.getComputedStyle(elm).getPropertyValue(attr);
		elm.classList.remove(cls);
		return result;
	},
};
