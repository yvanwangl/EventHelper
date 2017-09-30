let assert = require('assert');
let fs = require('mz/fs');
let EventHelper = require('../index');

describe('#method: after', ()=>{
    let emmiter = new EventHelper();

    it('#after() should has value [2,4,6]', ()=>{
        let count = 1;
        emmiter.after('times', 3, (result)=>{
            if(count==1){
                assert.equal(result.length, 3);
                assert.equal(result[0], 2);
                assert.equal(result[1], 4);
                assert.equal(result[2], 6);
                count++;
            }else {
                assert.equal(result.length, 3);
                assert.equal(result[0], 8);
                assert.equal(result[1], 10);
                assert.equal(result[2], 12);
            }
           
        });

        emmiter.emit('times', 2);
        emmiter.emit('times', 4);
        emmiter.emit('times', 6);
        emmiter.emit('times', 8);
        emmiter.emit('times', 10);
        emmiter.emit('times', 12);

    });

    it('#after() should read files in group', (done)=>{
        let count = 1;
        emmiter.after('read', 1, (result)=>{
            if(count==1){
                assert.equal(result.length, 1);
                assert.equal(result[0], 'read10');
                count++;
            }else if(count==2) {
                assert.equal(result.length, 1);
                assert.equal(result[0], 'read20');
                count++;
            }else {
                assert.equal(result.length, 1);
                assert.equal(result[0], 'read30');
                count++;
                done();
            }
           
        });

        ['read', 'read20', 'read30'].map((filename)=> fs.readFile(`./mock/${filename}.txt`, 'utf-8', emmiter.group('read')));

    });
});

describe('#method: afterOnce', ()=>{
    let emmiter = new EventHelper();

    it('#after() should has value [2,4,6]', ()=>{
        emmiter.afterOnce('times', 3, (result)=>{
            assert.equal(result.length, 3);
            assert.equal(result[0], 2);
            assert.equal(result[1], 4);
            assert.equal(result[2], 6);
        });

        emmiter.emit('times', 2);
        emmiter.emit('times', 4);
        emmiter.emit('times', 6);
        emmiter.emit('times', 8);
        emmiter.emit('times', 10);
        emmiter.emit('times', 12);

    });
});