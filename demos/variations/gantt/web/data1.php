<?php

$tempFileName = tempnam(sys_get_temp_dir(), 'SigmaGantt');
$file = new SplFileObject($tempFileName, 'a');

$file->fwrite(var_export($_GET, true));

$data = [
[
	'project'=>'aaaシステム',
	'user'=>'青木',
	'startDay'=>'2018-01-23',
	'endDay'=>'2018-02-23',
	'task'=>'システム設計',
	'progress'=>80,
	'chart'=>[
		[
			'id'=>'p1',
			'start'=>'{startDay}',
			'end'=>'{endDay}',
			'type'=>'bar',
			'progress'=>'{progress}',
			'format'=>'YYYY-MM-DD',
			'text'=>'システム設計',
			'className'=>'my-class',
			'textColor'=>'#ff0000',
			'borderColor'=>'#ff0000',
			'backgroundColor'=>'#00ff00',
			'progressColor'=>'#0000ff',
		],
	],
],	
[
	'project'=>'aaaシステム',
	'user'=>'井上',
	'startDay'=>'2018-02-12',
	'endDay'=>'2018-03-12',
	'task'=>'ソフト設計',
	'progress'=>30,
	'chart'=>[
		[
			'id'=>'p2',
			'start'=>'{startDay}',
			'end'=>'{endDay}',
			'type'=>'bar',
			'progress'=>'{progress}',
			'format'=>'YYYY-MM-DD',
			'text'=>'ソフト設計',
		],
	],
],	
[
	'project'=>'aaaシステム',
	'user'=>'鵜島',
	'startDay'=>'2018-02-12',
	'endDay'=>'2018-03-01',
	'task'=>'PLC設計',
	'progress'=>10,
	'chart'=>[
		[
			'id'=>'p31',
			'start'=>'2018-02-12',
			'end'=>'2018-02-12',
			'type'=>'stone',
			'format'=>'YYYY-MM-DD',
			'text'=>'DR-B',
		],
		[
			'id'=>'p32',
			'start'=>'2018-03-01',
			'end'=>'2018-03-01',
			'type'=>'stone',
			'format'=>'YYYY-MM-DD',
			'text'=>'DR-C',
		],
	],
],
	
];

print(json_encode(['data' => $data]));
