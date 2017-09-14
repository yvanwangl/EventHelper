let assert = require('assert');
let EventHelper = require('../index');

describe('#method: immediate', ()=>{
    let emmiter = new EventHelper();

    it('#immediate(eventType, handler) will be executed immediatly', ()=>{
        emmiter.immediate('read', (result)=> {
            assert.equal(result, 'read10');
        }, 'read10');
    });
});