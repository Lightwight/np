/* 
 * Copyright (C) 2015 cross
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

np.plugin.extend ('search_optimizer', (function () {
    return {
        optimize: function (searchType, model, model_id, searchTerm) {
            var request;

            request = {
                search_optimizer:   {
                    optimize: {
                        type:   searchType,
                        model:  model,
                        id:     model_id,
                        term:   searchTerm
                    }
                },
                type:               'search_optimizer'
            };

            np.ajax(
            {
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {})
            .fail (function (rsp) {});             
        }
    };
})());