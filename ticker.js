// Adding python-shell to allow python scripts to be called.
var PythonShell = require('python-shell');

function Ticker() {

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

Ticker.prototype.ssh = function () {
    //Run the hello.py script located in the python folder at the base of ticker
    //( see more info regarding python-shell here: https://www.npmjs.com/package/python-shell )

    var pyshell = new PythonShell('ssh2.py');

    pyshell.send('hello');

    pyshell.on('message', function (message) {
      // received a message sent from the Python script (a simple "print" statement)
      console.log(message);
    });

    // end the input stream and allow the process to exit
    pyshell.end(function (err) {
      if (err) throw err;
      console.log('finished');
    });

//    PythonShell.run('/ssh.py', function (err) {
//      if (err) throw err;
    // This is the console output on the node commandline
//      console.log('ssh.py script has been executed from a button-call');


    };

// 

// Note to self, this is how i can call python-shell and run the scripts
    process.on('message', function (msg) {
        if (msg.op === 'startNOW') {
            Ticker.prototype.execute();
        }
        else if (msg.op === 'stopNOW') {
            ticker.stop();
        }
        else if (msg.op === 'buyNOW') {
            ticker.buy(msg.name);
        }
        else if (msg.op === 'sshNOW') {
            Ticker.prototype.ssh();
        }
    });
