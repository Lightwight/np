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

class Article_manufacturersController extends ControllerHelper implements ControllerInterface 
{
    public function getModel (\Model $model, $params) 
    {
        $params     = explode ('/', $params);
        $id         = (int)$params[0] > 0 ? (int)$params[0] : 0;

        return $id > 0 ? $model->findBy ('manufacturer_id', $id)->excludeDeleted ()->result () : $this->getError (ErrorCodeHelper::$_REQ_INVALID_ARGS);
    }

    public function postModel (\Model $model)           {}
    public function updateModel(\Model $model)          
    {
        $breadcrumb     = new BreadcrumbController ();
        $slugify        = new \Cocur\Slugify\Slugify ();
        
        $manufacturer   = $model->result ();

        $name           = $manufacturer->get ('name');
        $slug           = $slugify->slugify ($name, '-');
        
        $manufacturer->set ('name', $manufacturer->get ('name'));
        $manufacturer->set ('country', $manufacturer->get ('country'));
        $manufacturer->set ('postal', $manufacturer->get ('postal'));
        $manufacturer->set ('city', $manufacturer->get ('city'));
        $manufacturer->set ('street', $manufacturer->get ('street'));
        $manufacturer->set ('street_number', $manufacturer->get ('street_number'));
        
        $breadcrumb->addBreadcrumb ($slug, $name);
        
        return $manufacturer->update ();
    }
    
    public function deleteModel (\Model $model)         {}
    public function uploadFile (\Model $model, $file)   {}
}