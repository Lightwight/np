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

class Model extends ControllerHelper
{
    private $storage;
    private $internalSearch;
    
    private $language;
    
    private $hModel;
    private $lModel;
    
    private $pagination;
    
    private $asGroup;
    
    private $findBy;
    private $findLike;
    
    private $excludeDeleted;
    private $includeDeleted;
    
    private $replace;
    
    private $clearColumns;
    
    private $columns;
    private $joins;
    private $definitions;
    
    private $limit;
    private $offset;
    private $orderBy;
    
    private $ignoreRights;
    
    private $logQuery;
    private $showQuery; 

    public function __construct ($model, $ignoreRights = false) 
    {
        $languageHelper         = new LanguageHelper ();
        
        $this->language         = $languageHelper->getLanguage ();
        
        $this->internalSearch   = false;

        $this->limit            = false;
        $this->offset           = false;
        $this->orderBy          = false;
        
        $this->storage          = null;
        
        $this->asGroup          = false;
        
        $this->findBy           = array ();
        $this->findLike         = array ();
        
        $this->findByDeleted    = false;

        $this->replace          = array ();
        
        $this->clearColumns     = array ();
        
        $this->columns          = array ();
        $this->joins            = array ();
        $this->definitions      = array ();

        $this->hModel           = strtoupper (substr ($model, 0, 1)).substr ($model, 1);
        $this->lModel           = strtolower (substr ($model, 0, 1)).substr ($model, 1);
        
        $this->pagination       = false;
        
        $this->ignoreRights     = is_bool ($ignoreRights) ? $ignoreRights : false;
        $this->logQuery         = false;
        $this->showQuery        = false;
    }
    
    public function hasError () {}
    
    public function getName ()   { return $this->lModel; }

    public function result ($showQuery = false)
    {
        $result             = false;
        $this->showQuery    = $showQuery;
        
        if ($this->storage === null)    { $this->find ();   }
        
        if (is_array ($this->storage))
        {
            $count  = count ($this->storage);

            $result = $count > 1 ? $this->storage : ($count === 1 ? $this->storage[0] : false);
        } 
        else if (is_object ($this->storage) && get_class ($this->storage) === 'ErrorHandler')
        {
            $result = $this->storage;    
        }

        $this->resetResult ();
        
        return $result;
    }    
    
    public function max ($column, $where = false)
    {
        $oSql                   = Sql::getInstance ();
        $definitionHandler      = DefinitionHandler::getInstance ();
        $defData                = $definitionHandler->resolveDefinition ($this->lModel, 3);
        $max                    = 0;
        
        if (isset ($defData[$defData['definition']][$column]))
        {
            $query  = 'SELECT MAX(`'.$column.'`) AS "max" FROM `'.$this->lModel.'`';
            
            if ($where)
            {
                $sqlWhere   = implode (' AND ', array_map (function ($value, $key) {
                    $oSql   = Sql::getInstance ();
                    
                    return $key.'="'.$oSql->real_escape_string ($value).'"';
                }, array_values ($where), array_keys ($where)));
                
                $query .= ' WHERE '.$sqlWhere;
            }
            
            $result = $oSql->query ($query);
            
            $max    = $result ? $result[0]['max'] : 0;
        }
        
        return $max;
    }
    
    public function getNext ($column)
    {
        return $this->max ($column) + 1;
    }
    
    public function min ($column)
    {
        $oSql                   = Sql::getInstance ();
        $definitionHandler      = DefinitionHandler::getInstance ();
        $defData                = $definitionHandler->resolveDefinition ($this->lModel, 3);
        $min                    = 0;
        
        if (isset ($defData[$defData['definition']][$column]))
        {
            $query  = 'SELECT MIN(`'.$column.'`) AS "min" FROM `'.$this->lModel.'`';
            $result = $oSql->query ($query);
            
            $min    = $result ? $result[0]['min'] : 0;
        }
        
        return $min;
    }
    
