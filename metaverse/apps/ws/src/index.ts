import {WebSocketServer} from 'ws';

const wss = new WebSocket({ port : 3001 });

wss.on('connection', function connection(ws){
    ws.on('error', console.error);

    ws.on('message', function message(data: any){
        console.log('received: %s', data)
    });

    ws.send('something');
});