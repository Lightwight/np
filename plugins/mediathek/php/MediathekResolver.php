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

class MediathekResolver extends ControllerHelper
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
        $id         = isset ($parameters['id']) ? (int)$parameters['id'] : false;
        $folder_id  = isset ($parameters['folder_id']) ? (int)$parameters['folder_id'] : false;

        if ($id)
        {
            return array 
            (
                'mediathek' => array
                (
                    'del'   => array
                    (
                        'id'    => $id
                    )
                )
            );
        }
        else if ($folder_id)
        {
            return array 
            (
                'mediathek' => array
                (
                    'del'   => array
                    (
                        'folder_id'    => $folder_id
                    )
                )
            );
        }
    }
    
    private function resolveSave ($parameters)
    {
        if (isset ($parameters['folder']))
        {
            $params     = $parameters['folder'];
            
            $folder_id  = isset ($params['folder_id']) ? (int)$params['folder_id'] : 0;
            $folder     = isset ($params['folder']) && !empty ($params['folder'])? filter_var ($params['folder'], FILTER_SANITIZE_STRING) : false;
            
            if ($folder_id > 0 && $folder) 
            {
                return array
                (
                    'mediathek' => array
                    (
                        'update'   => array
                        (
                            'folder'    => array
                            (
                                'folder_id' => $folder_id,
                                'folder'    => $folder
                            )
                        )
                    )
                );
            }
        }
        else if (isset ($parameters['media']) && isset ($parameters['media']['type']))
        {
            $params = $parameters['media'];
            $type   = $params['type'];
            
            if ($type === 'image')
            {
                
                $image_id       = isset ($params['id']) ? (int)$params['id'] : 0;
                $title          = isset ($params['title']) ? filter_var ($params['title'], FILTER_SANITIZE_STRING) : false;
                $description    = isset ($params['description']) ? filter_var ($params['description'], FILTER_SANITIZE_STRING) : false;
                $folder_id      = isset ($params['folder_id']) ? (int)$params['folder_id'] : 0;
                
                return $image_id > 0 ? array
                (
                    'mediathek' => array
                    (
                        'update'    => array
                        (
                            'image' => array
                            (
                                'id'            => $image_id,
                                'folder_id'     => $folder_id,
                                'title'         => $title,
                                'description'   => $description
                            )
                        )
                    )
                ) : $this->getError (ErrorCodeHelper::$_REQ_INVALID_ARGS);
            }
        }
    }
    
    private function resolveAdd ($parameters)
    {
        if (isset ($parameters['video']))
        {
            $params     = $parameters['video'];
            
            $videoID    = isset ($params['videoID']) ? filter_var ($params['videoID'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH) : false;
            $name       = isset ($params['title']) ? filter_var ($params['title'], FILTER_SANITIZE_STRING) : '';

            if ($videoID)
            {
                return array 
                (
                    'mediathek' => array 
                    (
                        'add'  => array
                        (
                            'video' => array
                            (
                                'video_id'          => $videoID,
                                'name'              => $name
                            )
                        )
                    )
                );
            }
        }
        else if (isset ($parameters['folder']))
        {
            $folder     = filter_var ($parameters['folder'], FILTER_SANITIZE_STRING);
            
            if ($folder) 
            {
                return array
                (
                    'mediathek' => array
                    (
                        'add'   => array
                        (
                            'folder'    => array
                            (
                                'folder'    => $folder
                            )
                        )
                    )
                );
            }
        }
    }
}