    public function paginate ($limit = 10, $page = 1)
    {
        $routeHandler       = RouteHandler::getInstance ();
        $route              = $routeHandler->getRoute ();
        
        if (strpos ($route, '/*') === strlen ($route) - 2)
        {
            $route  = substr ($route, 0, strlen ($route) - 2);
        }

        $this->pagination   = true;
        
        $this->limit        = $_SESSION['pagination'][$this->lModel]['limit'] = $limit;

        $_SESSION['pagination'][$this->lModel]['route']         = $route;
        $_SESSION['pagination'][$this->lModel]['currentPage']   = $page;

        $this->offset       = (($page-1)*$limit);
        
        return $this;
    }
    
    public function limit ($offset, $limit = false) 
    {
        $this->limit    = is_int ($offset) && $limit === false ? $offset : (is_int ($limit) ? $limit : false);
        $this->offset   = is_int ($offset) && $limit === false ? 0 : (is_int ($offset) ? $offset : false);
        
        return $this;
    }
    
    public function excludeDeleted ()
    {
        $this->excludeDeleted   = true;
        
        return $this;
    }
    
    public function includeDeleted ()
    {
        $this->includeDeleted   = true;
        
        return $this;
    }
    
    public function orderBy ($column, $sort = 'ASC')
    {
        if (is_string ($column) && $this->column_is_available ($column))
        {
            $sort           = is_string ($sort) ? strtoupper ($sort) : 'ASC';
            $sort           = $sort === 'ASC' || $sort === 'DESC' ? $sort : 'ASC';
            
            if (!is_array ($this->orderBy)) { $this->orderBy  = array ();   }
            
            $this->orderBy[]    = array ($column, $sort);
        }
        
        return $this;
    }
    
    public function add ($row)
    {
        $this->storage[]    = new ModelManip ($this->hModel, $row, $this->ignoreRights);

        return $this;
    }
    
    public function resetResult ()
    {
        $this->internalSearch   = false;

        $this->limit            = false;
        $this->offset           = false;
        $this->orderBy          = false;
        
        $this->storage          = null;
        
        $this->findBy           = array ();
        $this->findLike         = array ();

        $this->columns          = array ();
        $this->joins            = array ();
        
        $this->definitions      = array ();
    }
    
    public function nl2br ($column)
    {
        $this->replace[$column] = array
        (
            'search'    => '\n',
            'replace'   => '<br>'
        );
        
        return $this;
    }
    
    public function asGroup ($groupName)
    {
        $this->asGroup  = $groupName;
        
        return $this;
    }
    
    public function innerJoin ($sourceTable, $sourceColumn, $onDestTable, $onDestColumn, $fetchTable, $fetchColumn, $asColumn = null)
    {
        $this->joins[]  = array 
        (
            'src'           => $sourceTable,
            'srcCol'        => $sourceColumn,
            'dest'          => $onDestTable,
            'destCol'       => $onDestColumn,
            'fetchTable'    => $fetchTable === $sourceTable || $fetchTable === $onDestTable ? $fetchTable : $this->lModel,
            'fetchCol'      => $fetchColumn,
            'fetchColAs'    => $asColumn !== null ? $asColumn : $fetchColumn,
            'condition'     => 'and',
            'type'          => 'inner'
        );

        return $this;
    }
    
    public function orInnerJoin ($sourceTable, $sourceColumn, $onDestTable, $onDestColumn, $fetchTable, $fetchColumn, $asColumn = null)
    {
        $this->joins[]  = array 
        (
            'src'           => $sourceTable,
            'srcCol'        => $sourceColumn,
            'dest'          => $onDestTable,
            'destCol'       => $onDestColumn,
            'fetchTable'    => $fetchTable === $sourceTable || $fetchTable === $onDestTable ? $fetchTable : $this->lModel,
            'fetchCol'      => $fetchColumn,
            'fetchColAs'    => $asColumn !== null ? $asColumn : $fetchColumn,
            'condition'     => 'or',
            'type'          => 'inner'
        );

        return $this;
    }
    
