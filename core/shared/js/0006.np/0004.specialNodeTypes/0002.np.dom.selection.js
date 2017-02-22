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

np.module ('dom.selection', (function () {
    function setRange (elem, range) {
        var $elem, $range, newRange, selection,
            startOffset, endOffset;

        $elem       = elem[0];
        $range      = $elem.childNodes[0] ? $elem.childNodes[0] : $elem;
        
        startOffset = range.anchorOffset;
        endOffset   = range.focusOffset;

        if (startOffset > endOffset) {
            startOffset = endOffset;
            endOffset   = range.anchorOffset;
        }

        newRange    = rangy.createRange();

        newRange.selectNodeContents($elem);
        newRange.setStart ($range, startOffset);
        newRange.collapse (true);

        if (startOffset !== endOffset)    { newRange.setEnd ($range, endOffset); }

        selection   = rangy.getSelection ();

        selection.removeAllRanges ();
        selection.addRange (newRange);

        $elem.focus ();        
    }
    
    function getRange () {
        var selection;

        selection   = rangy.getSelection ();

        return {focusOffset: selection.focusOffset, anchorOffset: selection.anchorOffset};
    }
    
    function getNode () {
        var selection;
        
        selection   = rangy.getSelection ();
        
        return selection.focusNode !== null ? $(selection.focusNode.parentNode) : false;
    }
    
    return {
        setRange: function (elem, range) {
            setRange (elem, range);
        },

        getRange: function () {
            return getRange ();
        },

        getNode: function () {
            return getNode ();
        }
    };
}()));