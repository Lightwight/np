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

np.module ('notify', function (message) {
    np.observable.update ('NPCtaNotification', 1, 'message', message);
    
    function setTimeout (ms) {
        np.observable.update ('NPCtaNotification', 1, 'timeout', ms);
    }
    
    function showNotifier () {
        np.observable.update ('NPCtaNotification', 1, 'show', true);
    }
    
    function _show () {
        showNotifier ();
    }
    
    function _timeout (ms) {
        setTimeout (ms);

        return { show: _show };
    }
    
    function _setType (type) {
        np.observable.update ('NPCtaNotification', 1, 'type', type);
        
        return {
            timeout:    _timeout,
            show:       _show
        };
    }
    
    return {
        timeout: function (ms) {
            return _timeout (ms);
        },
        
        show: function () {
            _show ();
        },
        
        asError: function () {
            return _setType ('fail');
        },
        
        asSuccess: function () {
            return _setType ('success');
        }
    };
});