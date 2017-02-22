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

abstract class RouteHelper
{
    private static $route   = false;
    private static $routeID = false;
    
    public static function setRoute ($route)
    {
        $oSql           = Sql::getInstance ();
        $oConfig        = Config::getInstance();
        $settings       = $oConfig->getSettings ();

        $default_route  = isset ($settings['routes']) && isset ($settings['routes']['custom']) ? $settings['routes']['custom'] : '/';
        $search         = trim ($oSql->real_escape_string ($route));
        if( $search === '' )    { $search = $default_route; }
        $item           = false;

        $query          = 'SELECT ';
        $query         .=   '`routes`.`ID`,';
        $query         .=   '`route`,';
        $query         .=   '`route_scopes`.`name` AS `scope` ';
        $query         .= 'FROM ';
        $query         .=   '`routes` ';
        $query         .= 'INNER JOIN ';
        $query         .=   '`route_scopes` ';
        $query         .= 'ON ';
        $query         .=   '`route_scopes`.`ID`=`routes`.`scope_id` ';
        $query         .= 'WHERE ';
        $query         .=   '`route`="'.$search.'";';

        $result         = $oSql->query ($query);

        if (is_array ($result) && count ($result) === 1)
        {
            $routeID    = $result[0]['ID'];
            $route      = $result[0]['route'];
            $scope      = $result[0]['scope'];
        }
        else
        {
            $route      = false;
            $scope      = false;
            $routeID    = false;
        }

        if (!$route)
        {
            $route_parts    = explode ('/', $search);
            $routes         = array();
            $item           = false;
            $last           = '';

            if (is_array ($route_parts) && count ($route_parts) > 0)
            {
                foreach ($route_parts as $part)
                {
                    $routes[]   = $oSql->real_escape_string ($last.$part.'/*');
                    $last      .= $part.'/';
                }

                $routes = array_reverse ($routes) ;

                foreach ($routes as $key => $link)
                {
                    $query  = 'SELECT ';
                    $query .=   '`routes`.`ID`,';
                    $query .=   '`route`,';
                    $query .=   '`route_scopes`.`name` AS `scope` ';
                    $query .= 'FROM ';
                    $query .=   '`routes` ';
                    $query .= 'INNER JOIN ';
                    $query .=   '`route_scopes` ';
                    $query .= 'ON ';
                    $query .=   '`route_scopes`.`ID`=`routes`.`scope_id` ';
                    $query .= 'WHERE ';
                    $query .=   '`route`="'.$link.'";';

                    $result = $oSql->query ($query);

                    if (is_array ($result) && count ($result) === 1)
                    {
                        $routeID    = $result[0]['ID'];
                        $route      = strtolower ($result[0]['route']);
                        $scope      = strtolower ($result[0]['scope']);
                        
                        $item       = explode ('/', $search);
                        $item       = $oSql->real_escape_string ($item[count($item)-1]);
                        
                        break;
                    }
                }
                
            }
        }     

        $route  = $route ? str_replace('*', '', $route).'/' : false;
        $route  = $route ? str_replace('//', '/', $route) : false;
        
        $oConfig->setScope ($scope);
        
        self::$routeID  = $routeID;
        self::$route    = strrpos ($route, '/') < strlen ($route) - 1 ? $route.'/' : $route;
    }

    public static function getRouteForAutoload ()
    {
        return self::$route;
    }
    
    public static function getRouteID ()
    {
        return self::$routeID;
    }

    public static function getDefaultRoute ()
    {
        $config         = Config::getInstance ();
        $settings       = $config->getSettings ();
        $defRoute       = isset ($settings['routes']) && isset ($settings['routes']['custom']) ? $settings['routes']['custom'] : false;
        
        return $defRoute;
    }
}