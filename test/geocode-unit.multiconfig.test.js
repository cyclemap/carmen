var tape = require('tape');
var Carmen = require('..');
var context = require('../lib/context');
var mem = require('../lib/api-mem');
var queue = require('d3-queue').queue;
var addFeature = require('../lib/util/addfeature'),
    queueFeature = addFeature.queueFeature,
    buildQueued = addFeature.buildQueued;

var country =new mem(null, function() {});
var region = new mem(null, function() {});
var place = new mem(null, function() {});
var confA = {
    country: country,
    place: place
};
var confB = {
    country: country,
    region: region,
    place: place
};
var pre = new Carmen(confA);

tape('index province', (t) => {
    t.ok(pre);
    queueFeature(confA.country, {
        id:1,
        properties: {
            'carmen:text':'america',
            'carmen:zxy':['6/32/32'],
            'carmen:center':[0,0]
        }
    }, t.end);
});
tape('index place', (t) => {
    queueFeature(confA.place, {
        id:1,
        properties: {
            'carmen:text':'chicago',
            'carmen:zxy':['6/32/32','6/33/32'],
            'carmen:center':[0,0]
        }
    }, t.end);
});
tape('build queued features', (t) => {
    var q = queue();
    Object.keys(confA).forEach(function(c) {
        q.defer(function(cb) {
            buildQueued(confA[c], cb);
        });
    });
    Object.keys(confB).forEach(function(c) {
        q.defer(function(cb) {
            buildQueued(confB[c], cb);
        });
    });
    q.awaitAll(t.end);
});
tape('chicago (conf a)', (t) => {
    var a = new Carmen(confA);
    a.geocode('chicago', {}, function(err, res) {
        t.ifError(err);
        t.deepEqual(res.features[0].place_name, 'chicago, america');
        t.deepEqual(res.features[0].id, 'place.1');
        t.end();
    });
});
tape('chicago (conf b)', (t) => {
    var b = new Carmen(confB);
    b.geocode('chicago', {}, function(err, res) {
        t.ifError(err);
        t.deepEqual(res.features[0].place_name, 'chicago, america');
        t.deepEqual(res.features[0].id, 'place.1');
        t.end();
    });
});

tape('teardown', (t) => {
    context.getTile.cache.reset();
    t.end();
});
