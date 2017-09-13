let assert = require('assert');
let fs = require('mz/fs');
let EventHelper = require('../index');

describe('#method: race', ()=>{
    let emmiter = new EventHelper();

    it('#race() should trriger the handler with value {eventType: "read", data: "read10"}', (done)=>{
        emmiter.race('read', 'readMore', ({eventType, data})=>{
            assert.equal(eventType, 'read');
            assert.equal(data, 'read10');
            done();
        });
        fs.readFile('./mock/read.txt', 'utf-8', (err, data)=> emmiter.emit('read', data));
        fs.readFile('./mock/readMore.txt', 'utf-8', (err, data)=> emmiter.emitLater('readMore', data));
    });

    it('#race() should trriger the handler with value {eventType: "time300", data: 300}', (done)=>{
        emmiter.race('time300', 'time500', ({eventType, data})=>{
            assert.equal(eventType, 'time300');
            assert.equal(data, 300);
            done();
        });
        setTimeout(()=> emmiter.emit('time300', 300), 300);
        setTimeout(()=> emmiter.emit('time500', 500), 500);
    });
});