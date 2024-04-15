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

eval("__webpack_require__.r(__webpack_exports__);\nconst socket = io('http://localhost:3000');\r\n\r\n    document.addEventListener('DOMContentLoaded', () => {\r\n        const messageForm = document.getElementById('message-form');\r\n        const messageInput = document.getElementById('message-input');\r\n        const messagesList = document.getElementById('messages');\r\n\r\n        messageForm.addEventListener('submit', (e) => {\r\n            e.preventDefault();\r\n            console.log( \"Enviat al servidor\" );\r\n            \r\n            const message = messageInput.value;\r\n            socket.emit('send_message', message);\r\n            messageInput.value = '';\r\n        });\r\n\r\n        socket.on('send_message', (msg) => {\r\n            console.log( \"Rebut del servidor:\", msg);\r\n            const item = document.createElement('li');\r\n            item.textContent = msg;\r\n            messagesList.appendChild(item);\r\n        });\r\n    });\n\n//# sourceURL=webpack://finques/./src/js/xatclient.js?");

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