let assert = require('assert');
let EventHelper = require('../index');
let fs = require('mz/fs');

describe('#method: done', ()=>{

    it('#done(eventType) should return a callback for async', (done)=>{
        let emmiter = new EventHelper();
        emmiter.on('read', (result)=> {
            assert.equal(result, 'read10');
            done();
        });
        fs.readFile('./mock/read.txt', 'utf-8', emmiter.done('read'));
    });

    it('#done(eventType, handler) should return a callback which will return a value deal with handler', (done)=>{
        let emmiter = new EventHelper();
        emmiter.on('read', (result)=> {
            assert.equal(result, 'read10-20');
            done();
        });
        fs.readFile('./mock/read.txt', 'utf-8', emmiter.done('read', (data)=> `${data}-20`));
    });
});

describe('#method: doneLater', ()=>{

    it('#doneLater(eventType) should return a callback for async', (done)=>{
        let emmiter = new EventHelper();
        emmiter.on('read', (result)=> {
            assert.equal(result, 'read10');
            done();
        });
        fs.readFile('./mock/read.txt', 'utf-8', emmiter.doneLater('read'));
    });

    it('#doneLater(eventType, handler) should return a callback which will return a value deal with handler', (done)=>{
        let emmiter = new EventHelper();
        emmiter.on('read', (result)=> {
            assert.equal(result, 'read10-20');
            done();
        });
        fs.readFile('./mock/read.txt', 'utf-8', emmiter.doneLater('read', (data)=>`${data}-20`));
    });
});