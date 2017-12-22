/**
*	HTTPダウンロード
**/
if (!window.Sigma) {
  window.Sigma = {};
}

/**
*
**/
Sigma.HttpDownloader =  {
	/**
	*	実行
	*
	*	@param string
	*	@param Blob
	**/
	execute:function (filename, blob) {
		if (window.navigator.msSaveBlob) {
			window.navigator.msSaveBlob(blob, filename);
		} else {
			var a = document.createElement("a");
			a.href = window.URL.createObjectURL(blob);
			document.body.appendChild(a);
			a.target = '_blank';
			a.download = filename;
			a.click();
			document.body.removeChild(a);
		}
	},
};

/**
*	テキストダウンローダー
**/
Sigma.TextDownloader =  {
	/**
	*	実行
	*
	*	@param string
	**/
	execute:function (filename, text) {
		Sigma.HttpDownloader.execute(
			filename,
			new Blob([text], {type: "application/octet-stream"})
		);
	},
};

/**
*	バイナリ(Array)ダウンローダー
**/
Sigma.ArrayDownloader =  {
	/**
	*	実行
	*
	*	@param string
	**/
	execute:function (filename, array) {
		Sigma.HttpDownloader.execute(
			filename,
			new Blob(
				[new Uint8Array(array)],
				{type: "application/octet-stream"}
			)
		);
	},
};
