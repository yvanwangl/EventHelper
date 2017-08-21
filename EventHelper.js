function EventHelper(){
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
    }
};

let emmiter = new EventHelper();
emmiter.on('hello', (name)=> console.log(`hello ${name}`));

emmiter.emit('hello', 'wangyafei')