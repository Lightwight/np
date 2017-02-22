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

class ModelHandler extends HandlerHelper
{
    private static $instance    = null;
    private static $method      = 'Get';
    
    public static function getInstance()    { return ( self::$instance !== null )? self::$instance : self::$instance = new self;    }    
    
    private function __construct() {}
    
    private function __clone(){}
    
    public function setMethod( $method ) 
    {
        self::$method   = $method;
    }
    
    public function resolveModel ($params)
    {
        RouteHelper::setRoute (isset ($params['route']) ? $params['route'] : -1);

        if( self::$method === 'get' )           { return self::fetchModel ($params);    }
        else if( self::$method === 'post' )     { return self::postModel ($params);     }
//        else if( self::$method === 'delete' )   { return self::deleteModel ($params );  }
    }
    
    private static function getController ($model)
    {
        $oConfig            = Config::getInstance ();
        $scope              = $oConfig->getScope ();
        
        $hModel             = strtoupper (substr ($model, 0, 1)).substr ($model, 1);
        $class              = $hModel.'Controller';

        $classExists        = npAutoload ($class, RouteHelper::getRouteForAutoload (), $scope);

        return $classExists ? new $class : false;
    }

    private static function postModel ($params)
    {
        $model      = ( isset( $params['model'] ) )? $params['model'] : false;
        $data       = ( isset( $params[$model] ) && count( $params[$model] > 0 ) )? $params[$model] : false;
        $controller = false;

        $retVal     = array
        ( 
            'model' => $model,
            $model  => array()
        );
        
        if ($model && $data)
        {
            $controller = self::getController ($model);

            foreach ($data as $key => $rows)
            {
                $state  = isset ($rows['state']) ? $rows['state'] : false;
                $row    = isset ($rows['row']) ? $rows['row'] : false;
                $vID    = isset ($row['ID']) ? $row['ID'] : (isset ( $row['id'] ) ? $row['id'] : false);
                
                $retVal[$model][$vID]   = null;
               
                if ($controller)
                {
                    if ($state && $state === 'new')
                    {
                        $oModel     = new Model ($model);
                        $manip      = $controller->postModel ($oModel->add ($row));
                        $isManip    = is_object ($manip) && get_class ($manip) === 'ModelManip';

                        if ($isManip)
                        {
                            $error  = $manip->error ();
                            $row    = $manip->getRow ();

                            $retVal[$manip->getName(true)][$vID]    = count ($error) > 0 ? $error : $row['id'];
                        }
                        else
                        {
                            $retVal[$model][$vID]   = $manip;
                        }
                    }
                    else if ($state && $state === 'chg')
                    {
                        $oModel     = new Model ($model);
                        $manip      = $controller->updateModel ($oModel->add ($row));
                        $isManip    = is_object($manip) && get_class ($manip) === 'ModelManip';

                        if ($isManip)
                        {
                            $error  = $manip->error ();
                            $row    = $manip->getRow ();

                            $retVal[$manip->getName(true)][$vID]    = count ($error) > 0 ? $error : $row['id'];
                        }
                        else
                        {
                            $retVal[$model][$vID]   = $manip;
                        }
                    }
                    else if ($state && $state == 'rem')
                    {
                        $retVal = array_merge ($retVal, self::deleteRow (array( 'model' => $model, 'dataset' => array ($row))));
                    }
                    else 
                    {
                        // TODO_ Method not allowed!
                    }
                } 
            }
        }

        return $retVal;
    }
    
    private static function updateRow( $model, $row )
    {
        $oSql       = Sql::getInstance ();        
        $blacklist  = array( 'status', 'ID', 'id' );
       
        $set        = '';
        $where      = '';
        $id         = 0;
        
        foreach( $row as $col => $value )
        {
            if( !in_array( $col, $blacklist ) ) 
            { 
                $set   .= '`'.$oSql->real_escape_string( $col ).'`="'.$oSql->real_escape_string( $value ).'",';
            }
        }
        
        $set    = ( strlen( $set ) > 0 )? substr( $set, 0, strlen( $set ) - 1 ) : false;
        
        // TODO: Implement Check if query success:
        if( $set )  
        {
            $id     = isset( $row['ID'] ) ? (int)$row['ID'] : (int)$row['id'];
            $query  = 'UPDATE `'.$oSql->real_escape_string( $model ).'` SET '.$set.' WHERE `'.$model.'`.`ID`='.$id.';';

            $oSql->query( $query );
        }

        $errno  = $oSql->lastError ();

        return  $errno === 0 ? $id : $this->error ($errno);
    }
    
