/**
*	選択行コピー/追加行挿入
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
Sigma.Tool.CopyRows = {
	/**
	*	保存
	*
	*	@param Object grid
	**/
	set:function(grid) {
		Sigma.Clipboard.set(
			JSON.stringify(grid.getSelectedRecords())
		);
	},
	
	/**
	*	行追加挿入
	*
	*	@param object grid | null
	*	@param callback|null beforeAdd Event
	*		beforeAdd=function(array records){retrun records;}
	**/
	add:function(grid, func) {
		var records = JSON.parse(
			Sigma.Clipboard.get()
		) || [];
		
		if (typeof func == 'function') {
			records = func.apply(this, [records]);
			if (records === false) {
				return;
			}
		}
		
		var getLength = function(target) {
			return (Array.isArray(target))?
				target.length:
				Object.keys(target).length;
		};
		
		
		if (getLength(grid.dataset.data[0]) !=
			 getLength(records[0])
		 ) {
			return;
		}
		
		records.forEach(function(rec) {
			grid.addRow(rec);
		});
	},
};
