/**
*	LoadFailure
**/
if (!window.Sigma) {
  window.Sigma = {};
}

if (!Sigma.Gantt) {
  Sigma.Gantt = {};
}

if (!Sigma.Gantt.Error) {
  Sigma.Gantt.Error = {};
}

/**
*	{inherit}
*
**/
Sigma.Gantt.Error.LoadFailure = function(message){
	this.message = message || 'error';
};
Object.setPrototypeOf(Sigma.Gantt.Error.LoadFailure, Error);
Sigma.Gantt.Error.LoadFailure.prototype = Object.create(Error.prototype);
Sigma.Gantt.Error.LoadFailure.prototype.name = "Sigma.Gantt.Error.LoadFailure";
Sigma.Gantt.Error.LoadFailure.prototype.constructor = Sigma.Gantt.Error.LoadFailure;
