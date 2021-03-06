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

/***/ "./src/js/homeMap.js":
/*!***************************!*\
  !*** ./src/js/homeMap.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function(){\r\n\r\n    const lat = -34.6162284;\r\n    const lng = -68.3299441;\r\n    const mapa = L.map('home-map').setView([lat, lng ], 14);\r\n    let markers = new L.FeatureGroup().addTo(mapa);\r\n\r\n    let propiedades = []\r\n\r\n    const filtros ={\r\n        categorys: '',\r\n        prices:''\r\n    }\r\n\r\n    const selectCategory = document.querySelector('#categorys')\r\n    const selectPrice = document.querySelector('#prices')\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n    selectCategory.addEventListener('change', e=>{\r\n        filtros.categorys = +e.target.value\r\n        filterProperty()\r\n    })\r\n    selectPrice.addEventListener('change', e=>{\r\n        filtros.prices = +e.target.value\r\n        filterProperty()\r\n    })\r\n\r\n    const getProperties = async ()=>{\r\n        const URL = '/api/properties'\r\n\r\n        const response = await fetch(URL)\r\n\r\n        propiedades = await response.json()\r\n\r\n        showProperties(propiedades)\r\n    }\r\n\r\n    const showProperties = async (propiedades)=>{\r\n\r\n        //Limpiar markers antiguos\r\n        markers.clearLayers()\r\n\r\n        propiedades.forEach(propiedad =>{\r\n            //Agregar los markers\r\n            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {\r\n                autoPan:true,\r\n\r\n            })\r\n            .addTo(mapa)\r\n            .bindPopup(`\r\n                <p class=\"text-indigo-600 font-extrabold text-center uppercase\">${propiedad?.categoria.name}</p>\r\n                <h1 class=\"text-l font-bold my-5 uppercase\">${propiedad?.title}</h1>\r\n                <img src=\"/uploads/${propiedad?.image}\" alt=\"Propiedad\"/>\r\n                <p class=\"text-gray-600 font-bold\">${propiedad?.precio.name}</p>\r\n                <a href=\"/property/${propiedad?.id}\" class=\"bg-indigo-600 block p-2 text-center font-bold uppercase\">Ver propiedad</a>\r\n            `)\r\n\r\n            markers.addLayer(marker)\r\n        })\r\n    }\r\n\r\n    const filterProperty = ()=>{\r\n        const filterCategory = propiedad => filtros.categorys ? propiedad.categoryId === filtros.categorys : propiedad\r\n        const filterPrice = propiedad => filtros.prices ? propiedad.priceId === filtros.prices : propiedad\r\n        \r\n        const result = propiedades.filter(filterCategory).filter(filterPrice)\r\n\r\n        showProperties(result)\r\n    }\r\n\r\n    getProperties()\r\n})()\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/homeMap.js?");

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
/******/ 	__webpack_modules__["./src/js/homeMap.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;