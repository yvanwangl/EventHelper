let assert = require('assert');
let EventHelper = require('../index');

describe('#method: bindForAll', () => {
    let emmiter = new EventHelper();

    it('#bindForAll(handler) will bind handler for event "__all__"', () => {
        let handler = () => console.log('bindForAll');
        emmiter.bindForAll(handler);
        assert.equal(emmiter._eventEmitter['__all__'].length, 1);
        assert.equal(emmiter._eventEmitter['__all__'][0], handler);
    });

    it('#unBindForAll(handler) will bind handler for event "__all__"', () => {
        let handler1 = () => console.log('bindForAll');
        let handler2 = () => console.log('bindForAll');
        emmiter.bindForAll(handler1);
        emmiter.bindForAll(handler2);
        assert.equal(emmiter._eventEmitter['__all__'].length, 2);
        assert.equal(emmiter._eventEmitter['__all__'][0], handler1);
        assert.equal(emmiter._eventEmitter['__all__'][1], handler2);
        emmiter.unBindForAll(handler1);
        assert.equal(emmiter._eventEmitter['__all__'].length, 1);
        assert.equal(emmiter._eventEmitter['__all__'][0], handler2);
        emmiter.bindForAll(handler1);
        assert.equal(emmiter._eventEmitter['__all__'].length, 2);
        emmiter.unBindForAll();
        assert.equal(emmiter._eventEmitter['__all__'].length, 0);
    });
});