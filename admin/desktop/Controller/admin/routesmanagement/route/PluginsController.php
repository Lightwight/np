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

class PluginsController extends ControllerHelper implements ControllerInterface
{
    public function getModel (\Model $model, $params) 
    {
        if ($this->isGroup (1))
        {
            $params         = explode ('/', $params);
            
            $mContent       = new Model ('Page_content');
            $mRoutePlugins  = new Model ('Route_plugins');
            $slugify        = new Cocur\Slugify\Slugify ();
            
            $page           = (int)$params[0] > 0 ? (int)$params[0] : 1;
            $plugins        = $model->result ();
            
            if ($plugins && !is_array ($plugins))   { $plugins  = array ($plugins); }

            if (is_array ($plugins))
            {
                foreach ($plugins as $plugin) 
                {
                    $mRoutePlugins->resetResult ();
                    $mContent->resetResult ();
                    

                    $pluginName     = $slugify->slugify (strtolower ($plugin->get ('plugin_name')), '_');
                    
                    $result         = $mRoutePlugins
                                        ->findBy ('route_id', $page)
                                        ->findBy ('plugin_id', $plugin->get ('id'))
                                        ->result ();

                    $resContent     = $mContent
                                        ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'route_id')
                                        ->findBy ('route_id', $page)
                                        ->findBy ('type', 'plugin-'.$pluginName)
                                        ->result ();
                    
                    $plugin->set ('plugin_enabled', $result ? $result->get ('enabled') : 0);
                    $plugin->set ('route_id', $page);
                    $plugin->set ('plugin_content', $resContent ? json_decode ($resContent->get ('content')) : json_decode (''));
                    $plugin->set ('plugin_admin_html', $this->fetchPluginAdminContent ($plugin->get ('plugin_name')));   
                }
            }

            return $plugins;
        }
    }
    
    public function postModel (\Model $model) {
        
    }

    public function updateModel (\Model $model) 
    {
        if ($this->isGroup (1))
        {
            $plugin         = $model->result ();

            $pluginID       = $plugin->get ('id');
            $routeID        = $plugin->get ('route_id');
            $enabled        = $plugin->get ('plugin_enabled');

            $mRoutePlugins  = new Model ('Route_plugins');
            $done           = false;

            $result         = $mRoutePlugins
                                ->findBy ('route_id', $routeID)
                                ->findBy ('plugin_id', $pluginID)
                                ->result ();
            if ($result)
            {
                $result->set ('enabled', $enabled);

                $done   = $result->update ();
            }
            else
            {
                $mRoutePlugins->resetResult ();

                $done   = $mRoutePlugins
                    ->add (array 
                        (
                            'route_id'  => $routeID,
                            'plugin_id' => $pluginID,
                            'enabled'   => $enabled
                        ))
                    ->result ()->post () ? true : false;
            }

            return $done;
        }
        
        return false;
    }
    
    public function deleteModel(\Model $model) 
    {
        
    }
    
    private function fetchPluginAdminContent ($plugin)
    {
        $slugify    = new Cocur\Slugify\Slugify ();
        
        $config     = Config::getInstance ();
        $plugin     = $slugify->slugify ($plugin, '_');
        $fso        = new Fso ();
        $file       = $config->getPath ().'plugins/'.strtolower ($plugin).'/templates/admin.html';

        return $fso->read ($file);
    }

    public function uploadFile (\Model $model, $file)   {}
}
