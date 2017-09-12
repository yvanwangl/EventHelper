let assert = require('assert');
let EventHelper = require('../index');

describe('#method: un', ()=>{
    let emmiter = new EventHelper();

    it('#un(eventType, handler) should remove a handler from emmiter listeners', ()=>{
        let handler = ()=> console.log('test handler');
        emmiter.on('test', handler);
        assert.equal(emmiter._eventEmitter['test'].length, 1);
        emmiter.un('test', handler);
        assert.equal(emmiter._eventEmitter['test'].length, 0);
    });

    it('#un(eventType) should remove all handlers', ()=>{
        let handler1 = ()=> console.log('test handler1');
        let handler2 = ()=> console.log('test handler2');
        emmiter.on('test', handler1);
        emmiter.on('test', handler2);
        assert.equal(emmiter._eventEmitter['test'].length, 2);
        emmiter.un('test');
        assert.equal(emmiter._eventEmitter['test'].length, 0);
    });
});

describe('#method: unAllListeners', ()=>{
    let emmiter = new EventHelper();

    it('#unAllListeners(eventType) should remove all handlers', ()=>{
        let handler1 = ()=> console.log('test handler1');
        let handler2 = ()=> console.log('test handler2');
        emmiter.on('test', handler1);
        emmiter.on('test', handler2);
        assert.equal(emmiter._eventEmitter['test'].length, 2);
        emmiter.unAllListeners('test');
        assert.equal(emmiter._eventEmitter['test'].length, 0);
    });
});