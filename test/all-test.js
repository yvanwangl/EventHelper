let assert = require('assert');
let fs = require('mz/fs');
let EventHelper = require('../index');

describe('#method: all', ()=>{
    let emmiter = new EventHelper();
    
    it('#all() should have result "read10 and write20"', (done)=>{
        emmiter.all('read', 'write', (read, write)=>{
            assert.equal(`${read} and ${write}`, 'read10 and write20');
            done();
        });
        fs.readFile('./mock/read.txt', 'utf-8', (err, data)=> emmiter.emit('read', data));
        fs.readFile('./mock/write.txt', 'utf-8', (err, data)=> emmiter.emit('write', data));
    });
    
});