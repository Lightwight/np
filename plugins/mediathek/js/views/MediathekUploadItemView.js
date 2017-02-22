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

np.view.extend ('MediathekUploadItemView', {
    setProgress: function (model) {
        this.css ('width', model.get ('progress')+'%');
    }.observes ('progress').on ('change'),
    
    setSource: function (model) {
        if (model.get ('success')) {
            this.css ('background-image', 'url('+model.get ('src')+')');
            
            if (!this.hasClass ('show'))    { this.addClass ('show');       }
        } else {
            this.css ('background-image', '');
            if (this.hasClass ('show'))     { this.removeClass ('show');    }
        }
    }.observes ('success').on ('change'),
    
    onSuccess: function (model) {
        if (model.get ('success')) {
            if (!this.hasClass ('show'))    { this.addClass ('show');       }
        } else {
            if (this.hasClass ('show'))     { this.removeClass ('show');    }
        }
    }
    .observes ('success').on ('change')
    .observes ('fail').on ('change'),
    
    onFail: function (model) {
        if (model.get ('fail')) {
            if (!this.hasClass ('show'))    { this.addClass ('show');       }
        } else {
            if (this.hasClass ('show'))     { this.removeClass ('show');    }
        }
    }
    .observes ('success').on ('change')
    .observes ('fail').on ('change')
});