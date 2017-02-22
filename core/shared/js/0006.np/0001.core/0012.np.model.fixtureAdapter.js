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

np.module ('model.fixtureAdapter', (function () {
    // Private properties/methods:
    var storage;
    
    storage =    {
        definition:     {},
        data:           new Array (),
        possibleFind:   new Array ()
    };
    
    function findData (model, findBy, search) {
        var data, result, i, l;
        
        result  = new Array ();
        
        if (typeof storage.data[model] !== 'undefined') {
            data    = storage.data[model];
            l       = data.length;
            
            if (findBy !== 'all') {
                for (i=0; i<l; i++) {
                    if (data[i][findBy] === search ) {
                        result.push (data[i]);
                    }
                }
                
                return result;
            } else {
                return data;
            }
        } else {
            return new Array();
        }
    }
    
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
        var i, j;
        
        np.warn ('===========================================================');
        np.warn ('Type: '+type);
        np.warn (' ');
        
        switch (type) {
            case 'no_model_name': 
                np.warn ('np.model.fixtureAdapter.addFixture:');
                np.warn ('No model-name passed.');
                np.warn ('Please pass a model-name as a string.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data);
                break;
                
            case 'no_model_definition': 
                np.warn ('np.model.fixtureAdapter.addFixture(\''+data.model+'\'):');
                np.warn ('No model-definition passed.');
                np.warn ('Please pass a model-definition as an object.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.definition);
                break;
                
            case 'invalid_model_fixture': 
                np.warn ('np.model.fixtureAdapter.addFixture(\''+data.model+'\'):');
                np.warn ('Model-fixture-data is invalid.');
                np.warn ('Please pass a valid model-fixture as an object.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.fixture);
                break;
                
            case 'model_already_added': 
                np.warn ('np.model.fixtureAdapter.addFixture(\''+data.name+'\'):');
                np.warn ('Model was already added.');
                np.warn ('You can change model data at the first added model-data');
                break;
                
            case 'req_invalid_options': 
                np.warn ('np.model.fixtureAdapter.request:');
                np.warn ('Invalid type of parameter.');
                np.warn ('Please pass the parameter as an object.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.options);
                np.warn (' ');
                np.warn ('and is type of:');
                np.warn (data.tof);
                break;
                
            case 'req_invalid_model': 
                np.warn ('np.model.fixtureAdapter.request:');
                np.warn ('No model passed.');
                np.warn ('Please pass a valid model as a string.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.model);
                np.warn (' ');
                np.warn ('and is type of:');
                np.warn (data.tof);
                break;
                
            case 'req_no_model': 
                np.warn ('np.model.fixtureAdapter.request:');
                np.warn ('Model not existing.');
                np.warn ('Please pass a existing model as a string.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.model);
                break;
                
            case 'req_invalid_find_by': 
                np.warn ('np.model.fixtureAdapter.request({model:\''+data.model+'\'}):');
                np.warn ('findBy not valid.');
                np.warn ('Please pass a findBy-parameter as a valid string.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.findBy);
                np.warn (' ');
                np.warn ('and is type of:');
                np.warn (data.tof);
                np.warn (' ');
                np.warn ('Possible find-by-methods:');
                for (i in data.possible) { np.warn (data.possible[i]); }
                break;
                
            case 'req_no_find_by': 
                np.warn ('np.model.fixtureAdapter.request({model:\''+data.model+'\',findBy:\''+data.findBy+'\'}):');
                np.warn ('findBy not existing.');
                np.warn ('Please pass an existing findBy-parameter.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.findBy);
                np.warn (' ');
                np.warn ('Possible find-by-methods:');
                for (i in data.possible) { np.warn (data.possible[i]); }
                break;
                
            case 'req_invalid_search': 
                np.warn ('np.model.fixtureAdapter.request({model:\''+data.model+'\',findBy:\''+data.findBy+'\'}):');
                np.warn ('search-parameter is invalid.');
                np.warn ('Please pass a valid search-parameter.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.search);
                break;
                
            case 'sve_invalid_options': 
                np.warn ('np.model.fixtureAdapter.save:');
                np.warn ('Invalid type of parameter.');
                np.warn ('Please pass the parameter as an object like {model:[model], data:[data]}.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.options);
                np.warn (' ');
                np.warn ('and is type of:');
                np.warn (data.tof);
                break;
                
            case 'sve_invalid_model': 
                np.warn ('np.model.fixtureAdapter.save:');
                np.warn ('Invalid type of model.');
                np.warn ('Please pass the model as a string.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.model);
                np.warn (' ');
                np.warn ('and is type of:');
                np.warn (data.tof);
                break;
                
            case 'sve_model_not_exists': 
                np.warn ('np.model.fixtureAdapter.save:');
                np.warn ('Model not existing.');
                np.warn ('Please ensure that the model exists.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.model);
                break;
                
            case 'sve_invalid_type_of_data': 
                np.warn ('np.model.fixtureAdapter.save(\''+data.model+'\'):');
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
                np.warn ('np.model.fixtureAdapter.save(\''+data.model+'\'):');
                np.warn ('Empty data.');
                np.warn ('Please do not pass empty data.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.data);
                break;
                
            case 'sve_invalid_data': 
                np.warn ('np.model.fixtureAdapter.save(\''+data.model+'\'):');
                np.warn ('Invalid data.');
                np.warn ('Please pass valid data.');
                np.warn (' ');
                np.warn ('You passed:');
                for (i in data.data) {
                    np.warn ('Object {');
                    for (j in data.data[i]) { np.warn ('    '+j+': '+data.data[i][j]+' ['+typeof data.data[i][j]+']'); }
                    np.warn ('}');
                }
                np.warn (' ');
                np.warn ('the format should be:');
                for (i in data.def) { np.warn (i+': '+data.def[i]); }
                
                break;
        }
        
        np.warn (' ');
        np.warn ('Type np.help.module(\'model.fixtureAdapter\') for more information.');
        np.warn (' ');
        np.warn ('error stack:', true);
    }
    
    // Public properties/methods:
    return {
        definition: function (model) {
            var promise, definition;
            
            promise     = new np.Promise();

            if (model) {
                definition  = storage.definition;

                if ( definition[model] && typeof definition[model] !== 'function') {
                    np.tick (promise.then, definition[model]);   
                } else {
                    np.tick (promise.fail);
                }
            } else {
                np.tick (promise.fail);
            }

            return promise;
        },

        request:    function (options) {
            var promise, defaults, options, model, find_by, find_by_lower, search,
                tof_model, tof_find_by, tof_search, valid_options, valid_model, valid_find_by,
                valid_search, model_exists, find_by_exists, result;
            
            promise         = np.Promise();
            
            if (options) {
                defaults        = {model:false, findBy:'all'};
                valid_options   = typeof options === 'object';

                if (valid_options ) {
                    options         = $.extend (defaults, options);
                    model           = options.model;
                    find_by         = options.findBy;
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
                        result          = findData (model, find_by_lower, search);

                        np.tick (promise.then, result);
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

        save:   function (options)     {
            var promise, defaults, tof_model, tof_data, valid_options, 
                valid_model, valid_tof_data, valid_len_data, valid_data,
                model_exists, model, data, old_id, new_id, i, j, l, rows,
                state, row;

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
                    valid_data      = (valid_len_data && model_exists) ? (function () {
                        var def, tof, col, row, i, j, z, valid_def, valid_tof;

                        def         = np.jsonClone (storage.definition[model]);
                        def['id']   = 'number';

                        for (i in def) {
                            col     = i;
                            tof     = def[i];

                            for (j in data) {
                                row         = data[j].row;

                                valid_def   = false;
                                valid_tof   = false;

                                for (z in row) {
                                    valid_def   = col === z;
                                    valid_tof   = typeof row[z] === tof || (typeof row[z] === 'string' && tof === 'mail') || (typeof row[z] === 'string' && tof === 'password');
                                    
                                    if (!valid_tof) {
                                        valid_tof   = 'virtual_'+typeof row[z] === tof;
                                    }

                                    if (valid_def && valid_tof) { break; }
                                }

                                if (!valid_def || !valid_tof) { break; }
                            }

                            if (!valid_def || !valid_tof) { break; }
                        }

                        return valid_def && valid_tof;
                    }()) : false;

                    if (model_exists && valid_data) {
                        l       = storage.data[model].length;
                        new_id  = 1;
                        rows    = {};

                        for (i in data) {
                            row     = data[i].row;
                            state   = data[i].state;

                            if (state === 'new') {
                                for (j in storage.data[model]) {
                                    if (storage.data[model][j].id > new_id) {
                                        new_id  = storage.data[model][j].id;
                                    }
                                }

                                for (j in row) {
                                    if (j === 'id') {
                                        old_id          = data[i].row.id;
                                        data[i].row.id  = ++new_id;

                                        rows[old_id]    = data[i].row;

                                        storage.data[model].push (data[i].row);
                                    }
                                }
                            } else if (state === 'chg') {
                                for (j in storage.data[model]) {
                                    if (storage.data[model][j].id === row.id) {
                                        storage.data[model][j] = rows[i] = row;
                                    }
                                }
                            } else if (state === 'rem') {
                                for (j in storage.data[model]) {
                                    if (storage.data[model][j].id === row.id) {
                                        delete storage.data[model][j];

                                        rows[i] = {};
                                    }
                                }
                            }
                        }

                        np.tick (promise.then, rows);
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
                    } else if (!valid_data) {
                        warn ('sve_invalid_data', {model:model,data:data,def:storage.definition[model]});

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
        
        addFixture: function (name, definition, fixtureData) {
            var i, already_added, has_name, has_definition, t_of_data, 
                valid_t_of_data, has_fixture_data, col;

            already_added       = typeof storage.definition[name] !== 'undefined';
            has_name            = typeof name === 'string' && name.length > 0;
            has_definition      = typeof definition === 'object';

            if (has_name)       { name = name.slice(0, 1).toUpperCase () + name.slice (1); }
            
            t_of_data           = typeof fixtureData;
            
            valid_t_of_data     = t_of_data === 'object' || t_of_data === 'undefined';
            has_fixture_data    = t_of_data === 'object' && fixtureData.length > 0;

            if (!already_added && has_name && has_definition && valid_t_of_data) {
                storage.definition[name]    = definition;
                storage.possibleFind[name]  = new Array ();
                
                for (i in definition) {
                    col = i.slice (0, 1).toUpperCase()+i.slice (1);                
                    storage.possibleFind[name].push (col);
                }
                
                if (has_fixture_data) {
                    storage.data[name]  = fixtureData;
                }
                
                return true;
            } else {
                if (already_added)          { warn ('model:already_added', name);                                   }
                else if (!has_name)         { warn ('no_model_name', name);                                         }
                else if (!has_definition)   { warn ('no_model_definition', {model:name, definition:definition});    }
                else if (!valid_t_of_data)  { warn ('invalid_model_fixture', {model:name, fixture:fixtureData});    }
                
                return false;
            }
        },
        
        deleteFixture: function (model) {
            var def_is_available, data_is_available, possible_is_available;
            
            def_is_available        = typeof storage.definition[model] !== 'undefined';
            data_is_available       = typeof storage.data[model] !== 'undefined';
            possible_is_available   = typeof storage.possibleFind[model] !== 'undefined';
            
            if (def_is_available)       { delete storage.definition[model];         }
            if (data_is_available)      { delete storage.data[model];               }
            if (possible_is_available)  { delete storage.possibleFind[model];       }
        }
    };
}()));