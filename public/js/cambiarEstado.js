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

/***/ "./src/js/cambiarEstado.js":
/*!*********************************!*\
  !*** ./src/js/cambiarEstado.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\n    const cambiarEstadoBotones = document.querySelectorAll('.cambiar-estado')\n    const token = document.querySelector('meta[name=\"csrf-token\"]').getAttribute('content')\n\n    const cadena01 = cadenaTranslate.cadena01\n    const cadena02 = cadenaTranslate.cadena02\n    const cadena03 = cadenaTranslate.cadena03\n\n    cambiarEstadoBotones.forEach( boton => {\n        boton.addEventListener('click', cambiarEstadoPropiedad)\n    } )\n\n    async function cambiarEstadoPropiedad(e) {\n\n        const { propietatId: id } = e.target.dataset\n        \n        try {\n            const url = `/propietat/${id}`\n\n            const respuesta = await fetch(url, {\n                method: 'PUT',\n                headers: {\n                    'CSRF-Token': token\n                }\n            })\n\n            const {resultat, missatge} = await respuesta.json()\n\n            if(resultat) {\n                if(e.target.classList.contains('bg-yellow-100')) {\n                    e.target.classList.add('bg-green-100', 'text-green-800')\n                    e.target.classList.remove('bg-yellow-100', 'text-yellow-800')\n                    e.target.textContent = cadena02\n                } else {\n                    e.target.classList.remove('bg-green-100', 'text-green-800')\n                    e.target.classList.add('bg-yellow-100', 'text-yellow-800')\n                    e.target.textContent = cadena03\n                }\n            } else {\n                alert(cadena01 + '.\\n' + missatge)\n            }\n        } catch (error) {\n            console.log(error)\n        }\n       \n    }\n})()\n\n//# sourceURL=webpack://finques/./src/js/cambiarEstado.js?");

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
/******/ 	__webpack_modules__["./src/js/cambiarEstado.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;