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

np.module('help', {});
np.module('help.storage', {});

np.module('help.module', function (module) {
    var tOf, is_valid, warn_data, divider, module_name;
    
    divider     = '==========================================================';
    warn_data   = new Array('unknown failure');
    tOf         = typeof module;
    is_valid    = validateFormat(module, tOf);
    
    function warn (data) { $.each (data, function (i,line) { np.warn (line); }); }
    
    if (is_valid) {
        module_name = module.name;
        
        delete module.name;
        
        this.storage[module_name]   = module;
        
        return true;
    } else {
        warn (warn_data);
        
        return false;
    }
    
    function validateFormat (data, type) {
        var has_module_name, has_type, has_method, has_name, has_description, has_params, 
            has_returns, has_example, has_all, help_method, help_type;
        
        if (type === 'object') {
            has_module_name = typeof data.name !== 'undefined';
            has_type        = typeof data.type !== 'undefined';
            
            if (has_module_name && has_type) {
                help_type   = data.type === 'method' ? 'method' : data.type === 'property' ? 'property' : false;                
                
                if (help_type) {
                    if (help_type === 'method') {
                        has_method  = typeof data[help_type] !== 'undefined';

                        if (has_method) {
                            help_method = data[help_type];
                            
                            if( typeof help_method === 'object' ) {
                                has_name        = typeof data.method.name !== 'undefined';
                                has_description = typeof data.method.description !== 'undefined';
                                has_params      = typeof data.method.params !== 'undefined';
                                has_returns     = typeof data.method.returns !== 'undefined';
                                has_example     = typeof data.method.example !== 'undefined';
                                has_all         = has_name && has_description && has_params && has_returns && has_example;
                                
                                if( has_all ) {
                                    return true;
                                } else {
                                    prepareWarn ('missing_method_assignments', data);
                                    
                                    return false;
                                }
                            } else {
                                prepareWarn ('wrong_method', data);
                                
                                return false;
                            }
                            
                        } else {
                            prepareWarn ('missing_method');
                            
                            return false;
                        }
                    } else {
                        
                    }
                } else {
                    prepareWarn ('missing_type_assignment', data);
            
                    return false;
                }
            } else {
                if (!has_module_name) {
                    prepareWarn ('missing_module_name', data);
                } else {
                    prepareWarn ('missing_type', data);
                }
                
                return false;
            }
        } else if (type === 'string') {
            
        } else { 
            return false;
        }
        
        function prepareWarn (warn_type, data) {
            var has_name, has_description, has_params, has_returns, has_example;
                    
            switch (warn_type) {
                case 'missing_module_name':
                    warn_data   = new Array (
                        divider, 
                        'help.module({data}) invalid format:', 
                        'missing property \'name\'',
                        ' ', 
                        'usage:', 
                        'np.help.module({', 
                        '    name: \'moduleName\',', 
                        '    ...',
                        '});', 
                        'you have to assign a module-name.'
                    );
                    
                    break;
                case 'missing_type':
                    warn_data   = new Array (
                        divider, 
                        'help.module({data}) invalid format:', 
                        'missing property \'type\'',
                        ' ', 
                        'usage:', 
                        'np.help.module({', 
                        '    type: \'method\'|\'property\',', 
                        '    ...',
                        '});', 
                        'you can use \'method\' or \'property\' for the type assignement.'
                    );
                    
                    break;        
                    
                case 'missing_type_assignment':
                    warn_data = new Array (
                        divider,
                        'help.module({data}) invalid format:',
                        'invalid \'type\'-assignemnt',
                        ' ',
                        'usage:',
                        'np.help.module({',
                        '    type: \'method\'|\'property\',',
                        '    ...',
                        '});',
                        'you can use \'method\' or \'property\' for the type assignement.',
                        ' ',
                        'you passed: ',
                        '    type: \''+data.type+'\''
                    );
                    
                    break;
                    
                case 'missing_method':
                    warn_data = new Array (
                        divider,
                        'help.module({data}) invalid format:',
                        'missing property \'method\'',
                        ' ',
                        'usage:',
                        'np.help.module({',
                        '    type:   \'method\',',
                        '    method: {...}',
                        '});',
                        'add the \'method\'-property and assign a literal',
                        ' ',
                        'you just passed: ',
                        '    type: \'method\''
                    );
                    
                    break;
                    
                case 'wrong_method':
                    warn_data = new Array (
                        divider,
                        'help.module({data}) invalid format:',
                        'invalid type of property \'method\'-asignment',
                        ' ',
                        'usage:',
                        'np.help.module({',
                        '    type:      \'method\',',
                        '    method:    {}',
                        '});',
                        'assign a \'literal\' to the \'method\' property, not a \''+typeof data.method+'\'',
                        ' ',
                        'you passed: ',
                        '    type:      \'method\',',
                        '    method:    '+data.method+' <-- type of \''+typeof data.method+'\''
                    );
                    
                    break;
                case 'missing_method_assignments':
                    has_name        = typeof data.method.name !== 'undefined';
                    has_description = typeof data.method.description !== 'undefined';
                    has_params      = typeof data.method.params !== 'undefined';
                    has_returns     = typeof data.method.returns !== 'undefined';
                    has_example     = typeof data.method.example !== 'undefined';
                    
                    warn_data = new Array (
                        divider,
                        'help.module({data}) invalid format:',
                        'invalid type of property \'method\'-asignment',
                        ' ',
                        'usage:',
                        'np.help.module({',
                        '   type:      \'method\',',
                        '   method:    {',
                        '       name:           \'methodName\',',
                        '       description:    \'method description\',',
                        '       params:         false or {',
                        '           a_string:   \'string\',',
                        '           a_boolean:  \'boolean\',',
                        '           a_number:   \'number\',',
                        '           a_function: \'function\',',
                        '           an_array:   \'array\',',
                        '           an_object:  \'object\'',
                        '       },',
                        '       returns: string|boolean|number|array|function|object|null,',
                        '       example: \'a example how to use this method\'',
                        '   }',
                        '});',
                        'define the neccessary properties to the \'method-literal\'',
                        ' ',
                        'you passed: ',
                        '    type:      \'method\',',
                        '    method:    {',
                        '       name:           '+(!has_name ? 'not defined' : '\''+data.method.name+'\''),
                        '       description:    '+(!has_description ? 'not defined' : '\''+data.method.description+'\''),
                        '       params:         '+(!has_params ? 'not defined' : data.method.params),
                        '       returns:        '+(!has_returns ? 'not defined' : '\''+data.method.returns+'\''),
                        '       example:        '+(!has_example ? 'not defined' : '\''+data.method.example+'\''),
                        '    }'
                    );
                    
                    break;
            }
        }
    }
});