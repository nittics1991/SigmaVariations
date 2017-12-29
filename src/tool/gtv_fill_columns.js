/**
*	コピーデータの選択行選択セル貼り付け
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
Sigma.Tool.FillColumns = {
	/**
	*	貼り付け
	*
	*	@param object grid
	**/
	paste:function(grid) {
		var data = Sigma.Clipboard.get();
		var rows = grid.selectedRows;
		
		if (data == null ||
			rows.length == 0 ||
			grid.activeColumn == null
		) {
			return;
		}
		
		rows.forEach(function(row) {
			grid.setCellValue(grid.activeColumn.id, row.rowIndex, data);
			grid.refreshRow(row);
			grid.dirty(row.cells[grid.activeColumn.colIndex]);
		});
	},
};
