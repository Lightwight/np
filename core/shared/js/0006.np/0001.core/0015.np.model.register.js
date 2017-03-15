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

np.module('model.register', function (modelName, localDefinition, data) {
    var promise, is_string, model_exists, model_valid, blacklist, column_types,
        oldRows, oldData, newRows, pos, newID, oldID, i, j, k, l;
    
    blacklist       = new Array ('adapter', 'fixtureAdapter', 'ajaxAdapter', 'length', 'register');
    column_types    = new Array ('object', 'virtual_object', 'string', 'virtual_string', 'date', 'virtual_date', 
                                 'number', 'virtual_number', 'boolean', 'virtual_boolean',
                                 'mail', 'virtual_mail', 'password', 'virtual_password',
                                 'html', 'virtual_html');

    promise         = np.Promise();
    is_string       = typeof modelName === 'string';
    localDefinition = typeof localDefinition === 'object' ? localDefinition : false;
    
    if (is_string && modelName.length > 0 ) { modelName = modelName.slice(0, 1).toUpperCase() + modelName.slice(1); }

    model_exists    = (function (m, b, t){
        var i, j;
        
        for (i in b) { if (b[i]===m)    { return false; } }  
        for (j in t) { if (j===m)       { return true;  } }
        
        return false;
    }(modelName, blacklist, this));
    
    model_valid     = (function (m, b) {
        var d;

        for (d in b) { if (b[d]===m) { return false; } }

        return true;
    }(modelName, blacklist));

    if (is_string && model_valid) {
        if (model_exists) {
            oldData = np.model[modelName].findAll ();
            oldRows = new Array ();
            
            oldData.each (function (row) {
                oldRows.push (row.getAll ());
            });
            
            l   = data.length;
            k   = oldRows.length;
            pos = -1;

            for (i=0; i<l; i++) {
                if (typeof data[i] === 'object' && data[i] !== null && typeof data[i].id !== 'undefined') {
                    pos     = -1;
                    newID   = parseInt (data[i].id, 10);

                    for (j=0; j<k; j++) {
                        oldID   = parseInt (oldRows[j].id, 10);

                        if (oldID === newID) { pos = j; break;  }
                    }

                    if (pos > -1) {
                        oldRows[pos]    = np.jsonClone (data[i]);
                    } else {
                        oldRows.push (data[i]);
                    }
                }
            }
            
            data    = oldRows;
        }

        createModel.call (this, modelName, localDefinition, data)
        .then (function () { promise.then (modelName);  })
        .fail (function () { promise.fail ();           });
    } else if (!is_string) {
        warn ('nostring', modelName);
        
        np.tick (promise.fail);
    } else {
        warn ('blacklist', modelName);
            
        np.tick (promise.fail);
    }
    
    function convert (value, type ) {
        if      (type === 'boolean' || type === 'virtual_boolean' )     { value = value ? true : false;                             }
        else if (type === 'number' || type === 'virtual_number' )       { value = value ? parseFloat (value, 10) : 0;               }
        else if (type === 'string' || type === 'virtual_string' )       { value = value ? value.toString() : '';                    }
        else if (type === 'mail' || type === 'virtual_mail' )           { value = value ? value.toString() : '';                    }
        else if (type === 'password' || type === 'virtual_password' )   { value = value ? value.toString() : '';                    }
        else if (type === 'date' || type === 'virtual_date' )           { value = value ? value.toString() : '';                    }
        else if (type === 'object' || type === 'virtual_object' )       { value = value ? JSON.parse (JSON.stringify (value)) : {}; }
        
        return value;
    }
    
    function convertTypes (rows, definition) {
        var i, row;

        for (i in rows) {
            row     = rows[i];

            rows[i] = (function () {
                var j, d, conv;
                
                conv    = {};
                
                for(j in row) {
                    for( d in definition ) {
                        if (j===d || (j==='id' && d === 'ID')) {
                            conv[j] = convert (row[j], definition[d]);
                        }
                    }
                }

                return conv;
            }());
        }
        
        return rows;
    }
    
    function checkDefinition (model, definition) {
        var col, t_of, is_object, is_broken, is_valid, found_valid, cl, cd, l, i;
        
        t_of        = (definition !== 'function')? typeof definition : 'function'; 
        is_broken   = false;
        is_object   = t_of === 'object';
        is_valid    = true;
        l           = 0;

        if (is_object) {
            for (col in definition) {
                cl              = column_types.length;
                cd              = definition[col];
                found_valid     = false;
                
                for (i=0; i<cl; i++) {
                    if (cd===column_types[i]) {
                        found_valid     = true;
                        break;
                    }
                }
                
                if (!found_valid) {
                    is_valid    = false;

                    warn ('novalid_definition_assignment',{model:model,invalid:col,assigned:cd,definition: definition});
                } else {
                    l++;
                }
            }
        }
        
        if (!is_object) {
            warn ('nodefinition_object', {model:model, t_of:t_of});
            
            is_broken   = true;
        } else if (!is_valid)  {
            is_broken   = true;
        } else if (l===0) {
            warn ('nodefinition', {model:model, definition:definition});
            
            is_broken   = l === 0;
        }
        
        return is_broken;
    }
    
    function getError (error, modelName) {
        var data, tmpError, retError;
        
        retError    = {
            code:   0,
            msg:    'Unknown error'
        };

        if (error !== null 
            && typeof error !== 'undefined' 
            && typeof error.data !== 'undefined' 
            && typeof error.data.responseJSON !== 'undefined' 
            && typeof error.data.responseJSON[modelName] !== 'undefined'
        ) {
            data        = error.data.responseJSON[modelName];
            tmpError    = data[Object.keys(data)[0]];
            
            if (typeof tmpError.error !== 'undefined') {
                retError.code   = tmpError.error;
            }
            
            if (typeof tmpError.msg !== 'undefined') {
                retError.msg    = tmpError.msg;
            }
        } 
        
        return retError;
    }
    
    function createModel (model, localDefinition, data) {
        if ($.isArray (data) && typeof data[0] === 'object' && data[0] === null) {
            delete data[0];
            
            data.length = 0;
        }
        
        // Model instantiation:
        this[model] = (function (_t, m) {
            // Private model properties/methods:
            var promise, name, is_ready, is_pending, is_broken, definition, 
                methods, queries, queries_id, resultset, storage, new_id;

            promise     = np.Promise();
            
            name        = m;
            is_ready    = false;
            is_pending  = false;
            is_broken   = false;
            definition  = {};
            queries_id  = -1;
            
            queries     = new Array ();
            resultset   = new Array ();
            
            storage     = {
                dataset:        {},
                
                flush:  function () {
                    this.dataset    = {};
                },
                
                update: function (state, id, row) {
                    var updated;

                    switch (state) {
                        case 'new':
                            var isObject, hasID;
                            
                            isObject            = $.type (row) === 'object';

                            updated             = this.dataset[id].data.row;
                            
                            if (isObject) {
                                $.each (row, function (key, val) {
                                    updated[key] = val;
                                });
                            } else {
                                updated.id  = row;
                            }
                            
                            delete this.dataset[id];
                            
                            return updated;
                            
                            break;
                        case 'chg':
                            var isObject;
                            
                            updated     = this.dataset[id].data.row;
                            isObject    = $.type (row) === 'object';
                            
                            if (isObject) {
                                $.each (row, function (key, val) {
                                    if (key.toLowerCase () !== 'id') {
                                        updated[key] = val;
                                    }
                                });
                            }                            
                            
                            delete this.dataset[id];
                            
                            return updated;
                            
                            break;
                            
                        case 'rem':
                            
                            break;
                    }
                    
                    return updated;
                },
                
                add:        function (row) {
                    var hash;

                    hash    = (function () {
                        var i, s;
                        
                        s   = '';

                        for (i in row) { 
                            if (typeof definition[i] !== 'undefined') {
                                s  += row[i] !== null ? (typeof row[i] === 'object' ? JSON.stringify (row[i]) : row[i].toString ()) : ''; 
                            }
                        }
                        
                        return np.murmurhash (s);
                    }());
                    
                    if (typeof this.dataset[row.id] === 'undefined') {
                        this.dataset[row.id]    = {
                            hasRemoved:     false,
                            isNew:          false,
                            data:           {
                                hash:   hash,
                                row:    row
                            }
                        };
                    }
                },
                
                get:        function (id) {
                    return (typeof this.dataset[id] !== 'undefined') ? this.dataset[id] : false;
                },
                
                findLike:   function (col, search) {
                    var _this, dataset, row, j;
                    
                    _this   = this;
                    search  = search || '';
                    dataset = this.dataset;
                    
                    return (function () {
                        var data, cmpCol, i;
                        
                        data    = new Array ();
                        
                        for (i in dataset) {
                            if (col !== 'all') {
                                row     = dataset[i].data.row;
                                cmpCol  = col !== 'ID' ? col : 'id';

                                for (j in row) {
                                    if (j === cmpCol && (row[j]+'').toUpperCase ().indexOf (search.toUpperCase ()) > -1) {
                                        data.push (row);
                                    }
                                }
                            } else {
                                data.push (dataset[i].data.row);
                            }
                        }

                        return data;
                    }());                    
                },
                
                findBy:     function (col, search) {
                    var _this, dataset, row, j;
                    
                    _this   = this;
                    search  = search || '';
                    dataset = this.dataset;

                    return (function () {
                        var data, cmpCol, i;
                        
                        data    = new Array ();
                        
                        for (i in dataset) {
                            if (col !== 'all') {
                                row     = dataset[i].data.row;
                                cmpCol  = col !== 'ID' ? col : 'id';

                                for (j in row) {
                                    if (j === cmpCol && row[j] === search) {
                                        data.push (row);
                                    }
                                }
                            } else {
                                data.push (dataset[i].data.row);
                            }
                        }

                        return data;
                    }());
                }
            };
            
            new_id      = 0;

            (function (a, t, _m, n, p) {
                is_pending  = true;
                
                a.definition (_m, localDefinition)
                    .then (function (def) {
                        is_ready    = true;
                        is_pending  = false;
                        is_broken   = checkDefinition (n, def);
                        
                        if (is_broken) {
                            t[_m]       = methods;
                            
                            p.fail ();
                        } else {
                            definition  = np.jsonClone (def);
                            
                            createColumnMethods (definition);
                            addRows (convertTypes (data, definition));
                            
                            p.then ();
                        }
                    })
                    .fail (function () {
                        t[_m]       = methods;
                        
                        warn ('model_not_registered', {name:n});
                        
                        is_ready    = false;
                        is_pending  = false;
                        is_broken   = true;

                        p.fail ();
                    });
            }(_t.adapter.get (), _t, m, name, promise));
            
            function buildRows (rows) {
                var i, l, col_type, col, f_col, arr_col, tmp_col, methods;

                l       = rows.length;
                
                if (l > 0) { for (i = 0; i < l; i++) { storage.add (rows[i]); } }
                
                methods = {
                    length: l,
                    
                    each: function (fnc) {
                        var tof_fnc, valid_fnc, proceed, 
                            l;
                        
                        tof_fnc     = typeof fnc;
                        valid_fnc   = tof_fnc === 'function';
                        proceed     = true;
                        l           = rows.length;

                        if (valid_fnc) {
                            for (i = 0; i < l; i++) {
                                try {
                                    
                                    proceed   = fnc (buildRows (new Array (rows[i])));
                                    
                                    if (proceed === false ) { break; }
                                } catch (e) { 
                                    warn ('rows_each_broken', {name: name, fnc: fnc});
                                    
                                    return false;
                                }
                            }
                        } else {
                            warn ('rows_each_invalid_type', {name: name, fnc: fnc, tof: tof_fnc});
                            
                            return false;
                        }                        
                    },
                    
                    limit: function (offset, limit) {
                        var _len;
                        
                        _len    = rows.length;
                        
                        offset  = typeof offset === 'number' && offset > -1 ? offset : 0;
                        limit   = typeof limit === 'number' && limit > -1 ? limit : 0;
                        
                        if (_len <= offset) { offset = 0;   }
                        
                        rows    = rows.slice (offset, offset+limit);
                        
                        return this;
                    },
                    
                    orderBy: function (column, order) {
                        order   = order !== 'desc' ? 'asc' : 'desc';
                        column  = typeof column === 'string' ? column.toLowerCase () : false;
                        
                        if (column && order && $.isArray (rows) && rows.length > 0)   
                        {
                            rows.sort (function (a, b) {
                                var _a, _b;

                                _a  = np.jsonClone (a);
                                _b  = np.jsonClone (b);
                                
                                $.map (_a, function (_v, _k) { 
                                    _a[_k.toLowerCase ()]   = _v;
                                });
                                
                                $.map (_b, function (_v, _k) { 
                                    _b[_k.toLowerCase ()]   = _v;    
                                });

                                if (typeof _a[column] !== 'undefined'
                                    && typeof _b[column] !== 'undefined') {
                                        return order === 'asc' ? (_a[column] < _b[column] ? -1 : 1) : (_b[column] < _a[column] ? -1 : 1);
                                }
                                
                                return 0;
                            });
                        }
                        
                        return this;
                    },
                    
                    length: function () {
                        return $.isArray (rows) ? rows.length : 0;
                    },
                    
                    remove: function () {
                        if (l > 0) {
                            for (i = 0; i < l; i++ ) {
                                storage.get (rows[i].id).hasRemoved   = true;
                            }
                            
                            return true;
                        } else {
                            return false;
                        }
                    },

                    save: function (force) {
                        var promise, dataset, row, hash, state, hasChanged, hasRemoved, isNew, rows, adapter, i;

                        promise     = np.Promise ();
                        rows        = new Array ();
                        dataset     = storage.dataset;
                        
                        force       = typeof force === 'boolean' ? force : false;

                        for (i in dataset) {
                            row         = dataset[i].data.row;
                            hash        = dataset[i].data.hash;
                            
                            isNew       = dataset[i].isNew;
                            hasRemoved  = dataset[i].hasRemoved;
                            hasChanged  = (function() {
                                var s, j, x;
                            
                                s   = '';

                                for (j in row) {
                                    if (typeof definition[j] !== 'undefined') {
                                        s  += row[j] !== null ? (typeof row[j] === 'object' ? JSON.stringify (row[j]) : row[j].toString ()) : ''; 
                                    }
                                }

                                return hash !== np.murmurhash (s);
                            }());

                            if (force || isNew || hasRemoved || hasChanged) {
                                if (isNew)              { state = 'new';    }
                                else if (hasRemoved)    { state = 'rem';    }
                                else if (hasChanged)    { state = 'chg';    }
                                else if (force)         { state = 'chg';    }
                                
                                row.id  = parseInt (i, 10);
                                
                                rows.push ({row:row, state:state});
                            }
                        }

                        if (rows.length > 0) {
                            adapter     = _t.adapter.get ();

                            adapter.save ({model:name, data:rows})
                            .then (function (result) {
                                var i, rows, err, has_err, doBuild;

                                rows    = new Array ();
                                err     = new Array ();
                                doBuild = true;

                                for (i in result) {
                                    has_err = result[i] === null || typeof result[i].err !== 'undefined' && result[i].err > 0;

                                    // if i < 0 then it means, it was a new row which has been posted on server
                                    if (i < 0) {
                                        if (result[i] !== null && !has_err) {
                                            rows.push (storage.update ('new', i, result[i]));
                                        } else if (result[i] !== null){
                                            err.push (result[i].err);
                                        } else {
                                            err.push (0);
                                        }
                                    } 
                                    // i is > 0, it is a changed row to handle:
                                    else {
                                        // if row has been saved and manipulated serverside column values differs from clientside column values
                                        // or if row has been saved and only manipulated serverside column equals clientside column:
                                        if (result[i] !== null && !has_err) {
                                            rows.push (storage.update ('chg', i, result[i]));
                                        } 
                                        // else if the response contains an error (error while saving):
                                        else if (result[i] !== null && has_err) {
                                            err.push (result[i].err);
                                        } 
                                        // else an unknown error has occured:
                                        else if (typeof result[i] !== 'boolean') {
                                            err.push (0);
                                        } 
                                    }
                                }

                                if (err.length === 0 ) {
                                    promise.then (doBuild ? buildRows (rows) : result);
                                } else {
                                    buildRows (rows);

                                    promise.fail (err);
                                }
                            })
                            .fail (function (err) {
                                promise.fail (getError (err, name));
                            });
                        } else {
                            np.tick (promise.then, buildRows (rows));
                        }
                            
                        return promise;
                    },
                    
                    add: function (data) {
                        return _t[name].add (data);
                    }
                };
                
                if (l===1) {
                    methods.flush       = function () {
                        delete storage.dataset[rows[0].id];
                    };
                    
                    methods.isNew       = function (isNew) {
                        if (typeof isNew === 'boolean') {
                            storage.get (rows[0].id).isNew  = isNew;
                        }
                        
                        return storage.get (rows[0].id).isNew;
                    };
                    
                    methods.hasRemoved  = function () {
                        return storage.get (rows[0].id).hasRemoved;
                    };
                    
                    methods.hasChanged  = function () {
                        var data, hash, row;
                        
                        data    = storage.get (rows[0].id).data;
                        hash    = data.hash;
                        row     = data.row;
                        
                        return hash !== (function () {
                            var s, i;
                            
                            s   = '';
                            
                            for (i in row) { 
                                if (typeof definition[i] !== 'undefined') {
                                    s  += row[i] !== null ? (typeof row[i] === 'object' ? JSON.stringify (row[i]) : row[i].toString ()) : ''; 
                                }
                            }
                            
                            return np.murmurhash (s);
                        }());
                    };
                    
                    methods.getID   = function () {
                        return rows[0].id;
                    };
                    
                    methods.getAll  = function () {
                        return rows[0];
                    };
                    
                    for (i in definition) {
                        col         = tmp_col = i;
                        col_type    = definition[i];
                        
                        if (col !== 'id') {
                            
                            if (col.indexOf ('_') > -1) {
                                arr_col = col.split ('_');
                                tmp_col = '';

                                for (i=0; i<arr_col.length; i++) {
                                    tmp_col += arr_col[i].slice (0,1).toUpperCase ()+arr_col[i].slice (1);
                                }
                            }

                            f_col   = tmp_col.slice (0,1).toUpperCase ()+tmp_col.slice (1);
                            
                            methods['set'+f_col]    = (function (r, c, ct, fc) {
                                return function (val) {
                                    var id, data;

                                    id          = r.id;
                                    data        = storage.get (id).data.row;

                                    data[c]     = val;

                                    return true;
                                };
                            }(rows[0], col, col_type, f_col));

                            methods['get'+f_col]    = (function (r, c) {
                                return function () {
                                    var id;

                                    id  = r.id;

                                    return storage.get (id).data.row[c];
                                };
                            }(rows[0], col));
                        }
                    }
                }

                return methods;
            }            
            
            function prepareRow (data) {
                var row, data_col, def_col, u_col;
                
                row         = {};
                row['id']   = --new_id;

                for (data_col in data) { 
                    u_col   = data_col.slice (0, 1).toUpperCase () + data_col.slice (1);

                    for (def_col in definition) {
                        if (def_col === data_col) {
                            row[data_col]  = data[data_col];
                        }
                    }
                }
                
                return row;
            }            
            
            function createRows (data, local) {
                var multiple, row,
                    i, len;
                
                multiple    = $.isArray (data);
                
                if (!multiple) {
                    row     = prepareRow (data);

                    storage.add (row);
                    storage.get (row.id).isNew  = local ? false : true;
                } else {
                    len     = data.length;
                
                    for (i=0; i<len; i++) {
                        row     = prepareRow (data[i]);
                        
                        if (i < len-1)  { storage.add (row, false); } 
                        else            { storage.add (row);        }
                        
                        storage.get (row.id).isNew  = local ? false : true;
                    }
                }
                
                return true;
            }
            
            function compliesDefinition (data) {
                var tmpData, def_col, data_col, score,
                    i, j, k, n, x, y;
                
                tmpData = np.jsonClone (data);
                tmpData = applyToPush (tmpData);
                
                x       = (function() { var t, z; t = 0; for (z in tmpData) { t++; } return t; }());
                y       = (function() { var t, z; t = 0; for (z in data) { t++; } return t; }());                
                
                score   = x/y;

                i       = 0;
                j       = 0;
                k       = (function () {
                    var x;
                    
                    x   = 0;
                    
                    for (n in tmpData) { x++; }
                    
                    return x;
                }());

                for (def_col in definition) {
                    i++;
                    
                    for (data_col in tmpData) {
                        if (data_col === def_col) { 
                            j++; 
                        }
                    }
                }
                
                return {model: modelName, score: score};
            }
            
            function compliesTypes (data) {
                var i, j, def_col, data_col, def_type, data_type;
                
                i   = 0;
                j   = 0;
                
                for (def_col in definition) {
                    def_type    = definition[def_col];
                    
                    if (def_type.indexOf ('virtual_') !== 0) {
                        i++;

                        for (data_col in data) {
                            data_type   = typeof (data[data_col]);

                            if ((data_col === def_col && 
                                ((data_type === def_type) || 
                                (def_type === 'mail' && data_type === 'string') ||
                                (def_type === 'password' && data_type === 'string')
                                ))) {
                                    j++; 
                            }
                        }
                    }
                }

                return i === j;
            }
            
            /* 
             * applyToPush
             * 
             * removes all columnes in data which are not defined
             * 
             * return cleaned data with its defined columns
             * */
            function applyToPush (data) {
                var applied_data, i, j;
                
                applied_data    = {};

                for (i in data) {
                    for (j in definition) {
                        if (i === j) {
                            applied_data[i] = data[i];
                        }
                    }
                }

                return applied_data;
            }
            
            function validToPushRow (data) {
                var tof_data, valid_data, comply_types;
                
                tof_data            = typeof data;
                valid_data          = tof_data === 'object';
                
                if (valid_data) {
                    return true;  
                } else if (!valid_data) {
                    warn ('add_invalid_params', {name: name, data: data, tof: tof_data});

                    return false;
                } 
            }
            
            function pushSingleRow (data, local) {
                var push_data, is_valid;
                
                push_data       = applyToPush (data);
                is_valid        = validToPushRow (push_data);

                if (is_valid) {
                    return createRows (push_data, local);
                } else {
                    return false;
                }
            }
            
            function pushMultipleRows (data, local) {
                var push_data, invalid_row, is_valid, data_len, push_len, i;
                
                push_data   = new Array ();
                data_len    = $.isArray (data) ? data.length : (function () {var x, t; t = 0; for (x in data) {t++;} return t;}());
                is_valid    = true;
                invalid_row = false;
                
                for (i=0; i<data_len; i++) {
                    push_data.push (applyToPush (data[i]));
                }
                
                push_data   = convertTypes (push_data, definition);
                push_len    = push_data.length;
                
                for (i=0; i<push_len; i++) {
                    if (!validToPushRow (push_data[i]) ) { is_valid = false; break;  }
                }
                
                if (is_valid && !invalid_row) {
                    return createRows (push_data, local);
                } else {
                    return false;
                }
            }
            
            function addRows (data) {
                var i, l;
                
                l   = data.length;
                
                for (i=0; i<l; i++) { 
                    _t[name].add(data[i], true);    
                }
            }
            
            function createColumnMethods (definition) {
                var col, cnt_all, all, f_col, arr_col, tmp_col, i, def, findTypes, findType, fLen, j, k, createMethod;
                
                findTypes       = new Array ('findBy', 'findLike');
                fLen            = findTypes.length;
                
                def             = np.jsonClone (definition);
                cnt_all         = 0;
                _t[name]        = methods;
                
                while (typeof def['all'+cnt_all] !== 'undefined' ) { cnt_all++; }
                
                all                 = 'all'+cnt_all;
                def[all]            = '';
                
                for (col in def) {
                    for (j = 0; j < fLen; j++) {
                        findType        = findTypes[j];
                        createMethod    = true;
                        
                        if (col !== all) {
                            tmp_col = col;

                            if (col.indexOf ('_') > -1) {
                                arr_col = col.split ('_');
                                tmp_col = '';

                                for (i=0; i<arr_col.length; i++) {
                                    tmp_col += arr_col[i].slice (0,1).toUpperCase ()+arr_col[i].slice (1);
                                }
                            }

                            f_col           = tmp_col !== 'id' && tmp_col !== 'ID' ? findType+tmp_col.slice (0,1).toUpperCase ()+tmp_col.slice (1) : 'findByID';
                            createMethod    = (findType === 'findLike' && tmp_col !== 'id' && tmp_col !== 'ID') || findType === 'findBy';
                        } else {
                            f_col           = 'findAll';
                            createMethod    = findType === 'findBy';
                        } 
                        
                        if (createMethod) {
                            _t[name][f_col]     = (function (c, fType) {

                                if (c !== 'subscribe')  {
                                    return function (search, forceAdapter, storage_search) {
                                        queries_id++;

                                        forceAdapter            = forceAdapter || false;
                                        storage_search          = !forceAdapter && typeof storage_search === 'undefined' || !forceAdapter && storage_search === true; 

                                        if (storage_search) {
                                            return buildRows (storage[fType] ((c!==all) ? c : 'all', search));
                                        } else {
                                            queries[queries_id]     = new Array ();
                                            resultset[queries_id]   = new Array ();                            

                                            if (fType === 'findBy') {
                                                queries[queries_id].push ({model:name,findBy:(c!==all) ? c : 'all',search:search});
                                            } else {
                                                queries[queries_id].push ({model:name,findLike:(c!==all) ? c : 'all',search:search});
                                            }

                                            return (function (q_id) {
                                                var chainedMethods, arr_col, tmp_col, i, findType;

                                                chainedMethods  = {};

                                                for (col in def) {
                                                    for (k = 0; k < fLen; k++) {
                                                        findType    = findTypes[k];
                                                        
                                                        if (col !== all) {
                                                            tmp_col = col;

                                                            if (col.indexOf ('_') > -1) {
                                                                arr_col = col.split ('_');
                                                                tmp_col = '';

                                                                for (i = 0; i < arr_col.length; i++) {
                                                                    tmp_col += arr_col[i].slice (0,1).toUpperCase ()+arr_col[i].slice (1);
                                                                }
                                                            }

                                                            f_col   = findType+tmp_col.slice (0,1).toUpperCase ()+tmp_col.slice (1);

                                                            chainedMethods[f_col]    = (function (c) {
                                                                return function (search) {
                                                                    if (findType === 'findBy') {
                                                                        queries[q_id].push ({model:name, findBy:(c!==all) ? c : 'all', search:search});
                                                                    } else {
                                                                        queries[q_id].push ({model:name, findLike:(c!==all) ? c : 'all', search:search});
                                                                    }

                                                                    return this;
                                                                };
                                                            }(col));
                                                        }
                                                    }
                                                }

                                                chainedMethods['then']  = function (fnc) {
                                                    var promise, query, inx, l;

                                                    promise     = np.Promise();
                                                    l           = queries[q_id].length;
                                                    inx         = 0;

                                                    request()
                                                    .then (function (result) {
                                                        var rows;

                                                        delete resultset[q_id];
                                                        delete queries[q_id];

                                                        rows    = buildRows (result);

                                                        try         { fnc (rows);                                     }
                                                        catch (e)   { warn ('model_then_error', {name:name,error:e});   }
                                                    })
                                                    .fail (function () {
                                                        delete resultset[q_id];
                                                        delete queries[q_id];

                                                        warn ('model_query_error');                        

                                                        try         { fnc (new Array ());                               }
                                                        catch (e)   { warn ('model_then_error', {name:name,error:e});   }
                                                    });                    

                                                    function request (resultsetSearch) {
                                                        var adapter, findType, col, col_lower, search, i, l, tmp_result, storage_result;

                                                        adapter             = _t.adapter.get ();
                                                        query               = queries[q_id][inx];
                                                        findType            = typeof query.findBy !== 'undefined' ? 'by' : 'like';
                                                        
                                                        resultsetSearch     = resultsetSearch || false;

                                                        if (resultsetSearch) {

                                                            col         = findType === 'by' ? query.findBy : query.findLike;

                                                            col_lower   = col.slice (0, 1).toLowerCase ()+col.slice (1);
                                                            search      = query.search;
                                                            tmp_result  = new Array ();
                                                            l           = resultset[q_id].length;
                                                            
                                                            for (i=0; i<l; i++) {
                                                                if (findType === 'by') {
                                                                    if (resultset[q_id][i][col_lower] === search) {
                                                                        tmp_result.push (resultset[q_id][i]);
                                                                    }
                                                                } else {
                                                                    if (resultset[q_id][i][col_lower].indexOf (search) > -1) {
                                                                        tmp_result.push (resultset[q_id][i]);
                                                                    }
                                                                }
                                                            }

                                                            resultset[q_id] = tmp_result;

                                                            inx++; 

                                                            if (inx < l)    { request (true);                   }
                                                            else            { promise.then (resultset[q_id]);   }
                                                        } else {
                                                            // Search in local storage:
                                                            storage_result  = !forceAdapter ? storage.findBy (query.findBy, query.search) : [];
                                                            
                                                            if (storage_result.length > 0) {
                                                                inx++;

                                                                resultset[q_id] = storage_result;

                                                                if (inx < l)    { request (true);                   }
                                                                else            { promise.then (resultset[q_id]);   }
                                                            } else {
                                                                // Not in local storage. Let the adapter search:
                                                                adapter.request (query)
                                                                .then (function (result) {
                                                                    inx++;

                                                                    resultset[q_id] = convertTypes (result, definition);

                                                                    if (inx < l)    { request (true);                   }
                                                                    else            { promise.then (resultset[q_id]);   }
                                                                })
                                                                .fail (function (result) {
                                                                    promise.fail (result);
                                                                });
                                                            }
                                                        }

                                                        return promise;
                                                    }
                                                };    

                                                return chainedMethods;
                                            }(queries_id));
                                        }
                                    };
                                } 
                            }(col, findType));
                        }
                    }
                }   
            }
            
            // Public model properties/methods:
            methods = {
                isReady:    function ()         { return is_ready;      },
                isPending:  function ()         { return is_pending;    },
                isBroken:   function ()         { return is_broken;     },
                isModel:    function ()         { return true;          },
                name:       function ()         { return model;         },
                
                definition:         function (data)     { return np.jsonClone(definition);      },
                complies:           function (data)     { return compliesDefinition (data);     },
                applyToDefinition:  function (data)     { return applyToPush (data);            },
                
                add:        function (data, local)     {
                    local   = local === true ? true : false;

                    if (is_broken) {
                        return false;
                    } else {
                        if (!$.isArray (data) ) {
                            return pushSingleRow (data, local);
                        } else {
                            return pushMultipleRows (data, local);
                        }
                    } 
                },
                
                save: function (force) {
                    if (!is_broken) {
                        return this.findAll ().save (force);
                    } else {
                        return false;
                    }
                },
                
                each:   function (fnc) {
                    var tof_fnc, valid_type, accessible, rows, proceed,
                        i, l;
                    
                    tof_fnc     = typeof fnc;
                    valid_type  = tof_fnc === 'function';
                    accessible  = !is_broken && valid_type;
                    
                    if (accessible) {
                        rows    = storage.findBy ('all');
                        l       = rows.length;
                        
                        for (i=0; i<l; i++) {
                            proceed = fnc (buildRows (new Array (rows[i]))); 
                            
                            if( proceed === false ) { break; }
                        }
                        
                        return true;
                    } else if (is_broken) {
                        warn ('model_not_existing', {name: name});
                        
                        return false;
                    } else if (!valid_type) {
                        warn ('each_invalid_type', {name: name, tof: tof_fnc, fnc: fnc});
                        
                        return false;
                    }
                },
                
                flush: function () { storage.flush (); }
            };
            
            return promise;
        }(this, model));
        
        return this[model];
    }

    function warn (type, data) {
        var errStack, i, affix;
        
        errStack    = true;
        affix       = '';
        
        np.warn ('===========================================================');
        np.warn ('Type: '+type);
        np.warn (' ');
        
        switch (type) {
            case 'nostring':
                np.warn ('np.model.register:');
                np.warn ('the passed parameter isn\'t a string. Please pass it as a string.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data);
                break;
                
            case 'blacklist':
                np.warn ('np.model.register:');
                np.warn ('the passed parameter is reserved by core. Don\'t use it.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data);
                break;
                
            case 'model_not_registered':
                np.warn ('np.model.register(\''+data.name+'\'):');
                np.warn ('The passed model could not be registered.');
                np.warn ('Ensure that the model exists.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.name);
                break;
                
            case 'model_not_existing':
                np.warn ('np.model.'+data.name+':');
                np.warn ('model not existing');
                np.warn ('Ensure that the model has registered.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.name);
                break;
                
            case 'nodefinition':
                np.warn ('np.model.register:');
                np.warn ('The model definition is empty');
                np.warn ('Please define the model.');
                np.warn (' ');
                np.warn ('You asked for model:');
                np.warn (data.model);
                np.warn ('with definition:');
                np.warn (data.definition);
                break;
                
            case 'nodefinition_object':
                np.warn ('np.model.register:');
                np.warn ('The type of model definition is invalid');
                np.warn ('Please pass the definition as an json-object.');
                np.warn (' ');
                np.warn ('You asked for model:');
                np.warn (data.model);
                np.warn ('with type of:');
                np.warn (data.t_of);
                break;
                
            case 'novalid_definition_assignment':
                errStack    = false;
                affix       = '.definition';
                
                np.warn ('np.model.register:');
                np.warn ('The format of your model definition was assigned wrong');
                np.warn ('Please fix it.');
                np.warn (' ');
                np.warn ('You asked for model:');
                np.warn (data.model);
                np.warn (' ');
                np.warn ('with definition:');
                np.warn (data.invalid);
                np.warn (' ');
                np.warn ('assigned:');
                np.warn (data.assigned);
                np.warn (' ');
                np.warn ('your complete definition assignment:');
                np.warn (data.definition);
                break;
                
            case 'model_then_error':
                np.warn ('np.model.'+data.name+'().then():');
                np.warn ('error in its containing then-method.');
                np.warn ('Please fix it.');
                np.warn (' ');
                np.warn ('Error:');
                np.warn (data.error);
                break;
                
            case 'add_invalid_params':
                np.warn ('np.model.'+data.name+'.add('+data.data+'):');
                np.warn ('Invalid parameter.');
                np.warn ('Please pass the parameter as an object.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.data);
                np.warn (' ');
                np.warn ('and is type of:');
                np.warn (data.tof);
                break;
                
            case 'doesnt_comply_definition':
                np.warn ('np.model.'+data.name+'.add('+data.data+'):');
                np.warn ('Passed data doesn\'t comply with model defintion.');
                np.warn ('Please pass the parameter according the model definition.');
                np.warn (' ');
                np.warn ('You passed:');
                for (var i in data.data) { np.warn (i); }
                np.warn (' ');
                np.warn ('but should be:');
                for (var i in data.definition) { np.warn (i); }
                break;
                
            case 'doesnt_comply_definition_types':
                np.warn ('np.model.'+data.name+'.add('+data.data+'):');
                np.warn ('Passed data doesn\'t comply with model defintion types.');
                np.warn ('Please pass the parameter according the model definition types.');
                np.warn (' ');
                np.warn ('You passed:');
                for (var i in data.data) { np.warn (i+': '+typeof data.data[i]); }
                np.warn (' ');
                np.warn ('but should be:');
                for (var i in data.definition) { np.warn (i+': '+data.definition[i]); }
                break;
                
            case 'each_invalid_type':
                np.warn ('np.model.'+data.name+'.each('+data.fnc+'):');
                np.warn ('Invalid type of parameter.');
                np.warn ('Please pass the parameter as a function.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.fnc);
                np.warn (' ');
                np.warn ('and is type of:');
                np.warn (data.tof);
                break;
                
            case 'rows_each_invalid_type':
                np.warn ('np.model.'+data.name+': rows.each('+data.fnc+'):');
                np.warn ('Invalid type of parameter.');
                np.warn ('Please pass the parameter as a function.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.fnc);
                np.warn (' ');
                np.warn ('and is type of:');
                np.warn (data.tof);
                break;
                
            case 'rows_each_broken':
                np.warn ('np.model.'+data.name+': rows.each():');
                np.warn ('Your function contains invalid code.');
                np.warn ('Please fix it.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.fnc.toString ());
                break;
                
            case 'model_set_invalid_type':
                np.warn ('np.model.'+data.name+': row.set'+data.set+'('+data.val+'):');
                np.warn ('Invalid type of parameter');
                np.warn ('Please use the valid parameter type.');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn (data.val);
                np.warn (' ');
                np.warn ('and is type of:');
                np.warn (data.tof);
                np.warn (' ');
                np.warn ('but should be type of:');
                np.warn (data.type);
                break;
        }
        
        np.warn (' ');
        np.warn ('Type np.help.module(\'model.register'+affix+'\') for more information.');
        
        if (errStack) {
            np.warn (' ');
            np.warn ('error stack:', true );
        }
    }
    
    return promise;
});