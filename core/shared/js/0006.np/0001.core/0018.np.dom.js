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

np.module ('dom', ( function () {
    return {
        generate:   function (data) {
            var cpData, root, generated;
            
            cpData      = np.jsonClone (data);
            
            function buildElement (parent, data) {
                var i, j, a;
                
                for (i in data) {
                    var name, nodes, attrs;
                    
                    if (i === 'nodes') {
                        for (j in data[i]) {
                            for (name in data[i][j]) {
                                generated   = name !== 'text' ? $('<'+name+'></'+name+'>') : data[i][j][name];
                                attrs       = typeof data[i][j][name]['attrs'] === 'object' ? data[i][j][name].attrs : false;
                                nodes       = typeof data[i][j][name]['nodes'] === 'object' ? data[i][j][name].nodes : false;
                                
                                if (parent === false)   { root = generated;             } 
                                else                    { parent.append (generated);    }
                                
                                if (attrs) { 
                                    for (a in attrs) { 
                                        if (a === 'class')      { generated.addClass (attrs[a]);    }
                                        else if (a === 'html')  { generated.html (attrs[a]);        }
                                        else                    { generated.attr (a, attrs[a]);     }
                                    } 
                                }
                                
                                if (nodes)  { buildElement (generated, {nodes:nodes});  }
                            }
                        }
                    }
                }
            }
            
            buildElement (false, cpData);
            
            return root;
        }
    };
}()));