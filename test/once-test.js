let assert = require('assert');
let EventHelper = require('../index');

describe('#method: once',()=>{
    let emmiter = new EventHelper();
    let times = 0;

    it('#once(eventType, handler) should execute the handler only once', ()=>{
        emmiter.once('test', (content)=> {
            times++;
            assert.equal(content, 'firstEmit');
            assert.equal(times, 1);
        });
        emmiter.emit('test', 'firstEmit');
        emmiter.emit('test', 'secondEmit');
    });
});