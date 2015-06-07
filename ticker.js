var PythonShell = require('python-shell');
var options = {
  scriptPath: '/home/acehege/ticker/public/python'
};
function Ticker(opt) {
    this._decay = opt.decay;
    this._growth = opt.growth;
    this._stocks = opt.stocks;
    this._state = null;
};
Ticker.prototype.execute = function () {
var options = {
scriptPath: '/home/acehege/ticker/public/python'
};
PythonShell.run('/hello.py', function (err) {
  if (err) throw err;
  console.log('finished');
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
