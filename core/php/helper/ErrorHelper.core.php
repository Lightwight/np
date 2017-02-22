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

class ErrorHelper
{
    private static $instance            = null;
    private $sendResponseCode           = false;
    private $responseCode               = false;
    
    private $presets    = array
    (
        404 => '<main>Ups! Diese Seite existiert nicht.</main>'
    );
    
    public static function getInstance()    { return ( self::$instance !== null )? self::$instance : self::$instance = new self;    }    
    
    private function __construct()  {}
    private function __clone()      {}
    
    public function setResponseCode ($errCode)
    {
        if (!$this->sendResponseCode)
        {
            $this->sendResponseCode = true;
            $this->responseCode     = $errCode;
            
            http_response_code ($errCode);
        }
    }
    
    public function getResponseCode ()      { return $this->responseCode;           }
    public function getErrorPage ($page)    
    {
        if (isset ($page['main']) && isset ($page['main']['html']))
        {
            $page['main']['html']   = $this->fetchErrorTemplate ();
            
            return $page;
        }
        else
        {
            return array ('main' => array ('html' => $this->fetchErrorTemplate ()));
        }
        
    }
    
    private function fetchErrorTemplate ()
    {
        $path   = getcwd ();
        $path   = str_replace ('\\', '/', $path);
        if (strrpos ($path, '/') < strlen($path) - 1)   { $path .= '/'; }
        $path  .= 'custom/Templates/errors/';
        
        $file   = $path.$this->responseCode.'.html';
        
        if (file_exists ($file))
        {
            $fso        = new Fso ();
            $content    = $fso->read ($file);
            $content    = HTMLTreeBuilder::parsePartials ($content);
        }
        else if (array_key_exists($this->responseCode, $this->presets))
        {
            $content    = $this->presets[$this->responseCode];
        }
        else
        {
            $content    = '<main>Ups! Ein unbekannter Fehler ist aufgetreten.</main>';
        }
        
        return $content;
    }
}