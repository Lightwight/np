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

class Article_suppliersController extends ControllerHelper implements ControllerInterface 
{

    public function getModel (\Model $model, $params) 
    {
        $params     = explode ('/', $params);
        
        $page       = (int)$params[0] > 0 ? (int)$params[0] : 1;
        $sort       = isset ($params[1]) ? $this->escape_string ($params[1]) : 'name';
        $sortOrder  = isset ($params[2]) ? $this->escape_string ($params[2]) : 'asc';
        $search     = isset ($params[3]) ? $this->escape_string ($params[3]) : false;

        if ($sort === 'id') { $sort = 'ID'; }        

        if (!$search)
        {
            $uRows  = $model
                        ->paginate (10, $page)
                        ->findBy ('deleted', 0)
                        ->excludeDeleted ()
                        ->orderBy ($sort, $sortOrder)
                        ->result ();

        }
        else
        {
            $uRows  = $model
                        ->paginate (10, $page)
                        ->findBy ('deleted', 0)
                        ->orderBy ($sort, $sortOrder)
                        ->findLike ('ID', $search)
                        ->findLike ('supplier_id', $search)
                        ->orFindLike ('name', $search)
                        ->orFindLike ('city', $search)
                        ->excludeDeleted ()
                        ->result ();
        }

        return $uRows;
    }

    public function postModel (\Model $model)           
    {
        $row        = $model->result ();
        $name       = $row->get ('name');
        $supplierID = $model->getNext ('supplier_id');
        if ($supplierID < 1000) { $supplierID = 1000;   }

        $postID     = $model->add (array ('supplier_id' => $supplierID, 'name'=> $name))->result ()->post ();
        
        if ($postID)
        {
            return array 
            (
                'id'            => $postID,
                'supplier_id'   => $supplierID
            );
        }
        
        return $this->getError (ErrorCodeHelper::$_SQL_ERROR_ON_POST);
    }

    public function updateModel (\Model $model)         {}
    public function deleteModel (\Model $model)         {}
    public function uploadFile (\Model $model, $file)   {}
}