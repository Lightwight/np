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

class SliderHandler extends HandlerHelper
{
    private static $instance    = null;
    
    private $method             = 'get';
    
    public static function getInstance($method)    { return ( self::$instance !== null )? self::$instance : self::$instance = new self ($method);    }    
    
    private function __construct ($method = 'get') {
        $this->method   = strtolower (substr ($method, 0, 1)).substr ($method, 1);
    }
    
    private function __clone(){}
    
    public function resolveSlider ($params)
    {
        if ($this->method === 'get')           { return $this->fetchSlides ($params);   }
        else if ($this->method === 'post')     { return $this->postSlide ($params);     }
    }
    
    public function fetchSlides ($params)
    {
        $controller     = new SlideController ();
        $result         = $controller->getSlides ();
        
        return $this->prepareOutput ($result);
    }
    
    public function postSlide ($params) 
    {
        $isAdd      = isset ($params['slider']['add']);
        $isUpdate   = isset ($params['slider']['update']);
        $isDelete   = isset ($params['slider']['del']);

        if ($isAdd && Auth::userGroup () === 1)
        {
            $controller = new SliderController ();
            $result     = $controller->addSlide ($params);
            
            return $this->prepareOutput ($result);
        }
        else if ($isUpdate && Auth::userGroup () === 1)
        {
            $controller = new SliderController ();
            $result     = $controller->updateSlides ($params);
            
            return $this->prepareOutput ($result);
        }
        else if ($isDelete && Auth::userGroup () === 1)
        {
            $controller = new SliderController ();
            $result     = $controller->deleteSlide ($params);
            
            return $this->prepareOutput ($result);
        }
        
        return $this->error ($this->REQ_ERR_INVALID_ARGS);
    }
}