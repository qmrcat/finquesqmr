function scrollToBottom() {
    const tauler = document.getElementById('tauler');
    tauler.scrollTop = tauler.scrollHeight;
}


const inserirMissatgeDelServidor = ( messagesList, msg, usr = '' ) => {
console.log("🚀 ~ inserirMissatgeDelServidor ~ messagesList, msg, usr:", msg, usr)

    const item = document.createElement( 'li' );
    //item.textContent = msg ;
    // item.className = 'text-blue-500 px-4 py-2 border rounded shadow-lg';
    item.className = 'flex flex-col px-4 py-2 border ml-1 mr-1 text-left';

    const itemMsg = document.createElement( 'p' );
    itemMsg.className = 'text-blue-500 text-left';
    itemMsg.textContent = msg ;

    item.appendChild( itemMsg )

    if( usr !== '' ){
        const itemUsr = document.createElement( 'p' );
        itemUsr.textContent = `${usr}` ;
        itemUsr.className = 'italic text-blue-300 text-sm text-left'
        item.appendChild( itemUsr )
    }

    messagesList.appendChild( item );
    scrollToBottom()

}

const inserirMissatgeAlServidor = ( messagesList, msg ) => {

    const item = document.createElement( 'li' );
    item.className = 'flex justify-end px-4 py-2 border ml-1 mr-1';
    const itemMsg = document.createElement( 'p' );
    itemMsg.className = 'text-blue-500';
    itemMsg.textContent = msg ;

    item.appendChild( itemMsg )

    messagesList.appendChild( item );
    scrollToBottom()

}


const inserirMissatgeBenvinguda = ( messagesList, msg ) => {

    const item = document.createElement( 'li' );
    item.className = 'flex flex-col px-4 py-2 border ml-1 mr-1 text-right';
    const itemMsg = document.createElement( 'p' );
    itemMsg.className = 'text-blue-500 text-right';
    itemMsg.textContent = msg ;

    item.appendChild( itemMsg )

    const itemId = document.createElement( 'p' );
    itemId.textContent = `id: ${socket.id}` ;
    itemId.className = 'italic text-blue-300 text-sm text-right'
    item.appendChild( itemId )

    messagesList.appendChild( item );
    scrollToBottom()

}

const tokenSocket = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

const socket = io( ':3000', { auth: { token: tokenSocket },  withCredentials: true } );

    let socketId

        socket.on('connect', () => {
            // Mostrar l'ID del socket en la consola del navegador
            console.log('Connectat amb l\'ID de socket:', socket.id);
            socketId = socket.id
        });


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
                const message = { m: messageInput.value, t: messageCsrf.value }
                socket.emit( 'send_message', message );
                inserirMissatgeAlServidor( messagesList, messageInput.value )
            } else {
                console.log( "Entra buida" );
            }
            messageInput.value = '';
        });

        socket.on( 'send_message', ( msgServer ) => {
            console.log( "Rebut del servidor:", msgServer );
            // const item = document.createElement( 'li' );
            // item.textContent = msg;
            // // item.className = 'text-blue-500 px-4 py-2 border rounded shadow-lg';
            // item.className = 'text-blue-500 px-4 py-2 border ml-1 mr-1';
            // messagesList.appendChild( item );
            const { m: msg, u: usr } = msgServer
            inserirMissatgeDelServidor( messagesList, msg, usr )
        });

        socket.on( 'connexio_rebutjada', (msg) => {
            console.log( "Rebut del servidor:", msg );
            // const item = document.createElement( 'li' );
            // item.textContent = msg ;
            // // item.className = 'text-blue-500 px-4 py-2 border rounded shadow-lg';
            // item.className = 'text-blue-500 px-4 py-2 border ml-1 mr-1';
            // messagesList.appendChild( item );
            inserirMissatgeAlServidor( messagesList, msg )
        });

        
        socket.on( 'missatge_benvinguda', (msg) => {
            console.log( "Rebut del servidor:", msg );
            // const item = document.createElement( 'li' );
            // item.textContent = msg;
            // // item.className = 'text-blue-500 px-4 py-2 border rounded shadow-lg';
            // item.className = 'text-blue-500 px-4 py-2 border ml-1 mr-1';
            // const itemP = document.createElement( 'p' );
            // itemP.textContent = `id: ${socket.id}` ;
            // itemP.className = 'italic text-blue-300 text-sm'
            // item.appendChild( itemP );
            // messagesList.appendChild( item );
            inserirMissatgeBenvinguda( messagesList, msg, socket.id)
        });
    });