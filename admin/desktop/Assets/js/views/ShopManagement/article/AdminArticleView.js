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

np.view.extend ('AdminArticleView', {
    didInsert: function () {
        $('#admin-article-tax').niceSelect ();
        $('#admin-article-sup-tax').niceSelect ();
        $('#admin-article-weight-unit').niceSelect ();
        $('#admin-article-category').niceSelect ();
        $('#admin-article-unit').niceSelect ();
        $('#admin-article-manufacturer').niceSelect ();
        $('#admin-article-supplier').niceSelect ();
        $('#admin-article-warehouse').niceSelect ();
    },

    setIsNew: function (model) {
        if (model.get ('is_new')) {
            this.prop ('checked', 'checked');
        } else {
            this.prop ('checked', '');
        }
    }.observes ('is_new').on ('change'),

    setEnabled: function (model) {
        if (model.get ('enabled')) {
            this.prop ('checked', 'checked');
        } else {
            this.prop ('checked', '');
        }
    }.observes ('enabled').on ('change'),

    setDeliverable: function (model) {
        if (model.get ('deliverable')) {
            this.prop ('checked', 'checked');
        } else {
            this.prop ('checked', '');
        }
    }.observes ('deliverable').on ('change'),

    setTopOffer: function (model) {
        if (model.get ('top_offer')) {
            this.prop ('checked', 'checked');
        } else {
            this.prop ('checked', '');
        }
    }.observes ('top_offer').on ('change'),

    setOversaleable: function (model) {
        if (model.get ('oversaleable')) {
            this.prop ('checked', 'checked');
        } else {
            this.prop ('checked', '');
        }
    }.observes ('oversaleable').on ('change'),

    setCategoryID: function (model) {
        var id;

        id  = parseInt (model.get ('category_id'), 10);

        this.find ('option').each (function () {
            if (parseInt ($(this).val (), 10) === id) {
                $(this).prop ('selected', 'selected');
            } else {
                $(this).prop ('selected', '');
            }
        });
    },    

    setUnitID: function (model) {
        var id;

        id  = parseInt (model.get ('unit_id'), 10);

        this.find ('option').each (function () {
            if (parseInt ($(this).val (), 10) === id) {
                $(this).prop ('selected', 'selected');
            } else {
                $(this).prop ('selected', '');
            }
        });
    },    

    setManufacturerID: function (model) {
        var id;

        id  = parseInt (model.get ('manufacturer_id'), 10);

        this.find ('option').each (function () {
            if (parseInt ($(this).val (), 10) === id) {
                $(this).prop ('selected', 'selected');
            } else {
                $(this).prop ('selected', '');
            }
        });
    },    

    setSupplierID: function (model) {
        var id;

        id  = parseInt (model.get ('supplier_id'), 10);

        this.find ('option').each (function () {
            if (parseInt ($(this).val (), 10) === id) {
                $(this).prop ('selected', 'selected');
            } else {
                $(this).prop ('selected', '');
            }
        });
    },    

    setWarehouseID: function (model) {
        var id;

        id  = parseInt (model.get ('warehouse_id'), 10);

        this.find ('option').each (function () {
            if (parseInt ($(this).val (), 10) === id) {
                $(this).prop ('selected', 'selected');
            } else {
                $(this).prop ('selected', '');
            }
        });
    },    

    setWeightUnit: function (model) {
        var unit;

        unit    = model.get ('weight_unit');

        this.find ('option').each (function () {
            if ($(this).val () === unit) {
                $(this).prop ('selected', 'selected');
            } else {
                $(this).prop ('selected', '');
            }
        });
    },    

    setMediaImage: function (model) {
        var image;

        image   = model.get ('image');

        if (image && image.length > 0) {
            this.html ('');
            this.css ('background-image', 'url('+image+')');
            this.css ('color', '#FFFFFF');
        } else {
            this.html ('Vorschau');
            this.css ('background-image', '');
            this.css ('color', '');
        } 
    }.observes ('image').on ('change'),

    setTax: function (model) {
        var tax;

        tax = parseInt (model.get ('tax'), 10);

        this.find ('option').each (function () {
            if (parseInt ($(this).val (), 10) === tax) {
                $(this).prop ('selected', 'selected');
            } else {
                $(this).prop ('selected', '');
            }
        });
    },

    setSupplierTax: function (model) {
        var tax;

        tax = parseInt (model.get ('supplier_tax'), 10);

        this.find ('option').each (function () {
            if (parseInt ($(this).val (), 10) === tax) {
                $(this).prop ('selected', 'selected');
            } else {
                $(this).prop ('selected', '');
            }
        });
    },

    savingArticle: function (model) {
        if (model.get ('sending')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('sending').on ('change'),

    disableSaveArticle: function (model) {
        if (model.get ('sending')) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }.observes ('sending').on ('change'),

    setPaypal: function (model) {
        if (model.get ('paypal_enabled')) {
            this.prop ('checked', 'checked');
        } else {
            this.prop ('checked', '');
        }
    }.observes ('paypal_enabled').on ('change'),

    setDebit: function (model) {
        if (model.get ('debit_enabled')) {
            this.prop ('checked', 'checked');
        } else {
            this.prop ('checked', '');
        }
    }.observes ('debit_enabled').on ('change'),

    setBanktransfer: function (model) {
        if (model.get ('banktransfer_enabled')) {
            this.prop ('checked', 'checked');
        } else {
            this.prop ('checked', '');
        }
    }.observes ('banktransfer_enabled').on ('change'),

    setCod: function (model) {
        if (model.get ('cod_enabled')) {
            this.prop ('checked', 'checked');
        } else {
            this.prop ('checked', '');
        }
    }.observes ('cod_enabled').on ('change'),

    flushArticles: function () {
        np.model.Products.flush ();
    }.observes ('route.before').on ('change'),
    
    removedArticle: function (model) {
        var _t;
        
        _t  = this;

        if (model.get ('removed')) {
            window.setTimeout (function () {
                _t.click ();
            }, 2000);
        }
    }.observes ('removed').on ('change')
});