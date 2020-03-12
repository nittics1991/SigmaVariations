/**
*	LoadCancel
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
Sigma.Gantt.Error.LoadCancel = function(message){
	this.message = message || 'error';
};
Object.setPrototypeOf(Sigma.Gantt.Error.LoadCancel, Error);
Sigma.Gantt.Error.LoadCancel.prototype = Object.create(Error.prototype);
Sigma.Gantt.Error.LoadCancel.prototype.name = "Sigma.Gantt.Error.LoadCancel";
Sigma.Gantt.Error.LoadCancel.prototype.constructor = Sigma.Gantt.Error.LoadCancel;
