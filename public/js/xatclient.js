/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/xatclient.js":
/*!*****************************!*\
  !*** ./src/js/xatclient.js ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nfunction scrollToBottom() {\r\n    const tauler = document.getElementById('tauler');\r\n    tauler.scrollTop = tauler.scrollHeight;\r\n}\r\n\r\n\r\nconst inserirMissatgeDelServidor = ( messagesList, msg, usr = '' ) => {\r\nconsole.log(\"🚀 ~ inserirMissatgeDelServidor ~ messagesList, msg, usr:\", msg, usr)\r\n\r\n    const item = document.createElement( 'li' );\r\n    //item.textContent = msg ;\r\n    // item.className = 'text-blue-500 px-4 py-2 border rounded shadow-lg';\r\n    item.className = 'flex flex-col px-4 py-2 border ml-1 mr-1 text-left';\r\n\r\n    const itemMsg = document.createElement( 'p' );\r\n    itemMsg.className = 'text-blue-500 text-left';\r\n    itemMsg.textContent = msg ;\r\n\r\n    item.appendChild( itemMsg )\r\n\r\n    if( usr !== '' ){\r\n        const itemUsr = document.createElement( 'p' );\r\n        itemUsr.textContent = `${usr}` ;\r\n        itemUsr.className = 'italic text-blue-300 text-sm text-left'\r\n        item.appendChild( itemUsr )\r\n    }\r\n\r\n    messagesList.appendChild( item );\r\n    scrollToBottom()\r\n\r\n}\r\n\r\nconst inserirMissatgeAlServidor = ( messagesList, msg ) => {\r\n\r\n    const item = document.createElement( 'li' );\r\n    item.className = 'flex justify-end px-4 py-2 border ml-1 mr-1';\r\n    const itemMsg = document.createElement( 'p' );\r\n    itemMsg.className = 'text-blue-500';\r\n    itemMsg.textContent = msg ;\r\n\r\n    item.appendChild( itemMsg )\r\n\r\n    messagesList.appendChild( item );\r\n    scrollToBottom()\r\n\r\n}\r\n\r\n\r\nconst inserirMissatgeBenvinguda = ( messagesList, msg ) => {\r\n\r\n    const item = document.createElement( 'li' );\r\n    item.className = 'flex flex-col px-4 py-2 border ml-1 mr-1 text-right';\r\n    const itemMsg = document.createElement( 'p' );\r\n    itemMsg.className = 'text-blue-500 text-right';\r\n    itemMsg.textContent = msg ;\r\n\r\n    item.appendChild( itemMsg )\r\n\r\n    const itemId = document.createElement( 'p' );\r\n    itemId.textContent = `id: ${socket.id}` ;\r\n    itemId.className = 'italic text-blue-300 text-sm text-right'\r\n    item.appendChild( itemId )\r\n\r\n    messagesList.appendChild( item );\r\n    scrollToBottom()\r\n\r\n}\r\n\r\nconst tokenSocket = document.querySelector('meta[name=\"csrf-token\"]').getAttribute('content')\r\n\r\nconst socket = io( ':3000', { auth: { token: tokenSocket },  withCredentials: true } );\r\n\r\n    let socketId\r\n\r\n        socket.on('connect', () => {\r\n            // Mostrar l'ID del socket en la consola del navegador\r\n            console.log('Connectat amb l\\'ID de socket:', socket.id);\r\n            socketId = socket.id\r\n        });\r\n\r\n\r\n    document.addEventListener( 'DOMContentLoaded', () => {\r\n\r\n        console.log( 'socket: ', socket );\r\n        \r\n\r\n        const messageForm = document.getElementById( 'message-form' );\r\n        const messageInput = document.getElementById( 'message-input' );\r\n        const messageCsrf = document.getElementById( '_csrf');\r\n        const messagesList = document.getElementById( 'messages');\r\n        \r\n\r\n        messageForm.addEventListener( 'submit', (e) => {\r\n            e.preventDefault();\r\n            if( messageInput.value ){\r\n                console.log( \"Enviat al servidor\" );\r\n                const message = { m: messageInput.value, t: messageCsrf.value }\r\n                socket.emit( 'send_message', message );\r\n                inserirMissatgeAlServidor( messagesList, messageInput.value )\r\n            } else {\r\n                console.log( \"Entra buida\" );\r\n            }\r\n            messageInput.value = '';\r\n        });\r\n\r\n        socket.on( 'send_message', ( msgServer ) => {\r\n            console.log( \"Rebut del servidor:\", msgServer );\r\n            // const item = document.createElement( 'li' );\r\n            // item.textContent = msg;\r\n            // // item.className = 'text-blue-500 px-4 py-2 border rounded shadow-lg';\r\n            // item.className = 'text-blue-500 px-4 py-2 border ml-1 mr-1';\r\n            // messagesList.appendChild( item );\r\n            const { m: msg, u: usr } = msgServer\r\n            inserirMissatgeDelServidor( messagesList, msg, usr )\r\n        });\r\n\r\n        socket.on( 'connexio_rebutjada', (msg) => {\r\n            console.log( \"Rebut del servidor:\", msg );\r\n            // const item = document.createElement( 'li' );\r\n            // item.textContent = msg ;\r\n            // // item.className = 'text-blue-500 px-4 py-2 border rounded shadow-lg';\r\n            // item.className = 'text-blue-500 px-4 py-2 border ml-1 mr-1';\r\n            // messagesList.appendChild( item );\r\n            inserirMissatgeAlServidor( messagesList, msg )\r\n        });\r\n\r\n        \r\n        socket.on( 'missatge_benvinguda', (msg) => {\r\n            console.log( \"Rebut del servidor:\", msg );\r\n            // const item = document.createElement( 'li' );\r\n            // item.textContent = msg;\r\n            // // item.className = 'text-blue-500 px-4 py-2 border rounded shadow-lg';\r\n            // item.className = 'text-blue-500 px-4 py-2 border ml-1 mr-1';\r\n            // const itemP = document.createElement( 'p' );\r\n            // itemP.textContent = `id: ${socket.id}` ;\r\n            // itemP.className = 'italic text-blue-300 text-sm'\r\n            // item.appendChild( itemP );\r\n            // messagesList.appendChild( item );\r\n            inserirMissatgeBenvinguda( messagesList, msg, socket.id)\r\n        });\r\n    });\n\n//# sourceURL=webpack://finques/./src/js/xatclient.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/xatclient.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;