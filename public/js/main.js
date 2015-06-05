var app = angular.module('stockStatusModule', []);

app.controller('updateController', function ($scope, socket) {
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

    $scope.start = function () {
        socket.emit('start_from_mainjsTEST');
    };

    $scope.stop = function () {
        socket.emit('stop');
    };

    $scope.buy = function (element) {
        socket.emit('buy', element.name);
    };

    socket.on('status', function (data) {
        $scope.status = data.message;
    });

    socket.on('update', function (data) {
        $scope.stocks = data.stocks;
    });
        
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
