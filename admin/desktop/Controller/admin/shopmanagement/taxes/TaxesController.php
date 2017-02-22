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

class TaxesController extends ControllerHelper implements ControllerInterface 
{

    public function getModel (\Model $model, $params) 
    {
        $params     = explode ('/', $params);
        
        $page       = (int)$params[0] > 0 ? (int)$params[0] : 1;
        $sort       = isset ($params[1]) ? $this->escape_string ($params[1]) : 'name';
        $sortOrder  = isset ($params[2]) ? $this->escape_string ($params[2]) : 'asc';

        $uRows      = $model
                        ->paginate (10, $page)
                        ->findBy ('deleted', 0)
                        ->orderBy ($sort, $sortOrder)
                        ->result ();

        return $uRows;
    }

    public function postModel (\Model $model)           
    {
        $row        = $model->result ();
        $tax        = $row->get ('tax');
        $taxID      = $model->getNext ('tax_id');
        if ($taxID < 1000) { $taxID = 1000;   }
         
        $postID     = $model->add (array ('tax_id' => $taxID, 'tax'=> $tax))->result ()->post ();
        
        if ($postID)
        {
            return array 
            (
                'id'        => $postID,
                'tax_id'    => $taxID
            );
        }

        return $this->error ($this->SQL_ERR_ON_POST);
    }

    public function updateModel (\Model $model)         {}
    public function deleteModel (\Model $model)         {}
    public function uploadFile (\Model $model, $file)   {}
}