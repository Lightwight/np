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

class NewsController extends ProductsHelper
{
    public function getModel (Model $model, $params)
    {
        $news   = $model->result ();
        
        if ($news)
        {
            if (!is_array ($news))  { $news = array ($news);    }
            
            foreach ($news as $item) 
            {
                $item->set ('release_date', date ('d.m.Y H:i', strtotime ($item->get ('release_date'))));
            }
        }
        
        return $news;
    }

    public function postModel (Model $model)    
    {
        $result = $model->result ();
        $posted = $result->post ();
        
        return $posted ? $posted : $this->error ($this->SQL_ERR_ON_POST);
    }

    public function updateModel (Model $model)  {}
    public function deleteModel (Model $model)  {}
}