    public function leftJoin ($sourceTable, $sourceColumn, $onDestTable, $onDestColumn, $fetchTable, $fetchColumn, $asColumn = null)
    {
        $this->joins[]  = array 
        (
            'src'           => $sourceTable,
            'srcCol'        => $sourceColumn,
            'dest'          => $onDestTable,
            'destCol'       => $onDestColumn,
            'fetchTable'    => $fetchTable === $sourceTable || $fetchTable === $onDestTable ? $fetchTable : $this->lModel,
            'fetchCol'      => $fetchColumn,
            'fetchColAs'    => $asColumn !== null ? $asColumn : $fetchColumn,
            'condition'     => 'and',
            'type'          => 'left'            
        );

        return $this;
    }
    
    public function orLeftJoin ($sourceTable, $sourceColumn, $onDestTable, $onDestColumn, $fetchTable, $fetchColumn, $asColumn = null)
    {
        $this->joins[]  = array 
        (
            'src'           => $sourceTable,
            'srcCol'        => $sourceColumn,
            'dest'          => $onDestTable,
            'destCol'       => $onDestColumn,
            'fetchTable'    => $fetchTable === $sourceTable || $fetchTable === $onDestTable ? $fetchTable : $this->lModel,
            'fetchCol'      => $fetchColumn,
            'fetchColAs'    => $asColumn !== null ? $asColumn : $fetchColumn,
            'condition'     => 'or',
            'type'          => 'left'
        );

        return $this;
    }
    
    public function rightJoin ($sourceTable, $sourceColumn, $onDestTable, $onDestColumn, $fetchTable, $fetchColumn, $asColumn = null)
    {
        $this->joins[]  = array 
        (
            'src'           => $sourceTable,
            'srcCol'        => $sourceColumn,
            'dest'          => $onDestTable,
            'destCol'       => $onDestColumn,
            'fetchTable'    => $fetchTable === $sourceTable || $fetchTable === $onDestTable ? $fetchTable : $this->lModel,            
            'fetchCol'      => $fetchColumn,
            'fetchColAs'    => $asColumn !== null ? $asColumn : $fetchColumn,
            'condition'     => 'and',
            'type'          => 'right'
        );

        return $this;
    }
    
    public function orRightJoin ($sourceTable, $sourceColumn, $onDestTable, $onDestColumn, $fetchTable, $fetchColumn, $asColumn = null)
    {
        $this->joins[]  = array 
        (
            'src'           => $sourceTable,
            'srcCol'        => $sourceColumn,
            'dest'          => $onDestTable,
            'destCol'       => $onDestColumn,
            'fetchTable'    => $fetchTable === $sourceTable || $fetchTable === $onDestTable ? $fetchTable : $this->lModel,            
            'fetchCol'      => $fetchColumn,
            'fetchColAs'    => $asColumn !== null ? $asColumn : $fetchColumn,
            'condition'     => 'or',
            'type'          => 'right'
        );

        return $this;
    }
    
    public function clear ($column, $altValue = '')
    {
        $this->clearColumns[$column]   = $altValue;
        
        return $this;
    }
    
    public function findBy ($column, $value, $op = false)
    {
        if ($op === '>=' || $op === '=>')       { $op = '>=';   }
        else if ($op === '<=' || $op === '=<')  { $op = '<=';   }
        else if ($op !== '>' && $op !== '<')    { $op = '=';    }
        
        $this->findBy[] = array 
        (
            'type'      => 'AND',
            'column'    => $column,
            'value'     => $value,
            'op'        => $op
        );

        return $this;
    }
    
