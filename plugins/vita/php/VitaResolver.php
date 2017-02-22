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

class VitaResolver extends ControllerHelper
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

            if (isset ($parameters['add']))
            {
                return $this->resolveAdd ($parameters['add']);
            }
            else if (isset ($parameters['update']))
            {
                return $this->resolveSave ($parameters['update']);
            }
            else if (isset ($parameters['del']))
            {
                return $this->resolveDelete ($parameters['del']);
            }
        }
    }
    
    private function resolveDelete ($parameters)
    {
        if (isset ($parameters['vita']))
        {
            $params     = $parameters['vita'];
            
            $routeID    = isset ($params['route_id']) ? (int)$params['route_id'] : -false;
            $vitaID     = isset ($params['vita_id']) ? (int)$params['vita_id'] : false;
            
            if ($routeID && $vitaID)
            {
                return array 
                (
                    'vitas' => array 
                    (
                        'del'  => array
                        (
                            'vita' => array
                            (
                                'route_id'          => $routeID,
                                'vita_id'           => $vitaID
                            )
                        )
                    )
                );
            }
        }
    }
    
    private function resolveSave ($parameters)
    {
        if (isset ($parameters['route_id']))
        {
            $vitas          = isset ($parameters['vitas']) ? $parameters['vitas'] : array ();
            $routeID        = isset ($parameters['route_id']) ? (int)$parameters['route_id'] : false;
            $result         = array 
            (
                'vitas'         => array (),
                'main_type'     => isset ($parameters['main_type']) ? filter_var ($parameters['main_type'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_HIGH | FILTER_FLAG_ENCODE_LOW) : '',
                'main_src'      => isset ($parameters['main_src']) ? filter_var ($parameters['main_src'], FILTER_SANITIZE_SPECIAL_CHARS) : '',
                'main_title'    => isset ($parameters['main_title']) ? filter_var ($parameters['main_title'], FILTER_SANITIZE_STRING) : '',
                'main_content'  => isset ($parameters['main_content']) ? filter_var ($parameters['main_content'], FILTER_UNSAFE_RAW) : ''
            );
            
            if (is_array ($vitas) && count ($vitas) > 0 && $routeID)
            {
                foreach ($vitas as $vita)
                {
                    $id         = isset ($vita['id']) ? (int)$vita['id'] : false;

                    $from       = isset ($vita['from']) ? filter_var ($vita['from'], FILTER_SANITIZE_STRING) : '';
                    $to         = isset ($vita['to']) ? filter_var ($vita['to'], FILTER_SANITIZE_STRING) : '';
                    $content    = isset ($vita['content']) ? filter_var ($vita['content'], FILTER_UNSAFE_RAW) : '';
                    $order      = isset ($vita['order']) ? (int)$vita['order'] : 1;

                    if (!$routeID)
                    {
                        return;
                    }

                    $result['vitas'][]   = array
                    (
                        'id'                => $id,
                        'from'              => $from,
                        'to'                => $to,
                        'content'           => $content,
                        'order'             => $order
                    );
                }
            }

            return array
            (
                'vitas'    => array
                (
                    'update'    => $result,
                    'route_id'  => $routeID
                )
            );
        }
    }
    
    private function resolveAdd ($parameters)
    {
        if (isset ($parameters['vita']))
        {
            $params     = $parameters['vita'];
            
            $routeID    = isset ($params['route_id']) ? (int)$params['route_id'] : false;
            $from       = isset ($params['from']) ? filter_var ($params['from'], FILTER_SANITIZE_STRING) : '';
            $to         = isset ($params['to']) ? filter_var ($params['to'], FILTER_SANITIZE_STRING) : '';
            $content    = isset ($params['content']) ? filter_var ($params['content'], FILTER_UNSAFE_RAW) : '';
            $order      = isset ($params['order']) ? (int)$params['order'] : 1;

            if ($routeID)
            {
                return array 
                (
                    'vitas' => array 
                    (
                        'add'  => array
                        (
                            'vita' => array
                            (
                                'route_id'          => $routeID,
                                'from'              => $from,
                                'to'                => $to,
                                'content'           => $content,
                                'order'             => $order
                            )
                        )
                    )
                );
            }
        }
    }
}