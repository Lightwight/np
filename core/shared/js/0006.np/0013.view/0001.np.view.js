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

/**
 * @module np.view
 * 
 * @description Add a custom view
 * @param {string} [viewName] The name of the custom view
 * @param {object} view The custom view
 * @example 
 * np.view.extend ('fooView', {
 *  didInsert: function () {}
 * });
 * 
 * @see controller
 */
np.module ('view', (function () {
    var storage;
    
    storage = { 
        views:      {},
        contexts:   {},
        handles:    {},
        relations:  {}
    };
    
    return {
        extend: function (view, options) {
            if (typeof storage.views[view] === 'undefined') {
                storage.views[view]     = options;
            }
        },
        
        registerContextOfView: function (viewNodeID, context, handle) {
            var _ctxName, _ctxID,
                i;

            if (typeof storage.handles[handle] === 'undefined') {
                storage.handles[handle]     = new Array ();
            }
            
            storage.handles[handle].push (viewNodeID);

            if (typeof context === 'object') {
                for (i in context) { _ctxName = i; break;   }
                
                if (typeof _ctxName === 'string' && _ctxName.length > 0) {
                    storage.contexts[viewNodeID]    = context;     
                    _ctxID  = parseInt (context[_ctxName].id, 10);

                    if (typeof storage.relations[_ctxName] === 'undefined') {
                        storage.relations[_ctxName] = {};
                    }

                    if (typeof storage.relations[_ctxName][_ctxID] === 'undefined') {
                        storage.relations[_ctxName][_ctxID] = new Array ();
                    }

                    storage.relations[_ctxName][_ctxID].push (viewNodeID);
                }
            }
        },
        
        gc: function () {
            var handles, relations,
                i, j, l,
                k, m, n;
            
            handles     = np.jsonClone (storage.handles);
            relations   = np.jsonClone (storage.relations);

            for (i in handles) {
                l   = handles[i].length;
                
                for (j=0; j<l; j++) {
                    if ($('[data-type="view"][data-node="'+handles[i][j]+'"]').length === 0 && typeof storage.views[i] !== 'undefined' && typeof storage.views[i].destroy === 'function') {
                        storage.views[i].destroy.call ($('[data-handle="'+i+'"]'));
                        
                        delete storage.handles[i][j];
                        
                        storage.handles[i] = storage.handles[i].reindex ();
                    }
                }
            }
            
            for (i in relations) {
                for (k in relations[i]) {
                    m   = relations[i][k].length;
                    
                    for (n=0; n<m; n++) {
                        if ($('[data-type="view"][data-node="'+relations[i][k][n]+'"]').length === 0) {
                            delete relations[i][k][n];
                        }
                    }
                    
                    relations[i][k] = relations[i][k].reindex ();
                    
                    if (relations[i][k].length === 0) {
                        delete relations[i][k];
                    }
                    
                    if ((function () {var x, t; t=0; for (x in relations[i]) {t++;} return t;}()) === 0) {
                        delete relations[i];
                    }
                }
            }
            
            storage.relations   = relations;
        },
        
        getStorage: function () {
            return storage;
        },
        
        get: function (view) {
            if (typeof storage.views[view] !== 'undefined') {
                return storage.views[view];
            }
            
            return false;
        },
        
        manip: function (viewID, context) {
            if (!(this instanceof np.view.manip)) { return new np.view.manip (viewID, context); }

            var _this, _ctx, _ctxName, _ctxID;
            
            _this       = '[data-type="view"][data-node="'+viewID+'"]';
            _ctxName    = np.model.getNameOf (context);
            _ctx        = _ctxName ? context[_ctxName] : new Array ();
            _ctxID      = _ctxName && typeof _ctx.id !== 'undefined' ? _ctx.id : false;

            return {
                rerender: function (viewName, onlyRelated, customContext, customID, _cCtx) {
                    var template, selector, nodes, viewIDS, related, compiled,
                        i, l,
                        rL;

                    onlyRelated = typeof onlyRelated === 'boolean' ? onlyRelated : false; 
                    template    = typeof viewName === 'undefined' || viewName === null ? np.handlebars.getTemplate ($(_this).data ('handle')) : np.handlebars.getTemplate (viewName);
                    selector    = $(document).find ('[data-type="view"][data-node="'+viewID+'"]');
                    viewIDS     = new Array ();
                    
                    if ((typeof viewName === 'undefined' || viewName === null) && !onlyRelated) {
                        if (selector.length > 0) {
                            np.handlebars.gc ();
                            
                            compiled    = Handlebars.compile (template)(_ctx);
                            selector.replaceWith (compiled);

                            np.observable.gc ();
                            np.view.gc ();
                        }
                    } else if (onlyRelated) {
                        if (onlyRelated && typeof customContext === 'string' && typeof customID !== 'undefined') {
                            if (typeof storage.relations[customContext] !== 'undefined' && typeof storage.relations[customContext][customID] !== 'undefined') {
                                related = storage.relations[customContext][customID];
                                rL      = related.length;
                                _cCtx   = typeof _cCtx === 'object' && typeof _cCtx.id !== 'undefined' ? _cCtx : {};
                                
                                for (i=0; i<rL; i++) {
                                    if (viewIDS.indexOf (related[i]) === -1 && $('[data-node="'+related[i]+'"]').data ('handle') === viewName) {
                                        viewIDS.push (related[i]);
                                    }
                                }

                                l   = viewIDS.length;

                                np.handlebars.gc ();

                                for (i=0; i<l; i++) {
                                    
                                    selector    = $('[data-type="view"][data-node="'+viewIDS[i]+'"]');

                                    if (selector.length > 0) {
                                        compiled    = Handlebars.compile (template)(_cCtx);
                                        selector.replaceWith (compiled);
                                    }
                                }

                                np.observable.gc ();
                                np.view.gc ();
                            }
                        } else if (onlyRelated && _ctxName && _ctxID) {
                            if (typeof storage.relations[_ctxName] !== 'undefined' && typeof storage.relations[_ctxName][_ctxID] !== 'undefined') {
                                related = storage.relations[_ctxName][_ctxID];
                                rL      = related.length;

                                for (i=0; i<rL; i++) {
                                    if (viewIDS.indexOf (related[i]) === -1 && $('[data-node="'+related[i]+'"]').data ('handle') === viewName) {
                                        viewIDS.push (related[i]);
                                    }
                                }
                            }

                            l   = viewIDS.length;

                            np.handlebars.gc ();

                            for (i=0; i<l; i++) {
                                selector    = $('[data-type="view"][data-node="'+viewIDS[i]+'"]');
                                
                                if (selector.length > 0) {
                                    compiled    = Handlebars.compile (template)(_ctx);
                                    
                                    selector.replaceWith (compiled);
                                }
                            }

                            np.observable.gc ();
                            np.view.gc ();
                        }
                    } else {
                        np.handlebars.gc ();
                        
                        nodes       = $('[data-type="view"][data-handle="'+viewName+'"]');                        
                        viewIDS     = nodes.length > 0 ? (function () {var ids; ids = new Array (); nodes.each (function () {ids.push ($(this).data ('node'));} ); return ids;}()) : new Array ();
                        l           = viewIDS.length;
                        
                        for (i=0; i<l; i++) {
                            selector    = $('[data-type="view"][data-node="'+viewIDS[i]+'"]');
                            
                            if (selector.length > 0) {
                                compiled    = Handlebars.compile (template)(_ctx);
                                selector.replaceWith (compiled);
                            }
                        }
                        
                        np.observable.gc ();
                        np.view.gc ();
                    }
                },
                
                parent: function (view) {
                    var _vContext, _vNodeID;
                    
                    _vNodeID    = typeof view === 'undefined' ? $(_this).parents('[data-type="view"]:first').data('node') : $(_this).parents('[data-type="view"][data-handle="'+view+'"]:first').data('node');
                    _vContext   = typeof storage.contexts[_vNodeID] !== 'undefined' ? storage.contexts[_vNodeID] : null;
                    
                    return new np.view.manip (_vNodeID, _vContext);
                },
                
                child: function () {
                    return new np.view.manip ($(_this).find('[data-type="view"]:first').data('node'));
                },
                
                component: function (name) {
                    return new np.component.manip ($(_this).find ('[data-type="component"][data-handle="'+name+'"]'));
                },
                
                getNode: function () { return $(_this); },
                
                context: function () {
                    var i;
                    
                    if (typeof storage.contexts[viewID] !== 'undefined') {
                        for (i in storage.contexts[viewID]) {
                            return np.observable.createModel (i, storage.contexts[viewID][i].id);
                        }
                    }
                    
                    return {};
                },
                
                get: function (binding) {
                    var selector, node;

                    selector    = $(_this);
                    node        = selector.find ('[data-bind="'+binding+'"]');

                    if (node.length > 0) {
                        if (node[0].nodeName.toLowerCase () === 'div') {
                            return node.html ();
                        } else {
                            return node.val ();
                        }
                    } else {
                        return '';
                    }
                },
                
                set: function (binding, val) {
                    var selector, node, nodeType;

                    selector    = $(_this);
                    node        = selector.find ('[data-bind="'+binding+'"]');
                    nodeType    = node[0].nodeName.toLowerCase ();

                    if (node.length > 0) {
                        if ((nodeType === 'div' || nodeType === 'span') && node.html () !== val) {
                            node.html (val);
                        } else if (node.val () !== val) {
                            node.val (val);
                        }
                        
                        node.change ();
                    } else {
                        return '';
                    }
                }
            };
        }
    };
}()));