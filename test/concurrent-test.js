let assert = require('assert');
//let {Image} = require('canvas');
let EventHelper = require('../index');
let images = require('../mock/images');

describe('#method: concurrent', ()=>{
    let emmiter = new EventHelper();
    it('#concurrent(eventType, limit, asyncHandler, params)', (done)=> {
        let loadImg = (url, callback)=>{
            let img = document.createElement('img');
            img.onload = ()=> callback(null, img);
            img.onerror = (error)=> callback(error, null);
            img.src = url;
        };
        emmiter.concurrent('load', 5, loadImg, images);
        emmiter.on('finish', (result)=> {
            assert.equal(result.length, 20);
            done();
        });
    });
});