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

np.view.extend ('AdminUpdateView', {
    showUpdateButton: function (model) {
        if (model.get ('updateable')) {
            this.removeClass ('no-display');
        } else {
            this.addClass ('no-display');
        }
        
        if (model.get ('sending')) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }
    .observes ('updateable').on ('change')
    .observes ('sending').on ('change'),
    
    setButtonText: function (model) {
        if (model.get ('updateable')) {
            this.html ('Update auf Version '+model.get ('new_version'));
        }
    }.observes ('updateable').on ('change'),
    
    sending: function (model) {
        if (model.get ('sending')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('sending').on ('change'),
    
    notSending: function (model) {
        if (model.get ('sending')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('sending').on ('change'),
    
    onError: function (model) {
        var title, message;

        if (model.get ('errorOnUpdate')) {
            title       = 'Fehler!';
            message     = 'Während der Aktualisierung ist ein Fehler aufgetreten.<br>Bitte versuchen Sie die Aktualisierung zu einem späteren Zeitpunkt erneut.';

            vex.dialog.alert ({
                className:  'vex-theme-top',
                message:    '<h3>'+title+'</h3><br><span>'+message+'</span>'
            });       
        }
    }.observes ('errorOnUpdate').on ('change')
});