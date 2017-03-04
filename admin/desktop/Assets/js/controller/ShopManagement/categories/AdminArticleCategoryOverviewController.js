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

np.controller.extend ('AdminArticleCategoryOverviewController', {
    view:   'AdminArticleCategoryOverviewView',
    model:  function () {
        var _t;
        
        _t                      = this;
        
        this.sending            = false;
        this.removed            = false;
        this.parentCategory     = '';
        this.parentCategoryID   = '';
        
        if (this.KeyOberkategorie > 0) {
            np.model.Article_categories.findByID (this.KeyOberkategorie).each (function (row) {
                _t.parentCategory   = row.getKeyBeschreibung ();
                _t.parentCategoryID = row.getID ();
            });
        }
        
        return {
            AdminArticleCategory: this
        };
    },
    
    events: {
        removeCategory: function () {
            var _t, message, title, buttons;

            _t  = this;

            title       = 'Kategorie entfernen';
            message     = 'Soll die Kategorie wirklich entfernt werden?';

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
                        np.model.Article_categories.findByID (_t.get ('id')).each (function (row) {
                            row.remove ();
                        });

                        _t.set ('sending', true);

                        np.model.Article_categories
                        .save ()
                        .then (function () {
                            _t.set ('sending', false);
                            _t.set ('removed', true);

                            np.observable.removeContext ('AdminArticleCategory', _t.get ('id'));
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