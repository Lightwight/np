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

String.prototype.strength = function () {
    var _this, strength, verdict_conv, spc_chars,
        flc, fuc, fnm, fsc,
        run_score,
        lcase_count, ucase_count, num_count, schar_count,
        length;
    
    _this           = this;
    strength        = 0;
    verdict_conv    = {veryweak: 2, weak: 5, medium: 53, strong: 150, verystrong: 250};
    spc_chars       = '+-=Â¦|~!@#$%&*_';
    
    var flc         = 1.0;  // lowercase factor
    var fuc         = 1.0;  // uppercase factor
    var fnm         = 1.3;  // number factor
    var fsc         = 1.5;  // special char factor    
    
    function getVerdict (percent) {
        if (percent <= verdict_conv.veryweak) {
            return 0;
        } else if (percent > verdict_conv.veryweak && percent <= verdict_conv.weak) {
            return 1;
        } else if (percent > verdict_conv.weak && percent <= verdict_conv.medium) { 
            return 2;
        } else if (percent > verdict_conv.medium && percent <= verdict_conv.strong) { 
            return 3;
        } else { 
            return 4;
        }
    }
    
    function getPwStrength () {
        var regex_sc, avg, percent;
        
        if ((run_score = detectPwRuns()) <= 1){
            strength = 1;
        } else {
            regex_sc        = new RegExp ('['+spc_chars+']', 'g');

            lcase_count     = _this.match (/[a-z]/g);
            lcase_count     = lcase_count ? lcase_count.length : 0;
            
            ucase_count     = _this.match (/[A-Z]/g);
            ucase_count     = ucase_count ? ucase_count.length : 0;
            
            num_count       = _this.match (/[0-9]/g);
            num_count       = num_count ? num_count.length : 0;
            
            schar_count     = _this.match (regex_sc);
            schar_count     = schar_count ? schar_count.length : 0;
            
            length          = _this.length;

            avg             = length / 4;

            // I'm dividing by (avg + 1) to linearize the strength a bit.
            // To get a result that ranges from 0 to 1, divide 
            // by Math.pow(avg + 1, 4)
            strength = ((lcase_count * flc + 1) * 
                        (ucase_count * fuc + 1) *
                        (num_count * fnm + 1) * 
                        (schar_count * fsc + 1)) / (avg + 1);
        }

        percent     = getPwPercent();
        percent     = percent < 0 ? 0 : percent;
        percent     = percent > 100 ? 100 : percent;

        return getVerdict (percent);
    };    
    
    function getPwPercent (){
        return strength <= 2 ? 0 : Math.floor( (strength/150) * 100 ) - 1;
    };    
    
    // This is basically an edge detector with a 'rectified' (or
    // absolute zero) result.  The difference of adjacent equivalent 
    // char values is zero.  The greater the difference, the higher
    // the result.  'aaaaa' sums to 0. 'abcde' sums to 1.  'acegi'
    // sums to 2, etc.  'aaazz', which has a sharp edge, sums to  
    // 6.25.  Any thing 1 or below is a run, and should be considered
    // weak.    
    function detectPwRuns (){	
        var pwParts, ords, accum, lasti,
            i, l;
    
        pwParts = _this.split ('');
        l       = pwParts.length;
        
        ords    = new Array();
        accum   = 0;
        
        for (i=0; i<l; i++)         { ords[i] = pwParts[i].charCodeAt(0);       }
        
        lasti   = ords.length-1;

        for (i=0; i < lasti; ++i)   { accum += Math.abs(ords[i] - ords[i+1]);   }

        return accum/lasti;
    };    
    
    return getPwStrength ();

};