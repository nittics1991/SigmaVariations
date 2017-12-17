/**
*	CSV
**/
if (!window.Sigma) {
  window.Sigma = {};
}

/**
*
*
**/
Sigma.Csv = {
	/**
	*	作成
	*
	*	@param array 値
	**/
	create:function(ar) {
		if (! Sigma.$type(ar, "array")) {
			return;
		}
		
		return ar.map(function(list) {
            return list.map(function (val) {
		        return (typeof val == "number")?
                    val:
                    '"' + val.replace(/"/g, '""') + '"';
            }).join(",");
	    }).join("\r\n");
	},
};
