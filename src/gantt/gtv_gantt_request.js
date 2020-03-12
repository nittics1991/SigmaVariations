/**
*	リクエスト
**/
if (!window.Sigma) {
  window.Sigma = {};
}

if (!Sigma.Gantt) {
  Sigma.Gantt = {};
}

/**
*	construct
*
* 	@visibility public
**/
Sigma.Gantt.Request = function(){
};

/**
*	ロード
*
* 	@param string
* 	@param object
* 	@param callback fn(array responce)
* 	@param callback fn(string message)
* 	@return Sigma.LoadData
* 	@throws Sigma.Gantt.Error.LoadFailure,LoadCancel
* 
* 		params = {
* 			pageInfo:{},
* 			sortInfo:[],
* 			filterInfo:[],
* 			parameters:{},
* 			remotePaging:false,
* 			remoteSort:false,
* 			loadSuccess:function(responce, reqParam, this){return true;},
* 		}
**/
Sigma.Gantt.Request.prototype.load = function(url, params, success, failure) {
	var reqParams = {
		action:'load',
		recordType:'object',
		pageInfo:(params['pageInfo'])? params['pageInfo']:{},
		sortInfo:(params['sortInfo'])? params['sortInfo']:[],
		filterInfo:(params['filterInfo'])? params['filterInfo']:[],
		parameters:(params['parameters'])? params['parameters']:{},
		remotePaging:(params['remotePaging'])? params['remotePaging']:false,
		remoteSort:(params['remoteSort'])? params['remoteSort']:false,
	};
	
	var ajax = new Sigma.Ajax(url);
	ajax.mimeType = "json";
	
	ajax.onFailure = function(xhr, error) {
		failure.call(null, error);
	};
	
	ajax.onSuccess = function(responce) {
		success.call(null, JSON.parse(responce['text']));
	};
	ajax.send({data:reqParams});
}
