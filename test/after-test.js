let assert = require('assert');
let EventHelper = require('../index');

describe('#method: after', ()=>{
    let emmiter = new EventHelper();

    it('#after() should has value [2,4,6]', ()=>{
        emmiter.after('times', 3, (result)=>{
            assert(result.length, 3);
            assert(result[0], 2);
            assert(result[1], 4);
            assert(result[2], 6);
        });

        emmiter.emit('times', 2);
        emmiter.emit('times', 4);
        emmiter.emit('times', 6);

    });
});