    public function orFindBy ($column, $value, $op = false)
    {
        if ($op === '>=' || $op === '=>')       { $op = '>=';   }
        else if ($op === '<=' || $op === '=<')  { $op = '<=';   }
        else if ($op !== '>' && $op !== '<')    { $op = '=';    }
        
        $this->findBy[] = array 
        (
            'type'      => 'OR',
            'column'    => $column,
            'value'     => $value,
            'op'        => $op
        );

        return $this;
    }
    
    public function findLike ($column, $value)
    {
        $this->findLike[]   = array
        (
            'type'      => 'AND',
            'column'    => $column,
            'value'     => $value
        );

        return $this;
    }
    
    public function orFindLike ($column, $value)
    {
        $this->findLike[]   = array
        (
            'type'      => 'OR',
            'column'    => $column,
            'value'     => $value
        );

        return $this;
    }
    
    public function log ()  
    { 
        $this->logQuery = true;   
        
        return $this;
    }
    
    private function column_is_available ($column)
    {
        $definitionHandler      = DefinitionHandler::getInstance ();
        $defData                = $definitionHandler->resolveDefinition ($this->lModel, 3);

        if (is_array ($defData) && isset ($defData[$this->hModel]))
        {
            foreach ($defData[$this->hModel] as $col => $val) 
            {
                if (strtolower ($col) === strtolower ($column))
                {
                    return true;
                }
            }
        }

        return false;
    }
    
    private function groupJoins ()
    {
        $sql            = Sql::getInstance ();
        $joins          = $this->joins;
        $grouped        = array ();

        foreach ($joins as $join)
        {
            $src        = $sql->real_escape_string ($join['src']);
            $dest       = $sql->real_escape_string ($join['dest']);
            $type       = $sql->real_escape_string ($join['type']);
            $condition  = $sql->real_escape_string ($join['condition']);
            
            $srcCol     = $sql->real_escape_string ($join['srcCol']);
            $destCol    = $sql->real_escape_string ($join['destCol']);
            $fetchTable = $sql->real_escape_string ($join['fetchTable']);
            $fetchCol   = $sql->real_escape_string ($join['fetchCol']);
            $fetchColAs = $sql->real_escape_string ($join['fetchColAs']);

            if (!isset ($grouped[$src]))                            { $grouped[$src]                            = array ();         }
            if (!isset ($grouped[$src][$dest]))                     { $grouped[$src][$dest]                     = array ();         }
            if (!isset ($grouped[$src][$dest][$type]))              { $grouped[$src][$dest][$type]              = array ();         }
            if (!isset ($grouped[$src][$dest][$type][$condition]))  { $grouped[$src][$dest][$type][$condition]  = array ();         }
            
            $grouped[$src][$dest][$type][$condition][]  = array
            (
                'srcCol'        => $srcCol,
                'destCol'       => $destCol,
                'fetchTable'    => $fetchTable,
                'fetchCol'      => $fetchCol,
                'fetchColAs'    => $fetchColAs
            );
        }
        
        $this->joins    = $grouped;
    }
    
    private function fetchDefinitions ()
    {
        $definitionHandler      = DefinitionHandler::getInstance ($this->asGroup ? $this->asGroup : false);
        
        $table                  = $this->lModel;
        $joins                  = $this->joins;
        $definitions            = $this->definitions;
        
        $definitions[$table]    = $definitionHandler->resolveDefinition ($table, 3);
        
        foreach ($joins as $srcTable => $destArray)
        {
            if (!isset ($definitions[$srcTable]))
            {
                $definitions[$srcTable] = $definitionHandler->resolveDefinition ($srcTable, 3);
            }
            
            foreach ($destArray as $destTable => $destValues)
            {
                if (!isset ($definitions[$destTable]))
                {
                    $definitions[$destTable]  = $definitionHandler->resolveDefinition ($destTable, 3);
                }
            }
        }

        $this->definitions  = $definitions;
    }
    
