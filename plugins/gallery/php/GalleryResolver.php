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

class GalleryResolver extends ControllerHelper
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
        if (isset ($parameters['gallery']))
        {
            $params     = $parameters['gallery'];
            
            $routeID    = isset ($params['route_id']) ? (int)$params['route_id'] : -false;
            $galleryID  = isset ($params['gallery_id']) ? (int)$params['gallery_id'] : false;

            if ($routeID && $galleryID)
            {
                return array 
                (
                    'gallery' => array 
                    (
                        'del'  => array
                        (
                            'gallery' => array
                            (
                                'route_id'          => $routeID,
                                'gallery_id'        => $galleryID
                            )
                        )
                    )
                );
            }
        }
    }
    
    private function resolveSave ($parameters)
    {
        if (isset ($parameters['galleries']))
        {
            $galleries  = $parameters['galleries'];
            $routeID    = isset ($parameters['route_id']) ? (int)$parameters['route_id'] : false;
            $result     = array ();
            
            if (is_array ($galleries) && count ($galleries) > 0 && $routeID)
            {
                foreach ($galleries as $gallery)
                {
                    $id         = isset ($gallery['id']) ? (int)$gallery['id'] : false;
                    $src        = isset ($gallery['src']) ? filter_var ($gallery['src'], FILTER_SANITIZE_URL) : false;
                    $thumbnail  = isset ($gallery['thumbnail']) ? filter_var ($gallery['thumbnail'], FILTER_SANITIZE_URL) : false;
                    $thumbnails = isset ($gallery['thumbnails']) ? filter_var_array ($gallery['thumbnails'], array 
                    (
                        'xs' => array ('filter' => FILTER_SANITIZE_URL),
                        'sm' => array ('filter' => FILTER_SANITIZE_URL),
                        'md' => array ('filter' => FILTER_SANITIZE_URL),
                        'lg' => array ('filter' => FILTER_SANITIZE_URL)
                    )) : false;

                    $title      = isset ($gallery['title']) ? filter_var ($gallery['title'], FILTER_SANITIZE_STRING) : '';
                    $content    = isset ($gallery['content']) ? filter_var ($gallery['content'], FILTER_UNSAFE_RAW) : '';
                    $type       = isset ($gallery['type']) ? filter_var ($gallery['type'], FILTER_SANITIZE_STRING) : '';
                    $order      = isset ($gallery['order']) ? (int)$gallery['order'] : 1;

                    if (!$routeID || !$src)
                    {
                        return;
                    }

                    $result[]   = array
                    (
                        'id'                => $id,
                        'src'               => $src,
                        'thumbnail'         => $thumbnail,
                        'thumbnails'        => $thumbnails,
                        'title'             => $title,
                        'content'           => $content,
                        'type'              => $type,
                        'order'             => $order
                    );
                }

                return array
                (
                    'gallery'    => array
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
        if (isset ($parameters['gallery']))
        {
            $params     = $parameters['gallery'];
            
            $routeID    = isset ($params['route_id']) ? (int)$params['route_id'] : false;
            $src        = isset ($params['src']) ? filter_var ($params['src'], FILTER_SANITIZE_URL) : false;
            $thumbnail  = isset ($params['thumbnail']) ? filter_var ($params['thumbnail'], FILTER_SANITIZE_URL) : false;
            $thumbnails = isset ($params['thumbnails']) ? filter_var_array ($params['thumbnails'], array 
            (
                'xs' => array ('filter' => FILTER_SANITIZE_URL),
                'sm' => array ('filter' => FILTER_SANITIZE_URL),
                'md' => array ('filter' => FILTER_SANITIZE_URL),
                'lg' => array ('filter' => FILTER_SANITIZE_URL)
            )) : false;
            
            $title      = isset ($params['title']) ? filter_var ($params['title'], FILTER_SANITIZE_STRING) : '';
            $content    = isset ($params['content']) ? filter_var ($params['content'], FILTER_UNSAFE_RAW) : '';
            $type       = isset ($params['type']) ? filter_var ($params['type'], FILTER_SANITIZE_STRING) : '';
            $order      = isset ($params['order']) ? (int)$params['order'] : 1;

            if ($routeID && $src)
            {
                return array 
                (
                    'gallery' => array 
                    (
                        'add'  => array
                        (
                            'gallery' => array
                            (
                                'route_id'          => $routeID,
                                'src'               => $src,
                                'thumbnail'         => $thumbnail,
                                'thumbnails'        => $thumbnails,
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