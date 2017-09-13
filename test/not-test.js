let assert = require('assert');
let EventHelper = require('../index');

describe('#method: not', ()=>{
    let emmiter = new EventHelper();

    it('#not(eventType, handler) will be executed when other event has been triggered', ()=>{
        emmiter.not('not', (result)=>{
            assert.equal(result, 'read10');
        });
        emmiter.emit('read', 'read10');
        emmiter.emit('not', 'not10');
    });
});