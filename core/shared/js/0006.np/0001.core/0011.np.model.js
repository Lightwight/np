/*
*   This software called - np - is a lightwight MVP Framework for building web applications and
*   was developed by Christian Peters
*
*   Copyright (C) 2016 Christian Peters
*
*   This program is free software: you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License
*   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*   Contact: Christian Peters <c.peters.eshop@gmail.com>
*/

np.module ('model', (function (){
    var storage;

    storage = {
        models:         {},
        newModelID:     -1
    };
    
    return {
        extend: function (model, options) {
            var i, modelExt;

            if (typeof storage.models[model] === 'undefined') {
                modelExt    = {};

                /* add model extensions to storage */
                for (i in options) { modelExt[i] = options[i];  }

                storage.models[model]   = modelExt;
            }
        },
        
        singularize: function (model) {
            if (typeof storage.models[model] === 'object' && typeof storage.models[model].singular === 'string') {
                return storage.models[model].singular;
            } else if (model.indexOf ('virtual') !== 0){
                return model.slice (0, model.length-1);
            } else {
                return model;
            }
        },

        get: function (model) {
            if (typeof storage.models[model] !== 'undefined') {
                return storage.models[model];
            } else {
                return false;
            }
        },
        
        getNameOf: function (context) {
            var i;
            
            for (i in context) { return i;  }
        }
    };
}()));