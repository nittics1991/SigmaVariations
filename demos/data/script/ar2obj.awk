#
#	test_data.jsのデータ型をarray==>object変換
#

BEGIN {
	FS=","
	firstBranket = 0;
}

{
	if ($0 ~ /TEST_DATA/) {
		sub(/TEST_DATA/, "TEST_DATA_OBJ", $0);
		print $0;
	} else if ($0 !~ /\[/) {
		print $0;
	} else if (firstBranket == 0) {
		firstBranket = 1;
		print $0;
	} else {
		sub(/\]/, "", $9);
		printf "{no:%s,\tcountory:%s,\tcustomer:%s,\temployee:%s,\tbill2005:%s,\tbill2006:%s,\tbill2007:%s,\tbill2008:%s,\torderDate:%s},\n", substr($1, 2), $2, $3, $4, $5, $6, $7, $8, $9;
	}
	
}

