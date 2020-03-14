/**
*	HTML表示文字フィルタ
**/
if (!window.Sigma) {
  window.Sigma = {};
}

if (!Sigma.Tool) {
  Sigma.Tool = {};
}

/**
*	construct
*
* @param object
**/
Sigma.Tool.HtmlFilter = function(grid){
	this.grid = grid;
    this.htmlFieldNameMap = [];
};

/**
*	検索するHTMLフィールド名
*
* @param string
* @param string
* @return mixed 
**/
Sigma.Tool.HtmlFilter.prototype.htmlFieldName = function(fieldName)
{
    return '_html_filter_'  + fieldName;
};

/**
* 検索するHtmlデータをgrid.datasetに追加
*
* @param string
**/
Sigma.Tool.HtmlFilter.prototype.addHtmlData = function(fieldName)
{
    let gridId = this.grid.gridId;
    let clsName = '.gt-col-' + gridId + '-' + fieldName;
    
    let elms = document.querySelectorAll(
        '#' + gridId + '_bodyDiv ' + clsName.toLowerCase()
    );
    
    let _grid = this.grid;
    let startRow = _grid.navigator.pageInfo.pageSize
        * (_grid.navigator.pageInfo.pageNum - 1)
        + _grid.navigator.pageInfo.startRowNum - 1;
    
    let dummyFieldName = this.htmlFieldName(fieldName);
    
    try {
        _grid.dataset.fieldsMap[dummyFieldName] = {
            index: dummyFieldName,
            name: dummyFieldName,
            type: 'string',
        };
        
        let _data = _grid.dataset.data;
        Array.prototype.forEach.call(elms, function(elm, index) {
            _data[startRow + index][dummyFieldName] = elm.textContent
        });
        
    } finally {
        this.htmlFieldNameMap.push(dummyFieldName);
    }
};

/**
* 追加したデータをクリア
*
**/
Sigma.Tool.HtmlFilter.prototype.clean = function() {
    let _dataset = this.grid.dataset;
    
    this.htmlFieldNameMap.forEach(function(name) {
        delete _dataset.fieldsMap[name];
        
        let _data = _dataset.data;
        let _name = name;
        
        _data.forEach(function(obj) {
            delete obj[_name];
        });
    });
};

/**
*	ダイアログ
*
**/
Sigma.Tool.HtmlFilterDialog = {
	/**
	*	生成
	*
    *   @see gt_dialog.js createFilterDialog()
	**/
	create:function(cfg) {
      var gridId = cfg.gridId;
      var grid = Sigma.$grid(gridId);
      var dialogId = gridId + "_htmlFilterDialog";
      
      //
      grid.justShowFiltered =
        cfg.justShowFiltered === true
          ? true
          : cfg.justShowFiltered === false ? false : grid.justShowFiltered;
      grid.afterFilter = cfg.afterFilter || grid.afterFilter;

      var addFn = function() {
        if (grid._noFilter) {
          clearFn();
          grid._noFilter = false;
        }
        var colSelect = Sigma.$(dialogId + "_column_select");
        if (colSelect && colSelect.options.length > 0) {
          var cid = colSelect.value;
          var cname = colSelect.options[colSelect.selectedIndex].text;
          Sigma.$(dialogId + "_div").appendChild(
            Sigma.createFilterItem(grid, cid, cname)
          );
        }
      };

      var clearFn = function() {
        Sigma.$(dialogId + "_div").innerHTML = "";
      };

      var okFn = function() {
        var colDiv = Sigma.$(dialogId + "_div");

        var filterInfo = [];
        
        //add htmlFilter obj
        var htmlFilter = new Sigma.Tool.HtmlFilter(grid);
        
        try {
            var items = colDiv.childNodes;
            for (var i = 0; i < items.length; i++) {
              if (
                Sigma.U.getTagName(items[i]) == "DIV" &&
                items[i].className == "gt-filter-item"
              ) {
                var colS = items[i].childNodes[1];
                var condS = items[i].childNodes[2];
                var f = items[i].childNodes[3].firstChild;
                var cid = Sigma.U.getValue(colS);
                var colObj = grid.columnMap[cid];
                
                if (colObj && colObj.fieldName) {
                  //htmlFilter でgrid.datasetに検索データ追加
                  htmlFilter.addHtmlData(colObj.fieldName);
                  
                  filterInfo.push({
                    columnId: cid,
                    //htmlFilter で検索するdatasetフィールド名
                    fieldName: htmlFilter.htmlFieldName(
                        colObj.fieldName
                    ),
                    logic: Sigma.U.getValue(condS),
                    value: Sigma.U.getValue(f)
                  });
                }
              }
            }
            if (filterInfo.length > 0) {
              //一度表示をリセット
              grid.applyFilter([]);
              var rowNos = grid.applyFilter(filterInfo);
            } else {
              grid.applyFilter([]);
            }
            
        } finally {
          //grid.datasetに仮想的に追加したデータをクリア
          htmlFilter.clean();
        }
        
        if (cfg.autoClose !== false) {
          grid._onResize();
          Sigma.WidgetCache[dialogId].close();
        }
      };

      var cancelFn = function() {
        Sigma.WidgetCache[dialogId].close();
      };

      var outW = 430,
        outH = 220;
      var inW = outW - (Sigma.isBoxModel ? 16 : 18),
        inH = outH - (Sigma.isBoxModel ? 93 : 95);
      var dialog = new Sigma.Dialog({
        id: dialogId,
        gridId: gridId,
        title: cfg.title,
        width: outW,
        height: outH,
        buttonLayout: "h",
        body: [
          '<div id="' +
            dialogId +
            '_div" class="gt-filter-dialog" style="width:' +
            inW +
            "px;height:" +
            inH +
            'px;" onclick="Sigma.clickHandler.onFilterItem(event)" >',
          "</div>"
        ].join(""),
        buttons: [
          { html: Sigma.createColumnSelect(grid, dialogId + "_column_select") },
          { text: grid.getMsg("TEXT_ADD_FILTER"), onclick: addFn },
          { text: grid.getMsg("TEXT_CLEAR_FILTER"), onclick: clearFn },
          { breakline: true },
          { text: grid.getMsg("TEXT_OK"), onclick: okFn },
          { text: grid.getMsg("TEXT_CLOSE"), onclick: cancelFn }
        ],
        afterShow: function() {
          var grid = Sigma.$grid(this.gridId);
          var filterInfo = grid.filterInfo || [];
          clearFn();
          for (var i = 0; i < filterInfo.length; i++) {
            var cid = filterInfo[i].columnId;
            var col = grid.getColumn(cid);
            var cname = col.header || col.title;
            var tt = Sigma.createFilterItem(grid, cid, cname);
            var colS = tt.childNodes[1];
            var condS = tt.childNodes[2];
            var f = tt.childNodes[3].firstChild;
            Sigma.U.setValue(colS, cid);
            Sigma.U.setValue(condS, filterInfo[i].logic);
            Sigma.U.setValue(f, filterInfo[i].value);
            Sigma.$(this.id + "_div").appendChild(tt);
          }
          if (filterInfo.length < 1) {
            Sigma.$(this.id + "_div").innerHTML =
              '<div style="color:#999999;margin:10px;">' +
              grid.getMsg("DIAG_NO_FILTER") +
              "</div>";
            grid._noFilter = true;
          }
        }
      });

      return dialog;
    }
};
