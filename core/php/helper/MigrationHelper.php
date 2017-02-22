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

/*
 *  Say ty to: https://crackstation.net/hashing-security.htm#phpsourcecode
 * 
 * it solved the security implementation of hashing data (i.e. Registration Password)
 */
class MigrationHelper
{
    protected $TYPE_BOOLEAN             = 1;
    protected $TYPE_NUMBER              = 2;
    protected $TYPE_STRING              = 3;
    protected $TYPE_PASSWORD            = 4;
    protected $TYPE_MAIL                = 5;
    protected $TYPE_HTML                = 6;
    protected $TYPE_DATE                = 7;
    protected $TYPE_OBJECT              = 8;
    
    protected $TYPE_VIRTUAL_BOOLEAN     = 101;
    protected $TYPE_VIRTUAL_NUMBER      = 102;
    protected $TYPE_VIRTUAL_STRING      = 103;
    protected $TYPE_VIRTUAL_HTML        = 106;
    protected $TYPE_VIRTUAL_DATE        = 107;
    protected $TYPE_VIRTUAL_OBJECT      = 108;

    protected $RIGHTS_READ_ONLY         = 1;
    protected $RIGHTS_WRITE_ONLY        = 2;
    protected $RIGHTS_READ_AND_WRITE    = 3;
    
    protected $GROUP_ADMINISTRATOR      = 1;
    protected $GROUP_EDITOR             = 2000;
    protected $GROUP_CUSTOMER           = 3000;
    protected $GROUP_VISITOR            = 4000;
   
    protected function query ($query)
    {
        $sql    = Sql::getInstance ();
        
        return $sql->query ($query);
    }
}