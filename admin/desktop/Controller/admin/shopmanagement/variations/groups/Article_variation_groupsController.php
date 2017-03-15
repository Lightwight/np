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
        $params     = explode ('/', $params);
        $filterMap  = array ('deleted', 'not-deleted', 'all');
        
        $page       = (int)$params[0] > 0 ? (int)$params[0] : 1;
        $sort       = isset ($params[1]) ? $this->escape_string ($params[1]) : 'group_name';
        $sortOrder  = isset ($params[2]) ? $this->escape_string ($params[2]) : 'asc';
        $search     = isset ($params[3]) ? $this->escape_string (implode ('/', array_slice ($params, 3))) : false;

        if ($sort === 'id') { $sort = 'ID'; }       

        if (!$search)
        {
            $uRows  = $model
                        ->paginate (10, $page)
                        ->orderBy ($sort, $sortOrder)
                        ->excludeDeleted ()
                        ->result ();
        }
        else
        {
            $aSearch    = explode ('/', $search);
            $in         = false;
            
            $model->paginate (10, $page);
                    
            foreach ($aSearch as $keyword)
            {
                if (!in_array ($keyword, $filterMap))
                {
                    if (!$in)
                    {
                        $model
                            ->findLike ('group_id', $keyword)
                            ->orFindLike ('group_name', $keyword);
                    
                        $in = true;
                    }
                    else
                    {
                        $model
                            ->orFindLike ('group_id', $keyword)
                            ->orFindLike ('group_name', $keyword);
                    }
                }
                
                if (in_array ($keyword, $filterMap))
                {
                    if ($keyword === 'deleted') 
                    {
                        $model->includeDeleted ();
                    }
                    else if ($keyword === 'not-deleted')
                    {
                        $model->excludeDeleted ();
                    }
                }
            }
            
            $uRows  = $model
                    ->orderBy ($sort, $sortOrder)
                    ->result ();
        }

        return $uRows;
    }

    public function postModel (\Model $model)           
    {
        return $this->getError (ErrorCodeHelper::$_SYS_ERR_NOT_IMPLEMENTED);
    }

    public function updateModel(\Model $model)
    {
        if ($this->isGroup (1))
        {
            return $model->result ()->set ('deleted', 0)->update ();
        }
        
        return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
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