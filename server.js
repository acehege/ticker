var jade = require('jade'),
	express = require('express'),
	app = express(),
    server = require('http').createServer(app),
	io = require('socket.io').listen(server);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.logger());
app.use(express.compress());
app.use(express.static(__dirname + '/public'));
	
app.get('/', function(req, res){
	res.render('index');
});

server.listen(process.env.PORT || 3000);
console.log('listening on' + process.env.PORT || 3000);

var cp = require('child_process').fork('ticker');
cp.on('message', function (message) {
    io.sockets.emit('update', message);
});

io.sockets.on('connection', function (socket) {
// Changing status to status_test --> Status is pulled from server.js and main.js to be shown on index.jade
    socket.emit('status_test', { message: "Connected" });
// start --> ticker.js " if (msg.op === 'startNOW') { ticker.execute();} " the function in the ticker.js listens for the op: msg " -->
// the first value in ( socket.on ) is from the main.js, "$scope.start = function () {socket.emit('start_from_mainjs');};"
// --> You can change the socket.emit XXX to whatever you want, just remember to change the value in ticker.js and main.js
    socket.on('start_from_mainjs', function (data) {
// You can change the op: XXX to whatever you want, just remember to change the function in ticker.js
        cp.send({ op: 'startNOW' });
// Emit the status in socket.io (Connected, Processing, Stopped )
// Changing status to status_test --> Status is pulled from server.js and main.js to be shown on index.jade
        socket.emit('status_test', { message: "Processing" });
    });
// Stop --> ticker.js " else if (msg.op === 'stopNOW') ticker.stop();} " the function in the ticker.js listens for the (msg.op ===) "
    socket.on('stop_from_mainjs', function (data) {
// You can change the op: XXX to whatever you want, just remember to change the function in ticker.js
        cp.send({ op: 'stopNOW' });
// Emit the status in socket.io (Connected, Processing, Stopped )
// Changing status to status_test --> Status is pulled from server.js and main.js to be shown on index.jade
        socket.emit('status_test', { message: "Stopped" });
    });
// buy --> ticker.js "" else if (msg.op === 'buyNOW') { ticker.buy(msg.name); }" the function in the ticker.js listens for the (msg.op ===)
// --> in this case the "buy" function. This calls the Ticker.prototype.buy 
    socket.on('buy_from_mainjs', function (data) {
        cp.send({ op: 'buyNOW', name: data });
    });

// SSH
    socket.on('ssh_from_mainjs', function (data) {
        cp.send({ op: 'sshNOW', name: data });
    });

});
