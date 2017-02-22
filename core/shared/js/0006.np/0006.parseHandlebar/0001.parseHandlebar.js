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

np.module ('parseHandlebar', function (template, models) {
    var compiled, html, invoked,
        rxView, rxChildView, rxMatch, matches, mLen,
        viewName, viewTemplate, lTemplate, rTemplate, childView,
        i;
    
    rxView      = /\{\{\#view\s+(\"|\'){1}(\S*)\1.*\}\}/g;
    rxChildView = /\{\{\{childView\s+(\"|\'){1}(.*)\1\}\}\}/g;
    matches     = new Array ();

    while (rxMatch = rxView.exec (template) ) { matches.push (rxMatch); }
    
    matches         = matches.reverse ();
    mLen            = matches.length;

    viewTemplate    = template;
    childView       = {};

    function invokeChildView (html) {
        var match, invoked;
        
        invoked = html;
        match   = rxChildView.exec (invoked);
        
        if (match) {
            invoked = invoked.replace (match[0], childView[match[2]]);
            invoked = invokeChildView (invoked);
        }
        
        return invoked;
    }

    for (i=0; i<mLen; i++) {
        viewName            = matches[i][2];
        
        html                = viewTemplate.slice (viewTemplate.lastIndexOf (matches[i][0]));
        html                = html.slice (0, html.indexOf ('{{/view}}')+9);

        childView[viewName] = html;
        lTemplate           = viewTemplate.slice (0, viewTemplate.lastIndexOf (html));
        rTemplate           = viewTemplate.slice (viewTemplate.lastIndexOf (html)+html.length);
        viewTemplate        = lTemplate + '{{{childView "'+matches[i][2]+'"}}}' + rTemplate;
        
        invoked             = invokeChildView (html);

        np.handlebars.setTemplate (viewName, invoked);
    }

    compiled    = Handlebars.compile (template);
    html        = compiled (models);

    return html;
});