    private function createDefaultColumns ($definitions)
    {
        $columns    = array ();
        
        if (is_array ($definitions))
        {
            foreach ($definitions as $model => $defData)
            {
                $definition = $defData[$defData['definition']];
                
                foreach ($definition as $column => $type)
                {
                    $isVirtual                      = strpos ($type, 'virtual_') === 0;
                    $columns[$column]['table']      = '`'.$model.'`';
                    $columns[$column]['select']     = !$isVirtual ? '`'.$model.'`.`'.$column.'` AS `'.$column.'`' : '"" AS `'.$column.'`';
                    $columns[$column]['column']     = $column;
                    $columns[$column]['isVirtual']  = $isVirtual;
                }
           }
        }
        
        return $columns;
    }
    
    private function createColumns ()
    {
        $definitions    = $this->definitions;
        $joins          = $this->joins;
        $columns        = $this->createDefaultColumns ($definitions);
        $match          = false;

        foreach ($joins as $leftTable => $join)
        {
            foreach ($join as $rightTable => $tableData)
            {
                $defLTable  = isset ($definitions[$leftTable][$definitions[$leftTable]['definition']]) ? $definitions[$leftTable][$definitions[$leftTable]['definition']] : false;
                $defRTable  = isset ($definitions[$rightTable][$definitions[$rightTable]['definition']]) ? $definitions[$rightTable][$definitions[$rightTable]['definition']] : false;
                
                foreach ($tableData as $values)
                {
                    $ands       = isset ($values['and']) ? $values['and'] : array ();
                    $ors        = isset ($values['or']) ? $values['or'] : array ();

                    foreach ($ands as $data)
                    {
                        $fetchTable = $data['fetchTable'];
                        $fetchCol   = $data['fetchCol'];
                        $fetchColAs = $data['fetchColAs'];
                        
                        $table      = $leftTable === $fetchTable && isset ($defLTable[$fetchCol]) ? $leftTable : false;
                        $table      = !$table && $rightTable === $fetchTable && isset ($defRTable[$fetchCol]) ? $rightTable : $table;

                        if ($table)
                        {
                            $typeofColumn                       = $definitions[$table][$definitions[$table]['definition']][$fetchCol];
                            $isVirtual                          = strpos ($typeofColumn, 'virtual_') === 0;

                            $columns[$fetchColAs]['table']      = '`'.$table.'`';
                            $columns[$fetchColAs]['select']     = !$isVirtual ? '`'.$table.'`.`'.$fetchCol.'` AS `'.$fetchColAs.'`' : '"" AS `'.$fetchColAs.'`';
                            $columns[$fetchColAs]['column']     = $fetchCol;
                            $columns[$fetchColAs]['isVirtual']  = $isVirtual;
                            $match   = true;
                        }
                    }

                    if (!$match)
                    {
                        foreach ($ors as $data)
                        {
                            $fetchTable = $data['fetchTable'];
                            $fetchCol   = $data['fetchCol'];
                            $fetchColAs = $data['fetchColAs'];
                            
                            $table      = $leftTable === $fetchTable && isset ($defLTable[$fetchCol]) ? $leftTable : false;
                            $table      = !$table && $rightTable === $fetchTable && isset ($defRTable[$fetchCol]) ? $rightTable : $table;

                            if ($table)
                            {
                                $typeofColumn                       = $definitions[$table][$definitions[$table]['definition']][$fetchCol];
                                $isVirtual                          = strpos ($typeofColumn, 'virtual_') === 0;

                                $columns[$fetchColAs]['table']      = '`'.$table.'`';
                                $columns[$fetchColAs]['select']     = !$isVirtual ? '`'.$table.'`.`'.$fetchCol.'` AS `'.$fetchColAs.'`' : '"" ` AS `'.$fetchColAs.'`';
                                $columns[$fetchColAs]['column']     = $fetchCol;
                                $columns[$fetchColAs]['isVirtual']  = $isVirtual;

                                $match   = true;
                            }
                        }
                    }
                }
            }
        }

        $lDefinition    = $definitions[$this->lModel][$definitions[$this->lModel]['definition']];
        $joinColumns    = $columns;

        foreach ($lDefinition as $lColumn => $typeOfColumn)
        {
            $isVirtual  = strpos ($typeOfColumn, 'virtual_') === 0 && strtolower ($lColumn) !== 'id';
            
            if (!isset ($joinColumns[$lColumn]) || !$isVirtual)
            {
                $columns[$lColumn]  = array
                (
                    'table'         => $this->lModel,
                    'select'        => !$isVirtual ? '`'.$this->lModel.'`.`'.$lColumn.'` AS `'.$lColumn.'`' : '"" AS `'.$lColumn.'`',
                    'column'        => $lColumn
                );
            }
        }

        
        $columns['ID']['table']     = '`'.$this->lModel.'`';
        $columns['ID']['select']    = '`'.$this->lModel.'`.`ID` AS `ID`';
        $columns['ID']['column']    = 'ID';

        $this->columns  = $columns;
    }
    
