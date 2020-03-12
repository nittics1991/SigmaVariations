/**
*	InvalidArgument
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
Sigma.Gantt.Error.InvalidArgument = function(message){
	this.message = message || 'error';
};
Object.setPrototypeOf(Sigma.Gantt.Error.InvalidArgument, Error);
Sigma.Gantt.Error.InvalidArgument.prototype = Object.create(Error.prototype);
Sigma.Gantt.Error.InvalidArgument.prototype.name = "Sigma.Gantt.Error.InvalidArgument";
Sigma.Gantt.Error.InvalidArgument.prototype.constructor = Sigma.Gantt.Error.InvalidArgument;
