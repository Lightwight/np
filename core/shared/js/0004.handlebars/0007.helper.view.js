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

Handlebars.registerHelper ('view', function (viewName, options) {
    var controller, view, plugin, html,
        model, modelController, modelData, tmpData, modelExtended, 
        groupBy, grouped, doPush,
        orderBy, 
        mLen, 
        modelName, nodeID, data,
        attrs,
        i, j, l;

    function warn (type, data)  {
        var affix;
        
        affix   = '';
        
        np.warn ('===========================================================');
        np.warn ('Type: '+type);
        np.warn (' ');
        
        switch (type) {
            case 'plugin_not_found':
                np.warn ('np.helper.view:');
                np.warn ('The given view should be rendered into a not existing plugin container.');
                np.warn (' ');
                np.warn ('View name:');
                np.warn (data.view);
                np.warn (' ');
                np.warn ('Plugin name:');
                np.warn (data.plugin);
                np.warn (' ');
                np.warn ('Ensure that you inserted the plugin into a template.');
                break;
        }
        
        np.warn (' ');
        np.warn ('Type np.help.view (\'helper.view\') for more information.');
    }
    
    data        = {};

    controller      = np.controller.getByView (viewName);
    view            = np.view.get (viewName);
    nodeID          = np.handlebars.getNodeID ();

    plugin          = options.hash && options.hash['data-plugin'] ? options.hash['data-plugin'] : false;
    
    modelController = new Array ();
    grouped         = new Array ();
    model           = {};

    if (controller) { 
        modelController     = controller.model.call (this);
        groupBy             = typeof controller.groupBy === 'string' ? controller.groupBy : false;
        orderBy             = typeof controller.orderBy === 'string' ? controller.orderBy : false;
        modelName           = (function () { var t; for (t in modelController) { return t; } }());
        
        if (modelController !== null) {
            modelData           = modelController[modelName];
            mLen                = $.isArray (modelData) ? modelData.length : 0;        
            
            if ($.isArray (modelData)) {
                /*
                 * Extend model with model attributes defined in extended model
                 *             
                 */
                for (i=0; i<mLen; i++) {
                    modelExtended   = np.model.get (modelName);
                    doPush          = true;

                    if (typeof model[modelName] === 'undefined') { model[modelName] = new Array (); }

                    if (groupBy) {
                        if (grouped.hasItem (modelData[i][groupBy]) === false ) {
                            grouped.push (modelData[i][groupBy]);
                        } else {
                            doPush  = false;
                        }
                    }

                    if (doPush) {
                        if (modelExtended) {
                            for (j in modelExtended) {
                                modelData[i][j]  = typeof modelExtended[j] === 'function' ? modelExtended[j].call (modelData[i]) : modelExtended[j];
                            }
                        }

                        model[modelName].push (modelData[i]);
                    }
                }

                if (orderBy && (function () {for (i in model){return true;} return false;}())) { model = modelOrder (model, orderBy); }
            } else if (modelData){
                modelExtended   = np.model.get (modelName);
                tmpData         = typeof modelData[modelName] === 'object' ? modelData[modelName] : false;

                if (tmpData) { modelData = tmpData; }

                if (modelExtended) {
                    for (j in modelExtended) {
                        modelData[j]  = typeof modelExtended[j] === 'function' ? modelExtended[j].call (modelData) : modelExtended[j];
                    }
                }

                model[modelName]   = modelData;
            }
        } else {
            model   = this;
        }
    }

    function modelOrder (model, orderByOpts) {
        var ordered, orderByValues, sortOrder, specialChars, i;
        
        specialChars    = {  
            'c0': 'A', 'c1': 'A', 'c2': 'A', 'c3': 'A', 'c4': 'A', 'c5': 'A', 'c6': 'A',
            'c7': 'C',
            'c8': 'E', 'c9': 'E', 'ca': 'E', 'cb': 'E',
            'cd': 'I', 'cc': 'I', 'ce': 'I', 'cf': 'I',

            'd0': 'D',
            '152': 'O', 'd3': 'O', 'd2': 'O', 'd4': 'O', 'd5': 'O', 'd6': 'O',
            'da': 'U', 'd9': 'U', 'db': 'U', 'dc': 'U',
            'df': 'S',

            'e0': 'a', 'e1': 'a', 'e2': 'a', 'e3': 'a', 'e4': 'a', 'e6': 'a',
            'e7': 'c',
            'e8': 'e', 'e9': 'e', 'ea': 'e', 'eb': 'e',
            'ec': 'i', 'ed': 'i', '130': 'i', 'ee': 'i', 'ef': 'i',

            '153': 'o', 'f3': 'o', 'f2': 'o', 'f4': 'o', 'f5': 'o', 'f6': 'o',
            'fa': 'u', 'f9': 'u', 'fb': 'u', 'fc': 'u',

            'f0': 'd'
        };        
        
        orderByValues   = orderByOpts.toLowerCase ().split (' ');
        orderBy         = orderByValues[0];
        sortOrder       = typeof orderByValues[1] === 'string' && orderByValues[1] === 'desc' ? 1 : 0;

        ordered = {};
        
        function convertSpecialChars (word) {
            var retVal, code, t, l;

            l       = word.length;
            retVal  = '';
            code    = '';

            for (t=0; t<l; t++) {
                retVal += typeof specialChars[word.charCodeAt (t).toString (16)] !== 'undefined' ? specialChars[word.charCodeAt (t).toString (16)] : word.charAt (t);
            }

            return retVal;            
        }

        model[modelName] = model[modelName].sort (function (a, b) {
            var sRet, aTmp, bTmp, aCmp, bCmp;
            
            if (typeof a[orderBy] !== 'undefined' && typeof b[orderBy] !== 'undefined' ) {
                sRet    = sortOrder === 0 ? 1 : -1;
                aTmp    = np.jsonClone (a);
                bTmp    = np.jsonClone (b);

                aCmp    = aTmp[orderBy];
                bCmp    = bTmp[orderBy];

                if (typeof a[orderBy] === 'string') {
                    aCmp    = convertSpecialChars (aCmp).toLowerCase ().replace (/[\W_]+/gim, '');
                    bCmp    = convertSpecialChars (bCmp).toLowerCase ().replace (/[\W_]+/gim, '');
                }
                
                return aCmp < bCmp ? sRet * -1 : sRet * 1;
            } else {
                return model[modelName];
            }
        });
        
        return model;
    }
    
    function registerContext (options) {
        var nodeID, context, handle;
        
        nodeID  = typeof options.nodeID !== 'undefined' ? options.nodeID : false;
        context = typeof options.context !== 'undefined' ? options.context : false;
        
        if (nodeID !== false) {
            handle  = $('[data-node="'+nodeID+'"]').data('handle');
            
            np.view.registerContextOfView (nodeID, context, handle);
        }
    }
    
    function registerViewEvents (options) {
        var view, node, childNodes, fncView, observes, context, ctxName;
        
        view    = options.view;
        node    = $('[data-node="'+options.nodeID+'"]');
        
        context = options.context;
        ctxName = options.modelName;
        
        for (i in view) {
            if (i !== 'didInsert') {
                childNodes  = node.find ('[data-method="'+i+'"]');
               
                if (childNodes.length === 0) {
                    fncView     = view[i];

                    if (typeof fncView.observe !== 'undefined') {
                        observes    = fncView.observe;

                        for (j in observes) {
                            np.observable.subscribe ('viewEvent', {context: context, contextName: ctxName, observe: j, on: observes[j], subscriber: fncView, nodeID: options.nodeID});
                        }
                    }
                }
            }
        }
    }
    
    function tick (options) {
        var selector, parents;

        selector    = $('[data-type="view"][data-node="'+options.nodeID+'"]');
        
        if (typeof options.ticked === 'undefined')  { options.ticked = 0;   }
        
        if (selector.length > 0) { 
            if (options.view && typeof options.view.didInsert === 'function') {
                options.view.didInsert.call (np.find (selector), options.context[options.modelName]); 
            }
            
            if (typeof options.context[options.modelName] !== 'undefined' && !$.isArray (options.context[options.modelName]) && typeof options.context[options.modelName].id !== 'undefined') {
                registerContext (options);
                
                if (options.view) { registerViewEvents (options);   }
            } else if (typeof options.context[options.modelName] !== 'undefined' && $.isArray (options.context[options.modelName])) {
                registerContext (options, true);
                
                if (options.view) { registerViewEvents (options);   }
//                if (options.view) { registerSystemEvents (options);  }
            }
        } else {
            if (options.ticked !== -1)  { options.ticked++; }

            if (options.ticked > 500) {
                options.ticked  = -1;
                // If handlebars needs more than 500 ticks (100 ticks ~ 1 sec)
                // then inform the developer. Now we have an infinite loop.
                parents = $('[data-handle="'+viewName+'"]').parents ('[data-type="view"]');

                if (parents.length > 0) {
                    np.warn('WARNING: CANCELED CONTEXT REGISTRATION OF VIEW AFTER 10 SECONDS:');
                    np.warn('=======================================');
                    np.warn('Affected view: '+viewName);
                    np.warn('Affected context: ');
                    np.warn(options.context);
                    np.warn(' ');
                    np.warn('This error may occur if you tried to rerender a view inside a parent view.');
                    np.warn(' ');
                    np.warn('Given example call in a controller event:');
                    np.warn(' ');
                    np.warn('exampleEvent: function () {');
                    np.warn('    np.view.rerender ("A");');
                    np.warn('    np.view.rerender ("B");');
                    np.warn('}');
                    np.warn(' ');
                    np.warn('NOTE: In this example the "A"-View is a child view of the "B"-View.');
                    np.warn('So what happens next ?');
                    np.warn(' ');
                    np.warn('1. First the "A"-View is starting to rerender.');
                    np.warn('2. Then the "B"-View is starting to rerender.');
                    np.warn('3. The "B"-View also is rerendering the "A"-View');
                    np.warn('4. The render-process of the "A"-View in step (1) cannot complete');
                    np.warn('   because the render-process of the "B"-View already replaced its child views');
                    np.warn('   automaitcally.');
                    np.warn('   If this happens the "A"-View rendering in step (1) looses its DOM-Object.');
                    np.warn(' ');
                    np.warn('Solution: It is not allowed to render a child view in a parent view and then rerender the parent view.');
                    np.warn('Check your controllers for code like the upper example.');
                    np.warn(' ');
                    np.warn('Here is a list of the given parent views which could cause the problem:.');
                    np.warn(' ');

                    $('[data-handle="'+viewName+'"]').parents ('[data-type="view"]').each (function () {
                        np.warn ($(this));
                    });
                }
            }
            
            np.tick (tick, options);
        }
    }
    
    l   = 0;
    
    for (i in model[modelName]) { l++; }
    
    if (typeof options.hash !== 'undefined') {
        attrs   = '';
        
        for (j in options.hash) {
            if (j !== 'data-node' && j !== 'data-handle' && j !== 'data-type')
            attrs  += ' '+j+'="'+options.hash[j]+'"';
        }
    }
    
    function tickPlugin (options) {
        var selector, plugin, lPlugin, html, classNames;
        
        if (typeof options.tick === 'undefined') {
            options.tick = -1;
        }
        
        options.tick++;
        
        plugin      = options.plugin;
        selector    = $('[data-type="plugin"][data-handle="'+plugin+'"]');
        
        if (selector.length > 0) { 
            html        = options.html;
            classNames  = selector.attr ('class');
            lPlugin     = (plugin.slice (0, 1).toLowerCase ()+plugin.slice (1));
            
            if (!$(selector).hasClass ('plugin-'+lPlugin)) {
                if (classNames) {
                    classNames += ' plugin-'+lPlugin;
                } else {
                    classNames  = 'plugin-'+lPlugin;
                }
            }
            
            $(selector).attr ('class', classNames);
            $(selector).html (html);
            
            if (options.viewData) { np.tick(tick, options.viewData);    }
        } else {
            if (options.tick < 1000) {
                np.tick (tickPlugin, options);
            } else {
                warn ('plugin_not_found', {view: viewName, plugin: plugin});
            }
        }
    }
    
    html    = '<div data-node="'+nodeID+'" data-type="view" data-handle="'+viewName+'"'+attrs+'>'+((l > 0) ? options.fn (model) : options.fn ())+'</div>';

    if (plugin) {
        np.tick (tickPlugin, {plugin: plugin, html: html, viewData: (view ? {nodeID: nodeID, view: view, modelName: modelName, context: model} : false)});
        
        return '';
    } else {
        np.tick (tick, {nodeID: nodeID, view: view, modelName: modelName, context: model});
        
        return html;
    }
});