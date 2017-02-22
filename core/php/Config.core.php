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

class Config
{
    private static $instance;
    
    private $path   = '';
    private $scope  = 'custom';
    
    public static function getInstance()    { return ( self::$instance !== null )? self::$instance : self::$instance = new self;    }    

    private function __construct()
    {
        $path           = str_replace( '\\' ,'/', getcwd() );
        if( strrpos( $path, '/' ) != strlen( $path ) - 1 )  { $path .= '/'; }

        $this->path     = $path;
    }
    
    private function __clone () {}    
    
    public function getSettings() 
    {
	$cFile		    = str_replace( '\\', '/', __FILE__ );
	$cFile		    = substr( $cFile, 0, strrpos( $cFile, '/core/php/Config.core.php' ) ).'/config.php';
	
        require $cFile;
        
        return $config;
    }
    
    public function getScope ()
    {
        return $this->scope;
    }
    
    public function setScope ($scope)
    {
        $this->scope    = $scope; 
    }

    public function isMobile ()
    {
        $config         = $this->getSettings ();

        $detectMobile   = isset ($config['client']) && isset ($config['client']['mobileDetect']) ? $config['client']['mobileDetect'] === true : false;
        $forceMobile    = $detectMobile === true &&  isset ($config['client']['forceMobileDetect']) ? $config['client']['forceMobileDetect'] === true : false;
        $isMobile       = false;
        
        if ($detectMobile)
        {
            $mobileDetector = new Mobile_Detect (); 
            
            $isMobile       = $mobileDetector->isMobile () && !$mobileDetector->isTablet ();
        }

        return $isMobile || $forceMobile;
    }
    
    public function isTablet ()
    {
        $config         = $this->getSettings ();

        $detectTablet   = isset ($config['client']) && isset ($config['client']['tabletDetect']) ? $config['client']['tabletDetect'] === true : false;
        $forceTablet    = $detectTablet === true &&  isset ($config['client']['forceTabletDetect']) ? $config['client']['forceTabletDetect'] === true : false;
        $isTablet       = false;
        
        if ($detectTablet)
        {
            $mobileDetector = new Mobile_Detect (); 
            
            $isTablet   = $mobileDetector->isTablet ();
        }

        return $isTablet || $forceTablet;
    }
    
    public function getClientDeviceType ()
    {
        $mobileDetector = new Mobile_Detect (); 
        
        if ($mobileDetector->isMobile () && !$mobileDetector->isTablet ())
        {
            return 'mobile';
        } 
        else if ($mobileDetector->isTablet ())
        {
            return 'tablet';
        }
        
        return 'desktop';
    }
    
    public function getPath()   { return $this->path;       }
}
?>