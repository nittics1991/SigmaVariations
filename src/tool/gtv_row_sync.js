/**
*	固定行との高さ同期
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
Sigma.Tool.RowSync = {
	/**
	*	同期
	*
	*	@param Object grid
	**/
	sync:function(grid) {
        var bodyTrs = grid.gridTable.children[0].children;
        var freezeTrs = grid.freezeBodyTable.children[0].children;
        
        for (var i=0; i<bodyTrs.length; i++) {
            if (freezeTrs[i].clientHeight != bodyTrs[i].clientHeight) {
                freezeTrs[i].style.height = bodyTrs[i].clientHeight + 'px';
            }
        }
	},
};
