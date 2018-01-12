/**
*	ドラッグソート
**/
if (!window.Sigma) {
  window.Sigma = {};
}

if (!Sigma.Tool) {
  Sigma.Tool = {};
}

/**
*	ダイアログ
*
**/
Sigma.Tool.DragSortDialog = {
	/**
	*	生成
	*
	**/
	create:function(grid) {
		var _grid = grid;
		/*v1230==>*/
		/*v<==1230*/
		var dialogId = grid.id + '_dragsort';
		var dataProxy = grid.dataset.dataProxy;
		
		var outW = document.querySelector('#' + grid.id + '_div').clientWidth * 0.9;
		var outH = document.querySelector('#' + grid.id + '_div').clientHeight * 0.9;
		var inW = outW - 4;
		var inH = outH - 70;
		
		var closeFn = function(){Sigma.WidgetCache[dialogId].close();};
		
		var okFn = function() {
			_grid.dataset.dataProxy = dataProxy;
			_grid.refresh();
			closeFn();
		};
		
		var viewTable = function() {
				var parent = document.querySelector('#' + dialogId + '_div');
				while (parent.firstChild) parent.removeChild(parent.firstChild);
				
				parent.insertAdjacentHTML(
						'beforeend',
						'<table cellspacing=0; cellpadding=0; border=0>'
							+document.querySelector('#' + _grid.id + '_headTable').innerHTML
							+ '</table>'
					);
				
				parent.insertAdjacentHTML(
						'beforeend',
						'<table id="' + dialogId + '_body_table" cellspacing=0; cellpadding=0; border=0>'
							+ document.querySelector('#' + _grid.id + '_bodyDiv > .gt-table').innerHTML
							+ '</table>'
					);
				
				var trs = document.querySelectorAll('#' + dialogId + '_body_table tr');
				for (var i=0; i< trs.length; i++) {
					trs[i].setAttribute('draggable', true);
				}
		}
				
		var dialog = new Sigma.Dialog({
			id:dialogId,
			gridId:grid.id ,
			title:grid.getMsg('DIAG_TITLE_DRAGSORT') || 'DragSort',
			width:outW,
			height:outH ,
			buttonLayout:'h',
			body:this._bodyTemplate({
				dialogId:dialogId,
				width:inW,
				height:inH,
			}),
			buttons : [
				{text:grid.getMsg('TEXT_OK'), onclick:okFn},
				{text:grid.getMsg('TEXT_CLOSE'), onclick:closeFn},
			],
			afterShow : function(){
				var __grid = _grid;
				var _dataProxy = dataProxy;
				viewTable();
				
				var draggable = document.querySelector('#' + dialogId + '_body_table tr[draggable="true"]');
				
				Sigma.U.addEvent(draggable.parentNode, 'dragstart', function(event){
					event.dataTransfer.setData("text/x-rowno", event.target.rowIndex);
					event.dataTransfer.setData("text/plain", event.target.outerHTML);
					event.dataTransfer.setData("text/x-id", event.target.id);
				});
				
				Sigma.U.addEvent(draggable.parentNode, 'dragenter', function(event){
					event.preventDefault();
				});
				
				Sigma.U.addEvent(draggable.parentNode, 'dragover', function(event){
					event.preventDefault();
				});
				
				Sigma.U.addEvent(draggable.parentNode, 'drop', function(event){
					event.preventDefault();
					
					var serachRow = function(elm) {
						if (!elm.parentNode ||
							elm.nodeName.toLowerCase() == 'body'
						) {
							return null;
						}	
						
						if (elm.nodeName.toLowerCase() == 'tr') {
							return elm;
						}
						return serachRow(elm.parentNode);
					};
					
					var sourceRowIndex = parseInt(event.dataTransfer.getData("text/x-rowno"));
					var targetRow = serachRow(event.target);
					var targetRowIndex = parseInt(targetRow.rowIndex);
					
					if (targetRowIndex == -1) {
						return;
					}
					
					try {
						var sourceElm = document.querySelector(
							'#' + dialogId + '_div #' + event.dataTransfer.getData("text/x-id")
						);
						while (sourceElm.firstChild) sourceElm.removeChild(sourceElm.firstChild);
						sourceElm.parentNode.removeChild(sourceElm);
						
						targetRow.insertAdjacentHTML('afterend', event.dataTransfer.getData("text/plain"));
						
						var pageInfo = __grid.getPageInfo();
						var removed = _dataProxy.splice(pageInfo.startRowNum + sourceRowIndex - 1, 1);
						var pos = (targetRowIndex >= sourceRowIndex)? -1:0;
						_dataProxy.splice(pageInfo.startRowNum + targetRowIndex + pos, 0, removed[0]);
					} catch (e) {
						alert(__grid.getMsg('WARNING_DRAG_SORT') || 'failure')
					}
				}, false);
			}
		});
		return  dialog;
	},
	
	_bodyTemplate:function(param) {
		var tmp = '\
			<div id="${dialogId}_div" style="width:${width}px; height:${height}px; padding:2px; overflow:auto;">\
			</div>\
		';
		return Sigma.Template.expand(tmp, param);
	},
};
