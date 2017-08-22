!(function(name, definition){
    let hasDefine = typeof define === 'function';
    let hasModule = typeof module !== 'undefined' && module.exports;

    if(hasDefine){
        // AMD module or CMD module
        define('eventhelper_dubug', function(){return function(){}});
        define(['eventhelper_dubug'], definition);
    }else if(hasModule){
        //CommonJS, Node.js module
        module.exports = definition(require('debug')('eventhelper'))
    }else {
        this[name] = definition();
    }
})('EventHelper', function(debug){
    debug = debug || function(){};

    function EventHelper(){
        if(!(this instanceof EventHelper)){
            return new EventHelper();
        }
        this.eventEmitter = {};
    }

    EventHelper.prototype = {
        constructor: EventHelper,
        on: function(eventType, handler){
            let eventList = this.eventEmitter[eventType]; 
            if(eventList){
                eventList.push(handler);
            }else {
                this.eventEmitter[eventType] = [handler];
            }
        },
        emit: function(eventType, ...args){
            let eventList = this.eventEmitter[eventType];
            if(eventList && eventList.length>0){
                eventList.map((handler)=> handler(...args));
            }else {
                return ;
            }
        },
        all: function(...args){
            let that = this;
            let callback = args.pop();
            let counter = args.length;
            let resultValue = [];
            let handler = (index)=>(value)=>{
                resultValue[index] = value;
                counter--;
                if(counter==0){
                    callback.apply(null, resultValue)
                }
            };
            args.map((arg, index)=> that.on(arg, handler(index)));
        },
        race: function(...args){
            let that = this;
            let callback = args.pop();
            let resultValue = [];
            let resolve = false;
            let handler = (value)=>{
                if(!resolve){
                    resolve = true;
                    callback(value);
                }
            }
            args.map((arg)=> that.on(arg, handler));
        },
        tail: function(...args){
            let that = this;
            let callback = args.pop();
            let counter = args.length;
            let resultValue = [];
            let handler = (index)=>(value)=>{
                resultValue[index] = value;
                if(counter>0){
                    counter--;
                    if(counter==0){
                        callback.apply(null, resultValue);
                    }
                }else {
                    callback.apply(null, resultValue);
                }
            };
            args.map((arg, index)=> that.on(arg, handler(index)));
        }
    };

    EventHelper.EventHelper = EventHelper;

    return EventHelper;
});
