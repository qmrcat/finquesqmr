
const tokenSocket = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

const socket = io( ':3000', { auth: { token: tokenSocket },  withCredentials: true } );

    document.addEventListener( 'DOMContentLoaded', () => {

        console.log( 'socket: ', socket );
        

        const messageForm = document.getElementById( 'message-form' );
        const messageInput = document.getElementById( 'message-input' );
        const messageCsrf = document.getElementById( '_csrf');
        const messagesList = document.getElementById( 'messages');
        

        messageForm.addEventListener( 'submit', (e) => {
            e.preventDefault();
            if( messageInput.value ){
                console.log( "Enviat al servidor" );
                const message = { m: messageInput.value, u: messageCsrf.value }
                socket.emit( 'send_message', message );
            } else {
                console.log( "Entra buida" );
            }
            messageInput.value = '';
        });

        socket.on( 'send_message', (msg) => {
            console.log( "Rebut del servidor:", msg );
            const item = document.createElement( 'li' );
            item.textContent = msg;
            // item.className = 'text-blue-500 px-4 py-2 border rounded shadow-lg';
            item.className = 'text-blue-500 px-4 py-2 border ml-1 mr-1';
            messagesList.appendChild( item );
        });

        socket.on( 'connexio_rebutjada', (msg) => {
            console.log( "Rebut del servidor:", msg );
            const item = document.createElement( 'li' );
            item.textContent = msg;
            // item.className = 'text-blue-500 px-4 py-2 border rounded shadow-lg';
            item.className = 'text-blue-500 px-4 py-2 border ml-1 mr-1';
            messagesList.appendChild( item );
        });

        
        socket.on( 'missatge_benvinguda', (msg) => {
            console.log( "Rebut del servidor:", msg );
            const item = document.createElement( 'li' );
            item.textContent = msg;
            // item.className = 'text-blue-500 px-4 py-2 border rounded shadow-lg';
            item.className = 'text-blue-500 px-4 py-2 border ml-1 mr-1';
            messagesList.appendChild( item );
        });
    });