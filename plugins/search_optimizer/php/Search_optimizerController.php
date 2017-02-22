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

class Search_optimizerController extends ControllerHelper
{
    public function getOptimized ($type, $search)
    {
        $mSResults      = new Model ('Search_results');
        $mSResModels    = new Model ('Search_result_models');
        
        $hashes         = $this->hashTerms ($search);
        $resultset      = array ();

        foreach ($hashes as $hash)
        {
            $mSResults->resetResult ();

            $row    = $mSResults
                            ->findBy ('search_type', strtolower ($type))
                            ->findBy ('hashed_term', $hash)
                            ->result ();
            
            if ($row)
            {
                $mSResModels->resetResult ();
                
                $result = $mSResModels->findBy ('search_result_id', $row->get ('id'))->result ();
                
                if ($result)
                {
                    if (!is_array ($result))    { $result = array ($result);    }
                    
                    foreach ($result as $resRow)
                    {
                        $model      = $resRow->get ('model');
                        $modelID    = $resRow->get ('model_id');

                        if (!isset ($resultset[$modelID]))
                        {
                            $resultset[$modelID]    = $resRow->get ('clicked');
                        }
                    }
                }
            }
        }
        
        return $resultset;
    }
    
    public function optimize ($params)
    {
        $type           = $params['search_optimizer']['optimize']['type'];
        $model          = $params['search_optimizer']['optimize']['model'];
        $modelID        = $params['search_optimizer']['optimize']['id'];
        $searchTerm     = $params['search_optimizer']['optimize']['term'];
        
        $hashedTerms    = $this->hashTerms ($searchTerm);

        $postIDs        = $this->addSearchResult ($type, $hashedTerms);
        
        $this->addSearchResultset ($postIDs, $model, $modelID);
    }
    
    private function hashTerms ($searchTerm)
    {
        $terms      = explode ('-', $searchTerm);
        $hashes     = array ();
        $tmpHash    = '';
        
        usort ($terms, function ($a, $b) { return strcmp ($a, $b); });
        
        foreach ($terms as $term)
        {
            $tmpHash   .= $term;
            $hashes[]   = md5 ($tmpHash);
        }
        
        return $hashes;
    }
    
    private function addSearchResult ($type, $hashes)
    {
        $model  = new Model ('Search_results');
        $ids    = array ();
        
        foreach ($hashes as $hash)
        {
            $data   = array
            (
                'search_type'   => $type,
                'hashed_term'   => $hash
            );

            $id = $model->add ($data)->result ()->post ();

            if (!$id)
            {
                $model->resetResult ();

                $result = $model
                            ->findBy ('search_type', $type)
                            ->findBy ('hashed_term', $hash)
                            ->result ();

                if ($result) { $id = $result->get ('id');   }
            }
            
            $ids[]  = $id;
        }
        
        return $ids;
    }
    
    private function addSearchResultset ($postIDs, $model, $modelID)
    {
        foreach ($postIDs as $postID)
        {
            $sModel = new Model ('Search_result_models');

            $result = $sModel
                        ->findBy ('search_result_id', $postID)
                        ->findBy ('model', $model)
                        ->findBy ('model_id', $modelID)
                        ->result ();

            $updateable = $this->setupSession ($postID, $model, $modelID);

            if ($result && $updateable)
            {
                $this->updateSession ($postID, $model, $modelID);
                $result->set ('clicked', $result->get ('clicked') + 1);
                $result->update ();
            }
            else if (!$result)
            {
                $row    = array
                (
                    'search_result_id'  => $postID,
                    'model'             => $model,
                    'model_id'          => $modelID,
                    'clicked'           => 1
                );

                $sModel->resetResult ();
                $sModel->add ($row)->result ()->post ();
            }
        }
    }
    
    private function setupSession ($postID, $model, $modelID)
    {
        if (!isset ($_SESSION['search_results']))                               { $_SESSION['search_results'] = array ();                               }
        if (!isset ($_SESSION['search_results'][$postID]))                      { $_SESSION['search_results'][$postID] = array ();                      }
        if (!isset ($_SESSION['search_results'][$postID][$model]))              { $_SESSION['search_results'][$postID][$model] = array ();              }

        if (!isset ($_SESSION['search_results'][$postID][$model][$modelID])) 
        { 
            $_SESSION['search_results'][$postID][$model][$modelID]  = time ()-(61*60);
        }
        
        return (time ()-$_SESSION['search_results'][$postID][$model][$modelID])/60 > 60;
    }
    
    private function updatesession ($postID, $model, $modelID)
    {
        $_SESSION['search_results'][$postID][$model][$modelID]  = time ();        
    }
}