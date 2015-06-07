// Adding python-shell to allow python scripts to be called.
var PythonShell = require('python-shell');
function Ticker(opt) {
    this._decay = opt.decay;
    this._growth = opt.growth;
    this._stocks = opt.stocks;
    this._state = null;
};
// Testing the execute ( start button ) function, so python scripts can be called and run from the webinterface
Ticker.prototype.execute = function () {
//Run the hello.py script located in the python folder at the base of ticker
//( see more info regarding python-shell here: https://www.npmjs.com/package/python-shell )
PythonShell.run('/hello.py', function (err) {
  if (err) throw err;
// This is the console output on the node commandline
  console.log('Hello.py script has been executed from a button-call');
});
};
Ticker.prototype.stop = function () {
    clearTimeout(this._state);
    this._state = null;
};
Ticker.prototype.buy = function (name) {
    var self = this;
    this._stocks.forEach(function (p, i) {
        if(p.name === name)
            p.price += p.price / self._growth;
    });
};
// 
var ticker = new Ticker({
    growth: 10.0,
    decay: 1800.0,
    stocks: [
        { name: "Apple", price: 14.50 },
        { name: "Microsoft", price: 43.00 },
        { name: "Facebook", price: 37.75 },
// Added two extra stock options to see how it affects the page --> If you only add the stocks in the ticker.js, they only show up when the ticker is running.
// --> you need to change the main.js in the public folder, since the names are hardcoded.
        { name: "Test001", price: 56.75 },
        { name: "Test002", price: 867.75 }
    ]
});
// Note to self, this is how i can call python-shell and run the scripts
process.on('message', function (msg) {
    if (msg.op === 'startNOW') {
        ticker.execute();
    }
    else if (msg.op === 'stopNOW') {
        ticker.stop();
    }
    else if (msg.op === 'buyNOW') {
        ticker.buy(msg.name);
    }
});
