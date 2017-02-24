<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Admin_panelController
 *
 * @author Christian Peters <cp.mail@gmx.net at www.np-dev.de>
 */
class Page_contentController extends ControllerHelper implements ControllerInterface
{
    public function getModel(\Model $model, $params) 
    {
        $result = $model
                ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'page_content_id')
                ->innerJoin ('routes', 'ID', 'route_page_content', 'route_id', 'routes', 'route')
                ->innerJoin ('routes', 'ID', 'route_page_content', 'route_id', 'routes', 'enabled')
                ->findBy ('route', $this->getRoute ())
                ->orderBy ('version', 'desc')
                ->limit (0, 1)
                ->result ();

        return $result;
    }
    
    public function postModel(\Model $model)            {}
    public function updateModel(\Model $model)          {}
    public function deleteModel(\Model $model)          {}
    public function uploadFile(\Model $model, $files)   {}
}
