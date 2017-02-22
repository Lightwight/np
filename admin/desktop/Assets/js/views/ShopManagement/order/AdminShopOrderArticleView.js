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

np.view.extend ('AdminShopOrderArticleView', (function () {
    function mapMessage (model) {
        var map, key, message;

        message         = '';
        
        map             = {
            'deleted':          'Dieser Artikel befand sich zum Zeitpunkt der Bestellung nicht mehr im Sortiment.',
            'disabled':         'Dieser Artikel wurde zum Zeitpunkt der Bestellung überarbeitet.',
            'notDeliverable':   'Dieser Artikel war zum Zeitpunkt der Bestellung nicht mehr lieferbar.',
            'notAvailable':     'Dieser Artikel war zum Zeitpunkt der Bestellung nicht mehr verfügbar.'
        };

        key     = parseInt (model.get ('deleted'), 10) === 1 ? 'deleted' : false;
        if (!key)   { key = parseInt (model.get ('enabled'), 10) === 0 ? 'disabled' : false;            }
        if (!key)   { key = parseInt (model.get ('deliverable'), 10) === 0 ? 'notDeliverable' : false;  }
        if (!key)   { key = parseInt (model.get ('available'), 10) === 0 ? 'notAvailable' : false;      }
        
        if (key) {
            message = map[key] + ' Der Artikel wurde in dieser Bestellung nicht mitberücksichtigt.';
        }
        
        return message;
    }

    return {
        hasIgnored: function (model) {
            var deleted, disabled, notDeliverable, notAvailable, hasIgnored;

            deleted         = parseInt (model.get ('deleted'), 10) === 1;
            disabled        = parseInt (model.get ('enabled'), 10) === 0;
            notDeliverable  = parseInt (model.get ('deliverable'), 10) === 0;
            notAvailable    = parseInt (model.get ('available'), 10) === 0;

            hasIgnored      = deleted || disabled || notDeliverable || notAvailable;

            if (hasIgnored) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        },

        setIgnoredText: function (model) {
            this.html (mapMessage (model));
        }
    };    
})());