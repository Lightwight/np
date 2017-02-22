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

np.module ('model.ajaxAdapter', (function () {
    var storage;
    
    storage     = {
        definition:     {}
    };
    
    function findByExists (model, findBy) {
        var def, i, valid_col, tmp;
        
        if (findBy !== 'all') {
            def         = storage.definition[model];
            valid_col   = false;
            findBy      = findBy.slice (0, 1).toUpperCase () + findBy.slice (1);

            for (i in def) {
                tmp = i.slice (0, 1).toUpperCase ()+i.slice (1);

                if (tmp === findBy) { valid_col = true; break; }
            }

            return valid_col;
        } else {
            return true;
        }
    }    
    
    function warn (type, data) {
        var i, l, j;
        
        np.warn ('===========================================================');
        np.warn ('Type: '+type);
        np.warn (' ');
        
        switch (type) {
            case 'invalid_model':
                np.warn ('np.model.ajaxAdapter.definition(\''+data.model+'\'):');
                np.warn ('No model-name passed.');
                np.warn ('Please pass a model-name as a string.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.model);
                np.warn (' ');
                np.warn ('and is type of:');
                np.warn (data.tof);
                break;
                
            case 'model_not_found': 
                np.warn ('np.model.ajaxAdapter.definition(\''+data.model+'\'):');
                np.warn ('No model-name passed.');
                break;
                
            case 'ajax_failed': 
                np.warn ('np.model.ajaxAdapter.definition(\''+data.model+'\'):');
                np.warn ('Server request failed.');
                np.warn (' ');
                np.warn ('Response data:');
                np.warn (data.error.params);
                np.warn (' ');
                np.warn ('Response status:');
                np.warn (data.error.status);
                np.warn (' ');
                np.warn ('Solution:');
                np.warn (data.solution);
                break;
                
            case 'model_not_exists': 
                np.warn ('np.model.ajaxAdapter.definition(\''+data.model+'\'):');
                np.warn ('The model could not be found on the server.');
                np.warn ('Please ensure that you defined the model server sided.');
                break;
                
            case 'req_invalid_model': 
                np.warn ('np.model.ajaxAdapter.request:');
                np.warn ('No model passed.');
                np.warn ('Please pass a valid model as a string.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.model);
                np.warn (' ');
                np.warn ('and is type of:');
                np.warn (data.tof);
                break;
                
            case 'req_invalid_options': 
                np.warn ('np.model.ajaxAdapter.request:');
                np.warn ('Invalid type of parameter.');
                np.warn ('Please pass the parameter as an object.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.options);
                np.warn (' ');
                np.warn ('and is type of:');
                np.warn (data.tof);
                break;
                
            case 'req_no_model': 
                np.warn ('np.model.ajaxAdapter.request:');
                np.warn ('Model not existing.');
                np.warn ('Please pass a existing model as a string.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.model);
                break;
                
            case 'sve_invalid_options': 
                np.warn ('np.model.ajaxAdapter.save:');
                np.warn ('Invalid type of parameter.');
                np.warn ('Please pass the parameter as an object like {model:[model], data:[data]}.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.options);
                np.warn (' ');
                np.warn ('and is type of:');
                np.warn (data.tof);
                break;
                
            case 'sve_invalid_type_of_data': 
                np.warn ('np.model.ajaxAdapter.save(\''+data.model+'\'):');
                np.warn ('Invalid type of data.');
                np.warn ('Please pass the data as an object.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.data);
                np.warn (' ');
                np.warn ('and is type of:');
                np.warn (data.tof);
                break;

            case 'sve_empty_data': 
                np.warn ('np.model.ajaxAdapter.save(\''+data.model+'\'):');
                np.warn ('Empty data.');
                np.warn ('Please do not pass empty data.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.data);
                break;

            case 'sve_invalid_data': 
                l   = data.data.length;
                
                np.warn ('np.model.ajaxAdapter.save(\''+data.model+'\'):');
                np.warn ('Invalid data.');
                np.warn ('Please pass valid data.');
                np.warn (' ');
                np.warn ('You passed:');
                for (i=0; i<l; i++) {
                    np.warn ('Object {');
                    for (j in data.data[i].row) { np.warn ('    '+j+': '+data.data[i].row[j]+' ['+typeof data.data[i].row[j]+']'); }
                    np.warn ('}');
                }
                np.warn (' ');
                np.warn ('the format should be:');
                for (i in data.def) { np.warn (i+': '+data.def[i]); }
                break;            
                
            case 'sve_ajax_error': 
                np.warn ('np.model.ajaxAdapter.save(\''+data.model+'\'):');
                np.warn ('Ajax error occured.');
                np.warn (' ');
                np.warn ('Error:');
                np.warn (data.err.error.status);
                np.warn (' ');
                np.warn ('with data:');
                np.warn (data.err.error.params);
                np.warn (' ');                
                np.warn ('Solution:');
                np.warn (data.err.solution);
                break;            
        };
        
        np.warn (' ');
        np.warn ('Type np.help.module(\'model.ajaxAdapter\') for more information.');
        np.warn (' ');
        np.warn ('error stack:', true);
    }
    
    return {
        definition: function (model, localDefinition) {
            var promise, definition, tof_model, valid_model, ajx;

            promise             = np.Promise();
            localDefinition     = typeof localDefinition === 'object' ? localDefinition : false;

            if (model) {
                definition  = storage.definition;
                tof_model   = typeof model;
                valid_model = tof_model === 'string' && model.length > 0;

                if (valid_model) {
                    if (localDefinition) {
                        var exists;
                        
                        exists  = (function (def){
                            var i;

                            for (i in def) { return true; }

                            return false;
                        }(localDefinition));
                        
                        if (exists) {
                            if (typeof(localDefinition['ID']) === 'string' ) {
                                localDefinition['id']  = localDefinition['ID'];

                                delete localDefinition['ID'];
                            }

                            definition[model]   = localDefinition;

                            np.tick (promise.then, localDefinition);
                        } else {
                            warn ('model_not_exists', {model:model});

                            np.tick (promise.fail);
                        }                        
                    } else {
                        ajx = np.ajax({
                            dataType:   'json',
                            url:        '/',
                            data:       {type:'definition', definition: model}
                        })
                        .then (function (rsp) {
                            var data, model, m_definition, exists;

                            data            = rsp.data;
                            model           = data.definition;
                            m_definition    = data[model];
                            exists          = (function (def){
                                var i;

                                for (i in def) { return true; }

                                return false;
                            }(m_definition));

                            if (exists) {
                                if (typeof(m_definition['ID']) === 'string' ) {
                                    m_definition['id']  = m_definition['ID'];

                                    delete m_definition['ID'];
                                }

                                definition[model]   = m_definition;

                                np.tick (promise.then, m_definition);
                            } else {
                                warn ('model_not_exists', {model:model});

                                np.tick (promise.fail);
                            }
                        })
                        .fail (function (err) {
                            warn ('ajax_failed', {model: model, error: err.error, solution: err.solution});

                            np.tick (promise.fail);
                        });
                    }
                } 
                // Just for test purposes (TDD):
                else if (tof_model === 'boolean') {
                    ajx = np.ajax().fail (function (err) {
                        warn ('ajax_failed', {model: model, error: err.error, solution: err.solution});

                        np.tick (promise.fail);
                    });

                    ajx.abort ();
                } else {
                    warn ('invalid_model', {model:model, tof: tof_model});

                    np.tick (promise.fail);
                }
            } else {
                np.tick (promise.fail);
            }
            
            return promise;            
        },

        request: function (options) {
            var promise, defaults, options, model, find_by, find_by_lower, search,
                tof_find, tof_model, tof_find_by, tof_search, valid_options, valid_model, valid_find_by,
                valid_search, model_exists, find_by_exists, request;
            
            promise         = np.Promise();
            
            if (options) {            
                defaults        = {model:false, findBy: 'all'};
                valid_options   = typeof options === 'object';

                if (valid_options ) {
                    options         = $.extend (defaults, options);
                    model           = options.model;
                    tof_find        = typeof options.findLike === 'undefined' ? 'findBy' : 'findLike';
                    find_by         = options[tof_find];

                    search          = (typeof options.search !== 'undefined') ? options.search : undefined;

                    tof_model       = typeof model;
                    tof_find_by     = typeof find_by;
                    tof_search      = typeof search;

                    valid_model     = tof_model === 'string' && model.length > 0;
                    valid_find_by   = tof_find_by === 'string' && find_by.length > 0;  
                    valid_search    = (tof_search === 'string' && search.length > 0 ) 
                                      || (tof_search !== 'undefined' && tof_search !== 'string')
                                      || (valid_find_by && find_by === 'all');

                    model_exists    = valid_model && typeof storage.definition[model] !== 'undefined';
                    find_by_exists  = model_exists && valid_find_by && findByExists(model, find_by);

                    if (valid_model && valid_find_by && valid_search && model_exists && find_by_exists) {
                        find_by_lower   = find_by.slice (0, 1).toLowerCase() + find_by.slice (1);

                        request         = {type:'model', model: model};
                        
                        if (tof_find_by === 'findBy') {
                            request[model]  = {findby: find_by_lower, search: search};
                        } else {
                            request[model]  = {findlike: find_by_lower, search: search};
                        }

                        np.ajax({
                            dataType:   'json',
                            url:        '/',
                            data:       request
                        })
                        .then (function (rsp) {
                            var m, d, valid;

                            m       = rsp.data.model;
                            d       = rsp.data[m];

                            valid   = typeof d  === 'object';

                            if (valid) {
                                promise.then (d);
                            } else {
                                warn ('ajax_failed', {model:model});

                                promise.fail();
                            }
                        })
                        .fail (function (err) {
                            warn ('ajax_failed', {model: model, error: err.error, solution: err.solution});

                            np.tick (promise.fail);
                        });                    
                    } else if (!valid_model) {
                        warn ('req_invalid_model', {model:model,tof:tof_model});

                        np.tick (promise.fail);
                    } else if (!model_exists) {
                        warn ('req_no_model', {model:model});

                        np.tick (promise.fail);
                    } else if (!valid_find_by) {
                        warn ('req_invalid_find_by', {model:model,findBy:find_by,tof:tof_find_by});

                        np.tick (promise.fail);
                    } else if (!find_by_exists) {
                        warn ('req_no_find_by', {model:model,findBy:find_by,possible:storage.possibleFind[model]});

                        np.tick (promise.fail);
                    } else if (!valid_search) {
                        warn ('req_invalid_search', {model:model,findBy:find_by,search:search});

                        np.tick (promise.fail);
                    } 
                } else {
                    warn ('req_invalid_options',{options:options,tof:(typeof options)});

                    np.tick (promise.fail);
                }
            } else {
                np.tick (promise.fail);
            }
            
            return promise;        
        },

        save: function (options) {
            var promise, defaults, tof_model, tof_data, valid_options, 
                valid_model, valid_tof_data, valid_len_data,
                model_exists, model, data;

            promise         = np.Promise();

            if (options) {
                valid_options   = typeof options === 'object' && typeof options['model'] !== 'undefined' && typeof options['data'] !== 'undefined';                            
            
                if (valid_options) {
                    options         = $.extend (defaults, options);
                    model           = options.model;
                    data            = options.data;

                    tof_model       = typeof model;
                    valid_model     = tof_model === 'string' && model.length > 0;
                    model_exists    = typeof storage.definition[model] !== 'undefined';

                    tof_data        = typeof data;
                    valid_tof_data  = tof_data === 'object';
                    valid_len_data  = valid_tof_data && data.length > 0;

                    if (model_exists) {
                        request         = {type:'model', model: model, route: $.address.path ()};
                        request[model]  = data;

                        np.ajax({
                            type:       'POST',
                            dataType:   'json',
                            url:        '/',
                            data:       request
                        }).then (function (rsp) {
                            var data, model, rows;

                            data    = rsp.data;
                            model   = data.model;
                            rows    = data[model];

                            promise.then (rows);
                        }).fail (function (err) {
                            warn ('sve_ajax_error', {model:model, err: err});

                            promise.fail (err);
                        });

                    } else if (!valid_model) {
                        warn ('sve_invalid_model', {model:model,tof:tof_model});

                        np.tick (promise.fail);
                    } else if (!model_exists) {
                        warn ('sve_model_not_exists', {model:model});

                        np.tick (promise.fail);
                    } else if (!valid_tof_data) {
                        warn ('sve_invalid_type_of_data', {model:model,data:data,tof:tof_data});

                        np.tick (promise.fail);
                    } else if (!valid_len_data) {
                        warn ('sve_empty_data', {model:model,data:data});

                        np.tick (promise.fail);
                    }
                } else {
                    warn ('sve_invalid_options',{options:options,tof:(typeof options)});

                    np.tick (promise.fail);
                }
            } else {
                np.tick (promise.fail);
            }
            
            return promise;            
        },
        
        removeModel: function () {
            
        }
    };
}()));