    private function createSelect ()
    {
        $columns    = $this->columns;
        $replaces   = $this->replace;
        $select     = '';

        foreach ($columns as $column => $values)
        {
            if (isset ($replaces[$column]))
            {
                $search     = $replaces[$column]['search'];
                $replace    = $replaces[$column]['replace'];

                $select    .= 'REPLACE('.$values['table'].'.`'.$values['column'].'`, "'.$search.'", "'.$replace.'") AS '.$column.', ';
            }
            else
            {
                $select    .= $values['select'].', ';
            }
        }

        $select = substr ($select, 0, strlen ($select) - 2).' ';

        return $select;
    }
    
    private function createClause ()
    {
        $joins  = $this->joins;
        $clause = 'FROM '.'`'.$this->lModel.'` ';
        
        foreach ($joins as $table => $join)
        {
            foreach ($join as $joinTable => $joinTypes)
            {
                foreach ($joinTypes as $joinType => $joinValues)
                {
                    $ands       = isset ($joinValues['and']) ? $joinValues['and'] : array ();
                    $ors        = isset ($joinValues['or']) ? $joinValues['or'] : array ();
                    $first      = true;
                    $built      = array ();
                    
                    $clause    .= strtoupper ($joinType).' JOIN '.' `'.$table.'` ';
                    $clause    .= 'ON ';

                    foreach ($ands as $and)
                    {
                        if (!isset ($built[$and['srcCol']]) && !isset ($built[$and['destCol']]))
                        {
                            if (!$first) { $clause .= 'AND ';   }

                            $first      = false;
                            $clause    .= '`'.$table.'`.`'.$and['srcCol'].'`=`'.$joinTable.'`.`'.$and['destCol'].'` ';
                            
                            $built[$and['srcCol']]  = true;
                            $built[$and['destCol']] = true;
                        }
                    }
                    
                    foreach ($ors as $or)
                    {
                        if (!isset ($built[$or['srcCol']]) && !isset ($built[$or['destCol']]))
                        {
                            if (!$first) { $clause .= 'OR ';    }

                            $first      = false;
                            $clause    .= '`'.$table.'`.`'.$or['srcCol'].'`=`'.$joinTable.'`.`'.$or['destCol'].'` ';
                            
                            $built[$or['srcCol']]   = true;
                            $built[$or['destCol']]  = true;
                        }
                    }
                    
                }
            }
        }

        return $clause;
    }
    
