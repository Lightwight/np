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

np.module ('Modal', {
    dialog: function (nodeID) {
        var _t, _nodeID, _fncApply, _fncCancel;
        
        
        _t          = this;
        _fncApply   = function () {};
        _fncCancel  = function () {};

        _nodeID     = typeof (nodeID) === 'string' && $(nodeID).length > 0 ? nodeID : '#modal-view';

        function _apply () {
            try {
                _fncApply ();
            } catch (e) { 
                console.log ('Module Modal cannot execute - apply - function.\nError: '+e); 
            }
        }

        function _cancel () {
            try {
                _fncCancel ();
            } catch (e) { 
                console.log ('Module Modal cannot execute - cancel - function.\nError: '+e); 
            }
        }

        np.observable.update ('NPModal', 1, 'nodeID', _nodeID);
        np.observable.update ('NPModal', 1, 'fncApply', _apply);
        np.observable.update ('NPModal', 1, 'fncCancel', _cancel);
        np.observable.update ('NPModal', 1, 'show', true);

        return {
            apply: function (fncApply) {
                _fncApply   = fncApply;

                return {
                    cancel: function (fncCancel) {
                        _fncCancel  = fncCancel;
                    }
                };
            },

            cancel: function (fncCancel) {
                _fncCancel  = fncCancel;

                return {
                    apply: function (fncApply) {
                        _fncApply   = fncApply;
                    }
                };
            }
        };
    }
});