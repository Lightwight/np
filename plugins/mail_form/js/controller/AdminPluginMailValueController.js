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

np.controller.extend ('AdminPluginMailValueController', {
    view:       'AdminPluginMailValueView',
    model:  function () {
        return {AdminPluginMailValue: this};
    },
    
    events: {
        setValue: function (view) {
            this.set ('value', view.get ('value'));
        },

        removeNewValue: function (view) {
            var values;

            np.observable.update ('AdminPluginMailValue', this.get ('id'), 'removed', true);
            np.observable.removeContext ('AdminPluginMailValue', this.get ('id'));
            
            values  = np.observable.getModelByContext ('AdminPluginMailValue');
            
            $.each (values, function (inx, value) {
                np.observable.update ('AdminPluginMailValue', value.id, 'order', value.order);
            });            
            
            $.each (values, function (inx, value) {
                np.observable.update ('AdminPluginMailValue', value.id, 'changed_order', true);
            });            
        },
        
        setNewValue: function (view) {
            this.set ('value', view.get ('new_value'));
        },
        
        sort: function () {
            var values;
                
            values  = np.observable.getModelByContext ('AdminPluginMailValue');

            $.each (values, function (inx, value) {
                np.observable.update ('AdminPluginMailValue', value.id, 'changed_order', true);
            });            
        }
    }
});