    private function createWhere ()
    {
        $oSql                   = Sql::getInstance ();

        $findBy                 = $this->findBy;
        $findLike               = $this->findLike;
        $columns                = $this->columns;
        $query                  = '';

        foreach ($findBy as $key => $find) 
        {
            $value          = $find['value'] !== null ? '"'.$oSql->real_escape_string ($find['value']).'"' : 'IS NULL';
            $op             = $find['value'] !== null ? $find['op'] : '';
            $table          = isset ($columns[$find['column']]) ? $columns[$find['column']]['table'].'.' : $this->lModel.'.';
            $column         = isset ($columns[$find['column']]['column']) && $columns[$find['column']]['column'] !== false ? $oSql->real_escape_string ($columns[$find['column']]['column']) : $oSql->real_escape_string ($find['column']);
            $query         .= ($key > 0 ? $find['type'] : '').' '.$table.'`'.$column.'` '.$op.' '.$value.' ';
        }

        foreach ($findLike as $key => $find) 
        {
            $table          = isset ($columns[$find['column']]) ? $columns[$find['column']]['table'].'.' : $this->lModel.'.';
            $column         = isset ($columns[$find['column']]['column']) && $columns[$find['column']]['column'] !== false ? $oSql->real_escape_string ($columns[$find['column']]['column']) : $oSql->real_escape_string ($find['column']);
            $prepend        = $key > 0 || strlen ($query) > 0;
            $query         .= ($prepend ? $find['type'] : '').' '.$table.'`'.$column.'` LIKE "%'.$oSql->real_escape_string ($find['value']).'%" ';
        }
        
        if ($this->excludeDeleted)
        {
            $query      = strlen ($query) > 0 ? '('.$query.') AND `'.$this->lModel.'`.`deleted`=0 ' : '`'.$this->lModel.'`.`deleted`=0 ';
        }
        else if ($this->includeDeleted)
        {
            $query      = strlen ($query) > 0 ? '('.$query.') AND `'.$this->lModel.'`.`deleted`=1 ' : '`'.$this->lModel.'`.`deleted`=1 ';
        }

        return strlen ($query) > 0 ? 'WHERE '.$query : '';
    }
    
    private function createOrderBy ()
    {
        if (is_array ($this->orderBy) && count ($this->orderBy) > 0 
            && is_array ($this->orderBy[0]) && count ($this->orderBy[0]) === 2
        ) {
            $orderBy    = ' ORDER BY ';

            foreach ($this->orderBy as $oBy)
            {
                if (is_array ($oBy) && count ($oBy) === 2)
                {
                    $lOBy       = strtolower ($oBy[0]);
                    $order      = isset ($this->columns[$lOBy]) ? $this->columns[$lOBy]['table'].'.`'.$this->columns[$lOBy]['column'].'`' : $this->lModel.'.`'.$oBy[0].'`';
                    $orderBy   .= $order.' '.$oBy[1].', ';
                }
            }

            $orderBy    = substr ($orderBy, 0, strlen ($orderBy) - 2).' ';
        }
        else
        {
            $orderBy    = '';
        }  

        return $orderBy;
    }
    
    private function createQuery ()
    {
        $this->groupJoins ();
        $this->fetchDefinitions ();
        $this->createColumns ();

        return array
        (
            'select'    => $this->createSelect (),
            'clause'    => $this->createClause (),
            'where'     => $this->createWhere (),
            'orderBy'   => $this->createOrderBy ()    
        );
    }
    
    /*
     * Fetch all columns of current model (table) wich are translatable:
     * 
     * @return array translatable columns
     */
    private function fetchTranslatables ()
    {
        $translatables  = array ();
        $oSql           = Sql::getInstance ();
        
        $query  = 'SELECT `col` FROM `model_definitions` ';
        $query .= 'INNER JOIN `models` ON `models`.`ID`=`model_definitions`.`model_id` ';
        $query .= 'WHERE `models`.`name`="'.$this->hModel.'" ';
        $query .= 'AND `model_definitions`.`translatable`=1 ';
        
        $result = $oSql->query ($query);
        
        if ($result && is_array ($result) && count ($result) > 0)
        {
            foreach ($result as $row => $column) 
            {
                $translatables[$column['col']]  = NULL;
            }
        }
        
        return $translatables;
    }
    
