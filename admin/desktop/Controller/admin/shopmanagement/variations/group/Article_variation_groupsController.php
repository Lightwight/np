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

class Article_variation_groupsController extends ControllerHelper implements ControllerInterface 
{
    public function getModel (\Model $model, $params) 
    {
        if ($this->isGroup (1))
        {
            $params     = explode ('/', $params);
            $id         = (int)$params[0] > 0 ? (int)$params[0] : 0;
            
            return $id > 0 ? $model->result () : false;
        }
        
        return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
    }
    
    public function postModel (\Model $model)           
    {
        if ($this->isGroup (1))
        {
            $row        = $model->result ();

            $groupID    = (int)$model->getNext ('group_id');
            $groupName  = $row->get ('group_name');

            $postID     = $model->add (array (
                            'group_id'      => $groupID,
                            'group_name'    => $groupName
                        ))->result ()->post ();

            if ($postID)
            {
                return array 
                (
                    'id'                => $postID,
                    'group_id'          => $groupID
                );
            }

            return $this->getError (ErrorCodeHelper::$_SQL_ERROR_ON_POST);
        }        
    }
    
    public function updateModel (\Model $model)          
    {
        $row        = $model->result ();
        $groupName  = $row->get ('group_name');
                
        // Article - user view
        $row->set ('group_name', $groupName);
        
        return $row->update ();
    }
    
    public function deleteModel (\Model $model)         
    {
        if ($this->isGroup (1))
        {
            return $model->result ();
        }
        
        return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
    }

    public function uploadFile (\Model $model, $file)   {}
}