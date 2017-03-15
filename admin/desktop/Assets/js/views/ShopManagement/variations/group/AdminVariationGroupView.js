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

np.view.extend ('AdminVariationGroupView', {
    savingGroup: function (model) {
        if (model.get ('sending')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('sending').on ('change'),

    disableSaveGroup: function (model) {
        if (model.get ('sending')) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }.observes ('sending').on ('change'),

    flushGroups: function () {
        np.model.Article_variation_groups.flush ();
    }.observes ('route.before').on ('change'),
    
    removedGroup: function (model) {
        var _t;
        
        _t  = this;

        if (model.get ('removed')) {
            np.notify ('Die Variationsgruppe wurde gelöscht.').asSuccess ().timeout (2000).show ();

            window.setTimeout (function () {
                _t.click ();
            }, 2000);
        }
    }.observes ('removed').on ('change'),
    
    errorOnRemove: function (model) {
        var error, code, msg;
        
        error   = model.get ('error');
        
        if (error) {
            code    = error.code;
            msg     = error.msg;
            
            np.notify ('Die Variationsgruppe konnte nicht gelöscht werden.<br>Code: '+code + ' : ' + msg).asError ().timeout (4000).show ();
        }
    }.observes ('error').on ('change')
});