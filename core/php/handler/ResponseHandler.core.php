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

class ResponseHandler
{
    private static $instance            = null;
    
    private static $data                = null;
    private static $requestHandler      = null;
    
    private static $requestType         = null;
    private static $requestMethod       = null;
    
    private static $isJson              = false;
    
    public static function getInstance ()   { return (self::$instance !== null) ? self::$instance : self::$instance = new self; }
    
    private function __construct () {}
    private function __clone ()     {}
    
    public function resolve ($requestHandler, $data)
    {
        self::$requestHandler   = $requestHandler;
        self::$data             = $data;

        self::$requestMethod    = $requestHandler->getMethod ();
        self::$requestMethod    = strtolower (substr (self::$requestMethod, 0 , 1)).substr (self::$requestMethod, 1);
        
        self::$requestType      = $requestHandler->getType ();
        self::$requestType      = strtoupper (substr (self::$requestType, 0 , 1)).substr (self::$requestType, 1);

        self::$isJson           = $requestHandler->isJson ();
    
        return self::parse ();
    }
    
    private static function parse ()
    {
        $method     = self::$requestMethod.self::$requestType;
        
        if (method_exists ('ResponseHandler', $method))
        {
            return self::$method ();
        }
        else
        {
            // Response: Method not allowed!
        }
    }
    
    private static function getRoute ()     { return self::returnRoute ();  }
    private static function returnRoute ()
    {
        $response   = self::$data;
        
        return self::$isJson ? json_encode ($response) : $response;
    }

    private static function getAuth ()          { return self::returnAuth ();       }
    private static function postAuth ()         { return self::returnAuth ();       }
    private static function returnAuth ()   
    {
        $auth           = self::$data;
        
        return json_encode ($auth);
    }
    
    private static function getDefinition ()    { return self::returnDefinition (); }
    private static function postDefinition ()   { return self::returnDefinition (); }
    private static function deleteDefinition () { return self::returnDefinition (); }
    private static function returnDefinition ()
    {
        $definition     = self::$data;

        return json_encode ($definition);
    }
    
    private static function getModel ()     { return self::returnModel ();  }
    private static function postModel ()    { return self::returnModel ();  }
    private static function deleteModel ()  { return self::returnModel ();  }    
    private static function returnModel ()
    {
        $model          = self::$data;

        return json_encode ($model);
    }
}