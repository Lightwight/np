np.model.extend ('Auth', {
    singular:   'Auth',
    
    logout_success: false,
    logout_error: false,
    
    checkout_step: function () { 
        var address, steps;
                
        address = $.address.path ();
        
        steps   =   {
            '/checkout/user':       1,
            '/checkout/address':    2
        };
        
        this.checkout_step   = steps[address] !== 'undefined' ? steps[address] : 1;

        return this.checkout_step; 
    },
    
    validGender: function () {
        this.validGender = this.gender === 'male' || this.gender === 'female';
        
        return this.validGender;
    },
    
    validMail: function () {
        this.validMail  = typeof this.email === 'string' && this.email.complies ('mail');
        
        return this.validMail;
    },
    
    validMailConfirmation: function () {
        this.validMailConfirmation  = typeof this.email === 'string' && this.email.length > 0 && this.email_confirmation === this.email;
        
        return this.validMailConfirmation;
    },
    
    validPrename: function () {
        this.validPrename   = typeof this.prename === 'string' && this.prename.length > 0;
        
        return this.validPrename;
    },
    
    validName: function () {
        this.validName  = typeof this.name === 'string' && this.name.length > 0;
        
        return this.validName;
    },
    
    validBillingCountry: function () {
        this.validBillingCountry    = typeof this.billing_country === 'string' && this.billing_country.length > 0;
        
        return this.validBillingCountry;
    },
    
    validShippingCountry: function () {
        this.validShippingCountry   = typeof this.validShippingCountry === 'string' && this.validShippingCountry.length > 0;
        
        return this.validShippingCountry;
    },
    
    validData: function () {
        return np.checkout.validCheckout (this.checkout_step);
    }
});