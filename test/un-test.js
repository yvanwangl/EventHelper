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

    it('#un() should throw an error with message: "eventType" is required, should be a String name, please checkout', ()=>{
        let handler1 = ()=> console.log('test handler1');
        let handler2 = ()=> console.log('test handler2');
        emmiter.on('test', handler1);
        emmiter.on('test', handler2);
        try {
            emmiter.un();
        }catch(e){
            assert.equal(e.message, '"eventType" is required, should be a String name, please checkout');
        }
    });

    it('#un(handler1) should throw an error with message: "eventType" is required, should be a String name, please checkout', ()=>{
        let handler1 = ()=> console.log('test handler1');
        let handler2 = ()=> console.log('test handler2');
        emmiter.on('test', handler1);
        emmiter.on('test', handler2);
        try {
            emmiter.un(handler1);
        }catch(e){
            assert.equal(e.message, '"eventType" is required, should be a String name, please checkout');
        }
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