    public static function fetchModel ($params)
    {
        $retDef     = array ();
        
        if (isset ($params['model']))
        {
            $oSql                   = Sql::getInstance ();            

            $model                  = strtoupper (substr ($params['model'], 0, 1)).substr ($params['model'], 1);
            $findBy                 = isset ($params[$model]['findby']) ? $oSql->real_escape_string ($params[$model]['findby']) : '';
            $findLike               = isset ($params[$model]['findlike']) ? $oSql->real_escape_string ($params[$model]['findlike']) : '';

            $search                 = (($findBy !== false || $findLike !== false) && isset ($params[$model]['search'])) ? $oSql->real_escape_string ($params[$model]['search']) : false;
            $customSearch           = ($findBy !== false || $findLike !== false ) && $search !== false;

            $retDef['model']        = $model;
            $retDef[$model]         = array ();

            $definitionHandler      = DefinitionHandler::getInstance ();
            $defData                = $definitionHandler->resolveDefinition ($model, 3);

            $definition             = array_key_exists ($model, $defData) && count ($defData[$model] > 0) ? $defData[$model] : array (); 

            $cols                   = '';

            foreach ($definition as $col => $type) 
            { 
                $isVirtual  = substr ($type, 0, 7) === 'virtual' && $col !== 'ID' && $col !== 'id';
                $isID       = $col === 'ID' || $col === 'id';
                $cols      .= $isVirtual ? '"" AS `'.$col.'`,' : ($isID ? '`ID` as \'id\',' : '`'.$col.'`,');
            }

            if ($cols !== '')
            {
                $cols   = substr ($cols, 0, strlen( $cols ) - 1);
                $table  = strtolower (substr ($model, 0, 1)).substr ($model, 1);

                $query  = 'SELECT '.$cols.' FROM '.$table;

                if ($customSearch) 
                {
                    if ($findBy)
                    {
                        // TODO: check, if findBy is in definiion (currently hackable):
                        $query  .= ' WHERE `'.$findBy.'`=\''.$search.'\'';
                    }
                    else 
                    {
                        $query  .= ' WHERE `'.$findLike.'` LIKE \'%'.$search.'%\'';
                    }
                }

                $query .= ';';

                $result = $oSql->query ($query);

                $errno  = mysqli_errno ($oSql->getConnection ());

                if ($errno === 0)
                {
                    $retDef[$model] = (is_array ( $result ) && count ($result) > 0)? $result : array ();
                }
                else
                {
                    return new ErrorHandler ($errno, false);
                }
            }
        }
        
        return $retDef;        
    }
    
    private static function deleteRow ($params)
    {
        $model  = ( isset( $params['model'] ) )? $params['model'] : false;
        $data   = ( isset( $params['dataset'] ) && is_array( $params['dataset'] ) && count( $params['dataset'] > 0 ) )? $params['dataset'] : false;
        $retVal = array();
        $userID = Auth::userID ();
        
        if ($model && $data)
        {
            $oSql               = Sql::getInstance ();
            
            $retVal['model']    = $model;
            $retVal[$model]     = array();
            
            $definitionHandler  = DefinitionHandler::getInstance ();
            $defData            = $definitionHandler->resolveDefinition ($model, 2);

            $definition         = array_key_exists ($model, $defData) && count ($defData[$model] > 0) ? $defData[$model] : array (); 
            
            $tmpModel           = strtolower (substr($model, 0, 1)).substr ($model, 1);

            if (isset ($definition['deleted']) && isset ($definition['user']))
            {
                foreach ($data as $set)
                {
                    $id     = isset ($set['ID']) ? $set['ID'] : $set['id'];
                    $query  = 'UPDATE `'.$tmpModel.'` SET `deleted`=1, `user`="'.$userID.'" WHERE `ID`="'.$id.'";';

                    $result = $oSql->query ($query);

                    $retVal[$model][$id] = (int)($result != 0) ? 1 : array ('err' => 404);
                }
            }
            else
            {
                foreach ($data as $set)
                {
                    $id                     = isset ($set['ID']) ? $set['ID'] : $set['id'];
                    $retVal[$model][$id]    = array ('err' => 404);
                }
            }
        }
        
        return $retVal;
    }
}