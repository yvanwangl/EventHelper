
if(typeof window == 'undefined'){
    let assert = require('assert');
    let fs = require('mz/fs');
    let EventHelper = require('../index');
    describe('#method: concurrent', ()=>{
        let emmiter = new EventHelper();
        it('#concurrent(eventType, limit, asyncHandler, params)', (done)=> {
            let files = ['read', 'read20', 'read30', 'readMore', 'write'].map((file)=> `./mock/${file}.txt`);
            let readFile = (path, callback)=>{
                fs.readFile(path, 'utf-8', callback);
            };
            emmiter.concurrent('read', 2, readFile, files);
            emmiter.on('readFinish', (result)=> {
                assert.equal(result.length, 5);
                done();
            });
        });
    });
}else {
    requirejs.config({
        baseUrl: 'vendor',
        paths: {
            'eventhelper': '../../lib/eventhelper'
        }
    });

    require(['chai', 'eventhelper', '../../mock/imageList','mocha'], function(chai, EventHelper, imageList){
        mocha.setup('bdd');
        let expect = chai.expect;
        describe('#method: concurrent', ()=>{
            let emmiter = new EventHelper();
            it('#concurrent(eventType, limit, asyncHandler, params)', (done)=> {
                let loadImg = (url, callback)=>{
                    let img = document.createElement('img');
                    img.onload = ()=> callback(null, img);
                    img.onerror = (error)=> callback(error, null);
                    img.src = url;
                };
                emmiter.concurrent('load', 5, loadImg, imageList.images);
                emmiter.on('loadFinish', (result)=> {
                    expect(result.length).to.equal(20);
                    done();
                });
            });
        });
        mocha.run();
    });
}



