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
		var storage = new Sigma.LocalStorage();
		storage.set(this.id, grid.getSkin());
	},
	
	/**
	*	適用
	*
	*	@param Object grid
	**/
	apply:function(grid) {
		var storage = new Sigma.LocalStorage();
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
		var storage = new Sigma.LocalStorage();
		storage.del(this.id);
	},
};
