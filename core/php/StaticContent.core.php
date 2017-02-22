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

class StaticContent
{
    private static $instance    = null;
    
    public static function getInstance()    { return ( self::$instance !== null )? self::$instance : self::$instance = new self;    }    
    
    private function __construct(){}
    private function __clone(){}

    public function getHeader()
    {
        $oSql   = Sql::getInstance ();
        
        $query  = 'SELECT * FROM `static_content` WHERE `name`="header";';

        $result = $oSql->query( $query );
        
        return ( is_array( $result ) && count( $result ) > 0 )? $result[0]['html'] : '';
    }
    
    public function getFooter()
    {
        $oSql   = Sql::getInstance ();
        
        $query  = 'SELECT * FROM `static_content` WHERE `name`="footer";';

        $result = $oSql->query( $query );
        
        return ( is_array( $result ) && count( $result ) > 0 )? $result[0]['html'] : '';
    }
}