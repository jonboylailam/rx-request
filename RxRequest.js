var stampit = require('stampit');
var Rx = require('rx');
var request = require('request-json');
var url = require('url');

var rxRequest = stampit().init(function () {
    var client = request.createClient(this.url);
    if (this.auth.username && this.auth.password) {
        client.setBasicAuth(this.auth.username, this.auth.password);
    }

    if (this.authorization) {
        client.headers['Authorization'] = this.authorization;
    }

    this.getClient = function () {
        return client;
    }
}).refs({
    url: 'http://some-host.com',
    auth: {},
    authorization: undefined
});

rxRequest = rxRequest.methods({
    get: function (req) {
        var client = this.getClient();
        return Rx.Observable.create(function (observer) {
            var urlStr = url.format(req);
            console.log("url: %s", urlStr);
            client.get(urlStr, function (err, res, ans) {
                if (err) observer.onError(err);
                observer.onNext(ans);
                observer.onCompleted();
            });
        });
    },
    post: function (req, data) {
        var client = this.getClient();
        return Rx.Observable.create(function (observer) {
            var urlStr = url.format(req);
            client.post(urlStr, data, function (err, res, ans) {
                if (err) observer.onError(err);

                console.log("url: %s dataIn: %s response: %s",
                    urlStr, JSON.stringify(data), JSON.stringify(ans));
                observer.onNext(ans);
                observer.onCompleted();
            });
        });
    }
});

module.exports = rxRequest;






