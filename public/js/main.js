var app = angular.module('stockStatusModule', ['ngAnimate', 'ui.bootstrap']);

app.controller('updateController', function ($scope, socket) {
    $scope.isCollapsed = false;
    $scope.status = 'AngularJS successfully loaded.';
    $scope.stocks = [
        { name: "Apple", price: 4.50 },
        { name: "Microsoft", price: 4.00 },
        { name: "Facebook", price: 3.75 },
// Added two extra stock options to see how it affects the page --> If you only add the stocks in the ticker.js, they only show up when the ticker is running.
// --> you need to change the main.js in the public folder, since the names are hardcoded.
        { name: "Test001", price: 56.75 },
        { name: "Test002", price: 867.75 }
    ];
    
// --> You can change the socket.emit XXX value to whatever you want, just remember to change the value in both ticker.js and main.js 
// start_from_button is the name of the "button" function, located on/in the index.jade page.
    $scope.start_from_button = function () {
        socket.emit('start_from_mainjs');
    };
// --> You can change the socket.emit XXX value to whatever you want, just remember to change the value in both ticker.js and main.js 
// stop_from_button is the name of the "button" function, located on/in the index.jade page.
    $scope.stop_from_button = function () {
        socket.emit('stop_from_mainjs');
    };
// --> You can change the socket.emit XXX value to whatever you want, just remember to change the value in both ticker.js and main.js 
// buy_from_button is the name of the "button" function, located on/in the index.jade page.
    $scope.buy_from_button = function (element) {
        socket.emit('buy_from_mainjs', element.name);
    };

        $scope.ssh_from_button = function () {
        socket.emit('ssh_from_mainjs');
    };
// Changing status to status_test --> Status is pulled from server.js and main.js to be shown on index.jade
    socket.on('status_test', function (data) {
        $scope.status_test = data.message;
    });

    socket.on('update', function (data) {
        $scope.stocks = data.stocks;
    });

        
});

app.controller('updateController2', function ($scope, socket) {
    $scope.isCollapsed = false;

});

app.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});


