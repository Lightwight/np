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

np.module ('observable', (function () {
    var observables, contexts, system;
    
    observables     = { actionEvents: {}, viewEvents: {}, pluginEvents: {}};
    contexts        = {};
    system          = { 
        window: {
            size:   new Array (),
            resize: new Array ()
        },
        
        orientation: {
            change: new Array ()
        },
        
        route: {
            change: new Array (),
            before: new Array (),
            after:  new Array ()
        }
    };
    
    function warn (type, data) {
        var errStack, i, affix;
        
        errStack    = true;
        affix       = '';
        
        np.warn ('===========================================================');
        np.warn ('Type: '+type);
        np.warn (' ');
        
        switch (type) {
            case 'invalid_arguments':
                np.warn ('np.observable.subscribeActionEvent:');
                np.warn ('Invalid arguments. Please ensure that you pass the correct arguments.');
                np.warn (' ');
                np.warn ('I need:');
                np.warn ('[object] context ');
                np.warn ('[string] contextName');
                np.warn ('[number] contextID');
                np.warn ('[number] nodeID ');
                np.warn (' ');
                np.warn ('You passed:');
                np.warn ('['+typeof data[0]+'] context: ');
                np.warn (data[0]);
                np.warn (' ');
                np.warn ('['+typeof data[2]+'] contextName: ' + data[2]);
                np.warn ('['+typeof data[3]+'] contextID: ' + data[3]);
                np.warn ('['+typeof data[1]+'] nodeID: ' + data[1]);
                
                i   = $('[data-node="'+data[1]+'"]');
                
                if (i.length > 0) {
                    np.warn (' ');
                    np.warn ('Affected view:');
                    np.warn (i.parents('[data-type="view"]:first').data('handle'));
                    np.warn (i.parents('[data-type="view"]:first'));
                    np.warn (' ');
                    np.warn ('Affected node:');
                    np.warn (i);
                }
                
                break;
        }
        
        np.warn (' ');
        np.warn ('Type np.help.module(\'observable.subscribeActionEvent'+affix+'\') for more information.');
        
        if (errStack) {
            np.warn (' ');
            np.warn ('error stack:', true );
        }
    }    
    
    function registerContext (contextName, context) {
        if (typeof contexts[contextName] === 'undefined') {
            contexts[contextName]   = {};
        }
        
        contexts[contextName][context[contextName].id]  = context[contextName];
    }
    
    function getModelByContext (contextName) {
        return typeof contexts[contextName] !== 'undefined' ? np.jsonClone (contexts[contextName]) : false;
    }
    
    function getContext (contextName, contextID, column) {
        var splitted, context, result,
            i, l;
        
        context = typeof contexts[contextName] !== 'undefined' && contexts[contextName][contextID] ? np.jsonClone (contexts[contextName][contextID]) : null;
        result  = null;
        
        if (context !== null) {
            if (typeof column !== 'undefined') {
                if (column.indexOf ('.') > -1) {
                    splitted    = column.split ('.');
                    l           = splitted.length;

                    for (i=0; i<l; i++) {
                        if (typeof context[splitted[i]] !== 'undefined') {
                            result  = np.jsonClone (context[splitted[i]]);
                            context = context[splitted[i]];
                        }
                    }
                    
                    return result;
                } else {
                    return typeof contexts[contextName] !== 'undefined' && typeof contexts[contextName][contextID] !== 'undefined' && typeof contexts[contextName][contextID][column] !== 'undefined' ? contexts[contextName][contextID][column] : null;
                }
            } else {
                return typeof contexts[contextName] !== 'undefined' && typeof contexts[contextName][contextID] !== 'undefined' ? contexts[contextName][contextID] : null;            
            }
        } else {
            return typeof contexts[contextName] !== 'undefined' ? contexts[contextName] : null;
        }

        return result;
    }
    
    function setContext (contextName, contextID, column, value) {
        var context, splitted, manip,
            i, l;
        
        context = typeof contexts[contextName] !== 'undefined' && typeof contexts[contextName][contextID] !== 'undefined' ? contexts[contextName][contextID] : null;
        
        if (context) {
            manip   = context;

            if (column.indexOf ('.') > -1) {
                splitted    = column.split ('.');
                l           = splitted.length;
                
                for (i=0; i<l; i++) {
                    if (i<l-1) {
                        if (typeof manip[splitted[i]] !== 'undefined') {
                            manip = manip[splitted[i]];
                        } else {
                            break;
                        }
                    } else {
                        manip[splitted[i]]   = value;
                    }
                }                
            } else {
                context[column]  = value;
            }
        } else if (!contextID && typeof contexts[contextName] !== 'undefined') {
            contexts[contextName]    = column;
        }
    }
    
    function publishPluginEvent (contextName, contextID, column, value) {
        var i, l, node, plugin, lPlugin, binding;

        if (typeof observables.pluginEvents[contextName] !== 'undefined'
            && typeof observables.pluginEvents[contextName][contextID] !== 'undefined') {
            l   = observables.pluginEvents[contextName][contextID].length;

            for (i=0; i<l; i++) {
                node    = $('[data-node="'+observables.pluginEvents[contextName][contextID][i]+'"]');
                binding = node.data ('bind');
                
                if (binding === column) {
                    plugin  = node.data ('handle');
                    lPlugin = plugin.slice (0, 1).toLowerCase () + plugin.slice (1);

                    if (typeof np[lPlugin] !== 'undefined' && typeof np[lPlugin].events !== 'undefined' && typeof np[lPlugin].events['set'+plugin] === 'function') {
                        np[lPlugin].events['set'+plugin] (node, value);
                    }
                }
            }
        }
    }
    
    function publishActionEvent (contextName, contextID, column, value) {
        var i, l, node, binding, notify;
        
        if (typeof observables.actionEvents[contextName] !== 'undefined'
            && typeof observables.actionEvents[contextName][contextID] !== 'undefined'
        ) {
            l    = observables.actionEvents[contextName][contextID].length;

            for (i=0; i<l; i++) {
                node        = $('[data-node="'+observables.actionEvents[contextName][contextID][i]+'"]');
                
                if (node.length > 0) {
                    notify      = node.data ('notify');
                    binding     = node.data ('bind');
                    
                    if (notify === true && binding==='v'+column) {
                        if (node[0].nodeName.toLowerCase () === 'input' || node[0].nodeName.toLowerCase () === 'textarea') {
                            if (node.val () !== value) {
                                node.val (value);
                            }
                        } else {
                            if (node.html () !== value) {
                                node.html (value);
                            }
                        }
                    }
                }
            }
        }
    }
    
    function publishViewEvent (contextName, contextID, column, action, options) {
        var viewEvents, observe, on, val, nodeID, node,
            i, l;

        viewEvents  = typeof observables.viewEvents[contextName] !== 'undefined' && typeof observables.viewEvents[contextName][contextID] !== 'undefined' ? observables.viewEvents[contextName][contextID] : false;

        if (viewEvents) {
            l   = viewEvents.length;
            
            for (i=0; i<l; i++) {
                observe = viewEvents[i].observe;
                on      = viewEvents[i].on;
                
                if ((observe === '@each' || observe===column) && on===action) {
                    nodeID  = viewEvents[i].nodeID;
                    node    = $('[data-node="'+nodeID+'"]');
                    
                    if (node.length > 0) {
                        val     = viewEvents[i].subscriber.call (node, createModel (contextName, contextID, false), {name: column, event: on}, options);
                        
                        if (typeof val !== 'undefined') {
                            if (node[0].nodeName.toLowerCase () === 'input' || node[0].nodeName.toLowerCase () === 'textarea') {
                                node.val (val);
                            } else {
                                node.html (val);
                            }
                        }
                    }
                }
            }
        } else if (typeof observables.viewEvents[contextName] !== 'undefined' 
                   && typeof observables.viewEvents[contextName]['undefined'] !== 'undefined' 
                   && $.isArray (observables.viewEvents[contextName]['undefined'])
        ){
            viewEvents  = observables.viewEvents[contextName]['undefined'];
            l           = viewEvents.length;
            
            for (i=0; i<1; i++) {
                observe = viewEvents[i].observe;
                on      = viewEvents[i].on;
                
                if ((observe === '@each' || observe === 'context' || observe===column) && on===action) {
                    nodeID  = viewEvents[i].nodeID;
                    node    = $('[data-node="'+nodeID+'"]');
                    
                    if (node.length > 0) {
                        viewEvents[i].subscriber.call (node, createModel (contextName, false, false), {name: column, event: on});
                    }
                }
            }            
        }
    }
    
    function createModel (contextName, contextID, setter) {
        setter      = typeof setter === 'boolean' ? setter : true;
        
        if (setter) {
            return {
                get:    function (column) {
                    return getContext (contextName, contextID, column);
                },

                set:    function (column, value) {
                    if (typeof column === 'string') {
                        setContext (contextName, contextID, column, value);

                        publishActionEvent (contextName, contextID, column, value);
                        publishPluginEvent (contextName, contextID, column, value);
                        publishViewEvent (contextName, contextID, column, 'change', value);
                    } else {
                        setContext (contextName, false, column);
                        
                        publishViewEvent (contextName, false, column, 'change', value);
                    }
                },

                getAll: function () {
                    return getContext (contextName, contextID);
                }
            };
        } else {
            return {
                get:    function (column) {
                    return getContext (contextName, contextID, column);
                },
                
                getAll: function () {
                    return np.jsonClone (getContext (contextName, contextID));
                }
            };
        }
    }
    
    function subscribePluginEvent (options) {
        var nodeID, context, contextID, contextName;
        
        nodeID      = typeof options.nodeID === 'number' ? options.nodeID : false;
        context     = typeof options.context !== 'undefined' ? options.context : false;
        contextName = context ? np.model.getNameOf (context) : false;
        contextID   = context ? context[contextName].id : false;
        
        if (nodeID && context && contextName && contextID) {
            registerContext (contextName, context);
            
            if (typeof observables.pluginEvents[contextName] === 'undefined') {
                observables.pluginEvents[contextName] = {};
            }
            
            if (typeof observables.pluginEvents[contextName][contextID] === 'undefined') {
                observables.pluginEvents[contextName][contextID] = new Array ();
            }

            observables.pluginEvents[contextName][contextID].push (nodeID);
            
            return new createModel (contextName, contextID); 
        }
    }
    
    function subscribeActionEvent (options) {
        var context, contextID, contextName, nodeID;

        context     = typeof options.context !== 'undefined' ? options.context : false;
        nodeID      = typeof options.nodeID === 'number' ? options.nodeID : false;
        contextName = context ? np.model.getNameOf (context) : false;
        contextID   = context ? context[contextName].id : false;
        
        if (context && contextName && contextID && nodeID !== false) {
            if (typeof observables.actionEvents[contextName] === 'undefined') {
                observables.actionEvents[contextName] = {};
            }
            
            if (typeof observables.actionEvents[contextName][contextID] === 'undefined') {
                observables.actionEvents[contextName][contextID] = new Array ();
            }

            observables.actionEvents[contextName][contextID].push (nodeID);
            
            registerContext (contextName, context);
            
            return new createModel (contextName, contextID); 
        } else {
            warn ('invalid_arguments', new Array (context, nodeID, contextName, contextID));
        }
    }
    
    function subscribeViewEvent (options) {
        var context, contextName, contextID, nodeID,
            wParts, wObserve,
            subscriber, observe, on, init,
            node, val;

        context     = typeof options.context !== 'undefined' ? options.context : false;
        contextName = typeof options.contextName !== 'undefined' ? options.contextName : false;

        contextID   = context && typeof context[contextName] !== 'undefined' ? context[contextName].id : false;
        nodeID      = typeof options.nodeID === 'number' ? options.nodeID : false;
        subscriber  = typeof options.subscriber === 'function' ? options.subscriber : false;
        observe     = typeof options.observe === 'string' ? options.observe : false;
        on          = typeof options.on === 'string' ? options.on : false;
        init        = typeof options.init === 'boolean' ? options.init : false;

        if (context && contextName && nodeID !== false && subscriber && observe && on) {
            if (typeof observables.viewEvents[contextName] === 'undefined') {
                observables.viewEvents[contextName] = {};
            }

            if (typeof observables.viewEvents[contextName][contextID] === 'undefined') {
                observables.viewEvents[contextName][contextID] = new Array ();
            }

            registerContext (contextName, context);

            observables.viewEvents[contextName][contextID].push ({nodeID: nodeID, subscriber: subscriber, observe: observe, on: on});
        }    

        // Add system events for views:
        // 1) window events (i.e. resize)
        // 2) orientationchange event (for mobile devices)
        // 3) route changed
        if (observe && (observe.indexOf ('window.') > -1 || observe.indexOf ('orientation.') > -1 || observe.indexOf ('route.') > -1)) {
            wParts      = observe.split ('.');
            wObserve    = wParts[1];

            if (typeof system[wParts[0]] !== 'undefined' && system[wParts[0]][wObserve] !== 'undefined') {
                system[wParts[0]][wObserve].push (new Array (contextName, contextID));
            }
        }
        
        if ((init || (observe !== false && observe.indexOf ('window.') > -1)) && context && nodeID && subscriber) { 
            node    = $('[data-node="'+nodeID+'"]');
            val     = subscriber.call (node, createModel (contextName, contextID, false), {name: observe, event: on});

            if ((observe === false || observe.indexOf ('window.') === -1) && typeof val !== 'undefined') {
                if (node[0].nodeName.toLowerCase () === 'input') {
                    node.val (val);
                } else {
                    node.html (val);
                }
            }                
        }
    }
    
    function gcActionObservables () {
        var cpObservables, events, event, hasEvents, affected, nodeIDS, nodes,
            i, j, l, k, m, n, p, q, r;

        events          = observables.actionEvents;
        cpObservables   = {};

        for (i in events) {
            affected    = events[i];
            l           = affected.length;

            if (typeof cpObservables[i] === 'undefined') {
                cpObservables[i] = {};
            }
            
            for (j in affected) {
                nodeIDS = affected[j];
                n       = nodeIDS.length;
                
                for (m=0; m<n; m++) {
                    if ($('[data-node="'+affected[j][m]+'"]').length > 0) {
                        if (typeof cpObservables[i][j] === 'undefined') {
                            cpObservables[i][j] = new Array ();
                        }
                        
                        cpObservables[i][j].push (affected[j][m]);
                    }                     
                }
            }
        }

        observables.actionEvents    = events = cpObservables;
        
        for (k in events) {
            hasEvents   = false;
            event       = events[k];
            
            for (p in event) {
                if (!hasEvents) { hasEvents = true; }
                
                nodes   = event[p];
                r       = nodes.length;
                
                if (r === 0) { delete events[k]; }
            }
            
            if (!hasEvents) { delete events[k]; }
        }        
    }
    
    function gcViewObservables () {
        var cpObservables, events, event, eventIDS, hasEvents, affected, nodeID, nodes,            
            i, j, l, k, m, n, p, q, r;
        
        events          = observables.viewEvents;
        cpObservables   = {};
        
        for (i in events) {
            affected    = events[i];

            if (typeof cpObservables[i] === 'undefined') {
                cpObservables[i] = {};
            }
            
            for (j in affected) {
                eventIDS    = affected[j];
                n           = eventIDS.length;
                
                for (m=0; m<n; m++) {
                    nodeID = eventIDS[m].nodeID;
                    
                    if ($('[data-node="'+nodeID+'"]').length > 0) {
                        if (typeof cpObservables[i][j] === 'undefined') {
                            cpObservables[i][j] = new Array ();
                        }
                        
                        cpObservables[i][j].push (affected[j][m]);
                    }                          
                }
            }
        }
        
        observables.viewEvents  = events = cpObservables;

        for (k in events) {
            hasEvents   = false;
            event       = events[k];
            
            for (p in event) {
                if (!hasEvents) { hasEvents = true; }
                
                nodes   = event[p];
                r       = nodes.length;
                
                if (r === 0) { delete events[k]; }
            }
                                        
            if (!hasEvents) { delete events[k]; }
        }                
    }
    
    function gcContexts () {
        var actionEvents, viewEvents, cpContexts,
            i;
        
        actionEvents    = observables.actionEvents;
        viewEvents      = observables.viewEvents;
        cpContexts      = {};
        
        for (i in contexts) {
            if ((typeof actionEvents[i] !== 'undefined' || typeof viewEvents[i] !== 'undefined')
                && typeof cpContexts[i] === 'undefined'
            ) {
                cpContexts[i]   = np.jsonClone (contexts[i]);
            }
        }
        
        contexts    = cpContexts;
    }
    
    return {
        subscribe: function (topic, options) {
            if (topic==='actionEvent') {
                return subscribeActionEvent (options);
            } else if (topic==='viewEvent') {
                return subscribeViewEvent (options);
            } else if (topic==='pluginEvent') {
                return subscribePluginEvent (options);
            }
        },
        
        listContextDetails: function (contextName) {
            var _ctx, _ctxProps, 
                i, j;
            
            if (typeof contexts[contextName] !== 'undefined') {
                np.warn (' ');
                np.warn ('Context "'+contextName+'" data:');
                np.warn ('===============================');
                
                _ctx    = contexts[contextName];
                
                for (i in _ctx) {
                    np.warn ('Data of dataset ID: ' + i);
                    np.warn ('-------------------------------');
                    
                    _ctxProps   = _ctx[i];
                    
                    for (j in _ctxProps) {
                        np.warn ('Property: ' + j);
                        np.warn ('Value:');
                        np.warn (_ctxProps[j]);
                        np.warn (' ');
                    }
                    
                    break;
                }
            }
        },
        
        listContextViewEvents: function (contextName) {
            var _ob, _obCtx, _node,
                i, j;

            if (typeof observables.viewEvents[contextName] !== 'undefined') {
                _ob = observables.viewEvents[contextName];

                np.warn (' ');
                np.warn ('Nodes of context "'+contextName+'":');
                np.warn ('===============================');
                
                for (i in _ob) {
                    _obCtx  = _ob[i];
                    
                    for (j in _obCtx) {
                        if (typeof _obCtx[j].nodeID !== 'undefined') {
                            _node   = $('[data-node="'+_obCtx[j].nodeID+'"]');

                            if (_node.data ('type') === 'view') {
                                np.warn ('Type: View - '+_node.data ('handle'));
                                np.warn ('Node: ');
                                np.warn (_node);
                                np.warn ('Observer Method: '+_obCtx[j].observe);
                                np.warn ('Observer Trigger: '+_obCtx[j].on);
                                np.warn (' ');
                                np.warn ('  ');
                            } else {
                                np.warn ('Type: ViewNode');
                                np.warn ('View: '+_node.parents ('[data-type="view"]:first').data ('handle'));
                                np.warn (_node.parents ('[data-type="view"]:first'));
                                np.warn ('Node: ');
                                np.warn (_node);
                                np.warn ('Observer Method: '+_obCtx[j].observe);
                                np.warn ('Observer Trigger: '+_obCtx[j].on);
                                np.warn (' ');
                                np.warn ('  ');
                            }
                        }
                    }
                }
            }
        },
        
        removeContext: function (contextName, contextID) {
            if (typeof contexts[contextName] !== 'undefined' && typeof contexts[contextName][contextID] !== 'undefined') {
                delete contexts[contextName][contextID];
                
                gcActionObservables ();
                gcViewObservables ();
                
                return true;
            }
            
            return false;
        },
        
        update: function (contextName, contextIDorObject, column, value) {
            var model, _ctxID, _ctxCol;
            
            if (typeof contextIDorObject === 'number') {
                model   = createModel (contextName, contextIDorObject, true);

                model.set (column, value);
            } else if (typeof contextIDorObject === 'object' && typeof contextIDorObject.id === 'number') {
                _ctxID  = contextIDorObject.id;
                model   = createModel (contextName, _ctxID, true);

                for (_ctxCol in contextIDorObject) {
                    if (_ctxCol.toLowerCase () !== 'id') {
                        model.set (_ctxCol, contextIDorObject[_ctxCol]);
                    }
                }
            } else if (typeof contextIDorObject === 'object' && $.isArray (contextIDorObject)) {
                model   = createModel (contextName, false, true);
                
                model.set (contextIDorObject);
            }
        },
        
        affectedViews: function (filterView, contextName, contextID) {
            var nodes, selectors, aData, view,
                i, l;

            nodes       = new Array ();
            selectors   = $();
            filterView  = typeof filterView === 'string' ? filterView : false;

            if (typeof observables.actionEvents[contextName] !== 'undefined'
                && typeof observables.actionEvents[contextName][contextID] !== 'undefined'
            ) {
                aData   = observables.actionEvents[contextName][contextID];
                l       = aData.length;
                
                for (i=0; i<l; i++) {
                    view    = filterView ? $('[data-node="'+aData[i]+'"]').parents('[data-type="view"][data-handle="'+filterView+'"]:first') : $('[data-node="'+aData[i]+'"]').parents('[data-type="view"]:first');
                    
                    if (view.length > 0) {
                        view.each (function () {
                            var nodeID  = parseInt ($(this).data('node'), 10);
                            
                            if (nodes.indexOf (nodeID) === -1) {
                                nodes.push (nodeID);
                            }
                        });
                    }
                }
            }
            
            return nodes;
        },
        
        createModel: function (contextName, contextID) {
            return new createModel (contextName, contextID);
        },
        
        getModelByContext: function (contextName) {
            return getModelByContext (contextName);
        },
        
        getObservables: function () {
            return observables;
        },
        
        getContexts: function () {
            return contexts;
        },
        
        gc: function () {
            gcActionObservables ();
            gcViewObservables ();
            gcContexts ();
        },
        
        triggerSystemEvent: function (e, val) {
            var sParts, sys, ctxName, ctxID, model, triggered,
                i, l;
            
            sParts      = e.split ('.');
            triggered   = {};
            
            if (typeof system[sParts[0]] !== 'undefined' && typeof system[sParts[0]][sParts[1]] !== 'undefined') {
                sys     = system[sParts[0]][sParts[1]];
                l       = sys.length;

                for (i=0; i<l; i++) {
                    ctxName             = sys[i][0];
                    ctxID               = sys[i][1];
                    
                    if (typeof triggered[ctxName] === 'undefined')  { triggered[ctxName] = {};  }
                    
                    if (typeof contexts[ctxName] !== 'undefined' 
                        && typeof contexts[ctxName][ctxID] !== 'undefined'
                        && typeof triggered[ctxName][ctxID] === 'undefined'
                    ) {
                        triggered[ctxName][ctxID]   = true;
                        model                       = createModel (ctxName, ctxID);

                        model.set (e, val);
                    }
                }
            }
        },
        
        test: function () {
            console.log (observables);
            console.log (contexts);
            console.log (system);
        }
    };
}()));