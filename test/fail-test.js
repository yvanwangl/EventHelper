
let assert = require('assert');
let EventHelper = require('../index');
let fs = require('mz/fs');
let muk = require('muk');

describe('#method: fail', ()=>{
    let _readFile = fs.readFile;

    before(()=>{
        muk(fs, 'readFile', (file, encoding, callback)=>{
            process.nextTick(callback(new Error('readError')));
        });
    });

    it('#fail(errorMap) should bind error event', (done)=>{
        let emmiter = new EventHelper();
        emmiter.fail({
            read: function(err){
                assert.equal(err.message, 'readError');
                done();
            }
        });
        fs.readFile('./mock/read.txt', 'utf-8', emmiter.done('read'));
    });

    it('#fail() should handle error event without any arguments', ()=>{
        let emmiter = new EventHelper();
        emmiter.fail();
        try{
            emmiter.emit('error');
        }catch(e) {
            assert.equal(e.message, 'Error');
        }
    });

    after(()=>{
        muk.restore();
    });
});