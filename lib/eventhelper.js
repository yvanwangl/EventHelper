!(function (name, definition) {
    let hasDefine = typeof define === 'function';
    let hasModule = typeof module !== 'undefined' && module.exports;

    if (hasDefine) {
        // AMD module or CMD module
        define('eventhelper_dubug', function () { return function () { } });
        define(['eventhelper_dubug'], definition);
    } else if (hasModule) {
        //CommonJS, Node.js module
        module.exports = definition(require('debug')('eventhelper'))
    } else {
        this[name] = definition();
    }
})('EventHelper', function (debug) {
    debug = debug || function () { };

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
    function EventHelper() {
        if (!(this instanceof EventHelper)) {
            return new EventHelper();
        }
        this._eventEmitter = {};
        this._groupIndex = {};
    }

    /**
     * EventHelper.prototype
     * 
     */
    EventHelper.prototype = {
        constructor: EventHelper,
        on: function (eventType, handler) {
            debug('Add listener for %s', eventType);
            this._eventEmitter[eventType] = this._eventEmitter[eventType] || [];
            handler = typeof handler == 'function' ? handler : function () { };
            this._eventEmitter[eventType].push(handler);
            return this;
        },
        emit: function (eventType, ...args) {
            let eventList = this._eventEmitter[eventType];
            let allEventList = this._eventEmitter[ALL_EVENT];
            if (eventList && eventList.length > 0) {
                eventList.map(handler => handler(...args));
            }
            if (allEventList && allEventList.length > 0) {
                allEventList.map(handler => handler(eventType, ...args));
            }
            return this;
        },
        all: function (...args) {
            let that = this;
            let callback = args.pop();
            let counter = args.length;
            let resultValue = [];
            let handler = (index) => (...results) => {
                resultValue[index] = results.length == 1 ? results[0] : results;
                counter--;
                if (counter == 0) {
                    callback.apply(this, resultValue);
                }
            };
            args.map((eventType, index) => that.once(eventType, handler(index)));
            return this;
        },
        race: function (...args) {
            let that = this;
            let callback = args.pop();
            let resultValue = [];
            let resolved = false;
            let handler = (eventType) => (...results) => {
                if (!resolved) {
                    resolved = true;
                    callback({
                        eventType: eventType,
                        data: results.length == 1 ? results[0] : results
                    });
                }
            }
            args.map((arg) => that.on(arg, handler(arg)));
            return this;
        },
        tail: function (...args) {
            let that = this;
            let callback = args.pop();
            let counter = args.length;
            let resultValue = [];
            let fired = {};
            let handler = (index, eventType) => (...results) => {
                resultValue[index] = results.length == 1 ? results[0] : results;
                if (counter > 0) {
                    if (!fired[eventType]) {
                        fired[eventType] = true;
                        counter--;
                    }
                    if (counter == 0) {
                        callback.apply(null, resultValue);
                    }
                } else {
                    callback.apply(null, resultValue);
                }
            };
            args.map((eventType, index) => that.on(eventType, handler(index, eventType)));
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
    EventHelper.prototype.headbind = function (eventType, handler) {
        debug(`HeadBind for event: ${eventType}`)
        this._eventEmitter[eventType] = this._eventEmitter[eventType] || [];
        this._eventEmitter[eventType].unshift(handler);
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
    EventHelper.prototype.un = function (eventType, handler) {
        let eventEmitter = this._eventEmitter;
        if (!eventType || typeof eventType == 'function') {
            debug('"eventType" is required');
            throw new Error('"eventType" is required, should be a String name, please checkout');
        } else {
            if (!handler) {
                debug(`Remove all listeners of ${eventType}`)
                this._eventEmitter[eventType] = [];
            } else {
                debug(`Remove a listener of ${eventType}`);
                let index = this._eventEmitter[eventType].indexOf(handler);
                this._eventEmitter[eventType].splice(index, 1);
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
    EventHelper.prototype.unAllListeners = function (eventType) {
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
    EventHelper.prototype.bindForAll = function (handler) {
        return this.on(ALL_EVENT, handler);
    }

    /**
     * unbind the ALL_EVENT event
     * @param {Function} handler
     */
    EventHelper.prototype.unbindForAll = function (handler) {
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
    EventHelper.prototype.once = function (eventType, handler) {
        let that = this;
        let wrapper = function (...args) {
            handler.apply(that, [...args]);
            that.un(eventType, wrapper);
        };
        return that.on(eventType, wrapper);
    };

    /**
     * `emitLater`: emit the eventType async
     */
    let later = (typeof setImmediate !== 'undefined' && setImmediate) || (typeof process !== 'undefined' && process.nextTick) || function (fn) { setTimeout(fn, 0) };
    EventHelper.prototype.emitLater = function (...args) {
        let that = this;
        later(function () {
            that.emit.apply(that, args);
        });
        return that;
    };

    /**
     * `immediate`: Bind an eventType and trigger it immediate
     * @param {String} eventType
     * @param {Function} handler
     * @param {Mix} data
     */
    EventHelper.prototype.immediate = function (eventType, handler, ...args) {
        this.on(eventType, handler);
        this.emit(eventType, ...args);
        return this;
    };

    /**
     * `asap` is alias of `immediate`
     */
    EventHelper.prototype.asap = EventHelper.prototype.immediate;

    /**
     * Assign some events, after all events has been fired, the callback function will be executed once.
     * ```
     * Example:
     * eventHelper.all(event1, event2, event3, callback);
     * @param {String} eventType1
     * @param {String} eventType2
     * @param {String} eventType3
     * @param {Function} handler
     */
    EventHelper.prototype.assign = EventHelper.prototype.all;

    /**
     * Assign the only one event handler
     * `errorMap` is an object, such as:
     * {
     *  eventType1: handler1,
     *  eventType2: handler2
     * }
     * @param {Object} errorMap
     */
    EventHelper.prototype.fail = function (errorMap) {
        let that = this;
        let wrapper = function (eventType, ...args) {
            let handler;
            if (arguments.length == 0) {
                handler = function () { throw new Error('Error') };
            } else {
                handler = errorMap[eventType] || function () { throw new Error(eventType, ...args) };
            }
            handler.apply(that, args);
        };
        return that.on('error', wrapper);
    };

    /**
     * `assignAll` is alias for `tail`
     */
    EventHelper.prototype.assignAll = EventHelper.prototype.tail;

    /**
     * `combineLastest` is alias for `tail`
     */
    EventHelper.prototype.combineLastest = EventHelper.prototype.tail;

    /**
     * inner function for after and afterOnce
     * @param {String} eventType 
     * @param {Number} times 
     * @param {Function} handler 
     * @param {Boolean} isOnce 
     */
    let _after = function (eventType, times, handler, isOnce) {
        let that = this;
        let count = 0;
        let resultArr = [];
        let n = 0;
        let wrapper = function (data) {
            count++;
            if (typeof data == 'object' && data.type == 'group' && data.hasOwnProperty('index')) {
                if(data['index']%times == 0){
                    n = data['index']/times;
                }
                resultArr[data['index']-n*times] = data['result'];
            } else {
                resultArr.push(data);
            }

            if (isOnce) {
                if (count == times) {
                    handler.apply(that, [resultArr]);
                    that.un(eventType, wrapper);
                }
            } else {
                if (count % times == 0) {
                    handler.apply(that, [resultArr]);
                    resultArr = [];
                }
            }

        };
        return that.on(eventType, wrapper);
    };

    /**
     * the callback will be executed after the event has ben fired N/2N/3N times
     * @param {String} eventType
     * @param {Number} times
     * @param {Function} handler
     */
    EventHelper.prototype.after = function (eventType, times, handler) {
        return _after.call(this, eventType, times, handler, false);
    };

    /**
     * the callback will be executed only once after the event has ben fired N times
     * @param {String} eventType
     * @param {Number} times
     * @param {Function} handler
     */
    EventHelper.prototype.afterOnce = function (eventType, times, handler) {
        return _after.call(this, eventType, times, handler, true);
    }

    /**
     * The `after` method's helper. Use it will return ordered results.
     * If you need manipulate result, you need callback
     * Examples:
     * ```js
     * let ep = new EventProxy();
     * ep.after('file', files.length, function (list) {
     *   // Ordered results
     * });
     * for (let i = 0; i < files.length; i++) {
     *   fs.readFile(files[i], 'utf-8', ep.group('file'));
     * }
     * ```
     * @param {String} eventname Event name, shoule keep consistent with `after`.
     * @param {Function} callback Callback function, should return the final result.
     */
    EventHelper.prototype.group = function (eventType, handler) {
        let that = this;
        that._groupIndex[eventType] = that._groupIndex[eventType] || { index: 0 };
        let index = that._groupIndex[eventType]['index'];
        that._groupIndex[eventType]['index']++;
        return function (err, data) {
            if (err) {
                // put all arguments to the error handler
                debug(`group for event: ${eventType}; item-${index} has an error: ${err.message}`);
                err.index = index;
                //emit eventType with data: undefined
                that.emit(eventType, {
                    type: 'group',
                    index: index,
                    // callback(err, args1, args2, ...)
                    result: undefined
                });
                return that.emit.apply(that, ['error', eventType, err]);
            }
            that.emit(eventType, {
                type: 'group',
                index: index,
                // callback(err, args1, args2, ...)
                result: handler ? handler.apply(null, data) : data
            });
        };
    };


    /**
     * The callback will be executed after any resistered event was fired. Only execute once.
     * @param {String} eventType1
     * @param {String} eventType2
     * @param {Function} handler. handler will get a object data, which has `data` and `eventType` attributes.
     */
    EventHelper.prototype.any = EventHelper.prototype.race;


    /**
     * The callback will be executed when the fired event name does not equal with assigned event.
     * @param {String} eventType
     * @param {Function} handler
     */
    EventHelper.prototype.not = function (eventType, handler) {
        let that = this;
        debug('Add listenner for not event %s', eventType);
        return that.bindForAll(function (eventName, data) {
            if (eventName !== eventType) {
                debug('listenner execute of event %s emit, but not event %s.', eventName, eventType);
                handler(data);
            }
        });
    };

    /**
     * Success callback wrapper , will handle error auto.
     * @param {String} eventType
     * @param {Function} handler
     */
    EventHelper.prototype.done = function (eventType, handler) {
        let that = this;
        return function (err, ...args) {
            if (err) {
                return that.emit('error', eventType, err);
            }
            if (handler && typeof handler == 'function') {
                return that.emit(eventType, handler(...args));
            } else {
                return that.emit(eventType, ...args);
            }
        };
    };

    /**
     * Async done
     * @param {String} eventType
     * @param {Function} handler
     */
    EventHelper.prototype.doneLater = function (eventType, handler) {
        let _doneLater = this.done(eventType, handler);
        return function (err, ...args) {
            later(function () {
                _doneLater(err, ...args);
            });
        };
    };

    /**
     * Concurrent, to handle async event concurrent
     * @param {String} eventType
     * @param {Number} limit
     * @param {Function} asyncHandler
     * @param {Array} asyncParams
     */
    EventHelper.prototype.concurrent = function(eventType, limit, asyncHandler, asyncParams){
        let that = this;
        let asyncParamsClone = [...asyncParams];
        let queue = asyncParamsClone.splice(0, limit).map((param) => asyncHandler(param, that.group(eventType)));
        let indexMap = {};
        let resultArr = [];
        let dataIndex, nextParam, indexMapKey, indexMapValue, handler, executeCount=0;
        [...new Array(limit)].map((item, index)=> indexMap[index] = index);
        handler = (data)=> {
            if(typeof data == 'object' && data.type == 'group' && data.hasOwnProperty('index')){
                executeCount++;
                dataIndex = data.index;
                //if asyncParamsClone's length does not equals to 0, then fill the queue
                if(asyncParamsClone.length!=0){
                    nextParam = asyncParamsClone.shift();
                    indexMapValue = indexMap[dataIndex];
                    queue.splice(indexMapValue, 1, asyncHandler(nextParam, that.group(eventType)));
                    indexMapKey = asyncParams.findIndex(param=> nextParam == param);
                    indexMap[indexMapKey] = indexMapValue;
                }
                resultArr[dataIndex] = data.result;
                //execute count equal asyncParams length, then fire `${eventType}Finish`
                if(executeCount == asyncParams.length){
                    that.emit(`${eventType}Finish`, resultArr);
                }
            }
        };
        return that.on(eventType, handler);
    };

    /**
     * Create a new EventHelper.
     * Examples:
     * ```js
     */

    EventHelper.create = function () {
        return new EventHelper();
    };

    EventHelper.EventHelper = EventHelper;

    return EventHelper;
});
