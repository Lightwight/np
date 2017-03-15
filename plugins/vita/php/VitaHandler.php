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

class VitaHandler extends HandlerHelper
{
    private static $instance    = null;
    
    private $method             = 'get';
    
    public static function getInstance($method)    { return ( self::$instance !== null )? self::$instance : self::$instance = new self ($method);    }    
    
    private function __construct ($method = 'get') {
        $this->method   = strtolower (substr ($method, 0, 1)).substr ($method, 1);
    }
    
    private function __clone(){}
    
    public function resolveVita ($params)
    {
        if ($this->method === 'get')           { return $this->fetchVita ($params);     }
        else if ($this->method === 'post')     { return $this->postVita ($params);      }
    }
    
    public function fetchVita ($params)
    {
        $controller     = new VitaController ();
        $result         = $controller->getVita ();
        
        return $this->prepareOutput ($result);
    }
    
    public function postVita ($params) 
    {
        $isAdd      = isset ($params['vitas']['add']);
        $isUpdate   = isset ($params['vitas']['update']);
        $isDelete   = isset ($params['vitas']['del']);

        if ($isAdd && Auth::userGroup () === 1)
        {
            $controller = new VitaController ();
            $result     = $controller->addVita ($params);
            
            return $this->prepareOutput ($result);
        }
        else if ($isUpdate && Auth::userGroup () === 1)
        {
            $controller = new VitaController ();
            $result     = $controller->updateVita ($params);
            
            return $this->prepareOutput ($result);
        }
        else if ($isDelete && Auth::userGroup () === 1)
        {
            $controller = new VitaController ();
            $result     = $controller->deleteVita ($params);
            
            return $this->prepareOutput ($result);
        }
        
        return $this->getError (ErrorCodeHelper::$_REQ_INVALID_ARGS);
    }
}