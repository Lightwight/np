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

class MediathekHandler extends HandlerHelper
{
    private static $instance    = null;
    
    private $method             = 'get';
    
    public static function getInstance($method)    { return ( self::$instance !== null )? self::$instance : self::$instance = new self ($method);    }    
    
    private function __construct ($method = 'get') {
        $this->method   = strtolower (substr ($method, 0, 1)).substr ($method, 1);
    }
    
    private function __clone(){}
    
    public function resolveMediathek ($params)
    {
        if ($this->method === 'get')           { return $this->fetchMediathek ($params);   }
        else if ($this->method === 'post')     { return $this->postMediathek ($params);     }
    }
    
    public function fetchMediathek ($params)
    {
        $controller     = new MediathekController ();
        $result         = $controller->getMediathek ();
        
        return $this->prepareOutput ($result);
    }
    
    public function postMediathek ($params) 
    {
        $isAddVideo     = isset ($params['mediathek']['add']['video']);
        $isAddFolder    = isset ($params['mediathek']['add']['folder']);
        $isUpdateFolder = isset ($params['mediathek']['update']['folder']);
        $isUpdateImage  = isset ($params['mediathek']['update']['image']);
        $isRemove       = isset ($params['mediathek']['del']['id']);
        $isRemoveFolder = isset ($params['mediathek']['del']['folder_id']);

        if ($isAddVideo && Auth::userGroup () === 1)
        {
            $controller = new MediathekController ();
            $result     = $controller->addVideo ($params);
            
            return $this->prepareOutput ($result);
        } 
        else if ($isAddFolder && Auth::userGroup () === 1)
        {
            $controller = new MediathekController ();
            $result     = $controller->addFolder ($params);

            return $this->prepareOutput ($result);
        } 
        else if ($isUpdateFolder)
        {
            $controller = new MediathekController ();
            $result     = $controller->updateFolder ($params['mediathek']['update']['folder']);
            
            return $this->prepareOutput ($result);
        }
        else if ($isUpdateImage)
        {
            $controller = new MediathekController ();
            $result     = $controller->updateImage ($params['mediathek']['update']['image']);
            
            return $this->prepareOutput ($result);
        }
        else if ($isRemove)
        {
            $controller = new MediathekController ();
            $result     = $controller->removeItem ($params['mediathek']['del']['id']);
            
            return $this->prepareOutput ($result);
        }
        else if ($isRemoveFolder)
        {
            $controller = new MediathekController ();
            $result     = $controller->removeFolder ($params['mediathek']['del']['folder_id']);
            
            return $this->prepareOutput ($result);
        }
        
        return $this->error ($this->REQ_ERR_INVALID_ARGS);
    }
}