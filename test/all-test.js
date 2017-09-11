let assert = require('assert');
let fs = require('mz/fs');
let EventHelper = require('../index');

describe('#method: all', ()=>{
    let emmiter = new EventHelper();
    fs.readFile('../mock/read.txt', 'utf-8', emmiter.done('read'));
    fs.readFile('../mock/write.txt', 'utf-8', emmiter.done('write'));
    
    it('#all() should have result "read10 and write20"', function(){
        emmiter.all('read', 'write', (read, write)=>{
            assert.equal(`${read} and ${write}`, 'read10 and write20');
        });
    });
    
});