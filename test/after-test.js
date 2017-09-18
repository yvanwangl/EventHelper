let assert = require('assert');
let EventHelper = require('../index');

describe('#method: after', ()=>{
    let emmiter = new EventHelper();

    it('#after() should has value [2,4,6]', ()=>{
        let count = 1;
        emmiter.after('times', 3, (result)=>{
            if(count==1){
                assert(result.length, 3);
                assert(result[0], 2);
                assert(result[1], 4);
                assert(result[2], 6);
                count++;
            }else {
                assert(result.length, 3);
                assert(result[0], 8);
                assert(result[1], 10);
                assert(result[2], 12);
            }
           
        });

        emmiter.emit('times', 2);
        emmiter.emit('times', 4);
        emmiter.emit('times', 6);
        emmiter.emit('times', 8);
        emmiter.emit('times', 10);
        emmiter.emit('times', 12);

    });
});

describe('#method: afterOnce', ()=>{
    let emmiter = new EventHelper();

    it('#after() should has value [2,4,6]', ()=>{
        emmiter.afterOnce('times', 3, (result)=>{
            assert(result.length, 3);
            assert(result[0], 2);
            assert(result[1], 4);
            assert(result[2], 6);
        });

        emmiter.emit('times', 2);
        emmiter.emit('times', 4);
        emmiter.emit('times', 6);
        emmiter.emit('times', 8);
        emmiter.emit('times', 10);
        emmiter.emit('times', 12);

    });
});