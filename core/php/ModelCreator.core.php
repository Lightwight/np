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

class ModelCreator 
{
    private $page       = '';
    private $modelDef   = array();
    private $paramInfo  = array();
    
    public function __construct(){}
    
    public function setPage( $page ) 
    {
        $this->page    = $page;
        
        if( strlen( $page ) > 0 && !array_key_exists( $page, $this->modelDef ) )
        {
            $this->modelDef[$page] = array();
        }
    }
    
    public function get_page()      { return $this->page;                           }
    public function get_models()    { return $this->modelDef[$this->page];          }
    
    public function set_invalid( $param, $message = '' )
    {
        $this->paramInfo[$param]                = array();
        $this->paramInfo[$param]['status']      = 'invalid';
        $this->paramInfo[$param]['message']     = $message;
    }

    public function createModelFor( $models  = null )
    {
        $this->modelDef[$this->page]        = array();
        $blCreated                          = true;

        if( is_array( $models ) && count( $models ) > 0 )
        {
            foreach( $models as $model )
            {
                if( $model !== null )
                {
                    $tmpModel           = strtoupper( substr( $model, 0, 1 ) ).substr( $model, 1 );

                    $oModel             = new $tmpModel();
                    $oSql               = Sql::getInstance ();
                    $tmpDef             = array();

                    $oModel->define();

                    $this->modelDef[$this->page][$tmpModel] = $definition = $oModel->get_attrs();

                    foreach( $definition as $name => $type )
                    {
                        if( $type !== 'virtual' )   { $tmpDef[$name] = $type;  }
                    }
                    
                    $this->modelDef[$this->page][$tmpModel]['id']   = 'integer';
                    
                    $tmpCreated = !$oSql->tableExists( $model ) && $oSql->createTable( $model, $tmpDef );
                    $blCreated  = ( $blCreated && $tmpCreated );        
                }
            }
        }    

        return $blCreated;
    }
    
    public function findModel( $modelName, $vars = null )
    {
        $tmpModel   = strtoupper( substr( $modelName, 0, 1 ) ).substr( $modelName, 1 );
        $oSql       = Sql::getInstance ();
        
        $oSql->selectTable ($modelName);
        
        $sqlResult                  = ( $vars !== null )? $oSql->find ($vars) : $oSql->result(); 
        
        $result                     = array();
        $result['type']             = 'model';
        $result['model']            = $tmpModel;
        $result[$tmpModel]          = $sqlResult;

        header ( 'Content-Type: application/json' );
        
        return json_encode( $result );
    }
    
    public function putModel( $class, $vars )
    {
        $blValid    = true;
        $return     = array();
        $invalid    = $class->get_invalid();
        
        foreach( $invalid as $param => $message )   { $this->set_invalid( $param, $message);    }
        
        foreach( $vars as $key => $value )
        {
            if( array_key_exists( $key, $this->paramInfo ) && $this->paramInfo[$key]['status'] === 'invalid' )
            {
                if( $blValid )  { $blValid    = false;  }
                
                $return[$key]   = $this->paramInfo[$key]['message'];
            }
        }
        
        if( !$blValid )
        {
            $responder  = ResponseCodes::getInstance();
            $responder->setResponseCode( ResponseCodes::RSP_ERR_NOT_ACCEPTABLE );
        }
        
        header ( 'Content-Type: application/json' );
        
        return json_encode( $return );
    }
}