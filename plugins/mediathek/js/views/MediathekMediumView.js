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
    
np.view.extend ('MediathekMediumView', {
    setFilterFolder: function (model) {
        var src, show, folderID, 
            inFilter, filter, fSrc;
        
        src         = model.get ('src') + model.get ('id') + model.get ('name');
        folderID    = parseInt (model.get ('filter_folder'), 10);
        filter      = model.get ('media_filter');

        fSrc        = filter.src;
        
        show        = folderID === 0 || folderID === parseInt (model.get ('folder_id'), 10);
        inFilter    = src.indexOf (fSrc) > -1;
        show        = show && inFilter;
        
        if (show) {
            this.removeClass ('no-display');
        } else {
            this.addClass ('no-display');
        }
        
        if (inFilter) {
            src = src.replace (fSrc, '<b style="color:yellow;">'+fSrc+'</b>');
        }

        this.find ('.media-title').html (src);
    }
    .observes ('media_filter').on ('change')
    .observes ('filter_folder').on ('change'),
    
    setSrc: function (model) {
        var thumb, src;
        
        thumb   = model.get ('thumb_sm');
        src     = model.get ('src')+model.get ('id');
        
        if (src.length > 0 && thumb.length > 0) {
            this.css ('background-image', 'url('+src+thumb+')');
        } else {
            this.css ('background-image', '');
        }
    }.observes ('src').on ('change'),
    
    setYoutubeSrc: function (model) {
        var data, isVideo, src;

        src     = model.get ('src');
        
        if (src.length > 0) {
            this.append ('<iframe class="youtube-iframe-preview" type="text/html" width="200" height="200" src="https://www.youtube.com/embed/'+src+'?autoplay=0&origin=http://hunde.de" frameborder="0"/>');
        }
    }.observes ('src').on ('change'),
    
    removingItem: function (model) {
        if (model.get ('removing')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('removing').on ('change'),
    
    removed: function (model) {
        var title, message;
        
        if (model.get ('removeSuccess')) {
            this.css ('display', 'none');
        } else {
            title       = 'Entfernen fehlgeschlagen';

            message     = 'Das Medium konnten nicht entfernt werden.<br><br>';
            message    += 'Bitte wiederholen Sie den Vorgang.';
            message    += 'Sollte der Fehler erneut auftauchen, dann konaktieren Sie Ihren Serviceanbieter.';

            vex.dialog.open ({
                className:  'vex-theme-top',
                message:    '<h3>'+title+'</h3><br><span>'+message+'</span>'
            });               
        }
    }.observes ('removeSuccess').on ('change')
});
