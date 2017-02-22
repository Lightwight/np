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

class LayoutHandler
{
    private static $instance                = null;
    
    public static function getInstance()    { return (self::$instance !== null) ? self::$instance : self::$instance = new self; }    
    
    private function __construct () {}
    private function __clone () {}
    
    public function getLayout ($routeID)
    {
        return self::fetchLayout ($routeID);
    }
    
    public function getBoostrap ()
    {
        $defaultLayout      = '<header></header><main></main><footer></footer>';
        
        $config             = Config::getInstance ();
        $isTablet           = $config->isTablet ();
        $isMobile           = $config->isMobile ();

        $fso                = new Fso ();
        $settings           = $config->getSettings ();
        $bootLayout         = isset ($settings['bootstrap']['layout']) ? $settings['bootstrap']['layout'] : false;
        
        $layout             = false;
        
        $layoutDesktopPath  = ($bootLayout) ? $config->getPath ().'custom/desktop/Layouts/'.$bootLayout : false;
        $layoutTabletPath   = ($bootLayout) ? $config->getPath ().'custom/tablet/Layouts/'.$bootLayout : false;
        $layoutMobilePath   = ($bootLayout) ? $config->getPath ().'custom/mobile/Layouts/'.$bootLayout : false;
        
        if ($isMobile)
        {
            $layout = $layoutMobilePath && is_file ($layoutMobilePath) ? $fso->read ($layoutMobilePath) : $defaultLayout;
        }
        else if ($isTablet)
        {
            $layout = $layoutTabletPath && is_file ($layoutTabletPath) ? $fso->read ($layoutTabletPath) : $defaultLayout;
        }
        else
        {
            $layout = $layoutDesktopPath && is_file ($layoutDesktopPath) ? $fso->read ($layoutDesktopPath) : $defaultLayout;
        }

        return $layout;
    }
    
    private static function fetchLayout ($routeID)
    {
        if( $routeID > 0 )
        {
            $oSql   = Sql::getInstance ();
            
            $query  = 'SELECT `ID`, `layout`, `seo_description`, `seo_keywords`, `title` FROM `routes` WHERE `ID`="'.$routeID.'";';
            
            $result = $oSql->query ($query);

            return (is_array ($result) && count ($result) > 0) ? $result[0] : array ('ID' => -1);
        }
        
        return array ('ID' => -1, 'layout' => 'unknown');
    }
}