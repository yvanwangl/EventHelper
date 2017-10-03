
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

