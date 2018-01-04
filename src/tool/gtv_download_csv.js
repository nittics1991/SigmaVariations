/**
*	CSVダウンロード
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
Sigma.Tool.DownloadCsv = {
	/**
	*	生成
	*
	**/
	download:function(grid) {
		var dataset = grid.dataset.data || [];
		if (dataset.length == 0) {
			return;
		}
		
		var props = Object.keys(dataset[0]).filter(function(key) {
			return key.substr(0, 1) != '_';
		});
		
		var list = dataset.map(function(obj) {
			return props.map(function(key) {
				return obj[key];
			});
		});
		
		var csv = Sigma.Csv.create(list);
		var encoder = new Sigma.Encoder();
		var encoded = encoder.convert(csv, 'SJIS');
		var ar = new Uint8Array(encoded);
		
		Sigma.HttpDownloader.execute(
			'data.csv', 
			new Blob([ar], {type: "application/octet-stream"})
		);
	},
};
