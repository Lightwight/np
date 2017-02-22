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

class DefinitionHandler
{
    private static $instance    = null;
    private static $logger      = null;
    private static $storage     = array ();
    private static $tempAsGroup = false;
    
    public static function getInstance ($tempAsGroup = false)    
    { 
        if (self::$logger === null) { self::$logger = LogHelper::getInstance ();    }

        self::$tempAsGroup  = $tempAsGroup;
        
        return (self::$instance !== null) ? self::$instance : self::$instance = new self;
    }    
    
    private function __construct () {}
    private function __clone () {}
    
    private function fetchModelID ($model)
    {
        $oSql   = Sql::getInstance ();
        
        $query  = 'SELECT `ID` FROM `models` WHERE `name` = "'.$model.'"';
        
        $result = $oSql->query ($query);
        
        return $result && is_array ($result) && count ($result) === 1 ? $result[0]['ID'] : 0;
    }
    
    public function resolveDefinition ($definition, $rights = 1)
    {
        $model                  = strtoupper (substr ($definition, 0, 1)).substr ($definition, 1);
        $search                 = strtolower (substr ($definition, 0, 1)).substr ($definition, 1);
        $modelID                = $this->fetchModelID ($model);

        $retDef['definition']       = $model;
        $retDef['definition_ids']   = array ();
        $retDef[$model]             = array ();

        if ($rights === 1)
        {
            $authColumns    = Auth::getReadable ($model, self::$tempAsGroup);
        } 
        else if ($rights === 2)
        {
            $authColumns    = Auth::getWritable ($model, self::$tempAsGroup);
        }
        else if ($rights === 3)
        {
            $authColumns    = Auth::getReadAndWritable ($model, self::$tempAsGroup);
        }

        if ($authColumns)
        {
            $oSql   = Sql::getInstance ();

            $query  = 'SELECT ';
            $query .= ' md.`ID`,';
            $query .= ' md.`col`,';
            $query .= ' md.`model_id`,';
            $query .= ' mt.`name` ';
            $query .= 'FROM ';
            $query .=   '`model_definitions` md ';
            $query .= 'INNER JOIN ';
            $query .=  '`models` m ';
            $query .= 'ON ';
            $query .=   'md.`model_id`=m.`ID` ';
            $query .= 'INNER JOIN ';
            $query .=  '`model_types` mt ';
            $query .= 'ON ';
            $query .=   'md.`model_type`=mt.`ID` ';
            $query .= 'WHERE ';
            $query .=   'm.`name`="'.$search.'"';

            $result = $oSql->query ($query);

            if (is_array ($result) && count ($result) > 0)
            {
                foreach ($result as $row)  
                { 
                    if (in_array ($row['col'], $authColumns))
                    {
                        $retDef[$model][$row['col']]            = $row['name'];   
                        $retDef['definition_ids'][$row['col']]  = $row['ID'];
                    }
                }

                $retDef[$model]['ID']                   = 'virtual_number';
                $retDef['model_id']                     = $modelID;

                self::$storage[$definition]             = array ();
                self::$storage[$definition][$rights]    = $retDef;
            }
            else
            {
                self::$logger->log ('Definition not found for model "'.$model.'"');
            }
        }        
        
        return $retDef;
    }
}