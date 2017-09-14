
let assert = require('assert');
let EventHelper = require('../index');
let fs = require('mz/fs');
let muk = require('muk');

describe('#method: fail', ()=>{
    let emmiter = new EventHelper();
    let _readFile = fs.readFile;

    before(()=>{
        muk(fs, 'readFile', (file, encoding, callback)=>{
            process.nextTick(callback(new Error('readError')));
        });
    });

    it('#fail(errorMap) should bind error event', (done)=>{
        emmiter.fail({
            read: function(err){
                assert.equal(err.message, 'readError');
                done();
            }
        });
        fs.readFile('./mock/read.txt', 'utf-8', emmiter.done('read'));
    });

    after(()=>{
        muk.restore();
    });
});