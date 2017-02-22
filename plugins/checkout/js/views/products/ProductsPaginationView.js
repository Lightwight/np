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

np.view.extend ('ProductsPaginationView', {
    isVisible: function (model) {
        var margContainer;
        
        margContainer   = $('[data-handle="ProductsView"]');

        if (model.get ('pages').length === 0) {
            if (np.client.isMobile ()) {
                margContainer.css ('margin-top', '0px');
            }
            
            if (!this.hasClass ('no-display'))  { this.addClass ('no-display');     }
        } else {
            margContainer.css ('margin-top', '');
            if (this.hasClass ('no-display'))   { this.removeClass ('no-display');  }
        }
    },
    
    setupLink: function (model) {
        var num;
        num     = model.get ('num');
        
        this.attr ('href', model.get ('link') + model.get ('num'));
    },
    
    setActive: function (model) {
        var route, parts, page, num;
        
        route       = np.route.getBookmarkItem (true);
        parts       = route.split ('/');
        page        = typeof parts[3] !== 'undefined' ? parseInt (parts[3], 10) : 1;
        num         = model.get ('num');
        
        if (num === page) {
            if (!this.hasClass ('active'))  { this.addClass ('active');     }
        } else {
            if (this.hasClass ('active'))   { this.removeClass ('active');  }
        }
    },
    
    setPrev: function () {
        var route, parts, category, page;
        
        route       = np.route.getBookmarkItem (true);
        parts       = route.split ('/');
        category    = parts[1];
        page        = typeof parts[3] !== 'undefined' ? parseInt (parts[3], 10) - 1: 1;        
        if (page < 1)   { page = 1; }
        
        this.attr ('href', '/shop/'+category+'/page/'+page);
    },
    
    setNext: function () {
        var route, parts, category, page, total;
        
        route       = np.route.getBookmarkItem (true);
        parts       = route.split ('/');
        category    = parts[1];
        page        = typeof parts[3] !== 'undefined' ? parseInt (parts[3], 10) + 1: 2;
        total       = np.pagination.get ('Products');        
        if (page > total)   { page = total; }
        
        this.attr ('href', '/shop/'+category+'/page/'+page);
    },
    
    prevEnabled: function () {
        var route, parts, category, page;
        
        route       = np.route.getBookmarkItem (true);
        parts       = route.split ('/');
        category    = parts[1];
        page        = typeof parts[3] !== 'undefined' ? parseInt (parts[3], 10) : 1;        
        if (page < 1)   { page = 1; }
        
        if (page === 1) {
            if (!this.hasClass ('disabled'))    { this.addClass ('disabled');       }
        } else {
            if (this.hasClass ('disabled'))     { this.removeClass ('disabled');    }
        }
    },
    
    nextEnabled: function () {
        var route, parts, category, page, total;
        
        route       = np.route.getBookmarkItem (true);
        parts       = route.split ('/');
        category    = parts[1];
        page        = typeof parts[3] !== 'undefined' ? parseInt (parts[3], 10) : 1;
        total       = np.pagination.get ('Products');        
        if (page > total)   { page = total; }
        
        if (page === total) {
            if (!this.hasClass ('disabled'))    { this.addClass ('disabled');       }
        } else {
            if (this.hasClass ('disabled'))     { this.removeClass ('disabled');    }
        }
    }
});