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

np.module ('pagination', (function () {
    var paginations, modelCount, pageCount;
    
    modelCount  = 0;
    pageCount   = 0;
    paginations = {};
    
    function getPage (pos) {
        var resources, parts, rx;

        pos         = typeof pos === 'undefined' || typeof pos !== 'number' ? 0 : pos;
        resources   = np.route.getResources (pos);
        parts       = resources.length > pos ? resources.split ('/') : new Array ();

        return parts.length > pos ? parseInt (parts[pos], 10) : 1;
    }
    
    function getSort (asArray, exclude) {
        var resources, parts, rx;

        resources   = np.route.getResources ();

        if (typeof exclude === 'string' && exclude.length > 0) {
            rx              = new RegExp (exclude.slice (1)+'/','g');
            resources       = resources.replace (rx, '');
        }
        
        parts       = resources.length > 0 ? resources.split ('/') : new Array ();

        if (asArray === true) {
            return {
                sortBy:     parts.length > 1 ? parts[1] : false,
                sortOrder:  parts.length > 2 ? parts[2] : (parts.length > 1 ? 'asc' : false)
            };
        } else {
            return (parts.length > 1 ? '/'+parts[1] : '') + (parts.length > 2 ? '/' + parts[2] : (parts.length > 1 ? '/asc' : ''));
        }
    } 
    
    function getSearch (exclude) {
        var resources, parts, search, rx,
            i, l;
        
        resources    = np.route.getResources ();

        if (typeof exclude === 'string' && exclude.length > 0) {
            rx          = new RegExp (exclude.slice (1)+'/','g');
            resources   = resources.replace (rx, '');
        }
        
        parts       = resources.length > 0 ? resources.split ('/') : new Array ();
        l           = parts.length;
        search      = '';
        
        for (i=3; i<l;i++) {
            search  += parts[i] + '/';
        }
        
        if (search.length > 0) {
            search  = search.slice (0, search.length - 1);
        }
        
        return search;
    } 
    
    function getSortOrder (column) {
        var resources;

        resources   = np.route.getResources ().split ('/');

        return resources.length > 1 && resources[1] === column ? resources[2] : 'none'; 
    }
    
    return {
        set:    function (model, data) {
            var lModel;
            
            lModel                  = model.slice (0, 1).toLowerCase ()+model.slice (1);
            paginations[lModel]     = data;
            
            if (typeof paginations[lModel].id === 'undefined') {
                paginations[lModel].id  = --modelCount;
            }
        },
        
        getPage: function (pos) {
            return getPage (pos);
        },
        
        getPages:   function (model) {
            var lModel;
            
            lModel  = model.slice (0, 1).toLowerCase ()+model.slice (1);
            
            if (typeof paginations[lModel] !== 'undefined' && typeof paginations[lModel].total !== 'undefined'
                && typeof paginations[lModel].limit !== 'undefined'
            ) {
                return Math.ceil (parseInt (paginations[lModel].total, 10)/parseInt (paginations[lModel].limit, 10));
            }
            
            return 0;
        },
        
        getLimit: function (model) {
            var lModel;
            
            lModel  = model.slice (0, 1).toLowerCase ()+model.slice (1);
            
            if (typeof paginations[lModel] !== 'undefined' && typeof paginations[lModel].limit !== 'undefined' ) {
                return paginations[lModel].limit;
            }
            
            return 0;
        },
        
        getTotal: function (model) {
            var lModel;
            
            lModel  = model.slice (0, 1).toLowerCase ()+model.slice (1);
            
            if (typeof paginations[lModel] !== 'undefined' && typeof paginations[lModel].total !== 'undefined' ) {
                return paginations[lModel].total;
            }
            
            return 0;
        },
        
        getSort: function (prepend) {
            return getSort (true, prepend);
        },
        
        getSortOrder: function (column) {
            return getSortOrder (column);
        },
        
        getSearch: function (exclude) {
            return getSearch (exclude);
        },
        
        generateModel: function (model, sortables, prepend) {
            var lModel, genModel, total, route, sort, arrSort, search, currentPage, sortable_id;

            sortable_id = 1;
            lModel      = model.slice (0, 1).toLowerCase ()+model.slice (1);
            genModel    = {
                id:     0,
                total:  0,
                limit:  0,
                pages:  new Array ()
            };
            
            prepend     = typeof prepend !== 'undefined' ? prepend : '';
            sortables   = typeof sortables !== 'undefined' ? sortables : new Array ();
            
            if (typeof paginations[lModel] !== 'undefined' && typeof paginations[lModel].limit !== 'undefined' ) {
                total       = np.pagination.getPages (lModel);
                route       = paginations[lModel].route;
     
                currentPage = paginations[lModel].currentPage;

                sort        = getSort (false, prepend);
                arrSort     = getSort (true, prepend);
                
                search      = getSearch (prepend);

                genModel    = {
                    Pagination: {
                        id:         paginations[lModel].id,
                        total:      np.pagination.getPages (lModel),
                        limit:      paginations[lModel].limit,
                        sortables:  $.map (sortables, function (val, key) {
                            var currentOrder, sort;
                            
                            currentOrder    = arrSort.sortBy === key ? arrSort.sortOrder : '';
                            sort            = arrSort.sortBy === key ? (arrSort.sortOrder === 'desc' ? 'asc' : 'desc') : 'asc';

                            return {
                                id:             sortable_id++,
                                route:          route+prepend+'/'+currentPage+'/'+key+'/'+sort+'/'+search,
                                name:           key,
                                currentOrder:   currentOrder, 
                                model:          model,
                                label:          val
                            };
                        }),
                        
                        pages:  (function (_total) {
                            var _arr, _i;
                            
                            _arr    = new Array ();
                            
                            _arr.push ({
                                page:   {
                                    id:     --pageCount,
                                    num:    '',
                                    route:  route+prepend+'/1'+sort+'/'+search,
                                    icon:   'fa fa-angle-double-left',
                                    class:  (currentPage === 1) ? 'disabled' : '',
                                    model:  lModel
                                }
                            },
                            {
                                page:   {
                                    id:     --pageCount,
                                    num:    '',
                                    route:  route+prepend+'/'+((currentPage > 1) ? (currentPage - 1) : 1)+sort+'/'+search,
                                    icon:   'fa fa-angle-left',
                                    class:  (currentPage === 1) ? 'disabled' : '',
                                    model:  lModel
                                }
                            });
                            
                            for (_i=0; _i<_total; _i++) {
                                _arr.push ({page: {id: --pageCount, num: (_i+1), route: route+prepend+'/'+(_i+1)+sort+'/'+search, class: (currentPage === (_i+1)) ? 'active' : '', model: lModel}});
                            }
                            
                            _arr.push ({
                                page:   {
                                    id:     --pageCount,
                                    num:    '',
                                    route:  route+prepend+'/'+((currentPage < _total) ? currentPage + 1 : _total)+sort+'/'+search,
                                    icon:   'fa fa-angle-right',
                                    class:  (currentPage === _total) ? 'disabled' : '',
                                    model:  lModel
                                }
                            },
                            {
                                page:   {
                                    id:     --pageCount,
                                    num:    '',
                                    route:  route+prepend+'/'+_total+sort+'/'+search,
                                    icon:   'fa fa-angle-double-right',
                                    class:  (currentPage === _total) ? 'disabled' : '',
                                    model:  lModel
                                }
                            });
                            
                            return _arr;
                        }(total))
                    }
                };
            }

            return genModel;
        }
    };
}()));