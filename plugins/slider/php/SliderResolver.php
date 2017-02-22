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

class SliderResolver extends ControllerHelper
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
        if (isset ($parameters['slide']))
        {
            $params     = $parameters['slide'];
            
            $routeID    = isset ($params['route_id']) ? (int)$params['route_id'] : -false;
            $slideID    = isset ($params['slide_id']) ? (int)$params['slide_id'] : false;

            if ($routeID && $slideID)
            {
                return array 
                (
                    'slider' => array 
                    (
                        'del'  => array
                        (
                            'slide' => array
                            (
                                'route_id'          => $routeID,
                                'slide_id'          => $slideID
                            )
                        )
                    )
                );
            }
        }
    }
    
    private function resolveSave ($parameters)
    {
        if (isset ($parameters['slides']))
        {
            $slides     = $parameters['slides'];
            $routeID    = isset ($parameters['route_id']) ? (int)$parameters['route_id'] : false;
            $result     = array ();
            
            if (is_array ($slides) && count ($slides) > 0 && $routeID)
            {
                foreach ($slides as $slide)
                {
                    $id         = isset ($slide['id']) ? (int)$slide['id'] : false;
                    $src        = isset ($slide['src']) ? filter_var ($slide['src'], FILTER_SANITIZE_URL) : false;
                    $title      = isset ($slide['title']) ? filter_var ($slide['title'], FILTER_SANITIZE_STRING) : '';
                    $thumb      = isset ($slide['thumbnail']) ? filter_var ($slide['thumbnail'], FILTER_SANITIZE_STRING) : '';
                    $thumbs     = isset ($slide['thumbnails']) ? filter_var_array ($slide['thumbnails'], array 
                    (
                        'xs' => array ('filter' => FILTER_SANITIZE_URL),
                        'sm' => array ('filter' => FILTER_SANITIZE_URL),
                        'md' => array ('filter' => FILTER_SANITIZE_URL),
                        'lg' => array ('filter' => FILTER_SANITIZE_URL)
                    )) : false;
                    $seoTitle   = isset ($slide['seo_title']) ? filter_var ($slide['seo_title'], FILTER_SANITIZE_STRING) : '';
                    $seoAlt     = isset ($slide['seo_alt']) ? filter_var ($slide['seo_alt'], FILTER_SANITIZE_STRING) : '';
                    $type       = isset ($slide['type']) ? filter_var ($slide['type'], FILTER_SANITIZE_STRING) : '';
                    $order      = isset ($slide['order']) ? (int)$slide['order'] : 1;

                    if (!$routeID || !$src)
                    {
                        return;
                    }

                    $result[]   = array
                    (
                        'id'                => $id,
                        'src'               => $src,
                        'title'             => $title,
                        'seo_title'         => $seoTitle,
                        'seo_alt'           => $seoAlt,
                        'thumbnail'         => $thumb,
                        'thumbnails'        => $thumbs,
                        'type'              => $type,
                        'order'             => $order
                    );
                }

                return array
                (
                    'slider'    => array
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
        if (isset ($parameters['slide']))
        {
            $params     = $parameters['slide'];
            
            $routeID    = isset ($params['route_id']) ? (int)$params['route_id'] : false;
            $src        = isset ($params['src']) ? filter_var ($params['src'], FILTER_SANITIZE_URL) : false;
            $title      = isset ($params['title']) ? filter_var ($params['title'], FILTER_SANITIZE_STRING) : '';
            $seoTitle   = isset ($params['seo_title']) ? filter_var ($params['seo_title'], FILTER_SANITIZE_STRING) : '';
            $seoAlt     = isset ($params['seo_alt']) ? filter_var ($params['seo_alt'], FILTER_SANITIZE_STRING) : '';
            $thumb      = isset ($params['thumbnail']) ? filter_var ($params['thumbnail'], FILTER_SANITIZE_URL) : '';
            $thumbs     = isset ($params['thumbnails']) ? filter_var_array ($params['thumbnails'], array 
            (
                'xs' => array ('filter' => FILTER_SANITIZE_URL),
                'sm' => array ('filter' => FILTER_SANITIZE_URL),
                'md' => array ('filter' => FILTER_SANITIZE_URL),
                'lg' => array ('filter' => FILTER_SANITIZE_URL)
            )) : false;            
            $type       = isset ($params['type']) ? filter_var ($params['type'], FILTER_SANITIZE_STRING) : '';            
            $order      = isset ($params['order']) ? (int)$params['order'] : 1;

            if ($routeID && $src)
            {
                return array 
                (
                    'slider' => array 
                    (
                        'add'  => array
                        (
                            'slide' => array
                            (
                                'route_id'          => $routeID,
                                'src'               => $src,
                                'title'             => $title,
                                'seo_title'         => $seoTitle,
                                'seo_alt'           => $seoAlt,
                                'type'              => $type,
                                'thumbnail'         => $thumb,
                                'thumbnails'        => $thumbs,
                                'order'             => $order
                            )
                        )
                    )
                );
            }
        }
    }
}