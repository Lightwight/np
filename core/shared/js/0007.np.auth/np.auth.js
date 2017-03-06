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

np.plugin.extend ('auth', (function () {
    var storage, origin;
    
    storage = {
        user: {
            id:                 -1,
            email:              '',
            gender:             '',
            name:               '',
            prename:            '',
            company:            '',
            ustid:              '',
            group:              'visitor',
            loggedIn:           false,
            staystayLoggedIn:   true,
            
            password:       ''
        },
        
        register: {
            id:                     -1,
            email:                  '',
            email_confirmation:     '',
            password:               '',
            password_confirmation:  '',
            
            sending:                false,
            error:                  false,
            success:                false
        },
        
        forgot: {
            id:             -1,
            reset_email:    '',
            
            sending:        false,
            error:          false,
            success:        false,
            
            validPWReset:   false
        },
        
        reset: {
            id:                     -1,
            password:               '',
            password_confirmation:  '',
            pw_temp:                '',
            pw_reset:               false,
            
            sending:        false,
            error:          false,
            success:        false
        },
        
        confirm: {
            id:             -1,
            confirmation:   false
        }
    };
    
    origin  = np.jsonClone (storage);
    
    function getError (error) {
        if (error !== null && typeof error !== 'undefined' && typeof error.data !== 'undefined' && typeof error.data.responseJSON !== 'undefined' && typeof error.data.responseJSON.err !== 'undefined') {
            return error.data.responseJSON.err;
        } 
        
        return null;
    }
    
    function mergeStorage (selector, data) {
        var i;
        
        if (typeof storage[selector] !== 'undefined') {
            for (i in data) { 
                storage[selector][i] = data[i];   
            }
        }
    }
    
    function resetStorage (selector) {
        if (typeof storage[selector] !== 'undefined') { 
            storage[selector] = origin[selector];
        }
    }
    
    function updateUser (data, overwriteOrigin) {
        overwriteOrigin = typeof overwriteOrigin === 'boolean' ? overwriteOrigin : false;

        if (overwriteOrigin) {
            origin.user     = np.jsonClone (data);
            storage.user    = data;    
        } else {
            storage.user    = data;
        }        
    }
    
    return {
        setup: {
            reset: {
                password: function (val) { 
                    storage.reset.pw_reset = val !== 0 ? val : 0;   
                }
            },
            
            register: {
                confirmation: function (val) {
                    storage.confirm.confirmation    = val;
                }
            }
        },
        
        setUser: function (data, overwriteOrigin) {
            updateUser (data, overwriteOrigin);
        },
        
        user: function (type) { 
            if (typeof storage[type] !== 'undefined') {
                return np.jsonClone (storage[type]);
            } else {
                return false;
            }
        },
        
        origin: function (type) {
            if (typeof origin[type] !== 'undefined') {
                return origin[type];  
            } else {
                return false;
            }
        },
        
        setGender:      function (gender)       { storage.user.gender = gender;             },
        setPrename:     function (prename)      { storage.user.prename = prename;           },
        setName:        function (name)         { storage.user.name = name;                 },
        setCompany:     function (company)      { storage.user.company = company;           },
        setUstId:       function (ustid)        { storage.user.ustid = ustid;               },
        
        getGender:      function ()     { return storage.user.gender;   },
        getPrename:     function ()     { return storage.user.prename;  },
        getName:        function ()     { return storage.user.name;     },
        getCompany:     function ()     { return storage.user.company;  },
        getUstId:       function ()     { return storage.user.ustid;    },
        getMail:        function ()     { return storage.user.email;    },
        getGroup:       function ()     { return storage.user.group;    },
        
        
        setMail: function (type, mail) {
            if (typeof storage[type] !== 'undefined') {
                if (type !== 'forgot') {
                    storage[type].email = mail;
                } else {
                    storage[type].reset_email = mail;
                }
            }
        },
        
        validUserData: function () {
            return storage.user.gender.length > 0 
                   && storage.user.prename.length > 0
                   && storage.user.name.length > 0;
        },
        
        setPassword: function (type, pass) {
            if (typeof storage[type] !== 'undefined') {
                storage[type].password = pass;     
            }
        },
        
        setLoggedIn: function (loggedIn) {
            storage.user.loggedIn   = loggedIn;
        },
        
        loggedIn: function () {
            return storage.user.loggedIn;
        },
        
        wasLoggedIn: function () {
            return storage.user.wasLoggedIn;
        },
        
        relogin: function () {
            var compiled, html, title, type, message, buttons;

            buttons     = new Array ();
            type        = 'warning';
            title       = '<span class="glyphicon glyphicon-info-sign"></span><h4>Sitzung abgelaufen</h4>';
            message     = '';
            
            compiled    = Handlebars.compile (np.handlebars.getTemplate ('AuthLoginView'));
            html        = compiled ();
            
            message    += 'Ihre Sitzung ist abgelaufen.<br>';
            message    += 'Sie müssen sich erneut anmelden um fortzufahren.<br><br>';
            message    += html;

            np.ui.dialog.show (type, title, message, buttons, false);
        },
        
        login: function () {
            var promise, request;
            
            promise = np.Promise();

            request = {
                auth: {
                    login: {
                        email:          storage.user.email,
                        password:       storage.user.password,
                        stayLoggedIn:   storage.user.stayLoggedIn
                    }
                },
                type:       'auth'
            };
            
            storage.user.password   = '';
            
            np.ajax({
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                mergeStorage ('user', rsp.data);
                
                promise.then ();
            }).fail (function (error) {
                promise.fail (getError (error));
            });            
            
            return promise;
        },
        
        logout: function () {
            var promise, request;
            
            promise = np.Promise();

            request = {
                auth: {
                    logout: true
                },
                type:       'auth'
            }; 
            
            np.ajax({
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                resetStorage ('user');
                
                document.location.reload ();
            }).fail (function (error) {
                promise.fail (getError (error));
            });             
            
            return promise;
        },
        
        adminRegister: function (user) {
            var promise, request;
            
            promise = np.Promise ();

            request = {
                auth: {
                    adminRegister:  user
                },
                type:       'auth'
            };
            
            np.ajax({
                type:           'POST',
                dataType:       'json',
                url:            '/',
                data:           request
            })
            .then (function () {
                promise.then ();
            })
            .fail (function (error) {
                promise.fail (getError (error));
            });
            
            return promise;            
        },
        
        adminChangeUser: function (user) {
            var promise, request;
            
            promise = np.Promise ();

            request = {
                auth: {
                    adminChangeUser:    user
                },
                type:       'auth'
            };
            
            np.ajax({
                type:           'POST',
                dataType:       'json',
                url:            '/',
                data:           request
            })
            .then (function () {
                promise.then ();
            })
            .fail (function (error) {
                promise.fail (getError (error));
            });
            
            return promise;              
        },
        
        register: function () {
            var promise, request;
            
            promise = np.Promise ();

            request = {
                auth: {
                    register: {
                        email:      storage.register.email,
                        password:   storage.register.password
                    }
                },
                type:       'auth'
            };
            
            np.ajax({
                type:           'POST',
                dataType:       'json',
                url:            '/',
                data:           request
            })
            .then (function () {
                promise.then ();
            })
            .fail (function (error) {
                promise.fail (getError (error));
            });
            
            return promise;            
        },
        
        sendResetMail: function () {
            var promise, request;
            
            promise = np.Promise ();

            request = {
                auth: {
                    reset: {
                        email:      storage.forgot.reset_email
                    }
                },
                type:       'auth'
            };
            
            np.ajax({
                type:           'POST',
                dataType:       'json',
                url:            '/',
                data:           request
            })
            .then (function () {
                promise.then ();
                
            })
            .fail (function (error) {
                promise.fail (getError (error));
            });
            
            return promise;            
        },
        
        setNewPassword: function (pw_reset, pw_temp, password) {
            var promise, request;
            
            promise = np.Promise ();
            
            request = {
                auth: {
                    setnew: {
                        password:   password,
                        pw_reset:   pw_reset,
                        pw_temp:    pw_temp
                    }
                },
                type:       'auth'
            };
            
            np.ajax({
                type:           'POST',
                dataType:       'json',
                url:            '/',
                data:           request
            })
            .then (function () {
                promise.then ();
            })
            .fail (function (error) {
                promise.fail (getError (error));
            });
            
            return promise;
        },
        
        hasChanged: function () {
            var _user, _origin, _hasChanged, i;
            
            _user       = storage.user;
            _origin     = origin.user;
            _hasChanged = false;
            
            for (i in _user) {
                if (i !== 'id' && i !== 'email' && _user[i] !== _origin[i]) {
                    _hasChanged = true;
                    
                    break;
                }
            }
            
            return _hasChanged;
        },
        
        
        
        saveUser: function () {
            var promise, _origin, _user, request,
                i;

            promise         = np.Promise ();
            
            _origin         = origin.user;
            _user           = storage.user;
                    
            request         = {
                auth:   { user: {} },
                type:   'auth'
            };

            for (i in _user) {
                if (i !== 'id' && i !== 'email') {
                    request.auth.user[i]  = _user[i];
                }
            }

            np.ajax({
                type:           'POST',
                dataType:       'json',
                url:            '/',
                data:           request
            })
            .then (function () {
                updateUser (storage.user, true);

                promise.then ();
            })
            .fail (function (error) {
                promise.fail (getError (error));
            });
            
            return promise;            
        }
    };
}()));