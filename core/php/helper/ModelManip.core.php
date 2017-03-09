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

class ModelManip extends HandlerHelper
{
    private $hModel;
    private $lModel;
    
    private $row;
    private $postable;
    
    private $_error;
    
    private $ignoreRights;
    
    public function __construct ($model, $row, $ignoreRights = false) 
    {
        $this->hModel           = strtoupper (substr ($model, 0, 1)).substr ($model, 1);
        $this->lModel           = strtolower (substr ($model, 0, 1)).substr ($model, 1);
        
        $this->row              = is_array ($row) && count ($row) === 1 && array_key_exists (0, $row) ? $row[0] : $row;
        $this->_error            = array ();

        if (isset ($this->row['ID'])) 
        {
            $this->row['id']    = $this->row['ID'];
            
            unset ($this->row['ID']);
        }
        
        $this->postable         = false;
        
        $this->ignoreRights     = is_bool ($ignoreRights) ? $ignoreRights : false;
    }
    
    public function get ($column)
    {
        return isset ($this->row[$column]) ? $this->row[$column] : null;
    }
    
    public function set ($column, $value)
    {
        if (is_array ($this->row) && count ($this->row) > 0)
        {
            $this->row[$column]     = $this->postable[$column] = $value;
        }
        
        return $this;
    }
    
    public function update ()
    {
        $model          = $this->hModel;
        $row            = $this->postable;
        $id             = $this->row['id'];
        
        $defHandler     = DefinitionHandler::getInstance ();
        $definition     = $defHandler->resolveDefinition ($model, 2);
        
        $oSql           = Sql::getInstance ();        
        $blacklist      = array ('status', 'ID', 'id');
        
        $hasWritable    = false;
        $set            = '';

        if (is_array ($row))
        {
            foreach ($row as $col => $val)
            {
                if (!in_array ($col, $blacklist) && array_key_exists ($col, $definition[$model])) 
                {
                    if (!$hasWritable)  { $hasWritable = true;  }

                    $set   .= '`'.$col.'`="'.$oSql->real_escape_string ($val).'", ';
                }
            }

            if ($hasWritable)
            {
                $set    = substr ($set, 0, strlen ($set)-2);

                $query  = 'UPDATE `'.$this->lModel.'` ';
                $query .= 'SET '.$set.' ';
                $query .= 'WHERE `id`='.$id.';';

                $oSql->query ($query);

                $errno  = $oSql->lastError ();

                if ($errno === 0)
                {
                    $fetcher            = new Model ($this->hModel);
                    $fetchedRow         = $fetcher->findBy ('id', $id)->result ();
                    $updatedRow         = $fetchedRow ? $fetchedRow->getRow () : false;

                    if ($updatedRow)
                    {
                        foreach ($updatedRow as $column => $val)
                        {
                            $this->row[$column] = $val;
                        }

                        return true;
                    }               
                    else
                    {
                        $this->_error    = $this->error ($this->SQL_ERR_UNKNOWN_COLUMN);

                        return false;
                    }

                }
                else
                {
                    $this->_error    = $this->error ($errno);

                    return false;
                }
            }
        }
        
        return false;
    }
    
    public function post ()
    {
        $model          = $this->hModel;
        $row            = $this->row;
        
        $defHandler     = DefinitionHandler::getInstance ();
        $definition     = $defHandler->resolveDefinition ($model, 2);
       
        $oSql           = Sql::getInstance ();        
        $blacklist      = array ('status', 'ID', 'id');
        
        $hasWritable    = false;
        
        $cols           = '(';
        $vals           = '(';

        foreach ($row as $col => $value)
        {
            if (!in_array ($col, $blacklist)
                && array_key_exists ($col, $definition[$model])
            ) { 
                if (!$hasWritable)  { $hasWritable = true;  }

                $cols  .= '`'.$oSql->real_escape_string ($col).'`,'; 
                $vals  .= '"'.$oSql->real_escape_string ($value).'",';    
            }
        }

        if ($hasWritable)
        {
            $cols   = substr ($cols, 0, strlen ($cols) - 1).')';
            $vals   = substr ($vals,0, strlen ($vals) - 1).')';

            $query  = 'INSERT INTO `'.$oSql->real_escape_string ($this->lModel).'` ';
            $query .= $cols.' VALUES '.$vals.';';

            $id     = $oSql->query ($query);
            $errno  = $oSql->lastError ($oSql->getConnection ());
               
            if ($errno === 0)
            {
                foreach ($row as $column => $val)
                {
                    if (!in_array ($col, $blacklist) && array_key_exists ($col, $definition[$model]))
                    {
                        $this->row[$column] = $val;
                    }
                    else if ($column === 'id')
                    {
                        $this->row[$column] = $id;
                    }
                }

                return $id;
            }
            else
            {
                $this->_error    = $this->error ($errno, false);
                
                return false;
            }
        }
        else 
        {
            $this->_error    = $this->error ($this->AUTH_ERR_UNAUTHORIZED, false);
            
            return false;
        }        
    }
    
    public function delete ($hard = false)
    {
        if (isset ($this->row['id']))
        {
            $oSql   = Sql::getInstance ();
            
            if (!$hard)
            {
                $query  = 'UPDATE `'.$this->lModel.'` SET `deleted`=1 WHERE `id`="'.$this->row['id'].'" AND `deleted`=0;';
            }
            else
            {
                $query  = 'DELETE FROM `'.$this->lModel.'` WHERE `ID`="'.$this->row['id'].'"';
            }

            $oSql->query ($query);
            
            $errno  = $oSql->lastError ();
            
            if ($errno === 0)
            {
                return true;
            }
            else
            {
                $this->_error    = $this->error ($errno);
                
                return false;
            }
        }
    }
    
    public function getName ($upperCase = false)    
    { 
        return !$upperCase ? $this->lModel : $this->hModel;     
    }
    
    public function getRow ($asGroup = false)       
    { 
        $defHandler     = DefinitionHandler::getInstance ($asGroup);

        $resolved       = $defHandler->resolveDefinition ($this->hModel, 1);
        $definition     = isset ($resolved[$this->hModel]) ? $resolved[$this->hModel] : false;

        $row            = $this->row;
        $ignoreRights   = $this->ignoreRights;
        
        if ($ignoreRights || $definition)
        {
            foreach ($row as $col => $val)
            {
                if ($col === 'id')  { $col  = 'ID'; }
                
                if (!array_key_exists ($col, $definition) && !$ignoreRights)
                {
                    unset ($row[$col]);
                }
            }
            
            return $row;        
        }
        else
        {
            return $ignoreRights ? $this->row : false;
        }
    }
    
    public function postable ()     { return $this->postable;   }
    public function getError ()     { return $this->_error;     }
}