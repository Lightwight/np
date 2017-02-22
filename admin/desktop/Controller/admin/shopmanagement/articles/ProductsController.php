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

class ProductsController extends ControllerHelper implements ControllerInterface 
{
    public function getModel (\Model $model, $params) 
    {
        $params     = explode ('/', $params);
        
        $filterMap  = array ('deleted', 'not-deleted', 'all');
        
        $page       = (int)$params[0] > 0 ? (int)$params[0] : 1;
        $sort       = isset ($params[1]) ? $this->escape_string ($params[1]) : 'name';
        $sortOrder  = isset ($params[2]) ? $this->escape_string ($params[2]) : 'asc';
        $search     = isset ($params[3]) ? $this->escape_string (implode ('/', array_slice ($params, 3))) : false;
        
        if ($sort === 'id') { $sort = 'ID'; }       

        if (!$search)
        {
            $uRows  = $model
                        ->leftJoin ('article_categories', 'KeyKategorie', 'products', 'category_id', 'article_categories', 'KeyBeschreibung', 'category')
                        ->paginate (10, $page)
                        ->orderBy ($sort, $sortOrder)
                        ->excludeDeleted ()
                        ->result ();
        }
        else
        {
            $aSearch    = explode ('/', $search);
            $in         = false;
            
            $model
                ->leftJoin ('article_categories', 'KeyKategorie', 'products', 'category_id', 'article_categories', 'KeyBeschreibung', 'category')
                ->paginate (10, $page);
                    
            foreach ($aSearch as $keyword)
            {
                if (!in_array ($keyword, $filterMap))
                {
                    if (!$in)
                    {
                        $model
                            ->findLike ('ID', $keyword)
                            ->orFindLike ('category', $keyword)
                            ->orFindLike ('name', $keyword);
                    
                        $in = true;
                    }
                    else
                    {
                        $model
                            ->orFindLike ('ID', $keyword)
                            ->orFindLike ('category', $keyword)
                            ->orFindLike ('name', $keyword);
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
        if ($this->isGroup (1))
        {
            $breadcrumb = new BreadcrumbController ();
            $slugify    = new \Cocur\Slugify\Slugify ();
            $row        = $model->result ();

            $articleID  = (int)$model->getNext ('article_id');
            $name       = $row->get ('name');
            $slugged    = $slugify->slugify ($name, '-');
            $bookmark   = '/product/'.$slugged;

            if ($articleID < 1000) { $articleID = 1000;   }        

            $breadcrumb->addBreadcrumb ($slugged, $name);

            $postID     = $model->add (array (
                            'name'              => $name,
                            'article_id'        => $articleID,
                            'bookmark'          => $bookmark,
                            'enabled'           => false
                        ))->result ()->post ();

            if ($postID)
            {
                return array 
                (
                    'id'                => $postID,
                    'article_id'        => $articleID
                );
            }

            return $this->error ($this->SQL_ERR_ON_POST);
        }
        
        return $this->error ($this->AUTH_ERR_UNAUTHORIZED, false);
    }

    public function updateModel(\Model $model)
    {
        $product    = $model->result ();
                
        if ($this->isGroup (1))
        {
            return $product->set ('deleted', $product->get ('deleted'))->update ();
        }
        
        return $this->error ($this->AUTH_ERR_UNAUTHORIZED, false);
            
        
    }
    
    public function deleteModel (\Model $model)         {}
    public function uploadFile (\Model $model, $file)   {}
}
