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

np.module ('handlebars', (function () {
    var storage;
    
    storage = {
        templates:  {},
        nodes:      new Array (),
        eventID:    -1,
        nodeID:     -1
    };
    
    // Prevent browser opening file on drop for file upload
    $(document).on ('dragenter', function (e) 
    {
        e.stopPropagation();
        e.preventDefault();
    });
    
    $(document).on ('dragover', function (e) 
    {
      e.stopPropagation();
      e.preventDefault();
    });
    
    $(document).on ('drop', function (e) 
    {
        e.stopPropagation();
        e.preventDefault();
    });
    
    function getHashes (options) {
        var hash, result, events, system,
            i, l;
        
        events      = new Array ('click', 'change', 'submit', 'enter', 'hover', 'onload',
                                 'pan', 'panStart', 'panEnd', 'panLeft', 'panRight', 'panUp', 'panDown', 
                                 'tap',
                                 'swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
                                 'startDrag', 'stopDrag', 'dragging', 'drop',
                                 'sort',
                                 'mwheelup', 'mwheeldown');

        system      = new Array ('notify', 'type', 'bindAttr', '$', 'init', 'recaptcha', 'gmaps');
        
        hash        = typeof options.hash !== 'undefined' ? options.hash : false;
        result      = {
            internals:  {
                events: {},
                system: {}
            },
            customs:    {}
        };
        
        function resolveSystemAttr (attr, value) {
            if (attr==='notify') {
                return typeof value === 'boolean' ? value : true;
            }  else {
                return value;
            }
        }
        
        if (hash) {
            for (i in hash) { 
                if (events.indexOf (i) === -1 && system.indexOf (i) === -1) {
                    result.customs[i]   = hash[i]; 
                } else if (events.indexOf (i) > -1) {
                    result.internals.events[i] = resolveSystemAttr (i, hash[i]); 
                }
            }
        }
        
        l   = system.length;
        
        for (i=0; i<l; i++) {
            if (typeof hash[system[i]] !== 'undefined') {
                result.internals.system[system[i]] = resolveSystemAttr (system[i], hash[system[i]]);
            } else {
                result.internals.system[system[i]] = resolveSystemAttr (system[i]);
            }
        }

        return result;
    }
    
    function node (node) {
        var attributes, nodeID;
        
        attributes  = {};
        
        return {
            addAttribute: function (attribute, value) {
                attributes[attribute]   = value;
            },
            
            create: function (html) {
                var i, genAttributes;
                
                genAttributes   = '';
                nodeID          = ++storage.nodeID;
                
                genAttributes  += ' data-node="'+nodeID+'"';

                for (i in attributes) {
                    genAttributes += ' '+i+'="'+attributes[i]+'"';
                }
                
                if (node !== 'input' && node !== 'checkbox') {
                    return '<'+node+genAttributes+'>'+(typeof html==='string' ? html : '')+'</'+node+'>';
                } else if (node==='input') {
                    return '<'+node+genAttributes+'>';
                } else if (node==='checkbox') {
                    return '<div '+genAttributes+'><input id="checkbox'+nodeID+'" type="checkbox"><label for="checkbox'+nodeID+'">'+(typeof html !== 'undefined' ? html : 'Missing html for label text')+'</label></div>';
                }
            },
            
            getID: function () { return nodeID; }
            
        };
    }
    
    function createActionEvent (nodeID, eventType, event, context, subscriber, mobileEventConflict) {
        var selector, view, viewNodeID, viewName, viewManip, template, 
            controller, controllerEvent, nodeType, nodeFormat, nodePasteable, nodeEditable,
            hammer;
        
        selector        = $('[data-node="'+nodeID+'"]');
        nodeType        = selector[0].nodeName.toLowerCase () === 'input' ? 'input' : 'else';
        nodeEditable    = selector.attr ('contenteditable') === "true";
        nodeFormat      = selector.attr ('type');
        nodePasteable   = selector.data ('pasteable');
        
        view            = selector.parents ('[data-type="view"]:first');
        viewNodeID      = parseInt (view.data ('node'), 10);
        viewName        = view.data ('handle');
        viewManip       = null;
        
        template        = np.handlebars.getTemplate (viewName);
        controller      = np.controller.getByView (viewName);
        
        controllerEvent = controller && typeof controller.events !== 'undefined' && typeof controller.events[event] === 'function' ? controller.events[event] : false;

        if (controllerEvent) {
            if (eventType === 'change' 
                && (nodeType !== 'input' || nodeFormat === 'dateonly' || nodeFormat === 'datetime' || nodeFormat === 'file' || nodePasteable === true)
            ) { eventType = 'change keyup paste'; }
            else if (eventType === 'change' && (nodeType === 'input' || nodeEditable))  { eventType = 'keyup paste blur change';    }
            else if (eventType === 'enter')                             { eventType = 'np:enter';                   }

            viewManip   = np.view.manip (viewNodeID, context);

            if (eventType === 'onload') {
                controllerEvent.call (subscriber, viewManip);                
            } else if (eventType === 'hover') {
                $('[data-node="'+nodeID+'"]').on ({
                    mouseenter: function () {
                        controllerEvent.call (subscriber, viewManip, 'enter');
                    },
                    
                    mouseleave: function () {
                        controllerEvent.call (subscriber, viewManip, 'leave');
                    }
                });
            } else if (eventType === 'startDrag') {
                var node, trigger, containment;
                
                node    = $('[data-node="'+nodeID+'"]');
                
                if (node.data ('np-draggable') !== true) {
                    node.data ('np-draggable', true);
                    node.data ('np-draggable-start', true);
                    
                    containment = node.attr ('containment');
                    trigger     = node.attr ('trigger');
                    
                    if (trigger === 'parent') {
                        trigger = node.parents ('*:first');
                    } else if (typeof trigger === 'undefined') {
                        trigger = node;
                    }

                    trigger.draggable ({
                        containment:    containment,
                        cursor:         'move',
                        start:          controllerEvent.call (subscriber, viewManip)
                    });
                } else if (node.data ('np-draggable-start') !== true) {
                    trigger     = node.attr ('trigger');
                    
                    if (trigger === 'parent') {
                        trigger = node.parents ('*:first');
                    } else if (typeof trigger === 'undefined') {
                        trigger = node;
                    }
                    
                    trigger.draggable ().on ('start', function () {
                        controllerEvent.call (subscriber, viewManip);
                    });
                }
            } else if (eventType === 'stopDrag') {
                var node, trigger, containment;
                
                node    = $('[data-node="'+nodeID+'"]');
                
                if (node.data ('np-draggable') !== true) {
                    node.data ('np-draggable', true);
                    node.data ('np-draggable-drag', true);
                    
                    containment = node.attr ('containment');
                    trigger     = node.attr ('trigger');
                    
                    if (trigger === 'parent') {
                        trigger = node.parents ('*:first');
                    } else if (typeof trigger === 'undefined') {
                        trigger = node;
                    }

                    trigger.draggable ({
                        containment:    containment,
                        cursor:         'move',
                        stop:          controllerEvent.call (subscriber, viewManip)
                    });
                } else if (node.data ('np-draggable-drag') !== true) {
                    trigger     = node.attr ('trigger');
                    
                    if (trigger === 'parent') {
                        trigger = node.parents ('*:first');
                    } else if (typeof trigger === 'undefined') {
                        trigger = node;
                    }
                    
                    trigger.draggable ().on ('drag', function () {
                        controllerEvent.call (subscriber, viewManip);
                    });
                }
            } else if (eventType === 'dragging') {
                var node, trigger, containment;
                
                node    = $('[data-node="'+nodeID+'"]');
                
                if (node.data ('np-draggable') !== true) {
                    node.data ('np-draggable', true);
                    node.data ('np-draggable-stop', true);
                    
                    containment = node.attr ('containment');
                    trigger     = node.attr ('trigger');
                    
                    if (trigger === 'parent') {
                        trigger = node.parents ('*:first');
                    } else if (typeof trigger === 'undefined') {
                        trigger = node;
                    }

                    trigger.draggable ({
                        containment:    containment,
                        cursor:         'move',
                        drag:          controllerEvent.call (subscriber, viewManip)
                    });
                } else if (node.data ('np-draggable-stop') !== true) {
                    trigger     = node.attr ('trigger');
                    
                    if (trigger === 'parent') {
                        trigger = node.parents ('*:first');
                    } else if (typeof trigger === 'undefined') {
                        trigger = node;
                    }
                    
                    trigger.draggable ().on ('drag', function () {
                        controllerEvent.call (subscriber, viewManip);
                    });
                }
            } else if (eventType === 'drop') {
                var node, trigger;

                node        = $('[data-node="'+nodeID+'"]');
                trigger     = node.attr ('trigger');

                if (trigger === 'parent') {
                    trigger = node.parents ('*:first');
                } else if (typeof trigger === 'undefined') {
                    trigger = node;
                }

                trigger.on ('drop', function (e) {
                    e.preventDefault ();
                    controllerEvent.call (subscriber, viewManip, e);
                });
            } else if (eventType === 'sort') {
                var node, list, containment, cancel;
                
                node        = $('[data-node="'+nodeID+'"]');
                list        = $(node.attr ('list'));

                containment = typeof node.attr ('containment') !== 'undefined' ? node.attr ('containment') : 'parent';
                cancel      = typeof node.attr ('cancel') !== 'undefined' ? node.attr ('cancel') + ',input,textarea,button,a,[contenteditable]': 'input,textarea,button,a,[contenteditable]';
                
                node.removeAttr ('trigger');
                node.removeAttr ('containment');
                node.removeAttr ('cancel');
                
                list.data ('sortable-containment', containment);
                
                if (list.data ('np-sortable') !== true) {
                    list.data ('np-sortable', true);

                    list.sortable ({
                        cursor:                 'move',
                        helper:                 'clone',
                        cancel:                 cancel,
                        tolerance:              'pointer',
                        appendTo:               'body',
                        containment:            containment,
                        scroll:                 true,
                        create:                 function (e) {
                            jQuery (this).css ('height', '');
                            jQuery (this).height (jQuery (this).height());
                        },
                        update: function (e, ui) {
                            controllerEvent.call (subscriber, viewManip, e, ui);
                        }
                    });
                    
                    list.find ('> *:not(.np-sortable-item)').each (function () {
                        $(this).addClass ('np-sortable-item');
                    });
                    
                    list.observe ('added', '> *:not(.np-sortable-item)', function () {
                        list.find ('> *:not(.np-sortable-item)').each (function () {
                           $(this).addClass ('np-sortable-item'); 
                        });
                        
                        list.css ('height', '');

                        window.setTimeout (function () {
                            list.height (list.height ());
                            list.sortable ('refresh');
                            list.sortable ('refreshPositions');
                        }, 250);
                    });
                    
                    $(window).on ('resize orientationchange', function () {
                        list.css ('height', '');

                        window.setTimeout (function () {
                            list.height (list.height ());
                            list.sortable ('refresh');
                            list.sortable ('refreshPositions');
                        }, 250);
                    });
                    
                    list.observe ('removed', '> .np-sortable-item', function () {
                        list.css ('height', '');

                        window.setTimeout (function () {
                            list.height (list.height ());
                            list.sortable ('refresh');
                            list.sortable ('refreshPositions');
                        }, 250);
                    });
                }
            } else if (eventType === 'panLeft' || eventType === 'panRight'
                       || eventType === 'panStart' || eventType === 'panEnd') {
                hammer  = new Hammer ($('[data-node="'+nodeID+'"]')[0], {touchAction: 'auto'});

                if (eventType === 'panLeft') {
                    hammer.get ('pan').set ({direction: Hammer.DIRECTION_LEFT});
                    
                    hammer.on ('panstart panmove panend', function (e) {
                        if (e.type !== 'panstart' && e.additionalEvent === 'panleft') {
                            controllerEvent.call (subscriber, {view:viewManip, e: e});
                        }
                    });
                } else if (eventType === 'panRight') {
                    hammer.get ('pan').set ({direction: Hammer.DIRECTION_RIGHT});
                    
                    hammer.on ('panstart panmove panend', function (e) {
                        if (e.type !== 'panstart' && e.additionalEvent === 'panright') {
                            controllerEvent.call (subscriber, {view:viewManip, e: e});
                        }
                    });
                } else if (eventType === 'panStart') {
                    hammer.get ('pan').set ({direction: Hammer.DIRECTION_ALL});
                    
                    hammer.on ('panstart', function (e) {
                        controllerEvent.call (subscriber, {view:viewManip, e: e});
                    });
                } else if (eventType === 'panEnd') {
                    hammer.get ('pan').set ({direction: Hammer.DIRECTION_ALL});
                    
                    hammer.on ('panend', function (e) {
                        controllerEvent.call (subscriber, {view:viewManip, e: e});
                    });
                }
            } else if (eventType === 'swipeUp') {
                hammer  = new Hammer ($('[data-node="'+nodeID+'"]')[0]);
                hammer.get ('swipe').set ({direction: Hammer.DIRECTION_ALL});
                
                hammer.on ('swipeup', function (e) {
                    var $_this;

                    $_this  = $('[data-node="'+nodeID+'"]');

                    if ($_this.data ('disabled') === false || typeof $_this.data ('disabled') === 'undefined') {
                        controllerEvent.call (subscriber, viewManip);
                    }  
                });                
            } else if (eventType === 'swipeDown') {
                hammer  = new Hammer ($('[data-node="'+nodeID+'"]')[0]);
                hammer.get ('swipe').set ({direction: Hammer.DIRECTION_ALL});
                
                hammer.on ('swipedown', function (e) {
                    var $_this;

                    $_this  = $('[data-node="'+nodeID+'"]');

                    if ($_this.data ('disabled') === false || typeof $_this.data ('disabled') === 'undefined') {
                        controllerEvent.call (subscriber, viewManip);
                    }  
                });
            } else if (eventType === 'swipeLeft') {
                hammer  = new Hammer ($('[data-node="'+nodeID+'"]')[0]);
                hammer.get ('swipe').set ({direction: Hammer.DIRECTION_ALL});
                
                hammer.on ('swipeleft', function (e) {
                    var $_this;

                    $_this  = $('[data-node="'+nodeID+'"]');

                    if ($_this.data ('disabled') === false || typeof $_this.data ('disabled') === 'undefined') {
                        controllerEvent.call (subscriber, viewManip);
                    }  
                });
            } else if (eventType === 'swipeRight') {
                hammer  = new Hammer ($('[data-node="'+nodeID+'"]')[0]);
                hammer.get ('swipe').set ({direction: Hammer.DIRECTION_ALL});
                
                hammer.on ('swipeleft', function (e) {
                    var $_this;

                    $_this  = $('[data-node="'+nodeID+'"]');

                    if ($_this.data ('disabled') === false || typeof $_this.data ('disabled') === 'undefined') {
                        controllerEvent.call (subscriber, viewManip);
                    }  
                });
            } else if (eventType === 'tap') {
                hammer  = new Hammer ($('[data-node="'+nodeID+'"]')[0]);
                
                hammer.on ('tap', function (e) {
                    var $_this;
                    
                    $_this  = $('[data-node="'+nodeID+'"]');

                    if (np.client.isTouchDevice ()
                        && ($_this.data ('disabled') === false || typeof $_this.data ('disabled') === 'undefined')
                    ) {
                        controllerEvent.call (subscriber, viewManip);
                    }  
                });
            } else if (eventType === 'click') {
                $('[data-node="'+nodeID+'"]').on ('click', function (e) {
                    var $_this, isTouchDevice;
                    
                    $_this          = $(this);
                    isTouchDevice   = np.client.isTouchDevice ();

                    if ((!isTouchDevice || (isTouchDevice && !mobileEventConflict))
                        && ($_this.data ('disabled') === false || typeof $_this.data ('disabled') === 'undefined')
                    ) {
                        controllerEvent.call (subscriber, viewManip);
                    }  
                });
            } else if (eventType !== 'np:enter') {
                if ($('[data-node="'+nodeID+'"]')[0].type && $('[data-node="'+nodeID+'"]')[0].type.toLowerCase () === 'range')  {
                    eventType   = 'change mousemove touchmove';
                }
                
                $('[data-node="'+nodeID+'"]').on (eventType, function (e) { 
                    var $_this, pasteable;

                    $_this      = $(this);
                    pasteable   = $_this.data ('pasteable') === true;

                    if ((e.keyCode !== $.ui.keyCode.ENTER || $_this.attr ('contenteditable'))
                        && e.keyCode !== $.ui.keyCode.LEFT
                        && e.keyCode !== $.ui.keyCode.UP
                        && e.keyCode !== $.ui.keyCode.RIGHT
                        && e.keyCode !== $.ui.keyCode.DOWN
                        && e.keyCode !== $.ui.keyCode.END
                        && e.keyCode !== $.ui.keyCode.HOME
                        && e.keyCode !== $.ui.keyCode.PAGE_UP
                        && e.keyCode !== $.ui.keyCode.PAGE_DOWN
                        && (!e.ctrlKey || pasteable || nodeEditable)
                        && (!e.metaKey || pasteable || nodeEditable)
                        && e.keyCode !== 16
                        && e.keyCode !== 17
                        && e.keyCode !== 18
                        && e.keyCode !== 91
                        && e.keyCode !== 93
                        && ($_this.data ('disabled') === false || typeof $_this.data ('disabled') === 'undefined')
                    ) {
                        controllerEvent.call (subscriber, viewManip);
                    }
                });
            } else {
                $('[data-node="'+nodeID+'"]').on ('keyup', function (e) { 
                    var $_this  = $(this);

                    if (e.keyCode === $.ui.keyCode.ENTER
                        && ($_this.data('disabled') === false || typeof $_this.data('disabled') === 'undefined')
                    ) {
                        controllerEvent.call (subscriber, viewManip);
                    }
                });
            }
        }        
    }
    
    function registerActionEvents (options) {
        var subscriber, nodeID, selector, events, system, context,
            mobileEventConflict,
            i;

        nodeID      = options.nodeID;
        selector    = $('[data-node="'+nodeID+'"]');
        events      = options.events;
        system      = options.system;
        context     = options.context;

        if (selector.length > 0) { 
            subscriber  = np.observable.subscribe ('actionEvent', {context: context, nodeID: nodeID});
            
            for (i in system) {
                if (i==='type') {
                    if (system[i] === 'number') {
                        np.dom.setInputType (selector, 'number');
                    } else if (system[i] === 'dateonly') {
                        np.dom.setInputType (selector, 'date');
                    } else if (system[i] === 'datetime') {
                        np.dom.setInputType (selector, 'datetime');
                    } else if (system[i] === 'mail') {
                        np.dom.setInputType (selector, 'mail');
                    } else if (system[i] === 'text') {
                        np.dom.setInputType (selector, 'text');
                    }
                } else if (i === 'recaptcha' && system[i] === true) {
                    np.dom.setNodeType (selector, 'recaptcha', nodeID, context, subscriber);
                } else if (i === 'gmaps' && system[i] === true) {
                    np.dom.setNodeType (selector, 'gmaps', nodeID, context, subscriber);
                }
            }
            
            mobileEventConflict = (function () {
                return typeof events['click'] !== 'undefined' && typeof events['tap'] !== 'undefined';
            }());
            
            for (i in events) {
                if (typeof events[i] === 'string') {
                    createActionEvent (nodeID, i, events[i], context, subscriber, mobileEventConflict);
                }
           }
        } else if (storage.nodes.indexOf(nodeID) > -1) {
            np.tick (registerActionEvents, options);
        }
    }
    
    function registerViewEvents (options) {
        var nodeID, selector, jQ, context,
            viewName, domView, jsView, init,
            fncView,
            observes,
            i, j;

        nodeID      = options.nodeID;
        selector    = $('[data-node="'+nodeID+'"]');
        jQ          = options.jQ;
        context     = options.context;
        init        = typeof options.init === 'boolean' ? options.init : false;
   
        if (selector.length > 0) { 
            domView     = selector.parents ('[data-type="view"]:first');
            viewName    = domView.data ('handle');
            jsView      = np.view.get (viewName);
            
            for (i in jsView) {
                if (i===jQ) {
                    fncView = jsView[i];

                    if (typeof fncView.observe !== 'undefined') {
                        observes    = fncView.observe;

                        for (j in observes) {
                            np.observable.subscribe ('viewEvent', {context: context, contextName: np.model.getNameOf(context), subscriber: fncView, nodeID: nodeID, init: init, observe: j, on: observes[j]});
                        }
                    } else {
                        np.observable.subscribe ('viewEvent', {context: context, contextName: np.model.getNameOf(context), subscriber: fncView, nodeID: nodeID, init: init});
                    }
                }
            }
        } else if (storage.nodes.indexOf(nodeID) > -1) {
            np.tick (registerViewEvents, options);
        }
    }    
    
    function gc () {
        var nodeID, node, clNodes, 
            i, l;

        clNodes = np.jsonClone (storage.nodes);
        l       = clNodes.length;

        for (i=0; i<l; i++) {
            nodeID  = clNodes[i];
            node    = '[data-node="'+nodeID+'"]';

            if ($(node).length === 0) {
                $(node).off ();

                delete storage.nodes[i];
            }
        }

        storage.nodes   = storage.nodes.reindex ();
    }
    
    return {
        getEventID: function () { return ++storage.eventID; },
        getNodeID: function ()  { return ++storage.nodeID;  },
        
        gc: function () { gc ();    },
        
        setTemplate: function (viewName, template) {
            storage.templates[viewName]   = template;
        },
        
        getTemplate: function (viewName) {
            return typeof storage.templates[viewName] !== 'undefined' ? storage.templates[viewName] : false;
        },
        
        parseTemplate: function (viewName, _ctx) {
            var template, compiled;
            
            if (typeof storage.templates[viewName] !== 'undefined') {
                template    = storage.templates[viewName];
                compiled    = Handlebars.compile (template)(_ctx);
                
                return $(compiled);
            }
            
            return $('');
        },
        
        createDOMObject: function (nodeName, options, context, registerEvents) {
            var _node, _hashes, _jQ, _systemHashes, _eventHashes, _customHashes,
                html, i;
        
            registerEvents  = typeof registerEvents === 'boolean' ? registerEvents : true;
            _hashes         = getHashes (options);
            _systemHashes   = _hashes.internals.system;
            _eventHashes    = _hashes.internals.events;
            _jQ             = _systemHashes.$;
            _customHashes   = _hashes.customs;
            _node           = new node (nodeName);

            for (i in _customHashes) {
                _node.addAttribute (i, _customHashes[i]);
            }
            
            for (i in _systemHashes) {
                if (typeof _systemHashes[i] === 'string' || typeof _systemHashes[i] === 'boolean') {
                    if (i!=='$' && i!=='init') {
                        if (i!=='type' && i!=='bindAttr') {
                            _node.addAttribute ('data-'+i, _systemHashes[i]);
                        } else if (i==='type' && typeof _systemHashes[i] !== 'undefined') {
                            _node.addAttribute ('type', (_systemHashes[i] === 'number' || _systemHashes[i] === 'mail' ? 'text' : _systemHashes[i]));
                        } else if (i==='bindAttr' && typeof _systemHashes[i] !== 'undefined') {
                            _node.addAttribute ('data-bind', _systemHashes[i]);                    
                        }                     
                    } else if (i==='$') {
                        _node.addAttribute ('data-method', _systemHashes[i]);
                    }
                }
            }
            
            html    = nodeName !== 'input' && typeof options.fn === 'function' ? _node.create (options.fn (context)) : _node.create ();

            if (registerEvents) {
                if (storage.nodes.indexOf (_node.getID ()) === -1) {
                    storage.nodes.push (_node.getID ());
                }
                
                if (context !== window) {
                    registerActionEvents ({
                        nodeID:     _node.getID (), 
                        events:     _eventHashes,
                        system:     _systemHashes,
                        context:    context
                    });
                    
                    if (typeof _jQ === 'string') {
                        registerViewEvents ({
                            nodeID:     _node.getID (), 
                            jQ:         _jQ,
                            context:    context,
                            init:       _systemHashes.init
                        });
                    }
                }
            }
            
            return html;
        }
    };
}()));