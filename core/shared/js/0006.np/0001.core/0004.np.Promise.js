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
np.module('Promise', function () {
    if (!(this instanceof np.Promise)) { return new np.Promise();   }

    var cnt, _this;

    cnt             = 0;
    _this           = this;
    
    this.fncThen    = null;
    this.fncFail    = null;
    this.fncPending = null;

    function callFnc (that, type, params) {
        var p, fnc;

        type    = type || 'then';
        fnc     = ( type === 'then' )? that.fncThen : (type === 'pending')? that.fncPending : that.fncFail;
        p       = params || null;

        try         { fnc(p);   }
        catch(e)    { 
            if( typeof fnc === 'function' ) {
                np.warn('PROMISE ERROR: ');
                np.warn('=======================================');
                np.warn('cannot call "'+type+'" promise. Error in its containing function:');
                np.warn(' ');
                np.warn(e);
                np.warn(' ');
                np.warn ('error stack:', true );
                np.warn('=======================================');
                
                
                try {
                    that.fncFail();
                } catch(e2) {
                    np.warn('PROMISE ERROR: ');
                    np.warn('=======================================');
                    np.warn('cannot call "fail" promise. Error in its containing function:');
                    np.warn(e2);
                    np.warn (' ');
                    np.warn ('error stack:', true );
                    np.warn('=======================================');
                    
                }
            } else {
                // Prevent from endless loop:
                if( cnt < 150 && type === 'then' ) {
                    cnt++;

                    window.setTimeout(function(){
                        callFnc(that, type, p);
                    },1);
                }
            }
        }
    }

    this.pending = function (fnc) {
        if (typeof fnc === 'function')          { _this.fncPending   = fnc;      }
        else if (typeof fnc !== 'function')     { callFnc(_this,'pending',fnc);  }

        return _this;
    };

    this.then = function (fnc) {
        if (typeof fnc === 'function')          { _this.fncThen  = fnc;      }
        else if (typeof fnc !== 'function')     { callFnc(_this,'then',fnc); }

        return _this;
    };

    this.fail = function (fnc) {
        if (typeof fnc === 'function')          { _this.fncFail  = fnc;      }
        else if (typeof fnc !== 'function')     { 
            callFnc(_this,'fail',fnc); }

        return _this;
    };

    return this;
});