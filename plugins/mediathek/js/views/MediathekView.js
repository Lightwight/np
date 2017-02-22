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

np.view.extend ('MediathekView', {
    didInsert: function () {
        $('#mediathek-folder-selection-upload').niceSelect ();
    },
    
    setFolderID: function (model) {
        var id;

        id  = parseInt (model.get ('folder_id'), 10);
        
        this.find ('option').each (function () {
            if (parseInt ($(this).val (), 10) === id) {
                $(this).prop ('selected', 'selected');
            } else {
                $(this).prop ('selected', '');
            }
        });        
    },
    
    hideMediathek: function (model) {
        var body;
        
        body    = $('body');
        
        if (!model.get ('isVisible')) {
            this.removeClass ('show');
            body.css ('overflow', 'auto');
        } else {
            this.addClass ('show');
            body.css ('overflow', 'hidden');
        }
    }.observes ('isVisible').on ('change'),
    
    showMediaActive: function (model) {
        var menu;
        
        menu    = model.get ('menu');
        
        if (menu === 'show') {
            this.addClass ('active');
        } else {
            this.removeClass ('active');
        }
        
    }.observes ('menu').on ('change'),
    
    addMediaActive: function (model) {
        var menu;
        
        menu    = model.get ('menu');

        if (menu === 'add') {
            this.addClass ('active');
        } else {
            this.removeClass ('active');
        }
        
    }.observes ('menu').on ('change'),
    
    showMediaEditContainer: function (model) {
        var menu;
        
        menu    = model.get ('menu');
        
        if (menu === 'editImage') {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('menu').on ('change'),
    
    showMediaContainer: function (model) {
        var menu;
        
        menu    = model.get ('menu');
        
        if (menu === 'show') {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('menu').on ('change'),
    
    showImageContainer: function (model) {
        var menu;
        
        menu    = model.get ('menu');
        
        if (menu === 'image') {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('menu').on ('change'),

    showVideoContainer: function (model) {
        var menu;
        
        menu    = model.get ('menu');
        
        if (menu === 'video') {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('menu').on ('change'),
    
    showFolderContainer: function (model) {
        var menu;
        
        menu    = model.get ('menu');
        
        if (menu === 'folder') {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('menu').on ('change'),
    
    showProgress: function (model) {
        if (model.get ('uploading')) {
            this.removeClass ('no-display');
        } else {
            this.addClass ('no-display');
        }
    }.observes ('uploading'). on ('change'),
    
    progressStatus: function (model) {
        this.css ('width', model.get ('progress')+'%');
    }.observes ('progress').on ('change'),
    
    uploading: function (model) {
        if (model.get ('uploading')) {
            this.removeClass ('no-display');
        }
    }.observes ('uploading').on ('change'),
    
    loadVideo: function (model) {
        var src;
        
        src = model.get ('videoSrc');

        if (src) {
            this.html ('<iframe class="youtube-iframe-preview" type="text/html" width="640" height="390" src="'+src+'" frameborder="0"/>');
        } else {
            this.html ('YouTube Video Vorschau');
        }
    }.observes ('videoSrc').on ('change'),
    
    savingYoutubeVideo: function (model) {
        if (model.get ('savingYoutubeVideo')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('savingYoutubeVideo').on ('change'),
    
    errorYoutubeVideo: function (model) {
        var title, message, buttons;
        
        if (model.get ('errorYoutubeVideo')) {
            title       = 'Ups!';

            message     = 'Das Video konnte nicht gespeichert werden.<br><br>';
            message    += 'Bitte überprüfen Sie Ihre Internetverbindung und wiedeholen Sie den Vorgang.<br><br>';
            message    += 'Sollte der Fehler erneut auftauchen, dann setzen Sie sich bitte mit Ihrem Systemadministrator in Verbindung.';

            vex.dialog.open ({
                className:  'vex-theme-top',
                message:    '<h3>'+title+'</h3><br><span>'+message+'</span>'
            });    
        }
    }.observes ('errorYoutubeVideo').on ('change'),
    
    showVideoApply: function (model) {
        if (!model.get ('errorYoutubeVideo') && !model.get ('cancelVideo')) {
            this.removeClass ('no-display');
        } else {
            this.addClass ('no-display');
        }
    }
    .observes ('errorYoutubeVideo').on ('change')
    .observes ('cancelVideo').on ('change'),

    showVideoCancel: function (model) {
        if (!model.get ('errorYoutubeVideo') && !model.get ('cancelVideo')) {
            this.removeClass ('no-display');
        } else {
            this.addClass ('no-display');
        }
    }
    .observes ('errorYoutubeVideo').on ('change')
    .observes ('cancelVideo').on ('change'),
    
    hideVideoSaveButton: function (model) {
        if (!model.get ('errorYoutubeVideo') && !model.get ('cancelVideo')) {
            this.addClass ('no-display');
        } else {
            this.removeClass ('no-display');
        }
    }
    .observes ('errorYoutubeVideo').on ('change')
    .observes ('cancelVideo').on ('change')
});