let assert = require('assert');
let EventHelper = require('../index');

describe('#method: tail', ()=>{
    let emmiter = new EventHelper();

    it('#tail() should have value 300 and 500', (done)=>{
        let times = 0;
        let time300Values = [];
        let time500Values = [];
        let interval300;
        let interval500;
        emmiter.tail('time300', 'time500', (time300, time500)=>{
            time300Values.push(time300);
            time500Values.push(time500);
            times++;
            if(times==2){
                assert(time300Values.length, 2);
                assert(time300Values[0], 300);
                assert(time300Values[1], 600);
                assert(time500Values.length, 1);
                assert(time500Values[0], 500);
                clearInterval(interval300);
                clearInterval(interval500);
                done();
            }
        });
        interval300 = setInterval(()=> emmiter.emit('time300', (times+1)*300, 300));
        interval500 = setInterval(()=> emmiter.emit('time500', (times+1)*500, 500));
        
    })
});