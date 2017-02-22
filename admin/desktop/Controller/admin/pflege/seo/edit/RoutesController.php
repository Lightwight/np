<?php

/* 
 * Copyright (C) 2015 cross
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

class RoutesController extends ControllerHelper implements ControllerInterface
{
    public function getModel (Model $model, $params)
    {
        $id     = !empty ($params) && (int)$params > 0 ? (int)$params : false;
        $route  = $id > 0 ? $model->findBy ('id', $id)->result () : false;
        
        return $route && $route->get ('customizable') ? $route : 0;
    }

    public function postModel (Model $model)            {}
    public function updateModel (Model $model)          {}
    public function deleteModel (Model $model)          {}
    public function uploadFile (\Model $model, $file)   {}
}