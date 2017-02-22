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

np.plugin.extend ('geo', (function () {
   var storage;
   
   storage  = {
       countries:   new Array ()
   };
   
   function orderCountries (countries) {
       var specialChars;
       
        specialChars    = {  
            'c0': 'A', 'c1': 'A', 'c2': 'A', 'c3': 'A', 'c4': 'A', 'c5': 'A', 'c6': 'A',
            'c7': 'C',
            'c8': 'E', 'c9': 'E', 'ca': 'E', 'cb': 'E',
            'cd': 'I', 'cc': 'I', 'ce': 'I', 'cf': 'I',

            'd0': 'D',
            '152': 'O', 'd3': 'O', 'd2': 'O', 'd4': 'O', 'd5': 'O', 'd6': 'O',
            'da': 'U', 'd9': 'U', 'db': 'U', 'dc': 'U',
            'df': 'S',

            'e0': 'a', 'e1': 'a', 'e2': 'a', 'e3': 'a', 'e4': 'a', 'e6': 'a',
            'e7': 'c',
            'e8': 'e', 'e9': 'e', 'ea': 'e', 'eb': 'e',
            'ec': 'i', 'ed': 'i', '130': 'i', 'ee': 'i', 'ef': 'i',

            '153': 'o', 'f3': 'o', 'f2': 'o', 'f4': 'o', 'f5': 'o', 'f6': 'o',
            'fa': 'u', 'f9': 'u', 'fb': 'u', 'fc': 'u',

            'f0': 'd'
        }; 
        
        function convertSpecialChars (word) {
            var retVal, code, t, l;

            l       = word.length;
            retVal  = '';
            code    = '';

            for (t=0; t<l; t++) {
                retVal += typeof specialChars[word.charCodeAt (t).toString (16)] !== 'undefined' ? specialChars[word.charCodeAt (t).toString (16)] : word.charAt (t);
            }

            return retVal;            
        }        
        
        countries   = countries.sort (function (a, b) {
            var aTmp, bTmp, aCmp, bCmp;

            aTmp    = np.jsonClone (a);
            bTmp    = np.jsonClone (b);

            aCmp    = aTmp.de;
            bCmp    = bTmp.de;

            aCmp    = convertSpecialChars (aCmp);
            bCmp    = convertSpecialChars (bCmp);

            return aCmp > bCmp;
        });
    }
   
    return {
        setup: {
            countries:   function (data) {
                if ($.isArray (data) && data.length > 0) {
                    orderCountries (data);

                    storage.countries    = data;
                }
            }
        },
       
        html: function () {
            var html, countries,
                i, l;
           
            countries   = storage.countries;
            l           = countries.length;
            html        = '<select class="selectpicker" data-live-search="true">';
            html       +=   '<option data-hidden="true">Land</option>';
           
            for (i=0; i<l; i++) {
                html   +=   '<option>'+countries[i].de+'</option>';
            }
   
            html       += '</select>';
           
            return html;
        },
       
        didInsert: function (value) {
            this.find ('select').val (value);
            this.find ('select').selectpicker ({size: 4, showIcon: false, mobile: $('html').hasClass ('.np-device-desktop')});
            
            return this.find ('select');
        },
       
        events: {
            getGeo: function (node) {
                return node.val ();
            },
            
            setGeo: function (node, value) {
                var select;
                
                select  = node.find ('select.selectpicker:first');

                select.selectpicker ('val', value);
            }
        }
    };
}()));