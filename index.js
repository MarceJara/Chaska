const express = require('express');
const http = require('http');
const path = require('path');
const serialcom = require('serialport');

const app = express();
app.set('PORT',process.env.PORT || 9000);
const server = http.createServer(app);

//routes
app.use(express.static(path.join(__dirname, '/client/')));

app.get('/render', (req, res) => {
    res.sendFile(path.join(__dirname, './client/render.html'))
});

app.get('/dashtest', (req, res) => {
    res.sendFile(path.join(__dirname, './client//dashtest.html'))
});

//inicializacion del server
server.listen(app.get('PORT'), () => {
    console.log("servidor iniciado en el puerto", app.get('PORT'));
});

//comunicacion socket
const io = require('socket.io')(server); 

//comunicacion serial
/*
const parser = new serialcom(
    'COM3',
    {baudRate: 9600}
).pipe(new serialcom.parsers.Readline({delimiter: '\n'}));


parser.on('data', (datos) => {
    if(datos.includes('ypr')){
        console.log(datos);
        io.emit('datos-giro', datos);
    };
});

*/