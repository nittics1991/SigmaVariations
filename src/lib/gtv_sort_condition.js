/**
*	ソート条件
*
**/
if (!window.Sigma) {
  window.Sigma = {};
}

/**
*	construct
*
**/
Sigma.SortCondition = {
	ASC:1,
	DESC:-1,
	
	/**
	*	数値
	*
	*	@param number
	*	@param number
	*	@param enum 1:ASC -1:DESC
	*	@return init
	**/
	byNumber:function(a, b, order) {
		if (! Sigma.SortCondition._isValidOrder(order)) {
			return 0;
		}
		return (a - b) * order
	},
	
	/**
	*	アルファベット(大文字小文字無視)
	*
	*	@param string
	*	@param string
	*	@param enum 1:ASC -1:DESC
	*	@return init 1, 0, -1
	**/
	byAlpha:function(a, b, order) {
		if (! Sigma.SortCondition._isValidOrder(order)) {
			return 0;
		}
		var x = String(a).toLowerCase(); 
		var y = String(b).toLowerCase(); 
			
		if (x > y) {
			return 1 * order;
		}
		if (x < y) {
			return -1 * order;
		}
		return 0;
	},
	
	/**
	*	ソート定数検査
	*
	*	@param int
	*	@bool
	**/
	_isValidOrder:function(order) {
		return (order === 1 || order === -1);
	},
};
