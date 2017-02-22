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

np.controller.extend ('AdminProductOverviewController', {
    view:   'AdminProductOverviewView',
    model:  function () {
        this.sending    = false;
        this.removed    = false;
        
        return {
            AdminProduct: this
        };
    },
    
    events: {
        undeleteProduct: function () {
            var _t;
            
            _t  = this;
            
            np.model.Products.findByID (_t.get ('id')).each (function (row) {
                row.setDeleted (0);
            });

            _t.set ('sending', true);

            np.model.Products
            .save ()
            .then (function (rsp) {
                _t.set ('sending', false);
                _t.set ('deleted', 0);
            })
            .fail (function () {
                _t.set ('sending', false);
            });
        },

        removeProduct: function () {
            var _t, message, title, buttons;
            
            _t  = this;
            
            title       = 'Artikel entfernen';
            message     = 'Soll der Artikel wirklich entfernt werden?';
                    
            buttons = new Array 
            (
                $.extend ({}, vex.dialog.buttons.YES, {text: 'Ja'}),
                $.extend ({}, vex.dialog.buttons.NO, {text: 'Abbrechen'})
            );
            
            vex.dialog.open ({
                className:  'vex-theme-top',
                message:    '<h3>'+title+'</h3><br><span>'+message+'</span>',
                buttons:    buttons,
                callback:   function (data) {
                    if (data === true) {
                        np.model.Products.findByID (_t.get ('id')).each (function (row) {
                            row.remove ();
                        });

                        _t.set ('sending', true);

                        np.model.Products
                        .save ()
                        .then (function (rsp) {
                            _t.set ('sending', false);
                            _t.set ('removed', true);
                            _t.set ('deleted', 1);
                            
                            np.observable.removeContext ('AdminProduct', _t.get ('id'));
                        })
                        .fail (function () {
                            _t.set ('sending', false);
                            _t.set ('removed', false);
                        });
                    }                
                }
            });
        }
    }
});