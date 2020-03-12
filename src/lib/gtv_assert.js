/**
*	assert
**/
if (!window.Sigma) {
  window.Sigma = {};
}

/**
*
**/
Sigma.Assert =  {
	/**
	*	equal
	*
	*	@param mixed
	*	@param mixed
	* 	@param string
	**/
	eq:function (a, b, message) {
		if (a !== b) {
			if (message) {
				console.log(message);
			}
			console.error("a=", a);
			console.error("b=", b);
			return;
		}
	},
	
	/**
	*	equal obj
	*
	*	@param mixed
	*	@param mixed
	* 	@param string
	**/
	eqObj:function (a, b, message) {
		var fn = function(obj) {
			var keys = Object.keys(obj).sort();
			var map = {};
			
			keys.forEach(function(key){
				var val = obj[key];
				
				if(val != null &&
					(typeof val === "object" ||
					typeof val === "function")
				){
					val = fn(val);
				}
				map[key] = val;
			});
			return map;
		};
		
		var jsondA = JSON.stringify(fn(a));
		var jsondB = JSON.stringify(fn(b));
		
		return Sigma.Assert.eq(jsondA, jsondB, message);
	},
	
	/**
	*	exception
	*
	*	@param callback
	*	@param array
	* 	@param string
	**/
	ex:function (fn, arg, message) {
		try {
			fn.apply(null, arg);
			if (message) {
				console.log(message);
			}
			console.error("arg=", arg);
			return;
			
		} catch (e) {
			return;
		}
	},
	
	/**
	*	not exception
	*
	*	@param callback
	*	@param array
	* 	@param string
	**/
	nex:function (fn, arg, message) {
		try {
			fn.apply(null, arg);
		} catch (e) {
			if (message) {
				console.log(message);
			}
			console.error("arg=", arg);
			return;
		}
	},
};
