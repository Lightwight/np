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

// Its just an jquery-ajax wrapper
np.module ('ajax', (function () {
    var cid, csrf;
    
    cid         = cid || new Fingerprint ({ie_activex: true}).get().toString ();

    return function (options) {
        var promise, xhrObject, xhrHelper, warn, error, info;
        
        csrf        = np.INITIAL_DATA.csrf_token;
        error       = np.error;
        warn        = np.warn;
        info        = np.info;
        
        promise     = np.Promise();

        xhrHelper   = {done: false, timer: null};

        xhrObject   = $.ajax ((function (o, x) {
            o.context   = x;
            
            if (typeof o.file === 'undefined') {
                o.data.cid  = cid;
                o.data.csrf = csrf;
            } else {
                o.data.append ('cid', cid);
                o.data.append ('csrf', csrf);
            }
            
            options     = o;

            o.xhr       = function () {
                var myXHR;
                
                
                myXHR   = $.ajaxSettings.xhr ();
                
                if (o.file && myXHR.upload) {
                    myXHR.upload.addEventListener ('progress', function (e) {
                        promise.pending ({file: o.file, progress: Math.ceil ((e.loaded/e.total)*100)});
                    });
                }
                
                return myXHR;
            };
    
            return o;
        }(options || {}, xhrHelper)));

        xhrObject.always (function (data, status) {
            this.done   = true;
            
            function clearOptions() {
                delete options.context;
                delete options.data.cid;
                delete options.data.csrf;
            }

            if (data !== null
                && typeof data.responseJSON !== 'undefined' 
                && typeof data.responseJSON.auth !== 'undefined'
                && typeof data.responseJSON.auth.loggedIn !== 'undefined'
            ) {
                np.auth.setLoggedIn (data.responseJSON.auth.loggedIn===1);
            } 
            
            if (data !== null
                && typeof data.responseJSON !== 'undefined' 
                && typeof data.responseJSON.err !== 'undefined'
                && parseInt (data.responseJSON.err, 10) === 700
            ) {
                document.location.reload ();
            } else {
                switch (status) {
                    case 'success':
                        clearOptions();

                        promise.then (info({success:{params:options,status:"request success"},data:data}));
                        break;

                    case 'error':
                        clearOptions();

                        promise.fail (warn({error:{params:options,statusCode:data.status, status:"request error"},solution:'see http://de.wikipedia.org/wiki/HTTP-Statuscode#5xx_.E2.80.93_Server-Fehler',data:data}));

                        break;

                    case 'abort':
                        clearOptions();

                        promise.fail (warn({error:{params:options,statusCode:data.status,status:"request aborted"},solution:'do not abort the ajax request'}));
                        break;

                    case 'parsererror':
                        clearOptions();

                        promise.fail (warn({error:{params:options,statusCode:data.status,status:"request parseError"},solution:'Invalid JSON data. This is a server side issue. The server should respond with valid JSON data'}));
                        break;

                    case 'timeout':
                        clearOptions();

                        promise.fail (warn({error:{params:options,statusCode:data.status,status:"request timeout"},solution:'Server side issue. The response time for the server timed out. Check your server code functionality and fix it'}));
                        break;
                }
            }
        });

        // Give the user the possibility to trigger abort
        promise.abort   = function () { xhrObject.abort(); };

        return promise;
    };
}()));