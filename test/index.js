let emmiter = new EventHelper();
emmiter.on('hello', (name)=> console.log(`hello ${name}`));

emmiter.emit('hello', 'wangyafei')

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

emmiter.tail('read', 'write', (readResult, writeResult)=> console.log(`result is: ${readResult} -- ${writeResult}`))