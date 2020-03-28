//

if (!window.Sigma){
	window.Sigma={};
}
Sigma.Msg=Sigma.Msg || {};
SigmaMsg=Sigma.Msg;

Sigma.Msg.Grid = Sigma.Msg.Grid || {};

Sigma.Msg.Grid.en={
	LOCAL : "JP",
	ENCODING : "UTF-8",
	NO_DATA : "データなし",


	GOTOPAGE_BUTTON_TEXT: 'Go To',

	FILTERCLEAR_TEXT: "全フィルタ削除",
	SORTASC_TEXT	: "昇順",
	SORTDESC_TEXT	: "降順",
	SORTDEFAULT_TEXT: "原文",

	ERR_PAGENUM		: "ページ番号は整数 1 - #{1}.",

	EXPORT_CONFIRM	: "この操作は全体のテーブルのすべてのレコードに影響します\n\n( \"Cancel\" を押すと現在ページを制限内にします)",
	OVER_MAXEXPORT	: "レコード数制限を超過 最大 #{1}",

	PAGE_STATE	: "#{1} - #{2} 行,  #{3}ページ 合計 #{4}",
	PAGE_STATE_FULL	: "#{5}ページ #{1} - #{2} 行表示  合計 #{3}ページ #{4} 行",

	SHADOWROW_FAILED: "関連情報が入手できません",
	NEARPAGE_TITLE	: "",
	WAITING_MSG : 'しばらくお待ちください...',

	NO_RECORD_UPDATE: "変更がありません",
	UPDATE_CONFIRM	: "保存しますか?",
	NO_MODIFIED: "変更がありません",

	
	PAGE_BEFORE : 'ページ',
	PAGE_AFTER : '',

	PAGESIZE_BEFORE :   '',
	PAGESIZE_AFTER :   'ページあたり',

	RECORD_UNIT : '',
	
	CHECK_ALL : '全てチェック',

	COLUMNS_HEADER : '列',

	DIAG_TITLE_FILTER : 'フィルターオプション',
	DIAG_NO_FILTER : 'フィルター無し',
	TEXT_ADD_FILTER	: "追加",
	TEXT_CLEAR_FILTER	: "全削除",
	TEXT_OK	: "OK",
	TEXT_DEL : "削除",
	TEXT_CANCEL	: "Cancel",
	TEXT_CLOSE	: "閉じる",
	TEXT_UP : "上",
	TEXT_DOWN : "下",

	NOT_SAVE : "保存しますか? \n \"Cancel\" で取り消します",

	DIAG_TITLE_CHART  : 'チャート',

	CHANGE_SKIN : "スキン",

	STYLE_NAME_DEFAULT : "Classic",
	STYLE_NAME_PINK : "Pink",
	STYLE_NAME_VISTA : "Vista",
	STYLE_NAME_MAC : "Mac",
	
	/*v1170==>*/
	STYLE_NAME_VARIATIONS:"Variations",
	/*<==v1170*/
	
	MENU_FREEZE_COL : "列固定",
	MENU_SHOW_COL : "列非表示",
	MENU_GROUP_COL : "グループ化",

	TOOL_RELOAD : "更新" ,
	TOOL_ADD : "追加" ,
	TOOL_DEL : "削除" ,
	TOOL_SAVE : "保存" ,

	TOOL_PRINT : "印刷" ,
	TOOL_XLS : "xls出力" ,
	TOOL_PDF : "pdf出力" ,
	TOOL_CSV : "csv出力" ,
	TOOL_XML : "xml出力",
	TOOL_FILTER : "フィルター" ,
	TOOL_CHART : "チャート",
	
	/*v1190==>*/
	TOOL_PAGE_FIRST:"先頭",
	TOOL_PAGE_PREV:"前",
	TOOL_PAGE_NEXT:"次",
	TOOL_PAGE_LAST:"最後",
	/*<==v1190*/
	
	/*v1171==>*/
	TOOL_BOOKMARK:"ブックマーク",
	TOOL_AGGREGATE:"集約",
	TOOL_COPY:"選択行コピー",
	TOOL_PASTE:"追加貼付け",
	TOOL_FILLCOLUMN:"カラム上書き",
	TOOL_ROWHEIGHT:"行高さ変更",
	TOOL_SELECTEDCHECK:"選択行チェック",
	/*<==v1171*/
	
	/*v1190==>*/
	TOOL_SKIN:"SaveSkin",
	TOOL_CONFIG:"SaveConfig",
	TOOL_UNCONFIG:"DeleteConfig",
	TOOL_DOWNLOADCONFIG:"DownloadConfig",
	TOOL_UPLOADCONFIG:"UploadConfig",
	/*<==v1190*/
	
	/*v1150==>*/
	DIAG_TITLE_BOOKMARK:"Filter Bookmark",
	TEXT_ADD_BOOKMARK:"Add",
	TEXT_DEL_BOOKMARK:"Del",
	TEXT_EXEC_BOOKMARK:"Exec",
	/*<==v1150*/
	
	/*v1160==>*/
	DIAG_TITLE_AGGREGATE:"Table Aggregate",
	/*<==v1160*/
	
	/*v1190==>*/
	DIAG_TITLE_FILEREADER:"FileReader",
	/*<==v1190*/
	
	/*v1230==>*/
	DIAG_TITLE_DRAGSORT: "DragSort",
	WARNING_DRAG_SORT: "sort failure",
	/*<==v1230*/
	
	/*v1260==>*/
	TOOL_ROWSYNC:"SyncRowHeight",
	/*<==v1260*/
	
	/*v210==>*/
	DIAG_TITLE_HTML_FILTER:"HTML Filter in Page",
	TOOL_HTMLFILTER : "Html Filter in Page" ,
	/*<==v210*/
    
	
};

