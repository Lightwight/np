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

np.module ('utils.shortentext', function (html, length, more) {
    var rxTags, rxTemp, rxTest,
        text, splitted, result,
        curLen, spLen, closeTags, tmpSpl, toolong,
        i, l;
    
    rxTags      = /<([^>]+)>/gim;
    rxTemp      = /(\:[^\:]+\:)/gim;
    rxTest      = /\:([^\:]+)\:/gim;
    
    text        = html.replace (rxTags, ':$1:');
    
    splitted    = text.split (rxTemp);
    l           = splitted.length;
    
    result      = '';
    curLen      = 0;
    closeTags   = {};
    more        = more ? more : '...';
    toolong     = false;
    
    for (i=0; i<l; i++) {
        if ($.isArray (splitted[i].match (rxTest))) {
            result += splitted[i];
        } else {
            curLen += spLen = splitted[i].length;
            
            if (curLen <= length)   { result += splitted[i];                                                    }
            else                    { result += splitted[i].slice (0, length-spLen+1); toolong = true; break;   }
        }
    }
    
    splitted    = result.split (rxTemp);
    l           = splitted.length;
    
    for (i=0; i<l; i++) {
        if ($.isArray (splitted[i].match (rxTest))) {
            if (splitted[i].indexOf ('br') === -1) {
                if (splitted[i].indexOf ('/') === -1) {
                    if (typeof closeTags[splitted[i]] === 'undefined') {
                        closeTags[splitted[i]] = 0;
                    }

                    closeTags[splitted[i]]++;
                } else {
                    tmpSpl  = splitted[i].replace ('/', '');

                    if (typeof closeTags[tmpSpl] !== 'undefined') {
                        closeTags[tmpSpl]--;
                    }
                }
            }
        }
    }
    
    for (i in closeTags) {
        result += i.slice (0, 1)+'/'+i.slice (1, i.length-1)+i.slice (i.length-1);
    }

    result        = result.replace (rxTest, '<$1>')+(toolong ? more : '');
    
    return result;
});