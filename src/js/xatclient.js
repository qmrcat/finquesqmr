const socket = io('http://localhost:3000');

    document.addEventListener('DOMContentLoaded', () => {
        const messageForm = document.getElementById('message-form');
        const messageInput = document.getElementById('message-input');
        const messagesList = document.getElementById('messages');

        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log( "Enviat al servidor" );
            
            const message = messageInput.value;
            socket.emit('send_message', message);
            messageInput.value = '';
        });

        socket.on('send_message', (msg) => {
            console.log( "Rebut del servidor:", msg);
            const item = document.createElement('li');
            item.textContent = msg;
            messagesList.appendChild(item);
        });
    });