Sigma.Msg.Grid['default']=Sigma.Msg.Grid.en;


if (!Sigma.Msg.Validator){
	Sigma.Msg.Validator={ };
}

Sigma.Msg.Validator.en={
		
		/*v1140==>*/
		/*
		'required'	: '{0#This field} is required.',
		'date'		: '{0#This field} must be in proper format ({1#YYYY-MM-DD}).',
		'time'		: '{0#This field} must be in proper format ({1#HH:mm}).',
		'datetime'	: '{0#This field} must be in proper format ({1#YYYY-MM-DD HH:mm}).',
		'email'		: '{0#This field} must be in proper email format.',
		'telephone'	: '{0#This field} must be in proper phone no format.',
		'number'	: '{0} must be a number.',
		'integer'	: '{0} must be an integer.',
		'float'		: '{0} must be integer or decimal.',
		'money'		: '{0} must be integer or decimal with 2 fraction digits.',
		'range'		: '{0} must be between {1} and {2}.',
		'equals'	: '{0} must be same as {1}.',
		'lessthen'	: '{0} must be less than {1}.',
		'idcard'	: '{0} must be in proper ID format',

		'enchar'	: 'Letters, digits or underscore allowed only for {0}',
		'cnchar'	: '{0} must be Chinese charactors',
		'minlength'	: '{0} must contain more than {1} characters.',
		'maxlength'	: '{0} must contain less than {1} characters.'
		*/
		
		'required'	: 'This field is required.',
		'date'		: 'must be in proper format.',
		'time'		: 'must be in proper format.',
		'datetime'	: 'must be in proper format.',
		'email'		: 'must be in proper email format.',
		'telephone'	: 'must be in proper phone no format.',
		'number'	: 'must be a number.',
		'integer'	: 'must be an integer.',
		'float'		: 'must be integer or decimal.',
		'money'		: 'must be integer or decimal with 2 fraction digits.',
		'range'		: 'must be between #{1} and #{2}.',
		'equals'	: 'must be same as #{1}.',
		'lessthen'	: 'must be less than #{1}.',
		'greatethen': 'must be greater than #{1}.',
		'less'	    : 'must be less #{1}.',
		'greater'  	: 'must be greater #{1}.',
		'idcard'	: 'must be in proper ID format.',
		'cnchar'	: 'must be Chinese charactors.',
		'minlength' : 'must contain more than #{1} characters.',
		'maxlength' : 'must contain less than #{1} characters.',
		
		/*<==v1140*/
		
}

Sigma.Msg.Validator['default'] = Sigma.Msg.Validator.en;

//
