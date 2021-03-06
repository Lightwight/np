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

np.view.extend ('AdminPluginVitaOverviewView', {
    setContent: function (model) {
        var tmp, content;
                
        tmp             = document.createElement ('div');
        content         = model.get ('main_content');
        tmp.innerHTML   = content.replace (/\<br\>/gim, "\n");

        this.val (tmp.textContent || tmp.innerText || '');
    },
    
    setMediaSrc: function (model) {
        var src, type;

        src     = model.get ('main_src');
        type    = model.get ('main_type');

        if (type === 'youtube' && src.length > 0) {
            this.css ('background-image', '');
            this.css ('color', '');
            
            this.html ('<iframe class="youtube-iframe-preview" type="text/html" width="200" height="200" src="https://www.youtube.com/embed/'+src+'?autoplay=0&origin=http://hunde.de" frameborder="0"/>');
        } else if (src.length > 0) {
            this.html ('');
            this.css ('background-image', 'url('+src+')');
            this.css ('color', '#FFFFFF');
        } else {
            this.html ('');
            this.css ('background-image', '');
            this.css ('color', '');
        } 
    }.observes ('main_src').on ('change'),    

    showError: function (model) {
        var code, title, message, buttons;
        
        code    = model.get ('error');
        
        if (code !== false) {
            title       = 'Ups!';

            message     = 'Die Vita konnte nicht gespeichert werden.<br><br>';
            message    += 'Bitte überprüfen Sie Ihre Internetverbindung und wiedeholen Sie den Vorgang.<br><br>';
            message    += 'Sollte der Fehler erneut auftauchen, dann setzen Sie sich bitte mit Ihrem Systemadministrator in Verbindung.';

            buttons = new Array 
            (
                $.extend ({}, vex.dialog.buttons.YES, {text: 'OK'})
            );

            vex.dialog.open ({
                className:  'vex-theme-top',
                message:    '<h3>'+title+'</h3><br><span>'+message+'</span>',
                buttons:    buttons
            });
        }
    }.observes ('error').on ('change'),
    
    showAddVita: function (model) {
        if (model.get ('addVita')) {
            this.addClass ('fadeIn');
        } else {
            this.removeClass ('fadeIn');
        }
    }.observes ('addVita').on ('change'),
    
    showAddButton: function (model) {
        if (model.get ('addVita')) {
            this.addClass ('fadeOut');
        } else {
            this.removeClass ('fadeOut');
        }
    }.observes ('addVita').on ('change'),
    
    saving: function (model) {
        if (model.get ('saving')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('saving').on ('change'),
    
    disableSaveNewVita: function (model) {
        if (model.get ('saving')) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }.observes ('saving').on ('change'),
    
    disableSaveVita: function (model) {
        if (model.get ('saving')) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }.observes ('saving').on ('change')
});