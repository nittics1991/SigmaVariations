/**
*	Skin保存
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
Sigma.Tool.SkinInf = {
	id:"Sigma.Tool.SkinInf.skin",
	
	/**
	*	保存
	*
	*	@param Object grid
	**/
	save:function(grid) {
		var storage = this._getStorage();
		storage.set(this.id, grid.getSkin());
	},
	
	/**
	*	適用
	*
	*	@param Object grid
	**/
	apply:function(grid) {
		var storage = this._getStorage();
		var skin = storage.get(this.id) || "";
		
		if (skin != "" && grid.getSkin() != skin) {
			Sigma.Grid.changeSkin(grid, skin);
		}
	},

	/**
	*	削除
	*
	**/
	del:function() {
		var storage = this._getStorage();
		storage.del(this.id);
	},
	
	//v1263==>
	/**
	*	localStorage取得
	*
	* @return this
	**/
	_getStorage:function() {
		var compressor = (typeof lzbase62 == 'undefined')?
			null:
			new Sigma.Compressor();
		
		return new Sigma.LocalStorage(compressor);
	},
	//<==v1263
	
};
