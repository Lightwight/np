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
        $id         = (int)$params[0] > 0 ? (int)$params[0] : 0;

        return $id > 0 ? $model->findBy ('supplier_id', $id)->excludeDeleted ()->result () : $this->error ($this->REQ_ERR_INVALID_ARGS);
    }

    public function postModel (\Model $model)           {}
    public function updateModel(\Model $model)          
    {
        $supplier       = $model->result ();
        
        $supplier->set ('name', $supplier->get ('name'));
        $supplier->set ('country', $supplier->get ('country'));
        $supplier->set ('postal', $supplier->get ('postal'));
        $supplier->set ('city', $supplier->get ('city'));
        $supplier->set ('street', $supplier->get ('street'));
        $supplier->set ('street_number', $supplier->get ('street_number'));
        
        return $supplier->update ();
    }
    
    public function deleteModel (\Model $model)         {}
    public function uploadFile (\Model $model, $file)   {}
}