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

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function(){\n    const lat = 41.155101;\n    const lng = 1.108758;\n    // const lat = document.querySelector('#lat').value || 41.155101;\n    // const lng = document.querySelector('#lng').value || 1.108758; \n    const mapa = L.map('mapa-inici').setView([lat, lng ], 13);\n\n    let markers = new L.FeatureGroup().addTo(mapa)\n\n    \n    let propietats = [];\n    \n    // Filtros\n    const filtres = {\n        categoria: '',\n        preu: ''\n    }\n    \n    const categoriesSelect = document.querySelector('#categories');\n    const preusSelect = document.querySelector('#preus');\n\n    // Filtrado de Categorias y precios\n    categoriesSelect.addEventListener('change', e => {\n        filtres.categoria = +e.target.value\n        filtrarPropietats();\n    })\n\n    preusSelect.addEventListener('change', e => {\n        filtres.preu = +e.target.value\n        filtrarPropietats();\n    })\n\n\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=ca', {\n        //attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributorsQMR'\n        attributionControl: false\n    }).addTo(mapa);\n\n    try {\n        mapa.attributionControl._container.innerHTML = ''\n    } catch (error) {\n        console.log( error );\n    }\n\n\n    const obtenirPropietats = async () => {\n        try {\n            const url = '/api/propietats'\n            const respuesta = await fetch(url)\n            propietats = await respuesta.json()\n            //console.log(\"🚀 ~ obtenirPropietats ~ propietats:\", propietats)\n            visualitzarPropietats(propietats)\n        } catch (error) {\n            console.log(error)\n        }\n    }\n\n    const visualitzarPropietats = propietats => {\n\n        markers.clearLayers()\n\n        propietats.forEach(propietat => {\n            \n            const marker = new L.marker([propietat?.lat, propietat?.lng ], {\n                autoPan: true\n            })\n            .addTo(mapa)\n            .bindPopup(`\n                <p class=\"text-indigo-600 font-bold\">${propietat.categoria.nom}</p>\n                <h1 class=\"text-xl font-extrabold uppercase my-2\">${propietat?.titol}</h1>\n                <img src=\"/uploads/${propietat?.imatge}\" alt=\"Imatge de la propietat ${propietat.titol}\">\n                <p class=\"text-gray-600 font-bold\">${propietat.preu.nom}</p>\n                <a href=\"/propietat/${propietat.id}\" class=\"bg-indigo-600 block p-2 text-center font-bold uppercase text-white\">Visualtzar Propietat</a>\n            `)\n            markers.addLayer(marker)\n        })\n    }\n\n    const filtrarPropietats = () => {\n        const resultat = propietats.filter( filtrarCategoria ).filter( filtrarPreu )\n        visualitzarPropietats(resultat)\n    }\n\n\n    const filtrarCategoria = propietat => filtres.categoria ? propietat.categoriaId === filtres.categoria : propietat\n    \n    const filtrarPreu = propietat => filtres.preu ? propietat.preuId === filtres.preu : propietat\n\n\n    obtenirPropietats()\n})()\n\n\n//# sourceURL=webpack://finques/./src/js/mapaInicio.js?");

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
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;