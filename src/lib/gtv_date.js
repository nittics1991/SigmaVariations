/**
*	日付操作
* 	@see moment.js
**/
if (!window.Sigma) {
  window.Sigma = {};
}

/**
* 
**/
Sigma.Date = function () {
	return moment.apply(this, arguments);
};

Sigma.Date.prototype = new moment;

/**
* 	月内週番号
* 
**/
moment.prototype.weekInMonth = function() {
	var m = this;
	var week = m.week();
	var firstDateWeek = moment(m).startOf('month').week();
	
	if (firstDateWeek <= week) {
		return week - firstDateWeek +1;
	}
	
	var dmyWeek;
	for (var i=1; i<31; i++) {
		dmyWeek = m.clone().subtract(i, 'day').week();
		if (dmyWeek > week) {
			return (dmyWeek+1) - firstDateWeek + 1;
		}
	}
	return (dmyWeek+1) - firstDateWeek + 1;
};

/**
* 	{inherit}
* 
**/
moment.prototype.exFormat = function(form) {
	if (form && form.indexOf('B') > -1) {
		form = form.replace(/B/g, this.weekInMonth());
	}
	return this.format(form);
};
