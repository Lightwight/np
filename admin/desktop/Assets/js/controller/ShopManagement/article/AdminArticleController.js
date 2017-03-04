np.controller.extend ('AdminArticleController', (function () {
    var currentArticle;
    
    function calcPriceBrutto (netto, tax) 
    {
        var _netto, _tax, _result;
        
        _netto  = parseFloat (netto);
        _tax    = parseInt (tax, 10) / 100;
        _result = parseFloat (_netto * (1+_tax)).toFixed (5);
        
        return !isNaN (_result) ? _result : '';
    }
    
    function calcPriceNetto (brutto, tax) 
    {
        var _brutto, _tax, _result;
        
        _brutto = parseFloat (brutto);
        _tax    = parseInt (tax, 10) / 100;
        _result = parseFloat (_brutto / (1+_tax)).toFixed (5);
        
        return !isNaN (_result) ? _result : '';
    }
    
    function getPage ()
    {
        return parseInt (np.route.getBookmarkItem (), 10);
    }
    
    return {
        view:   'AdminArticleView',
        model:  function () {
            var article, categories, taxes, units, manufacturers, suppliers, warehouses;

            categories      = new Array ();
            taxes           = new Array ();
            units           = new Array ();
            manufacturers   = new Array ();
            suppliers       = new Array ();
            warehouses      = new Array ();
            
            np.model.Products.findByID (getPage ()).each (function (row) {
                currentArticle  = row;
                article         = np.jsonClone (row.getAll ());
            });
            
            np.model.Article_categories.findAll ().each (function (row) {
                categories.push (row.getAll ());
            });

            np.model.Taxes.findAll ().each (function (row) {
                taxes.push (row.getAll ());
            });
            
            np.model.Article_units.findAll ().each (function (row) {
                units.push (row.getAll ());
            });
            
            np.model.Article_manufacturers.findAll ().each (function (row) {
                manufacturers.push (row.getAll ());
            });
            
            np.model.Article_suppliers.findAll ().each (function (row) {
                suppliers.push (row.getAll ());
            });

            np.model.Article_warehouses.findAll ().each (function (row) {
                warehouses.push (row.getAll ());
            });

            article.categories          = categories;
            article.taxes               = taxes;
            article.units               = units;
            article.manufacturers       = manufacturers;
            article.suppliers           = suppliers;
            article.warehouses          = warehouses;
            article.price_brutto        = calcPriceBrutto (article.price, article.tax);
            article.supplier_ek_brutto  = calcPriceBrutto (article.supplier_ek, article.supplier_tax);
            
            article.paypal_enabled                  = parseInt (article.payment_gateways[1], 10) === 1;
            article.debit_enabled                   = parseInt (article.payment_gateways[2], 10) === 1;
            article.banktransfer_enabled            = parseInt (article.payment_gateways[3], 10) === 1;
            article.cod_enabled                     = parseInt (article.payment_gateways[4], 10) === 1;
            
            article.sending                         = false;
            article.savingArticleGlobalSettings     = false;
            article.savingArticleSettings           = false;
            article.savingArticlePayments           = false;
            article.savingManufacturerSettings      = false;
            article.savingSupplierSettings          = false;
            article.savingWarehouseSettings         = false;
            
            article.success                         = false;
            
            return {AdminArticle: article};
        },
        
        events: {
            showMediathek: function () {
                np.mediathek.show (this, 'show', false, 'image', 'type');
            },
            
            setName: function (view) {
                this.set ('name', view.get ('name'));
            },
            
            setTitle: function (view) {
                this.set ('title', view.get ('title'));
            },
            
            setDescription: function (view) {
                this.set ('description', view.get ('description'));
            },
            
            toggleIsNew: function () {
                this.set ('is_new', (this.get ('is_new') ? 0 : 1));
            },
            
            toggleEnabled: function () {
                this.set ('enabled', parseInt (this.get ('enabled'), 10) === 1 ? 0 : 1);
            },
            
            toggleDeliverable: function () {
                this.set ('deliverable', (this.get ('deliverable') ? 0 : 1));
            },
            
            toggleTopOffer: function () {
                this.set ('top_offer', (this.get ('top_offer') ? 0 : 1));
            },

            toggleOversaleable: function () {
                this.set ('oversaleable', (this.get ('oversaleable') ? 0 : 1));
            },
            
            setCategoryID: function (view) {
                this.set ('category_id', parseInt (view.get ('c_id'), 10));
            },

            setUnitID: function (view) {
                this.set ('unit_id', parseInt (view.get ('u_id'), 10));
            },
            
            setWeight: function (view) {
                var weight;
                
                weight  = parseInt (view.get ('weight'), 10);
                
                if (isNaN (weight) || weight === 0) { weight = '';   }
                this.set ('weight', weight);
            },

            setWeightUnit: function (view) {
                this.set ('weight_unit', view.get ('w_unit'));
            },            

            setPackUnit: function (view) {
                this.set ('pack_unit', view.get ('pack_unit'));
            },

            setTax: function (view) {
                var price, price_brutto, tax;
                
                tax = parseInt (view.get ('article_tax'), 10);
                if (isNaN (tax))    { tax = ''; }
                
                this.set ('tax', tax);
                this.set ('price_brutto', calcPriceBrutto (view.get ('price'), tax));
            },
            
            setPriceNetto: function (view) {
                var price, price_brutto, tax;
                
                tax             = parseInt (view.get ('article_tax'), 10);
                price           = parseFloat (view.get ('price').replace (/,/g, '.')).toFixed (5);
                price_brutto    = calcPriceBrutto (price, tax);

                this.set ('price_brutto', price_brutto);
            },

            setPriceBrutto: function (view) {
                var price, price_brutto, tax;
                
                tax             = parseInt (view.get ('article_tax'), 10);
                price_brutto    = parseFloat (view.get ('price_brutto').replace (/,/g, '.')).toFixed (5);
                price           = calcPriceNetto (price_brutto, tax);

                this.set ('price', price);
            },

            setManufacturerID: function (view) {
                this.set ('manufacturer_id', parseInt (view.get ('man_id'), 10));
            },
            
            setHAN: function (view) {
                this.set ('han', view.get ('han'));
            },

            setSupplierID: function (view) {
                this.set ('supplier_id', parseInt (view.get ('sup_id'), 10));
            },
            
            setSupplierTax: function (view) {
                var tax;
                
                tax = parseInt (view.get ('sup_tax'), 10);
                if (isNaN (tax)) { tax = '';    }

                this.set ('supplier_tax', tax);
                this.set ('supplier_ek_brutto', calcPriceBrutto (view.get ('supplier_ek'), tax));
            },

            setEKNetto: function (view) {
                var price, price_brutto, tax;
                
                tax = parseInt (view.get ('sup_tax'), 10);
                if (isNaN (tax)) { tax = 1;    }
                
                price           = parseFloat (view.get ('supplier_ek').replace (/,/g, '.')).toFixed (5);
                price_brutto    = calcPriceBrutto (price, tax);
                
                this.set ('supplier_ek_brutto', price_brutto);
            },
            
            setEKBrutto: function (view) {
                var price, price_brutto, tax;
                
                tax = parseInt (view.get ('sup_tax'), 10);
                if (isNaN (tax)) { tax = 1;    }
                
                price_brutto    = parseFloat (view.get ('supplier_ek_brutto').replace (/,/g, '.')).toFixed (5);
                price           = calcPriceNetto (price_brutto, tax);
                
                this.set ('supplier_ek', calcPriceNetto (view.get ('supplier_ek_brutto'), tax));
            },
            
            setWarehouseID: function (view) {
                this.set ('warehouse_id', parseInt (view.get ('ware_id'), 10));
            },
            
            setStock: function (view) {
                this.set ('stock', parseFloat (view.get ('stock')));
            },
            
            togglePaypal: function (view) {
                this.set ('paypal_enabled', !this.get ('paypal_enabled'));
            },

            toggleDebit: function (view) {
                this.set ('debit_enabled', !this.get ('debit_enabled'));
            },

            toggleBanktransfer: function (view) {
                this.set ('banktransfer_enabled', !this.get ('banktransfer_enabled'));
            },
            
            toggleCod: function (view) {
                this.set ('cod_enabled', !this.get ('cod_enabled'));
            },
            
            saveArticle: function () {
                var _t;
                
                _t  = this;

                currentArticle.setImage (_t.get ('image'));
                currentArticle.setName (_t.get ('name'));
                currentArticle.setTitle (_t.get ('title'));
                currentArticle.setDescription (_t.get ('description'));
                
                _t.set ('sending', true);
                
                currentArticle
                .save ()
                .then (function (rsp) {
                    _t.set ('sending', false);
                    _t.set ('success', true);
                })
                .fail (function (err) {
                    _t.set ('sending', false);
                    _t.set ('success', false);
                });
            },
            
            saveArticleGlobalSettings: function () {
                var _t;
                
                _t  = this;

                currentArticle.setIsNew (_t.get ('is_new'));
                currentArticle.setEnabled (_t.get ('enabled'));
                currentArticle.setDeliverable (_t.get ('deliverable'));
                currentArticle.setTopOffer (_t.get ('top_offer'));
                currentArticle.setOversaleable (_t.get ('oversaleable'));

                _t.set ('savingArticleGlobalSettings', true);
                
                currentArticle
                .save ()
                .then (function () {
                    _t.set ('savingArticleGlobalSettings', false);
                    _t.set ('success', true);
                })
                .fail (function () {
                    _t.set ('savingArticleGlobalSettings', false);
                    _t.set ('success', false);
                });
            },
            
            saveArticleSettings: function () {
                var _t, weight, price, price_brutto, tax;
                
                _t  = this;

                weight  = parseInt (_t.get ('weight'), 10);
                if (isNaN (weight)) { weight = 0;   }
                
                tax     = parseInt (_t.get ('tax'), 10);
                if (isNaN (tax)) { tax = 0; }

                price           = parseFloat ((''+_t.get ('price')).replace (/,/g, '.')).toFixed (5);
                price_brutto    = calcPriceBrutto (price, tax);

                currentArticle.setCategoryId (_t.get ('category_id'));
                currentArticle.setUnitId (_t.get ('unit_id'));
                currentArticle.setWeight (weight);
                currentArticle.setWeightUnit (_t.get ('weight_unit'));
                currentArticle.setPackUnit (_t.get ('pack_unit'));
                currentArticle.setTax (tax);
                currentArticle.setPrice (price);
                
                _t.set ('savingArticleSettings', true);
                
                currentArticle
                .save ()
                .then (function () {
                    _t.set ('savingArticleSettings', false);
                    _t.set ('success', true);
                })
                .fail (function () {
                    _t.set ('savingArticleSettings', false);
                    _t.set ('success', false);
                });
            },
            
            saveArticlePayments: function () {
                var _t, payments;
                
                _t          = this;
                
                payments    = {
                    1:  _t.get ('paypal_enabled') === false ? 0 : 1,
                    2:  _t.get ('debit_enabled') === false ? 0 : 1,
                    3:  _t.get ('banktransfer_enabled') === false ? 0 : 1,
                    4:  _t.get ('cod_enabled') === false ? 0 : 1
                };

                currentArticle.setPaymentGateways (payments);
                
                _t.set ('savingArticlePayments', true);
                
                currentArticle
                .save ()
                .then (function () {
                    _t.set ('savingArticlePayments', false);
                    _t.set ('success', true);
                })
                .fail (function () {
                    _t.set ('savingArticlePayments', false);
                    _t.set ('success', false);
                });
            },
            
            saveManufacturerSettings: function () {
                var _t;
                
                _t  = this;

                currentArticle.setManufacturerId (_t.get ('manufacturer_id'));
                currentArticle.setHan (_t.get ('han'));
                
                _t.set ('savingManufacturerSettings', true);
                
                currentArticle
                .save ()
                .then (function () {
                    _t.set ('savingManufacturerSettings', false);
                    _t.set ('success', true);
                })
                .fail (function () {
                    _t.set ('savingManufacturerSettings', false);
                    _t.set ('success', false);
                });
            },
            
            saveSupplierSettings: function () {
                var _t, price, price_brutto, tax;
                
                _t  = this;

                tax     = parseInt (_t.get ('supplier_tax'), 10);
                if (isNaN (tax)) { tax = 0; }

                price               = parseFloat ((''+_t.get ('supplier_ek')).replace (/,/g, '.')).toFixed (5);
                price_brutto        = parseFloat ((''+_t.get ('supplier_ek_brutto')).replace (/,/g, '.')).toFixed (5);

                currentArticle.setSupplierId (_t.get ('supplier_id'));
                currentArticle.setSupplierTax (tax);
                currentArticle.setSupplierEk (_t.get ('supplier_ek'));
                
                _t.set ('supplier_ek', price);
                _t.set ('supplier_ek_brutto', price_brutto);
                _t.set ('savingSupplierSettings', true);
                
                currentArticle
                .save ()
                .then (function () {
                    _t.set ('savingSupplierSettings', false);
                    _t.set ('success', true);
                })
                .fail (function () {
                    _t.set ('savingSupplierSettings', false);
                    _t.set ('success', false);
                });
            },
            
            saveWarehouseSettings: function () {
                var _t;
                
                _t  = this;

                currentArticle.setWarehouseId (_t.get ('warehouse_id'));
                currentArticle.setStock (_t.get ('stock'));
                
                _t.set ('savingWarehouseSettings', true);
                
                currentArticle
                .save ()
                .then (function () {
                    _t.set ('savingWarehouseSettings', false);
                    _t.set ('success', true);
                })
                .fail (function () {
                    _t.set ('savingWarehouseSettings', false);
                    _t.set ('success', false);
                });
            }
        }
    };
})());