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

class Simple_offersHandler extends HandlerHelper
{
    private static $instance    = null;
    
    private $method             = 'get';
    
    public static function getInstance($method)    { return ( self::$instance !== null )? self::$instance : self::$instance = new self ($method);    }    
    
    private function __construct ($method = 'get') {
        $this->method   = strtolower (substr ($method, 0, 1)).substr ($method, 1);
    }
    
    private function __clone(){}
    
    public function resolveSimple_offers ($params)
    {
        if ($this->method === 'get')           { return $this->fetchOffers ($params);   }
        else if ($this->method === 'post')     { return $this->postOffers ($params);     }
    }
    
    public function fetchOffers ($params)
    {
        $controller     = new Simple_offersController ();
        $result         = $controller->getOffers ();
        
        return $this->prepareOutput ($result);
    }
    
    public function postOffers ($params) 
    {
        $isAdd      = isset ($params['simple_offers']['add']);
        $isUpdate   = isset ($params['simple_offers']['update']);
        $isDelete   = isset ($params['simple_offers']['del']);

        if ($isAdd && Auth::userGroup () === 1)
        {
            $controller = new Simple_offersController ();
            $result     = $controller->addOffer ($params);
            
            return $this->prepareOutput ($result);
        }
        else if ($isUpdate && Auth::userGroup () === 1)
        {
            $controller = new Simple_offersController ();
            $result     = $controller->updateOffers ($params);
            
            return $this->prepareOutput ($result);
        }
        else if ($isDelete && Auth::userGroup () === 1)
        {
            $controller = new Simple_offersController ();
            $result     = $controller->deleteOffer ($params);
            
            return $this->prepareOutput ($result);
        }
        
        return $this->getError (ErrorCodeHelper::$_REQ_INVALID_ARGS);
    }
}