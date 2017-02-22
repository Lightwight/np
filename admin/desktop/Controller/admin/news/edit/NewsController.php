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
        $id     = !empty ($params) && (int)$params > 0 ? (int)$params : false;
        $result = $id ? $model->findBy ('id', $id)->result () : 0;
        
        if ($result !== 0)
        {
            $result->set ('release_date', date ('d.m.Y H:i', strtotime ($result->get ('release_date'))));
            
            if (trim ($result->get ('article_id')) !== '') 
            {
                $mProducts      = new Model ('Products');
                $resProducts    = $mProducts->findBy ('article_id', $result->get ('article_id'))->result ();
                
                if ($resProducts)
                {
                    $result->set ('bookmark', $resProducts->get ('bookmark'));
                }
            }
        }
        
        return $id ? $model->findBy ('id', $id)->result () : 0;
    }

    public function postModel (Model $model)    
    {
        $result = $model->result ();
        $result->set ('release_date', date ('Y-m-d H:i:s', strtotime ($result->get ('release_date'))));

        $posted = $result->post ();
        
        return $posted ? $posted : $this->error ($this->SQL_ERR_ON_POST);
    }

    public function updateModel (Model $model)  
    {
        $result         = $model->result ();

        $result->set ('title', $result->get ('title'));
        $result->set ('descr', $result->get ('descr'));
        $result->set ('content', $result->get ('content'));
        $result->set ('src', $result->get ('src'));        
        $result->set ('article_id', $result->get ('article_id'));        
        $result->set ('published', $result->get ('published'));
        $result->set ('release_date', date ('Y-m-d H:i:s', strtotime ($result->get ('release_date'))));

        $updated        = $result->update ();
        
        return $updated ? $updated: $this->error ($this->SQL_ERR_ON_UPDATE);
    }
    
    public function deleteModel (Model $model)  {}
}