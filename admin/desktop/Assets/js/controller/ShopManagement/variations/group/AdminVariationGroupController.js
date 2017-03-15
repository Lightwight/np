np.controller.extend ('AdminVariationGroupController', (function () {
    var currentGroup, isNew;
    
    function getPage ()
    {
        return parseInt (np.route.getBookmarkItem (), 10);
    }
    
    return {
        view:   'AdminVariationGroupView',
        model:  function () {
            var groupID, group,
                _def, _row;
            
            groupID         = getPage ();
            isNew           = groupID === -1;
            group           = {
                id: -2
            };
            
            if (isNew) {
                _def    = np.model.Article_variation_groups.definition ();

                _row    = {
                    id:         -1,
                    sending:    false,
                    success:    false,
                    failed:     false
                };

                $.map (_def, function (v, k) {
                    if (k !== 'id') { 
                        _row[k] = v === 'number' ? 0 : ''; 
                    }
                });
                
                np.model.Article_variation_groups.add (_row);
            }
            
            np.model.Article_variation_groups.findByGroupId (groupID).each (function (row) {
                currentGroup    = row;
                group           = np.jsonClone (row.getAll ());
            });
            
            group.sending       = false;
            group.success       = false;
            
            return {AdminVariationGroup: group};
        },
        
        events: {
            setGroupName: function (view) {
                this.set ('group_name', view.get ('group_name'));
            },
            
            setSort: function (view) {
                this.set ('Sort', view.get ('Sort'));
            },
            
            saveGroup: function () {
                var _t, notifyMsg;
                
                _t  = this;

                currentGroup.setGroupName (_t.get ('group_name'));
                
                _t.set ('sending', true);
                
                currentGroup
                .save ()
                .then (function (rsp) {
                    _t.set ('sending', false);
                    _t.set ('success', true);
                    
                    notifyMsg   = !isNew ? 'Die Variationsgruppe wurde gespeichert.' : 'Die Variationsgruppe wurde angelegt.';

                    np.notify (notifyMsg).asSuccess ().timeout (2000).show ();
                    
                    if (isNew) {
                        np.routeTo ('/admin/shopmanagement/variations/group/'+rsp.getID ());
                    } 
                })
                .fail (function (err) {
                    _t.set ('sending', false);
                    _t.set ('success', false);
                    
                    np.notify ('Die Variationsgruppe konnte nicht gespeichert werden.<br><br>'+ err).asError ().timeout (4000).show ();                    
                });
            },
            
            removeGroup: function (view) {
                var _t;

                _t  = this;

                _t.set ('error', false);

                np.Modal
                .dialog ('#remove-group')
                .apply (function () {
                    np.model.Article_variation_groups.findByGroupId (_t.get ('group_id')).each (function (row) {
                        row.remove ();
                    });

                    _t.set ('sending', true);

                    np.model.Article_variation_groups
                    .save ()
                    .then (function (rsp) {
                        _t.set ('sending', false);
                        _t.set ('removed', true);
                        _t.set ('deleted', 1);

                        np.observable.removeContext ('AdminVariationGroup', _t.get ('id'));
                    })
                    .fail (function (err) {
                        _t.set ('error', err);
                        _t.set ('sending', false);
                        _t.set ('removed', false);
                    });                
                });                
            }            
        }
    };
})());