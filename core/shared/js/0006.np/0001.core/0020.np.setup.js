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

np.module ('setup', (function () {
    var storage, _settings;
    
    storage = {
        theme:      '',
        ajaxInfo:   false
    };
    
    _settings   = {};
    
    np.ajaxInfo = storage.ajaxInfo;
    
    return {
        config: function (settings) {
            var theme;
            
            _settings   = settings;
            
            if (typeof settings.debug === 'boolean') {
                np.debug = settings.debug;    
            } 
            
            if (typeof settings.theme === 'string') {
                $('html').removeClass (storage.theme);
                
                theme   = storage.theme = 'np-theme-'+settings.theme;
                
                if (!$('html').hasClass (theme)) { $('html').addClass (theme); }
            } 
        },
        
        getSettings: function () {
            return _settings;
        }
    };
}()));