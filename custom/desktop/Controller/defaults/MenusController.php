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
class MenusController extends ControllerHelper implements ControllerInterface
{
    public function getModel(\Model $model, $params) 
    {
        $slugify    = new Cocur\Slugify\Slugify ();
        $menus      = array ();
        
        $result =  $model
                ->innerJoin ('routes', 'ID', 'menus', 'route_id', 'routes', 'route')
                ->innerJoin ('route_scopes', 'ID', 'routes', 'scope_id', 'route_scopes', 'name', 'scope')
                ->orderBy ('parent', 'asc')
                ->orderBy ('order', 'asc')
                ->result ();
        
        
        foreach ($result as $menu) 
        {
            if ( (int)$menu->get ('parent') > 0)
            {
                $route  = $menu->get ('route');
                $route  = str_replace ('*', $slugify->slugify ($menu->get ('menu')), $route);
                
                $menu->set ('route', $route);
            }
        }

        return $result;
    }
    
    public function postModel (\Model $model)           {}
    public function updateModel (\Model $model)         {}
    public function deleteModel (\Model $model)         {}
    public function uploadFile (\Model $model, $files)  {}
}
