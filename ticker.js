function Ticker(opt) {
    this._decay = opt.decay;
    this._growth = opt.growth;
    this._stocks = opt.stocks;
    this._state = null;
};
Ticker.prototype.execute = function () {
    var self = this;
    this._stocks.forEach(function (p, i) {
        p.price -= p.price / self._decay;
    });
    process.send({ stocks: this._stocks });

    this._state = setTimeout(function () {
        self.execute();
    }, 1000);
};
Ticker.prototype.stop = function () {
    clearTimeout(this._state);
    this._state = 10;
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
