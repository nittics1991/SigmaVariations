/**
*	選択行のチェックボックスチェック切り替え
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
Sigma.Tool.CheckSelectedRows = {
	/**
	*	切り替え
	*
	*	@param Object grid
	**/
	toggle:function(grid) {
		var columns = grid.columns.filter(function(obj) {
			return !!obj.isCheckColumn;
		}).map(function(obj) {
			return 'gt_' + grid.id + '_chk_' + obj.id;
		});
		
		grid.selectedRows.forEach(function(row) {
			var _grid = grid;
			columns.forEach(function(id) {
				var name = id + row.rowIndex;
				var elm = document.getElementsByName(name);
				
				if (elm.length > 0) {
					for (var i=0; i<elm.length; i++) {
						var checked = elm[i].checked? false:true;
						Sigma.checkOneBox(elm[i], _grid, checked);
					}
				}
			});
		});
	},
};
