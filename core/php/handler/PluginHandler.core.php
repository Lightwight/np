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

class PluginHandler extends HandlerHelper
{
    public function __construct () {}
    
    public function getByRoute ($route)
    {
        $possiblePlugin     = $this->getRoutePlugin ($route);

        return $possiblePlugin && class_exists ($possiblePlugin.'Handler') ? $possiblePlugin : false;
    }
    
    public function handleRoutePlugin ($plugin, $item = null)
    {
        $fetched    = array ();
        $params     = false;

        if (trim ($plugin) !== '')
        {
            $router         = RouteHandler::getInstance();    
            $requester      = RequestHandler::getInstance();
            
            $route          = $router->getRoute ();

            $plugin         = strtoupper (substr ($plugin, 0, 1)).substr ($plugin, 1);
            $method         = $this->getMethod ($route);
            
            $pluginMethod   = $requester->getMethod ().$method;
            $class          = $plugin.'Controller';
            
            if ($pluginMethod && class_exists ($class) && method_exists($class, $pluginMethod))
            {
                $oPlugin    = new $class ();
                $result     = $oPlugin->$pluginMethod ($item);
                $fetched    = $this->prepareOutput ($result);

                $params     = $this->buildParams ($route, $fetched);
            }
        }
        
        return $params;
    }
    
    public function handlePlugin ($plugin, $item = null)
    {
        $fetched    = array ();
        $params     = false;
        
        if (trim ($plugin) !== '')
        {
            $router         = RouteHandler::getInstance();    
            $requester      = RequestHandler::getInstance();
            
            $route          = $router->getRoute ();

            $plugin         = strtoupper (substr ($plugin, 0, 1)).substr ($plugin, 1);
            $method         = $this->getMethod ($route);
            
            $pluginMethod   = $requester->getMethod ().$method;
            $class          = $plugin.'Controller';

            if (class_exists ($class) && method_exists ($class, 'initPlugin'))
            {
                $oPlugin    = new $class ();
                $result     = $oPlugin->initPlugin ($item, $route);
                $fetched    = $this->prepareOutput ($result);
            }
        }
        
        return $fetched;
    }
    
    private function getMethod ($route)
    {
        $method     = '';
        
        if (strrpos($route, '/*') === strlen($route)-2)
        {
            $route  = substr ($route, 0, strlen ($route)-2);
        }
        
        $parts  = explode ('/', $route);
        
        if (count ($parts) > 2) 
        {
            unset ($parts[0]);
            unset ($parts[1]);
        }
        
        foreach ($parts as $part)
        {
            $method    .= strtoupper (substr ($part, 0, 1)).substr ($part, 1);
        }
        
        return $method !== '' ? $method : false;
    }
    
    private function buildParams ($route, $responseData = null)
    {
        if ($route !== '' && $route !== '/')
        {
            if (strpos ($route, '/') === 0) { $route = substr ($route, 1);  }
            
            $parts  = explode ('/', $route);
            
            if ($parts[count ($parts)-1] === '*') { unset ($parts[count($parts)-1]); }
            
            if (count ($parts) > 0) { unset ($parts[0]); }
        }
        
        if (is_array ($parts) && count ($parts) > 0)
        {
            $parts      = array_flip ($parts);
            $reversed   = array_reverse ($parts);
            $firstIn    = true;
            $lastKey    = key (array_slice ($parts, -1, 1, true));

            foreach ($reversed as $key => $inx)
            {
                foreach ($parts as $key2 => $inx2 )
                {
                    if ($inx2 === $inx - 1)
                    {
                        $parts[$key2]  = array ($key => '');
                        break;
                    }
                }
            }

            $parts[$lastKey]   = $responseData;
            $parts             = array_reverse ($parts);

            while (count($parts) > 1)
            {
                $cnt    = 0;
                $prev   = false;

                foreach ($parts as $key => $val)
                {
                    if ($cnt === 1)
                    {
                        $parts[$key]   = $prev;
                        break;
                    }

                    $prev[$key] = $val;

                    unset ($parts[$key]);

                    $cnt++;
                }
            }

            return $parts;
        }
        
        return false;        
    }
    
    private function getRoutePlugin ($route)
    {
        $plugin = false;
        
        if ($route !== '' && $route !== '/')
        {
            if (strpos ($route, '/') === 0) { $route = substr ($route, 1);  }

            $parts  = explode ('/', $route);
            
            if ($parts[count ($parts)-1] === '*') { unset ($parts[count($parts)-1]); }
            
            if (count ($parts) > 0)
            {
                $plugin = $parts[0];
                $plugin = strtoupper (substr ($plugin, 0, 1)).substr ($plugin, 1);
            }
        }

        return $plugin;
    }
}