let assert = require('assert');
let fs = require('mz/fs');
let EventHelper = require('../index');

describe('#method: group', ()=>{
    let emmiter = new EventHelper();

    it('#group(eventTYpe) should return a callback function for async', (done)=>{
        let files = ['./mock/read.txt', './mock/read20.txt', './mock/read30.txt'];
        emmiter.after('content', files.length, (result)=>{
            assert.equal(result.length, 3);
            assert.equal(result[0], 'read10');
            assert.equal(result[1], 'read20');
            assert.equal(result[2], 'read30');
            done();
        });
        files.map(file=> fs.readFile(file, 'utf-8', emmiter.group('content')));
    });

    it('#group(eventType) has an error emmit', (done)=>{
        let files = ['./mock/read.txt', './mock/read20.txt', './mock/read50.txt'];
        emmiter.fail({
            contentError: function(err){
                assert.equal(err.index, 2);
            }
        });
        emmiter.after('contentError', files.length, (result)=>{
            assert.equal(result.length, 3);
            assert.equal(result[0], 'read10');
            assert.equal(result[1], 'read20');
            assert.equal(result[2], undefined);
            done();
        });
        files.map((file, index)=> fs.readFile(file, 'utf-8', emmiter.group('contentError')));
    });
});