    private function fetchTranslation ($affected, $row)
    {
        $intersected    = array_intersect_key ($row, $affected);
        $row_id         = $row['ID'];
        $oSql           = Sql::getInstance ();
        
        foreach ($intersected as $column => $value)
        {
            $definition_id  = $affected[$column];
            
            $query          = 'SELECT `content` FROM `translations` ';
            $query         .= 'WHERE `lang_code`="'.$this->language.'" ';
            $query         .= 'AND `definition_id`="'.$definition_id.'" ';
            $query         .= 'AND `row_id`="'.$row_id.'";';
            
            $result         = $oSql->query ($query);
            
            if ($result && is_array ($result) && count ($result) === 1)
            {
                $row[$column]   = $result[0]['content'];
            }
        }
        
        return $row;
    }
    
    private function translate ($rows)
    {
        $translatables  = $this->fetchTranslatables ();
        $defIDS         = $this->definitions[$this->lModel]['definition_ids'];
        
        $affected       = array_intersect_key ($defIDS, $translatables);

        foreach ($rows as $inx => $row)
        {
            $rows[$inx] = $this->fetchTranslation ($affected, $row);
        }
        
        return $rows;
    }
    
    private function fetchModel ()
    {
        $retDef                 = array();

        $env                    = $this->setting ('env');

        $oSql                   = Sql::getInstance ();

        $model                  = $this->hModel;
        $offset                 = is_int ($this->offset) ? $this->offset : 0;
        $limit                  = is_int ($this->limit) ? ' LIMIT '.$offset.', '.$this->limit : '';

        $retDef['model']        = $model;
        $retDef[$model]         = array ();

        $query                  = $this->createQuery ();

        $select                 = $query['select'];
        $clause                 = $query['clause'];
        $where                  = $query['where'];
        $orderBy                = $query['orderBy'];

        $querySelect    = 'SELECT '.$select.' '.$clause.' '.$where.$orderBy.$limit.';';
        
        if ($this->showQuery && $env !== 'live')
        {
            echo $querySelect;exit;
        }
        
        if ($this->pagination)
        {
            $queryCalc      = 'SELECT SQL_CALC_FOUND_ROWS '.$select.' '.$clause.' '.$where;
            $resultCalc     = $oSql->query ($queryCalc);

            if ($resultCalc)
            {
                $_SESSION['pagination'][$this->lModel]['total']    = (int)$resultCalc;
            }
        }

        if ($this->logQuery)
        {
            $logQuery   = 'INSERT INTO `log` (`user_id`, `type`, `log`) ';
            $logQuery  .= 'VALUES ("'.$this->userID ().'", "Single Log", "'.$this->escape_string ($querySelect).'");';

            $oSql->query ($logQuery);
        }

        $result         = $oSql->query ($querySelect);
        $errno          = mysqli_errno ($oSql->getConnection ());

        if ($errno === 0)
        {
            $retDef[$model] = (is_array ($result) && count ($result) > 0) ? $result : array ();
            $retDef[$model] = $this->translate ($retDef[$model]);
        }
        else
        {
            return new ErrorHandler ($errno, false);
        }  
        
        $this->resetResult ();
        
        return $retDef;
    }

    private function find ()
    {
        $fetched    = $this->fetchModel ();
        $isError    = is_object ($fetched) && get_class ($fetched) === 'ErrorHandler';
            
        if (!$isError)
        {
            $rows   = isset ($fetched[$this->hModel]) && is_array ($fetched[$this->hModel]) && count ($fetched[$this->hModel]) > 0 ? $fetched[$this->hModel] : false;
        
            if ($rows)            
            {
                foreach ($rows as $row)
                {
                    if (count ($this->clearColumns) > 0)    { $row = array_merge ($row, $this->clearColumns);   }

                    $this->storage[]    = new ModelManip ($this->hModel, $row);
                }
            }
        }
        else
        {
            $this->storage  = $fetched;
        }
    }
}
