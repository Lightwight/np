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

np.module('model.adapter', (function (m) {
    var _adapter, fallback, w;
    
    // if no adapter was set, we need a falllback:
    fallback    = {
        definition: function () { 
            var promise = np.Promise();

            np.tick (promise.fail);

            return promise;
        },
        
        request:    function () { 
            var promise = np.Promise();

            np.tick (promise.fail);

            return promise;
        },
        
        save:       function () { 
            var promise = np.Promise();

            np.tick (promise.fail);

            return promise;
        }
    };
    
    _adapter    = fallback;
    
    function warn (type, data) {
        np.warn ('===========================================================');
        np.warn ('Type: '+type);
        np.warn (' ');
        
        switch (type) {
            case 'noobject':
                np.warn ('np.model.adapter.set:');
                np.warn ('The passed parameter isn\'t an object. Please pass as an object.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data);
                break;
                
            case 'nodefinition':
                np.warn ('np.model.adapter.set:');
                np.warn ('The passed parameter doesn\'t contain a method named \'definition\'.');
                np.warn ('Please implement it.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data);
                break;
                
            case 'norequest':
                np.warn ('np.model.adapter.set:');
                np.warn ('The passed parameter doesn\'t contain a method named \'request\'.');
                np.warn ('Please implement it.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data);
                break;
                
            case 'nosend':
                np.warn ('np.model.adapter.set:');
                np.warn ('The passed parameter doesn\'t contain a method named \'save\'.');
                np.warn ('Please implement it.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data);
                break;
                
            case 'nodef_ret_promise':
                np.warn ('np.model.adapter.set:');
                np.warn ('The passed parameter which contains \'definition\' should return a np.Promise.');
                np.warn ('Please implement it.');
                np.warn (' ');
                np.warn ('Return value of your definition-method:');
                np.warn (data);
                break;
                
            case 'noreq_ret_promise':
                np.warn ('np.model.adapter.set:');
                np.warn ('The passed parameter which contains \'request\' should return a np.Promise.');
                np.warn ('Please implement it.');
                np.warn (' ');
                np.warn ('Return value of your request-method:');
                np.warn (data);
                break;
                
            case 'nosve_ret_promise':
                np.warn ('np.model.adapter.set:');
                np.warn ('The passed parameter which contains \'save\' should return a np.Promise.');
                np.warn ('Please implement it.');
                np.warn (' ');
                np.warn ('Return value of your send-method:');
                np.warn (data);
                break;
                
            case 'no_adapter_set':
                np.warn ('np.model.adapter.set:');
                np.warn ('The passed parameters are invalid.');
                np.warn ('Falling back to pseudo-adapter');
                break;
        }
        
        np.warn (' ');
        np.warn ('Type np.help.module(\'model.adapter\') for more information.');
        np.warn (' ');
        np.warn ('error occured at:', true, 'np.model.adapter.js');
    }
    
    return {
        set: function (adapter) {
            var tOf, np_promise, is_object, has_definition, has_request, has_save,
                def_ret_promise, req_ret_promise, sve_ret_promise, ret_value;
                
            tOf             = typeof adapter;
            np_promise      = np.Promise;
            is_object       = tOf === 'object';
            
            has_definition  = is_object ? typeof adapter.definition === 'function' : false;
            has_request     = is_object ? typeof adapter.request === 'function' : false;
            has_save        = is_object ? typeof adapter.save === 'function' : false;
            
            def_ret_promise = has_definition && adapter.definition(false) instanceof np_promise;
            req_ret_promise = has_request && adapter.request(false) instanceof np_promise;
            sve_ret_promise = has_save && adapter.save(false) instanceof np_promise;
            
            ret_value       = false;
            
            if (is_object && has_definition && has_request && has_save) {
                if (def_ret_promise && req_ret_promise && sve_ret_promise) {
                    _adapter    = adapter;
                    
                    ret_value   = true;
                } 
                
                if (!def_ret_promise) { warn ('nodef_ret_promise', adapter.definition(false));   } 
                if (!req_ret_promise) { warn ('noreq_ret_promise', adapter.request(false));      } 
                if (!sve_ret_promise) { warn ('nosve_ret_promise', adapter.save(false));         } 
                
                if (!def_ret_promise || !req_ret_promise || !sve_ret_promise) {
                    ret_value   = false;
                }
            } else if (!is_object) {
                warn ('noobject', adapter);
                
                ret_value   = false;
            } else if (!has_definition) {
                warn ('nodefinition', adapter);
                
                ret_value   = false;
            } else if (!has_request) {
                warn ('norequest', adapter);
                
                ret_value   = false;
            } else if (!has_save) {
                warn ('nosave', adapter);
                
                ret_value   = false;
            }
            
            if (!ret_value) {
                warn ('no_adapter_set');
                
                _adapter    = fallback;
            }

            return ret_value;
        },
        
        unset: function () {
            _adapter    = fallback;
        },
        
        get: function () {
            return _adapter;
        }
    };
}()));