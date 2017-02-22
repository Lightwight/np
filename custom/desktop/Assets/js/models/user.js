np.model.extend ('User', {
    errors: function () {
        return this.errors || 0;
    },
    
    success: function () {
        return this.success || false;
    },
    
    password_confirmation: function () {
        return this.password_confirmation || '';
    },
    
    sending: function () {
        return this.sending || false;
    }
});