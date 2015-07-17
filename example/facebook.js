var stampit = require('stampit');
var request = require('request-json');
var Rx = require('rx');
var url = require('url');

var rxRequest = require('../RxRequest');

var pageInfo = stampit.props({
    protocol: "https",
    hostname: "graph.facebook.com/v2.4"
});

var facebook = rxRequest.methods({
    getPageInfo: function (handle) {
        var data = pageInfo({
            pathname: handle,
            search: 'fields=category&access_token='+this.accessToken
        });
        return this.get(data);
    }
}).refs({
    accessToken: undefined // set your facebook access token here
});

function testPageInfo() {
    var fb = facebook({url: 'https://graph.facebook.com/v2.4'});
    fb.getPageInfo('teslamotors')
        .subscribe(
        function (d) {
            console.log('Next: ' + JSON.stringify(d));
        },
        function (err) {
            console.log('Error: ' + err);
        },
        function () {
            console.log('Completed');
        }
    );
}

testPageInfo();
