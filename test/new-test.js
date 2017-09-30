let assert = require('assert');
let EventHelper = require('../index');

describe('#method: create & EventHelper', ()=>{
    it('#create() should return a EventHelper instance', ()=>{
        let emmiter = EventHelper.create();
        assert.equal(emmiter instanceof EventHelper, true);
    });

    it('#EventHelper() should return a EventHelper instance', ()=>{
        let emmiter = EventHelper();
        assert.equal(emmiter instanceof EventHelper, true);
    });

    it('#new EventHelper() should return a EventHelper instance', ()=>{
        let emmiter = new EventHelper();
        assert.equal(emmiter instanceof EventHelper, true);
    });
});