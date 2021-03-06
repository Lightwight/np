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

class Simple_offersResolver extends ControllerHelper
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
        if (isset ($parameters['offer']))
        {
            $params     = $parameters['offer'];
            
            $routeID    = isset ($params['route_id']) ? (int)$params['route_id'] : -false;
            $offerID    = isset ($params['offer_id']) ? (int)$params['offer_id'] : false;

            if ($routeID && $offerID)
            {
                return array 
                (
                    'simple_offers' => array 
                    (
                        'del'  => array
                        (
                            'offer' => array
                            (
                                'route_id'          => $routeID,
                                'offer_id'          => $offerID
                            )
                        )
                    )
                );
            }
        }
    }
    
    private function resolveSave ($parameters)
    {
        if (isset ($parameters['offers']))
        {
            $offers     = $parameters['offers'];
            $routeID    = isset ($parameters['route_id']) ? (int)$parameters['route_id'] : false;
            $result     = array ();
            
            if (is_array ($offers) && count ($offers) > 0 && $routeID)
            {
                foreach ($offers as $offer)
                {
                    $id         = isset ($offer['id']) ? (int)$offer['id'] : false;
                    $src        = isset ($offer['src']) ? filter_var ($offer['src'], FILTER_SANITIZE_URL) : false;
                    $title      = isset ($offer['title']) ? filter_var ($offer['title'], FILTER_SANITIZE_STRING) : '';
                    $content    = isset ($offer['content']) ? filter_var ($offer['content'], FILTER_SANITIZE_STRING) : '';
                    $type       = isset ($offer['type']) ? filter_var ($offer['type'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH) : '';
                    $order      = isset ($offer['order']) ? (int)$offer['order'] : 1;

                    if (!$routeID || !$src)
                    {
                        return;
                    }

                    $result[]   = array
                    (
                        'id'                => $id,
                        'src'               => $src,
                        'title'             => $title,
                        'content'           => $content,
                        'type'              => $type,
                        'order'             => $order
                    );
                }

                return array
                (
                    'simple_offers'    => array
                    (
                        'update'    => $result,
                        'route_id'  => $routeID
                    )
                );
            }
        }
    }
    
    private function resolveAdd ($parameters)
    {
        if (isset ($parameters['offer']))
        {
            $params     = $parameters['offer'];
            
            $routeID    = isset ($params['route_id']) ? (int)$params['route_id'] : false;
            $src        = isset ($params['src']) ? filter_var ($params['src'], FILTER_SANITIZE_URL) : false;
            $title      = isset ($params['title']) ? filter_var ($params['title'], FILTER_SANITIZE_STRING) : '';
            $content    = isset ($params['content']) ? filter_var ($params['content'], FILTER_UNSAFE_RAW) : '';
            $type       = isset ($params['type']) ? filter_var ($params['type'], FILTER_SANITIZE_STRING) : '';
            $order      = isset ($params['order']) ? (int)$params['order'] : 1;

            if ($routeID && $src)
            {
                return array 
                (
                    'simple_offers' => array 
                    (
                        'add'  => array
                        (
                            'offer' => array
                            (
                                'route_id'          => $routeID,
                                'src'               => $src,
                                'title'             => $title,
                                'content'           => $content,
                                'type'              => $type,
                                'order'             => $order
                            )
                        )
                    )
                );
            }
        }
    }
}