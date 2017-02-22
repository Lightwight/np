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

Handlebars.registerHelper ('plugin', function (pluginName, options) {
    var lName, hName, nodeID, html, events, context, _hash, _binding, _value;

    context     = this !== window ? this : false;
    
    html        = '';
    
    lName       = pluginName.slice (0, 1).toLowerCase ()+pluginName.slice (1);
    hName       = pluginName.slice (0, 1).toUpperCase ()+pluginName.slice (1);

    _hash       = typeof options.hash !== 'undefined' ? options.hash : false;
    _binding    = _hash && typeof _hash.bindAttr !== 'undefined' ? _hash.bindAttr : false;

    _value      = typeof options.hash !== 'undefined' && typeof options.hash.value !== 'undefined' ? options.hash.value : undefined;
    
    if (typeof np[lName] !== 'undefined' && typeof np[lName].html === 'function') {
        html    = np[lName].html ();
    }
    
    nodeID  = np.handlebars.getNodeID ();
    
    options.hash['data-type']   = 'plugin';
    options.hash['data-handle'] = hName;
    options.hash['data-node']   = nodeID;
    
    function getEvents (hash) {
        var retVal, i;
        
        retVal  = {};

        if (hash) {
            events      = new Array ('click', 'change');
        
            for (i in hash) {
                if (events.indexOf (i) > -1) {
                    retVal[i]  = hash[i];
                }
            }
        }
        
        return retVal;
    }
    
    function registerEvents (plugin, selector, events, subscriber) {
        var events, controller, evType, evName, controllerEvent, pluginManip,
            i;
        
        controller              = np.controller.getByParentView (selector);
        
        if (controller && typeof controller.events !== 'undefined') {
            for (i in events) {
                evType          = i;
                evName          = events[evType];
                controllerEvent = typeof controller.events[evName] === 'function' ? controller.events[evName] : false;
                
                if (controllerEvent) {
                    if (evType === 'change')    { evType = 'change keyup paste';    }

                    pluginManip = np.plugin.manip (plugin, selector);
                    
                    selector.on (evType, function () {
                        if ($(this).data('disabled') === false || typeof $(this).data('disabled') === 'undefined') {
                            controllerEvent.call (subscriber, pluginManip);
                        }
                    });
                }
            }
        }
    }
    
    function tick(options) {
        var selector, pluginSelector, plugin, subscriber;
        
        selector    = $('[data-node="'+options.nodeID+'"]');
        plugin      = options.plugin;
        
        if (selector.length > 0 && options.context) {
            if (typeof np[plugin] !== 'undefined' && typeof np[plugin].didInsert === 'function') {
                pluginSelector  = np[plugin].didInsert.call (selector, options.value);
                
                if (pluginSelector.length > 0) {
                    subscriber      = np.observable.subscribe ('pluginEvent', {context: options.context, nodeID: options.nodeID});

                    registerEvents (np[plugin], pluginSelector, options.events, subscriber);
                }
            }
        } else if (options.context){
            np.tick (tick, options);
        }
    }
    
    tick ({nodeID: nodeID, context: context, value: _value, events: getEvents (typeof options.hash !== 'undefined' ? options.hash : false), plugin: lName, hash: typeof options.hash !== 'undefined' ? options.hash : false});
    
    if (_binding) {
        return '<div data-node="'+nodeID+'" data-type="plugin" data-handle="'+hName+'" data-bind="'+_binding+'">'+html+'</div>';        
    } else {
        return '<div data-node="'+nodeID+'" data-type="plugin" data-handle="'+hName+'">'+html+'</div>';        
    }
});
