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

np.view.extend ('ProductListView', (function () {
    var rspCodes;
    
    rspCodes    = {
        unknown:    'Ein unbekannter Fehler ist aufgetreten.<br>Bitte wiederholen Sie den Vorgang erneut.',
        1:          'Dieser Artikel wurde gerade ausverkauft und ist leider nicht mehr auf Lager.<br>In ein paar Tagen wird er aber wieder verfügbar sein.',
        404:        'Dieser Artikel wurde nicht gefunden.<br>Bitte versuchen Sie es erneut.'
    };
    
    return {
        destroy: function () {
            $('.variations').each (function () {
                if ($(this).qtip ('api')) { 
                    $(this).qtip ('api').hide ();    
                    $(this).qtip ('api').disable ();    
                }
            });

            $('.products-list .product .amount input[data-bind="amount"]').each (function () {
                if ($(this).qtip ('api')) { 
                    $(this).qtip ('api').hide ();    
                    $(this).qtip ('api').disable ();    
                }
            });

            $('.qtip').remove ();
        },
        
        closeInfo: function (model) {
            if (model.get ('info') !== 2) {
                if (this.hasClass ('no-display'))   { this.removeClass ('no-display');  }
            } else {
                if (!this.hasClass ('no-display'))  { this.addClass ('no-display');     }
            }
        }.observes ('info').on ('change'),
        
        add: function (model) {
            if (model.get ('info') === 2) {
                if (this.hasClass ('no-display'))   { this.removeClass ('no-display');  }
            } else {
                if (!this.hasClass ('no-display'))  { this.addClass ('no-display');     }
            }
        }.observes ('info').on ('change'),
        
        cancel: function (model) {
            if (model.get ('info') === 2) {
                if (this.hasClass ('no-display'))   { this.removeClass ('no-display');  }
            } else {
                if (!this.hasClass ('no-display'))  { this.addClass ('no-display');     }
            }
        }.observes ('info').on ('change'),        

        refresh: function (model) {
            var _this, parent, refresh;

            _this       = this;
            parent      = _this.parents ('.cart-refresh:first');
            refresh     = _this.find ('.refresh');

            if (model.get ('sending')) {
                if (!parent.hasClass ('deactivate'))    { parent.addClass ('deactivate');       }
                if (_this.hasClass ('fadeOut'))         { _this.removeClass ('fadeOut');        }
                if (!_this.hasClass ('fadeIn'))         { _this.addClass ('fadeIn');            }
            } else {
                if (!_this.hasClass ('fadeOut'))        { _this.addClass ('fadeOut');           }
                if (_this.hasClass ('fadeIn'))          { _this.removeClass ('fadeIn');         }
                if (parent.hasClass ('deactivate'))     { parent.removeClass ('deactivate');    }
            }
        }.observes ('sending').on ('change'),
        
        info: function (model) {
            var _this, info, infoCode, content, product, html;
            
            _this       = this;
            
            content     = this.find ('.table-cell .info-container .text');
            info        = this.find ('.info-container');
            
            infoCode    = model.get ('info');
            
            if (infoCode) {
                if (infoCode === 2) {
                    product     = model.getAll ();
                    
                    html        = 'Der Artikelpreis hat sich zwischenzeitlich geändert und beträgt jetzt:<br><br>';
                    html       += '<label>Preis/Stück:</label><b>'+accounting.formatMoney (np.Product.getGross (product), '', 2, '.', ',')+' &euro;</b> ';
                    html       += '<span class="small">(inkl. MwSt.'+np.Product.getTax (product)+'%)</span><br><br>';
                    html       += 'Möchten Sie den Artikel trotzdem in den Warenkorb legen?';
                } else {
                    html        = typeof rspCodes[infoCode] === 'string' ? rspCodes[infoCode] : rspCodes.unknown;
                }
                
                content.html (html);
                
                if (!this.hasClass ('deactivate'))  { this.addClass ('deactivate');     }
                if (!info.hasClass ('deactivate'))  { info.addClass ('deactivate');     }
            } else {
                if (this.hasClass ('deactivate'))   { this.removeClass ('deactivate');  }
                if (info.hasClass ('deactivate'))   { info.removeClass ('deactivate');  }
            }
        }.observes ('info').on ('change'),        

        highlightNeededVariations: function (model) {
            var mVariations, selectors, _this, needed, vName, hasMultiple,
                i, l;

            mVariations = model.get ('missingVariations');
            needed      = model.get ('neededVariations');

            l           = mVariations.length;
            selectors   = '';
            _this       = this;

            if (l>0) {
                for (i=0; i<l; i++) {
                    selectors  += '#prod-variation-'+mVariations[i]+',';
                }

                if (selectors.length > 0) {
                    selectors   = selectors.slice (0, selectors.length-1);
                }
            }

            if (selectors.length > 0) {
                $.fn.qtip.zindex    = 120;

                this.find (selectors).spotlight ({
                    exitEvent:      'click', 
                    parentSelector: _this.parents('.product:first'),

                    onShow: function () {
                        hasMultiple = _this.find (selectors).length > 1;

                        _this.find (selectors).each (function () {
                            var _t, varID;

                            _t      = $(this);

                            varID   = parseInt( _t.data ('variation'), 10);
                            vName   = (function (){
                                var t;

                                for (t in needed) { 
                                    if (parseInt (needed[t].key) === varID) {
                                        return needed[t].label;
                                    }
                                }

                                return 'unbekannt';
                            }());

                            _t.qtip ({
                                content:    {
                                    text: (function () {
                                        var text;

                                        text    = '<div class="np-qtip-container">';
                                        text   +=   '<span class="text">Bitte w&auml;hlen Sie einen Wert aus.</span>';
                                        text   +=   '<a href="#" class="np-qtip-close">';
                                        text   +=       '<span class="glyphicon glyphicon-remove"></span>';
                                        text   +=   '</a>';
                                        text   += '</div>';

                                        return text;
                                    }())
                                },
                                show:       { ready: true           },
                                hide:       false,
                                style: {
                                    classes: 'qtip-rounded qtip-shadow',
                                    tip: {
                                        corner: !hasMultiple ? 'right center' : 'top center'
                                    }
                                },
                                position: {
                                    my: !hasMultiple ? 'right center' : 'top center',
                                    at: !hasMultiple ? 'left center' : 'bottom center',
                                    target: _t
                                }
                            });
                        });                    
                    },

                    onHide: function () { 
                        $('.variations').each (function () {
                            if ($(this).qtip ('api')) { 
                                $(this).qtip ('api').hide ();    
                                $(this).qtip ('api').disable ();    
                            }
                        });

                        $('.qtip').remove ();
                    }
                });
            }
        }.observes ('missingListVariations').on ('change'),

        highlightMaxAmountReached: function (model) {
            var _this, selector, parent, text;

            _this       = this;
            selector    = _this.find ('input[data-bind="amount"]');
            parent      = _this.parents('.product:first');

            text        = '<div class="np-qtip-container">';
            text       +=   '<span class="text">Die maximale Anzahl wurde erreicht</span>';
            text       +=   '<a href="#" class="np-qtip-close">';
            text       +=       '<span class="glyphicon glyphicon-remove"></span>';
            text       +=   '</a>';
            text       += '</div>';

            if (model.get ('maxAmount')) {
                $.fn.qtip.zindex    = 120;

                selector.spotlight ({
                    exitEvent:      'click', 
                    parentSelector: _this.parents('.product:first'),

                    onShow: function () {
                        parent.qtip ({
                            content:    { 
                                text:   text
                            },
                            show:       { 
                                when:   false,
                                ready:  true
                            },
                            hide:       false,
                            style: {
                                classes: 'qtip-rounded qtip-shadow',
                                tip: {
                                    corner: 'bottom center'
                                }
                            },
                            position: {
                                my: 'bottom center',
                                at: 'top center',
                                target: selector
                            }
                        });
                    },

                    onHide: function () { 
                        $('.qtip').remove ();
                    }
                });            
            }
        }.observes ('maxListAmount').on ('change'),

        setBookmark: function (model) {
            this.find ('a:first').attr ('href', np.Product.getBookmark (model.getAll ()));
        }.observes ('selectedVariations').on ('change'),

        setArtikelName: function (model) {
            var name, variations, selected, current, found,
                i, l, m, n, o;

            name        = model.get ('name');
            variations  = model.get ('variations');
            selected    = model.get ('selectedVariations');

            l           = selected.length;
            n           = variations.length;
            found       = false;

            for (i=0; i<l; i++) {
                current = selected[i];

                for (m=0; m<n; m++) {
                    for (o in variations[m]) {
                        if (typeof variations[m][o] === 'object' 
                            && typeof variations[m][o].ArtikelNr === 'string'
                            && typeof variations[m][o].id !== 'undefined'
                            && variations[m][o].ArtikelNr.length > 0
                            && (variations[m][o].KeyEigenschaft+'-'+variations[m][o].KeyEigenschaftWert) === current
                        ) {
                            this.html (name + ' ' +variations[m][o].Name);

                            found   = true;
                        }    

                        if (found)  { break;    }
                    }

                    if (found)  { break;    }
                }

                if (found)  { break;    }
            }
        }.observes ('selectedVariations').on ('change'),    

        setGross: function (model) {
            var gross;
            
            gross   = np.Product.getGross (model.getAll ());
            gross   = accounting.formatMoney (gross, '', 2, '.', ',');
            
            this.html (gross+' €');
        }.observes ('selectedVariations').on ('change'),
        
        /*
         * Check, if article is available
         * 
         * Availability:
         * 
         * An article is available, if it isnt out of stock.
         * This includes article variations:
         * If an article has variations, then it is avialable if at least one
         * variation isnt out of stock.
         */
        isAvailable: function (model) {
            var available;

            available   = np.Product.available (model.getAll ());
            
            if (available) {
                if (this.hasClass ('no-display'))   { this.removeClass ('no-display');  }
            } else {
                if (!this.hasClass ('no-display'))  { this.addClass ('no-display');     }
            }
        }.observes ('available'). on ('change'),
        
        /*
         * Check, if article is not available
         * 
         * Availability:
         * 
         * An article is available, if it isnt out of stock.
         * This includes article variations:
         * If an article has variations, then it is avialable if at least one
         * variation isnt out of stock.
         */
        isNotAvailable: function (model) {
            var available;

            available   = np.Product.available (model.getAll ());

            if (!available) {
                if (this.hasClass ('no-display'))   { this.removeClass ('no-display');  }
            } else {
                if (!this.hasClass ('no-display'))  { this.addClass ('no-display');     }
            }
        }.observes ('available'). on ('change'),
        
        isInCart: function (model) {
            var first, second;

            first   = this.find ('.first');
            second  = this.find ('.second');

            if (model.get ('isInCart') === true) {
                if (this.hasClass ('add-to-cart'))          { this.removeClass ('add-to-cart');         }
                if (!this.hasClass ('remove-from-cart'))    { this.addClass ('remove-from-cart');       }

                if (first.hasClass ('down'))                { first.removeClass ('down');               }
                if (!first.hasClass ('no-alpha'))           { first.addClass ('no-alpha');              }
                if (!first.hasClass ('up'))                 { first.addClass ('up');                    }

                if (second.hasClass ('no-display'))         { second.removeClass ('no-display');        }            
            } else {
                if (this.hasClass ('remove-from-cart'))     { this.removeClass ('remove-from-cart');    }
                if (!this.hasClass ('add-to-cart'))         { this.addClass ('add-to-cart');            }

                if (first.hasClass ('up'))                  { first.removeClass ('up');                 }            
                if (first.hasClass ('no-alpha'))            { first.removeClass ('no-alpha');           }
                if (!first.hasClass ('down'))               { first.addClass ('down');                  }

                if (!second.hasClass ('no-display'))        { second.addClass ('no-display');           }
            }
        }.observes ('isInCart').on ('change')        
    };
}()));