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

class NewsResolver extends ControllerHelper
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
        if (isset ($parameters['news']))
        {
            $params     = $parameters['news'];
            
            $routeID    = isset ($params['route_id']) ? (int)$params['route_id'] : -false;
            $newsID     = isset ($params['news_id']) ? (int)$params['news_id'] : false;

            if ($routeID && $newsID)
            {
                return array 
                (
                    'news' => array 
                    (
                        'del'  => array
                        (
                            'news' => array
                            (
                                'route_id'          => $routeID,
                                'news_id'           => $newsID
                            )
                        )
                    )
                );
            }
        }
    }
    
    private function resolveSave ($parameters)
    {
        if (isset ($parameters['news']))
        {
            $news       = $parameters['news'];
            $routeID    = isset ($parameters['route_id']) ? (int)$parameters['route_id'] : false;
            $result     = array ();
            
            if (is_array ($news) && count ($news) > 0 && $routeID)
            {
                foreach ($news as $newsItem)
                {
                    $id         = isset ($newsItem['id']) ? (int)$newsItem['id'] : false;
                    $title      = isset ($newsItem['title']) ? filter_var ($newsItem['title'], FILTER_SANITIZE_STRING) : '';
                    $src        = isset ($newsItem['src']) ? filter_var ($newsItem['src'], FILTER_SANITIZE_STRING) : '';
                    $type       = isset ($newsItem['type']) && $newsItem['type'] === 'youtube' ? 'youtube' : 'image';
                    $content    = isset ($newsItem['content']) ? filter_var ($newsItem['content'], FILTER_UNSAFE_RAW) : '';
                    $order      = isset ($newsItem['order']) ? (int)$newsItem['order'] : 1;

                    if (!$routeID)
                    {
                        return;
                    }

                    $result[]   = array
                    (
                        'id'                => $id,
                        'src'               => $src,
                        'type'              => $type,
                        'title'             => $title,
                        'content'           => $content,
                        'order'             => $order
                    );
                }

                return array
                (
                    'news'    => array
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
        if (isset ($parameters['news']))
        {
            $params     = $parameters['news'];
            
            $routeID    = isset ($params['route_id']) ? (int)$params['route_id'] : false;
            $title      = isset ($params['title']) ? filter_var ($params['title'], FILTER_SANITIZE_STRING) : '';
            $src        = isset ($params['src']) ? filter_var ($params['src'], FILTER_SANITIZE_STRING) : '';
            $type       = isset ($params['type']) && $params['type'] === 'youtube' ? 'youtube' : 'image';
            $content    = isset ($params['content']) ? filter_var ($params['content'], FILTER_UNSAFE_RAW) : '';
            $order      = isset ($params['order']) ? (int)$params['order'] : 1;

            if ($routeID)
            {
                return array 
                (
                    'news' => array 
                    (
                        'add'  => array
                        (
                            'news' => array
                            (
                                'route_id'          => $routeID,
                                'src'               => $src,
                                'type'              => $type,
                                'title'             => $title,
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