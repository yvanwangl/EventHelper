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

    const ALL_EVENT = '__all__';

    /**
     * EventHelper is an implementation of task/event mode based asynchronous pattern.
     * EventHelper is Inspired by EventProxy, but implement totally different with it.
     * You can use `on` or `bind` to listen a customer event with a callback function;
     * `emit`-- an event fires all callback in succession.
     * Examples:
     * ```js
     * let render = function(template, resource){};
     * var eventHelper = new EventHelper();
     * eventHelper.all('template', 'resource', render);
     * eventHelper.emit('template', template);
     * eventHelper.emit('resource', resource);
     * ```
     */
    function EventHelper(){
        if(!(this instanceof EventHelper)){
            return new EventHelper();
        }
        this._eventEmitter = {};
    }

    /**
     * EventHelper.prototype
     * 
     */
    EventHelper.prototype = {
        constructor: EventHelper,
        on: function(eventType, handler){
            debug('Add listener for %s', eventType);
            this._eventEmitter[eventType] = this._eventEmitter[eventType] || []; 
            handler = typeof handler=='function' ? handler:function(){};
            this._eventEmitter[eventType].push(handler);
            return this;
        },
        emit: function(eventType, ...args){
            let eventList = this._eventEmitter[eventType];
            if(eventList && eventList.length>0){
                let list = [];
                eventList.map((handler)=> {
                    handler(...args);
                    /**
                     * if this handler has been bound by `once`,
                     * then when the `eventType` has been fired,
                     * this handler will be removed.
                     */
                    if(!handler.isOnce){
                        list.push(handler);
                    }
                });
                this._eventEmitter[eventType] = list;
            }
            return this;
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
                    callback.apply(this, resultValue)
                }
            };
            args.map((arg, index)=> that.on(arg, handler(index)));
            return this;
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
            return this;
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
            return this;
        }
    };

    /**
     * Bind an event, the first argument is eventType, a String name, 
     * second argument is callback function.
     * `addListener` is alias for `on`
     * @param {String} eventType
     * @param {Function} handler
     */
    EventHelper.prototype.addListener = EventHelper.prototype.on;

    /**
     * `subscribe` is alias for `on`
     */
    EventHelper.prototype.subscribe = EventHelper.prototype.on;

     /**
     * `bind` is alias for `on`
     */
    EventHelper.prototype.bind = EventHelper.prototype.on;

    /**
     * headbind: Bind an event, but put the callback function into head of all callbacks
     * @param {String} eventType
     * @param {Function} handler
     */
    EventHelper.prototype.headbind = function(eventType, handler){
        debug(`HeadBind for event: ${eventType}`)
        this._eventEmitter[eventType] = this._eventEmitter[eventType] || [];
        this._eventEmitter.unshift(handler);
        return this;
    };

    /**
     * Remove one or many callbacks.
     * 
     * if `callback` is null, removes all callbacks for the event.
     * if `eventType` is null, removes all bound callbacks for all events.
     * @param {String} eventType
     * @param {Function} handler
     */
    EventHelper.prototype.un = function(eventType, handler){
        let eventEmitter = this._eventEmitter;
        if(!eventType || typeof eventType=='function'){
            debug('Remove all events');
            this._eventEmitter = {};
        }else {
            if(!handler) {
                debug(`Remove all listeners of ${eventType}`)
                this._eventEmitter[eventType] = [];
            }else {
                debug(`Remove a listener of ${eventType}`);
                let index = this._eventEmitter[eventType].indexOf(handler);
                this._eventEmitter[eventType].splice(index ,1);
            }
        }
        return this;
    };

    /**
     * `removeListener` is the alias of `un`
     */
    EventHelper.prototype.removeListener = EventHelper.prototype.un;

    /**
     * `unsubscribe` is the alias of `un`
     */
    EventHelper.prototype.unsubscribe = EventHelper.prototype.un;

    /**
     * `unbind` is the alias of `un` 
     */
    EventHelper.prototype.unbind = EventHelper.prototype.un;

    /**
     * Remove all listeners of an event
     * @param {String} eventType
     */
    EventHelper.prototype.unAllListeners = function(eventType){
        debug(`Unbind all listeners of event: ${eventType}`);
        return this.un(eventType);
    }

    /**
     * `removeAllListeners` is alias of `unAllListeners`
     */
    EventHelper.prototype.removeAllListeners = EventHelper.prototype.unAllListeners;

    /**
     * `unbindAllListeners` is alias of 'unAllListeners' 
     */
    EventHelper.prototype.unbindAllListeners = EventHelper.prototype.unAllListeners;

    /**
     * bind the ALL_EVENT event
     * @param {Function} handler
     */
    EventHelper.prototype.bindForAll = function(handler){
        return this.on(ALL_EVENT, handler);
    }

    /**
     * unbind the ALL_EVENT event
     * @param {Function} handler
     */
    EventHelper.prototype.unbindForAll = function(){
        return this.un(ALL_EVENT, handler);
    };

    /**
     * trigger an event, firing all bound callbacks,
     * callbacks will be passed the same arguments as `trigger`, apart from the event name
     * Listening for `"all"` pass the eventType: `true` as the first argument
     * `trigger` is alias of `emit` 
     * @param {String} eventType
     * @param {Mix} data
     */
    EventHelper.prototype.trigger = EventHelper.prototype.emit;

    /**
     * `fire` is alias of `emit`
     */
    EventHelper.prototype.fire = EventHelper.prototype.emit;

    /**
     * Bind an event like the bind method, but will remove the listener after it was fired
     * @param {String} eventType
     * @param {Function} handler
     */
    EventHelper.prototype.once = function(eventType, handler){
        handler.isOnce = true;
        this.on(eventType, handler);
        return this;
    };

    /**
     * `emitLater`: emit the eventType async
     */
    let later = (typeof setImmediate !== 'undefined' && setImmediate) || (typeof process !== 'undefined' && process.nextTick) || function(fn){setTimeout(fn, 0)};
    EventHelper.prototype.emitLater = function(){
        let that = this;
        let args = arguments;
        later(function(){
            that.emit.apply(that, args);
        });
    };

    /**
     * `immediate`: Bind an eventType and trigger it immediate
     * @param {String} eventType
     * @param {Function} handler
     * @param {Mix} data
     */
    EventHelper.prototype.immediate = function(eventType, handler, ...args){
        this.on(eventType, handler);
        this.emit(eventType, ...args);
        return this;
    };

    /**
     * `asap` is alias of `immediate`
     */
    EventHelper.prototype.asap = EventHelper.prototype.immediate;

    


    EventHelper.EventHelper = EventHelper;

    return EventHelper;
});