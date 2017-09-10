let assert = require('assert');
let fs = require('fs');
let EventHelper = require('../index');

describe('#method: all', async (done)=>{
    let emmiter = new EventHelper();
    let result ;
    emmiter.all('read', 'write', (read, write)=>{
        result = `${read} and ${write}`;
    });
    await fs.readFile('../mock/read.txt', 'utf8', (err, data)=> {
        emmiter.emit('read', 'read10');
        console.log(data);
    });
    await fs.readFile('../mock/write.txt', 'utf8', (err, data)=> emmiter.emit('write', 'write20'));
    it('#all() should have result "read10 and write20"', (done)=>{
        assert.equal(result, 'read10 and write20');
        done();
    });
    
});