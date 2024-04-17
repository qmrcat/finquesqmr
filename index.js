import express from "express"
import { createServer } from "http";
import { Server } from "socket.io";
import url from "node:url"
import cors from "cors"
import csrf from 'csurf'
import cookieParser from "cookie-parser"
import { parse } from 'cookie';
import dotenv from 'dotenv'
import userRouter from "./routes/usuarisRoutes.js"
import propietatsRouter from "./routes/propietatsRoutes.js"
import appRouter from "./routes/appRouter.js"
import apiRoutes from "./routes/apiRoutes.js"
import { returnUsuariAutentificatPerToken } from "./helpers/usuariAutentificat.js"

import { userXatOk } from "./middleware/protegirRutes.js"
////////import { userXatAuth } from "./middleware/protegirRutes.js"

import { globalApp, getAllCategoriesGlobal, getAllPreusGlobal } from "./global/global.js"

import db from './config/db.js'

import { translateOpenMain, qmrTrans, isProduccionTranslate, writeFileMainJSON, mainTranslate } from './translate/translate.js'

const alreadyWelcomed = new Map();

dotenv.config({path: '.env'})
process.env.producction = (process.env.IS_PRODUCTION.toUpperCase() === 'YES') // ? true : false

console.log("Estatus de codificaió en producció?:", (!process.env.producction) ? 'Producció' : 'Desenvolupament' )

const app = express()

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*", // Configura això segons les teves necessitats de cors
        methods: ["GET", "POST"]
    }
});

app.use(cors())

translateOpenMain()

globalApp()
global.allCategories = await getAllCategoriesGlobal();
global.allPreus      = await getAllPreusGlobal();


app.use( express.urlencoded({
    extended: true
}))

app.use( cookieParser() )

app.use( csrf({cookie: true}) )

try {
    await db.authenticate()
    db.sync()
    console.log( 'Conectat a la BD amb exit' )
} catch (error) {
    console.log( 'No s\'ha poguc conectar a la BD' )
    console.log( error )
}

app.set( 'view engine', 'pug' )
app.set( 'views', './views' )

app.use( express.static( 'public' ) )

app.use((req, res, next) => {
    const urlCompleta = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log('URL demanada:', urlCompleta);
    next();
});

app.use( '/auth', userRouter )
app.use( '/home', appRouter )
app.use( '/api', apiRoutes )
app.use( '/', propietatsRouter )
app.use( '/', appRouter)
app.use( '*', appRouter )

// io.use((socket, next) => {
//     const token = socket.handshake.auth.token;
//     if (token) {
//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//             if (err) {
//                 return next(new Error('Autenticació fallida'));
//             }
//             socket.decoded = decoded;
//             next();
//         });
//     } else {
//         //next(new Error('No token provided'));
//         next(new Error('No s\ha proporcionat cap testimoni (token)'));
//     }
// });

const retornaNomUsuariPelId = ( id ) => {
    //  'XQ9BsrqYVTLE10y-AAAH' => { nom: 'Quimet', hconnexio: '345' },
    
    return alreadyWelcomed.get( id )?.nom ?? " ";
}

//userXatAuth()
io.on('connection', async ( socket ) => {
    console.log('Un usuari s\'ha connectat', socket.id );
    ///console.log("🚀 ~ io.on ~ socket:", socket)
    console.log("---")
    if (socket.handshake.headers.cookie) {
        console.log("🚀 ~ io.on ~ Galetes rebudes:", socket.handshake.headers.cookie)
        const cookiesReq = parse(socket.handshake.headers.cookie);
        const { _tokenSss } = cookiesReq;
        console.log("🚀 ~ io.on ~ _tokenSss:", _tokenSss)

        if ( !userXatOk( _tokenSss ) ) {
            console.log( 'Error: Usuari no autentificat, es redirigeix a l\'inici de sessió.' );
            socket.emit('connexio_rebutjada', 'Error: Usuari no autentificat');
            socket.disconnect(true);
        } else {
            console.log( 'Usuari autentificat' );
        }

        if (!alreadyWelcomed.has(socket.id)){

            const usuari = await returnUsuariAutentificatPerToken( _tokenSss )
            console.log("🚀 ~ io.on ~ userGetValues usuari:", usuari)

            if ( usuari === null ) {
                console.log( 'Error: Usuari no trobat' );
                socket.emit('connexio_rebutjada', 'Error: Usuari no trobat');
                socket.disconnect(true);
            } else {
                socket.emit('missatge_benvinguda', `Benvingut ${usuari.nom}, al nostre servei de Xat!`);
                alreadyWelcomed.set(socket.id, {'nom': usuari.nom, 'hconnexio': '345'});
                console.log("🚀 ~ io.on ~ alreadyWelcomed:", alreadyWelcomed)
                
            }
        }

    } else {
        console.log( 'Error: No existeix les galetes, es redirigeix a l\'inici de sessió.' );
        socket.emit('connexio_rebutjada', 'Error: No existeix les galetes');
        socket.disconnect(true);
    }

    socket.on('send_message', (data) => {
        console.log( `Missatge rebut: ${socket.id}` );
        console.log( data );
        console.log("🚀 ~ io.on ~ Galetes rebudes (send_message) >>:", socket.handshake.headers.cookie)
        const u = retornaNomUsuariPelId(socket.id)
        //io.emit('send_message', data.m); // envia a tots el missatge rebut inclos el remiten
        socket.broadcast.emit('send_message', { 'm': data.m, 'u': u } ); // envia a tots el missatge rebut esclos el remiten
    });

    socket.on('disconnect', (reason) => {
        console.log('Usuari desconnectat');
        console.log(`Client ${socket.id} desconnectat per la raó: ${reason}`);
        alreadyWelcomed.delete(socket.id);
    });

});
    

const PORT = process.env.PORT ?? process.env.BACKEND_PORT

httpServer.listen(PORT, () => {
    console.log(`El servidor està escoltant al port: ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});



// codi obsolet
//

// app.listen(PORT, () => {
//     console.log( `El servidor esta escoltan pel port: ${ PORT } ` );
//     console.log( `http://localhost:${ PORT } ` );
    
// })


//// RECORDAR
// executar XAMPP (MySql)
// executar npm run server
// executar npm run csswatch (Compilador de Tailwind)
// 
///// DOCUMENTACIÓ 
//
// PUG: https://pugjs.org/api/getting-started.html
// https://tailwindcss.com/
//
// 0️⃣ 1️⃣ 2️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 
// 
// SVG numeric
// num0: 5e0dd0d1
// num1: 290ae047
// num2: b003b1fd
// num3: c704816b
// num4: 596014c8
// num5: 2e67245e
// num6: b76e75e4
// num7: c0694572
// num8: 50d658e3
// num9: 27d16875
//