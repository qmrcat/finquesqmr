import express from "express"
import { createServer } from "http";
import { Server } from "socket.io";
import url from "node:url"
import cors from "cors"
import csrf from 'csurf'
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'
import userRouter from "./routes/usuarisRoutes.js"
import propietatsRouter from "./routes/propietatsRoutes.js"
import appRouter from "./routes/appRouter.js"
import apiRoutes from "./routes/apiRoutes.js"

import { globalApp, getAllCategoriesGlobal, getAllPreusGlobal } from "./global/global.js"

import db from './config/db.js'

import { translateOpenMain, qmrTrans, isProduccionTranslate, writeFileMainJSON, mainTranslate } from './translate/translate.js'



dotenv.config({path: '.env'})
process.env.producction = (process.env.IS_PRODUCTION.toUpperCase() === 'YES') // ? true : false

console.log("🚀 ~ process.env.producction:", process.env.producction)

if (!process.env.producction){ 
    console.log( 'Producció' );
} else {
    console.log( 'Desenvolupament' );
}
const app = express()

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*", // Configura això segons les teves necessitats de cors
        //origin: "http://127.0.0.1",
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



io.on('connection', (socket) => {
    console.log('Un usuari s\'ha connectat', socket.id );

    socket.on('send_message', (data) => {
        console.log( `Missatge rebut:` );
        console.log( data );

        io.emit('send_message', data);
    });

    socket.on('disconnect', () => {
        console.log('Usuari desconnectat');
    });
});

const PORT = process.env.PORT ?? process.env.BACKEND_PORT

// app.listen(PORT, () => {
//     console.log( `El servidor esta escoltan pel port: ${ PORT } ` );
//     console.log( `http://localhost:${ PORT } ` );
    
// })
httpServer.listen(PORT, () => {
    console.log(`El servidor està escoltant al port: ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

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