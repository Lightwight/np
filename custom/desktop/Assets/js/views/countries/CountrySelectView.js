np.view.extend ('CountrySelectView', {
    didInsert: function () {
        var data, valid;
        
        this('.selectpicker').selectpicker ({size: 4, title: 'Land', mobile: true});
        
        data    = this().data ('selected');
        valid   = typeof data === 'string' && !data.empty ();
        
        
        this('.selectpicker').selectpicker ('val', (valid ? data : 'Land'));
    }
});