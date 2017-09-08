let assert = require('assert');
let EventHelper = require('../lib/eventhelper.js');

describe('#method: on & emit', ()=>{
    let emmiter = new EventHelper();
    let emitResult = '';
    emmiter.on('test', (name)=> emitResult = `hello ${name}`);
    emmiter.emit('test', 'wangyafei');

    it('#on() should return EventHelper instance', ()=>{
        assert.ok(emmiter instanceof EventHelper);
    });

    it('#on() emmiter._eventEmitter["test"] length should be 1', ()=>{
        assert.equal(emmiter._eventEmitter['test'].length, 1);
    });

    it('#on() should bind a callback function for event: test', ()=>{
        assert.equal(typeof emmiter._eventEmitter['test'][0], 'function');
    });

    it('#emit() should emit a value to callback function', ()=>{
        assert.equal(emitResult, 'hello wangyafei');
    });
});
