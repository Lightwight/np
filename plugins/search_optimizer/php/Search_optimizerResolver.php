<?php

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

class Search_optimizerResolver extends ControllerHelper
{
    public function resolveParameters_get ($type)   {}
    
    public function resolveParameters_post ($type)
    {
        $contents   = array ();
        $parameters = array ();
        
        parse_str (file_get_contents ('php://input'), $contents);

        if (isset ($contents[$type]))
        {
            $parameters = $contents[$type];

            if (isset ($parameters['optimize']))
            {
                return $this->resolveOptimize ($parameters['optimize']);
            }
        }
    }
    
    private function resolveOptimize ($parameters)
    {
        $type       = isset ($parameters['type']) ? filter_var (strtolower ($parameters['model']), FILTER_SANITIZE_STRING) : false;
        $model      = isset ($parameters['model']) ? filter_var ($parameters['model'], FILTER_SANITIZE_STRING) : false;
        $id         = isset ($parameters['id']) ? (int)$parameters['id'] : false;
        $term       = isset ($parameters['term']) ? filter_var ($parameters['term'], FILTER_SANITIZE_URL) : false;

        if ($model && $id && $term)
        {
            return array 
            (
                'search_optimizer' => array 
                (
                    'optimize'  => array
                    (
                        'type'  => $type,
                        'model' => $model,
                        'id'    => $id,
                        'term'  => $term
                    )
                )
            );
        }
    }
}