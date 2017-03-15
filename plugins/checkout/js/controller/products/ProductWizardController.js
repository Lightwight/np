np.controller.extend ('ProductWizardController', {
    view:   'ProductWizardView',
    model:  function () {
        var fleisch, panade, sossen, beilagen, extras;
    
        fleisch     = {category: '', categoryID: 0, products: new Array ()};
        panade      = {category: '', categoryID: 0, products: new Array ()};
        extras      = {category: '', categoryID: 0, products: new Array ()};
        
        sossen      = 
        {
            category:       '', 
            categoryID:     0, 
            lecker: {
                category:       '',
                categoryID:     0,
                products:       new Array ()
            },
                
            superlecker: {
                category:       '',
                categoryID:     0,
                products:       new Array ()
            },
            
            spezial:    {
                category:       '',
                categoryID:     0,
                products:       new Array ()
            }
        };
        
        beilagen    = 
        {
            category:       '', 
            categoryID:     0, 
            lecker: {
                category:       '',
                categoryID:     0,
                products:       new Array ()
            },

            superlecker: {
                category:       '',
                categoryID:     0,
                products:       new Array ()
            }
        };
        
        // Category: Fleisch
        np.model.Article_categories.findByKeyKategorie (7).each (function (row) {
            fleisch.category    = row.getKeyBeschreibung ();
            fleisch.categoryID  = row.getKeyKategorie ();
            
            np.model.Products.findByCategoryId (fleisch.categoryID).each (function (prod) {
                fleisch.products.push (prod.getAll ());
            });
        });
        
        // Category: Panade
        np.model.Article_categories.findByKeyKategorie (8).each (function (row) {
            panade.category     = row.getKeyBeschreibung ();
            panade.categoryID   = row.getKeyKategorie ();
            
            np.model.Products.findByCategoryId (panade.categoryID).each (function (prod) {
                panade.products.push (prod.getAll ());
            });
        });
        
        // Category: Extras
        np.model.Article_categories.findByKeyKategorie (11).each (function (row) {
            extras.category     = row.getKeyBeschreibung ();
            extras.categoryID   = row.getKeyKategorie ();
            
            np.model.Products.findByCategoryId (extras.categoryID).each (function (prod) {
                extras.products.push (prod.getAll ());
            });
        });
        
        // Category: Sossen
        np.model.Article_categories.findByKeyKategorie (9).each (function (row) {
            sossen.category     = row.getKeyBeschreibung ();
            sossen.categoryID   = row.getKeyKategorie ();
            
            // Sub-Category: Lecker
            np.model.Article_categories.findByKeyKategorie (12).each (function (cat) {
                sossen.lecker.category          = cat.getKeyBeschreibung ();
                sossen.lecker.categoryID        = cat.getKeyKategorie ();
                
                np.model.Products.findByCategoryId (sossen.lecker.categoryID).each (function (prod) {
                    sossen.lecker.products.push (prod.getAll ());
                });
            });
            
            // Sub-Category: Superlecker
            np.model.Article_categories.findByKeyKategorie (13).each (function (cat) {
                sossen.superlecker.category      = cat.getKeyBeschreibung ();
                sossen.superlecker.categoryID    = cat.getKeyKategorie ();
                
                np.model.Products.findByCategoryId (sossen.superlecker.categoryID).each (function (prod) {
                    sossen.superlecker.products.push (prod.getAll ());
                });
            });
            
            // Sub-Category: Spezial
            np.model.Article_categories.findByKeyKategorie (16).each (function (cat) {
                sossen.spezial.category       = cat.getKeyBeschreibung ();
                sossen.spezial.categoryID     = cat.getKeyKategorie ();
                
                np.model.Products.findByCategoryId (sossen.spezial.categoryID).each (function (prod) {
                    sossen.spezial.products.push (prod.getAll ());
                });
            });
        });
        
        // Category: Beilagen
        np.model.Article_categories.findByKeyKategorie (10).each (function (row) {
            beilagen.category     = row.getKeyBeschreibung ();
            beilagen.categoryID   = row.getKeyKategorie ();
            
            // Sub-Category: Lecker
            np.model.Article_categories.findByKeyKategorie (14).each (function (cat) {
                beilagen.lecker.category          = cat.getKeyBeschreibung ();
                beilagen.lecker.categoryID        = cat.getKeyKategorie ();
                
                np.model.Products.findByCategoryId (beilagen.lecker.categoryID).each (function (prod) {
                    beilagen.lecker.products.push (prod.getAll ());
                });
            });
            
            // Sub-Category: Superlecker
            np.model.Article_categories.findByKeyKategorie (15).each (function (cat) {
                beilagen.superlecker.category      = cat.getKeyBeschreibung ();
                beilagen.superlecker.categoryID    = cat.getKeyKategorie ();
                
                np.model.Products.findByCategoryId (beilagen.superlecker.categoryID).each (function (prod) {
                    beilagen.superlecker.products.push (prod.getAll ());
                });
            });
        });
        
        return {
            ProductWizard: {
                id:         -1,
                fleisch:    fleisch,
                panade:     panade,
                sossen:     sossen,
                beilagen:   beilagen,
                extras:     extras
            }
        };
    }
});