let assert = require('assert');
let fs = require('mz/fs');
let EventHelper = require('../index');

describe('#method: group', ()=>{
    let emmiter = new EventHelper();
    let files = ['./mock/read.txt', './mock/read20.txt', './mock/read30.txt'];

    it('#group(eventTYpe) should return a callback function for async', (done)=>{
        emmiter.after('content', files.length, (result)=>{
            assert.equal(result.length, 3);
            assert.equal(result[0], 'read10');
            assert.equal(result[1], 'read20');
            assert.equal(result[2], 'read30');
            done();
        });
        files.map(file=> fs.readFile(file, 'utf-8', emmiter.group('content')));
    });

    // it('#group(eventType) has an error emmit', (done)=>{
    //     this.timeout(5000);
    //     let _readFileError = (file, encoding, callback)=> process.nextTick(()=> {callback(new Error('readError'))});
    //     emmiter.after('contentError', files.length, (result)=>{
    //         console.log(result);
    //         assert.equal(result.length, 3);
    //         assert.equal(result[0], 'read10');
    //         assert.equal(result[1], undefined);
    //         assert.equal(result[2], 'read30');
    //         done();
    //     });
    //     files.map((file, index)=> {
    //         if(index==1){
    //             _readFileError(file, 'utf-8', emmiter.group('contentError'));
    //         }else {
    //             fs.readFile(file, 'utf-8', emmiter.group('contentError'));
    //         }
    //     });
    // });
});