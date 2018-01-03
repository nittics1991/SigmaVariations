/**
*	集計表
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
Sigma.Tool.AggregateDialog = {
	/**
	*	生成
	*
	**/
	create:function(grid) {
		var _grid = grid;
		var dialogId = grid.id + '_aggregate';
		
		var outW = (window.innerWidth == null)?
			document.documentElement.clientWidth:
			window.innerWidth;
		outW = Math.floor(outW * 0.8);
		var outH = 360;
		var inW = outW - 2;
		var inH = outH - 60;
		
		var closeFn = function(){Sigma.WidgetCache[dialogId].close();};
		
		var viewHead = function() {
			var tmp = '<tr class="gt-hd-row"><td></td>';
			
			_grid.columnList.forEach(function(colObj) {
				tmp += '<td><div class="gt-inner  gt-inner-center">' + colObj.header + '</div></td>';
			});
			
			tmp += '</tr><tbody></tbody>';
			
			var thead = document.querySelector('#' + dialogId + '_div thead'); 
			thead.insertAdjacentHTML('beforeend', tmp);
		};
		
		var _viewInList = function(ar, cls) {
			var tables = new Sigma.Table(ar);
			
			var keys = tables.keys().filter(function(key) {
				return key.substr(0, 1) != '_';
			});
			
			var actions = ['length', 'sum', 'avg', 'max', 'min'];
			var tmp = '';
			
			actions.forEach(function(act) {
				tmp += '<tr class="gt-row ' + cls + '">';
				tmp += '<td><div class="gt-inner gt-inner-center">' + act + '</div></td>';
				var _tables = tables;
				
				tmp += keys.map(function(key) {
					return '<td><div class="gt-inner gt-inner-right">' + _tables[act](key) + '</div></td>';
				}).join("");
				
				tmp += '</tr>';
			});
			return tmp;
		};
		
		var viewList = function() {
			var tmp = '';
			tmp += _viewInList(_grid.getSelectedRecords());
			tmp += _viewInList(_grid.dataset.data, 'gt-row-even');
			
			var tbody = document.querySelector('#' + dialogId + '_div tbody'); 
			tbody.insertAdjacentHTML('beforeend', tmp);
		};
		
		var dialog = new Sigma.Dialog({
			id:dialogId,
			gridId:grid.id ,
			title:grid.getMsg('DIAG_TITLE_AGGREGATE') || 'Aggregate',
			width:outW,
			height:outH ,
			buttonLayout:'h',
			body:this._bodyTemplate({
				dialogId:dialogId,
				width:inW,
				height:inH,
			}),
			buttons : [
				{text:grid.getMsg('TEXT_CLOSE'), onclick:closeFn},
			],
			afterShow : function(){
				viewHead();
				viewList();
			}
		});
		return  dialog;
	},
	
	_bodyTemplate:function(param) {
		var tmp = '\
			<div id="${dialogId}_div" style="width:${width}px; height:${height}px;">\
				<table style="overflow:scroll-x; padding:4px; cellspacing=0; cellpadding=0; border=0;">\
				<thead></thead>\
				<tbody></tbody>\
				</table>\
			</div>\
		';
		return Sigma.Template.expand(tmp, param);
	},
};
