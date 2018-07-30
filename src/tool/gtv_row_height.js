/**
*	行高さフリー／指定値切り替え(freeze column未対応)
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
Sigma.Tool.RowHeight = {
	cache:[],
	
	/**
	*	切り替え
	*
	*	@param Object grid
	**/
	toggle:function(grid) {
		
		/*v1170==>*/
		var collections = document.querySelectorAll('#' + grid.id + '_div .gt-row .gt-inner');
		if (collections == null || collections.length == 0) {
			return;
		}
		/*<==v1170*/
		
		var style = collections[0].currentStyle
			|| document.defaultView.getComputedStyle(collections[0], '');
		
		if (Sigma.Tool.RowHeight.cache[grid.id] == null) {
			Sigma.Tool.RowHeight.cache[grid.id] = style.height;
		}
		
		if (style.whiteSpace.toLowerCase () == 'normal') {
			var s = 'nowrap';
			var h = Sigma.Tool.RowHeight.cache[grid.id]  || '19px;';
            /*v1292==>*/
            var o = 'normal';
            /*<==v1292*/
		} else {
			var s = 'normal';
			var h = 'auto';
            /*v1292==>*/
            var o = 'break-word';
            /*<==v1292*/
		}
		
		var searchGridId = function(elm, id) {
			var parent = elm.parentNode;
			if (parent.id == null || parent.id.indexOf(id) > -1) {
				return true;
			}
			
			if (parent) {
				var nextParent = parent.parentNode;
				if (nextParent) {
					return searchGridId(parent, id)
				}
			}
			return false;
		};
		
		for (var i=0; i<collections.length; i++) {
			if (searchGridId(collections[i], grid.id)) {
				collections[i].style.whiteSpace = s;
				collections[i].style.height = h;
                /*v1292==>*/
				collections[i].style.overflowWrap = o;
                /*<==v1292*/
			}
		}
	},
};
