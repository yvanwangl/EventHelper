let EventHelper = require('../index');
let emmiter = new EventHelper();
// emmiter.on('hello', (name)=> console.log(`hello ${name}`));

// emmiter.emit('hello', 'wangyafei');

setTimeout(()=>{
    emmiter.emit('read','read book 10')
}, 1000);

let times = 0;
setTimeout(()=>{
    times++;
    emmiter.emit('write', `write book ${times}`)
}, 500);

emmiter.all('read', 'write', (readResult, writeResult)=> console.log(`read: ${readResult} and write: ${writeResult}`));

emmiter.race('read', 'write', (result)=> console.log(`the winner is: ${result}`));

emmiter.tail('read', 'write', (readResult, writeResult)=> console.log(`result is: ${readResult} -- ${writeResult}`));

emmiter.once('read', (result)=> console.log(`once callback result is: ${result}`));

emmiter.headbind('read', (result)=> console.log(`this method is the first callback of read: ${result}`));