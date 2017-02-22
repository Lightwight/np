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

np.view.extend ('ProductSingleView', (function () {
    var rspCodes, imgZoom;
    
    rspCodes    = {
        unknown:    'Ein unbekannter Fehler ist aufgetreten.<br>Bitte wiederholen Sie den Vorgang erneut.',
        1:          'Dieser Artikel wurde gerade ausverkauft und ist leider nicht mehr auf Lager.<br>In ein paar Tagen wird er aber wieder verfügbar sein.',
        404:        'Dieser Artikel wurde nicht gefunden.<br>Bitte versuchen Sie es erneut.'
    };
    
    imgZoom     = false;
    
    return {
        didInsert: function () {
            var img;

            img = imgZoom = this ('.single.bg-image');

            if (!np.client.isMobile ()) {
                img.elevateZoom ({
                    zoomType: 'lens',
                    lensShape: 'round',
                    lensSize: 200,
                    scrollZoom: true,
                    responsive: true,
                    loadingIcon: true
                });
            }
        },
        
        closeInfo: function (model) {
            if (model.get ('info') !== 2) {
                if (this.hasClass ('no-display'))   { this.removeClass ('no-display');  }
            } else {
                if (!this.hasClass ('no-display'))  { this.addClass ('no-display');     }
            }
        }.observes ('info').on ('change'),

        refresh: function (model) {
            if (model.get ('sending')) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }.observes ('sending').on ('change'),
        
        info: function (model) {
            var title, message, buttons, infoCode, product, btnApply, btnRemove;
            
            infoCode    = model.get ('info');
            btnApply    = this.find ('.cart .btn-add-to-cart');
            
            if (infoCode) {
                title   = 'Artikelstatus';
                
                if (infoCode === 2) {
                    product     = model.getAll ();
                    
                    message     = 'Der Artikelpreis hat sich zwischenzeitlich geändert und beträgt jetzt:<br><br>';
                    message    += '<label>Preis/Stück:</label><b>'+accounting.formatMoney (np.Product.getGross (model.getAll ()), '', 2, '.', ',')+' &euro;</b> ';
                    message    += '<span class="small">(inkl. MwSt.'+np.Product.getTax (model.getAll ())+'%)</span><br><br>';
                    message    += 'Soll der Artikel im Warenkorb bleiben?';
                    
                    buttons = new Array 
                    (
                        $.extend ({}, vex.dialog.buttons.YES, {text: 'Ja'}),
                        $.extend ({}, vex.dialog.buttons.NO, {text: 'Nein'})
                    );
                } else {
                    message     = typeof rspCodes[infoCode] === 'string' ? rspCodes[infoCode] : rspCodes.unknown;
                    
                    buttons = new Array 
                    (
                        $.extend ({}, vex.dialog.buttons.YES, {text: 'OK'})
                    );
                }

                vex.dialog.open ({
                    className:  'vex-theme-top',
                    message:    '<h3>'+title+'</h3><br><span>'+message+'</span>',
                    buttons:    buttons,
                    callback:   function (data) {
                        if (infoCode === 2) {
                            if (data === true) {
                                btnApply.click ();
                            }
                        }
                    }
                });
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
                    parentSelector: _this.find('.promo-tag:first'),

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
                                        corner: 'bottom center'
                                    }
                                },
                                position: {
                                    my: 'bottom center',
                                    at: 'top center',
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
        }.observes ('missingVariations').on ('change'),

        maxAmount: function (model) {
            if (model.get ('maxAmount')) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }.observes ('maxAmount').on ('change'),

        setArtikelName: function (model) {
            var name, available, variations, selected, current, found,
                i, l, m, n, o;

            name        = model.get ('name');
            available   = model.get ('available');
            variations  = model.get ('variations');
            selected    = model.get ('selectedVariations');
            
            if (available) {
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
                
                if (!found) { this.html (name); }
            }
        }.observes ('selectedVariations').on ('change'),
    
        setArtikelNr: function (model) {
            var artikelNr, available, variations, varValues, selected, current, found,
                i, l, m, n, o;

            artikelNr   = model.get ('article_id');
            available   = model.get ('available');
            variations  = model.get ('variations');
            varValues   = new Array ();
            selected    = model.get ('selectedVariations');

            if (available) {
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
                                found   = true;

                                this.html (variations[m][o].ArtikelNr);
                            }

                            if (found)  { break;    }
                        }

                        if (found)  { break;    }
                    }

                    if (found)  { break;    }
                }
                
                if (!found) { this.html (artikelNr);    }
            }
        }.observes ('selectedVariations').on ('change'),       
        
        setTitle: function (model) {
            return np.Product.getTitle (model);
        }.observes ('selectedVariations').on ('change'),
        
        setDescription: function (model) {
            if (this.hasClass ('product-description')) {
                return np.Product.getDescription (model);
            }
        }.observes ('selectedVariations').on ('change'),
        
        imgZoomer: function () {
            var img;
            
            img     = imgZoom = this.find ('.single.bg-image');
            
            if (imgZoom) {
                imgZoom.removeData ('elevateZoom');
                $('.zoomContainer').remove ();
            }
            
            if (!np.client.isMobile ()) {
                img.elevateZoom ({
                    zoomType: 'lens',
                    lensShape: 'round',
                    lensSize: 200,
                    scrollZoom: true,
                    responsive: true,
                    loadingIcon: true
                });
            }
        }.observes ('window.size').on ('change'),

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
            if (model.get ('isInCart')) {
                if (this.hasClass ('no-display'))   { this.removeClass ('no-display');  }
            } else {
                if (!this.hasClass ('no-display'))  { this.addClass ('no-display');     }
            }
            
        }.observes ('isInCart').on ('change'),
        
        destroy: function () {
            if (imgZoom) {
                imgZoom.removeData ('elevateZoom');
                $('.zoomContainer').remove ();
            }
            
            $('body > .nicescroll-rails').remove ();
            
            $('.variations').each (function () {
                if ($(this).qtip ('api')) { 
                    $(this).qtip ('api').hide ();    
                    $(this).qtip ('api').disable ();    
                }
            });

            $('.products-details .product .amount input[data-bind="amount"]').each (function () {
                if ($(this).qtip ('api')) { 
                    $(this).qtip ('api').hide ();    
                    $(this).qtip ('api').disable ();    
                }
            });

            $('.qtip').remove ();
        }
    };
}()));