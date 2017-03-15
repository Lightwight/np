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

class SeoController extends ControllerHelper
{
    public function initPlugin ()       
    { 
        $mModels    = $this->fetchModels ();
        $mRoutes    = $this->fetchRoutes ();

        $mSeo       = new Model ('Seo', true);
        
        $mSeo->add (array ('models' => $mModels, 'bookmarks' => $mRoutes));

        return $mSeo->result ();
    }
    
    public function getSeo ()           { return 0; }
    
    public function exportRobots ()
    {
        $mRoutes    = new Model ('Routes');
        $resRoutes  = $mRoutes->findBy ('crawlable', 0)->result ();
        $robots     = 'User-agent: *'."\n\n";

        if ($resRoutes)
        {
            $domain     = $this->setting ('server', 'domain');

            if (!is_array ($resRoutes)) { $resRoutes = array ($resRoutes);  }

            foreach ($resRoutes as $route)
            {
                $curRoute   = $route->get ('route');
                
                if (strpos ($curRoute, '*') === false)
                {
                    $rbRoute    = '/'.$curRoute;
                    $rbRoute    = str_replace ('//', '/', $rbRoute);
                    
                    $robots    .= 'Disallow: '.$rbRoute."\n";
                }
            }

            $this->deleteRobots ();
            $this->saveRobots ($robots);
            
            return 1;
        }
        
        return $this->getEerror (ErrorCodeHelper::$_REQ_INVALID_ARGS);
    }
    
    public function exportSitemap ()
    {
        $mRoutes    = new Model ('Routes');
        $resRoutes  = $mRoutes->findBy ('crawlable', 1)->result ();
        
        if ($resRoutes)
        {
            $domain     = $this->setting ('server', 'domain');

            if (!is_array ($resRoutes)) { $resRoutes = array ($resRoutes);  }

            $sitemap    = '<?xml version="1.0" encoding="UTF-8"?>';
            $sitemap   .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
            
            foreach ($resRoutes as $route)
            {
                $curRoute   = $route->get ('route');
                $changefreq = $this->unmapFrequency ((int)$route->get ('seo_frequency'));
                $priority   = $this->unmapPriority ((int)$route->get ('seo_priority'));
                
                if (strpos ($curRoute, '*') === false)
                {
                    $rbRoute    = '/'.$curRoute.'/';
                    $rbRoute    = str_replace ('//', '/', $rbRoute);
                    
                    $sitemap   .= '<url>';
                    $sitemap   .=   '<loc>'.$domain.$rbRoute.'</loc>';
                    $sitemap   .=   '<changefreq>'.$changefreq.'</changefreq>';
                    $sitemap   .=   '<priority>'.$priority.'</priority>';
                    $sitemap   .= '</url>';
                }
                else
                {
                    $dynRoutes  = $this->fetchDynamicRoutes ($route->get ('id'));
                    
                    foreach ($dynRoutes as $dynRoute)
                    {
                        $sitemap   .= '<url>';
                        $sitemap   .=   '<loc>'.$domain.$dynRoute.'</loc>';
                        $sitemap   .=   '<changefreq>'.$changefreq.'</changefreq>';
                        $sitemap   .=   '<priority>'.$priority.'</priority>';
                        $sitemap   .= '</url>';
                        
                    }
                }
            }
            
            $sitemap   .= '</urlset>';

            $this->deleteSitemap ();
            $this->saveSitemap ($sitemap);
            
            return 1;
        }
        
        return $this->getError (ErrorCodeHelper::$_REQ_INVALID_ARGS);
    }
    
    
    public function saveRoute ($route)
    {
        $dbModel        = new Model ('Routes');
        $result         = $dbModel->findBy ('ID', $route['id'])->result ();
        $updated        = false;
        
        if ($result)
        {
            if ($result->get ('customizable'))
            {
                $result->set ('route', $route['route']);
                $result->set ('layout', $route['layout']);
                $result->set ('seo_keywords', $route['seo_keywords']);
                $result->set ('seo_description', $route['seo_description']);
                $result->set ('seo_frequency', $route['seo_frequency']);
                $result->set ('seo_priority', $route['seo_priority']);
                $result->set ('title', $route['title']);
                $result->set ('force', $route['force']);
                $result->set ('enabled', $route['enabled']);
                $result->set ('deleted', $route['deleted']);
                $result->set ('crawlable', $route['crawlable']);
                

                $updated        = $result->update ();
            }
            
            if ($route['seo_model'])
            {
                $this->deleteSeoModel ($route['id']);
                
                $inserted = $this->insertSeoModel ($route['id'], $route['seo_model'], $route['seo_column']);
            }
            else
            {
                $inserted = true;
            }
        }

        return $updated && $inserted ? $updated : $this->getError (ErrorCodeHelper::$_SQL_ERROR_ON_UPDATE);
    }
    
    private function deleteRobots () 
    {
        $path   = getcwd ();
        $path   = str_replace ('\\', '/', $path).'/';
        if (strrpos ($path, '/') < strlen ($path)-1) { $path .= '/';    }        
        
        $file   = $path.'robots.txt';
        
        unlink ($file);
    }
    
    private function saveRobots ($fstream)
    {
        $fso    = new Fso ();
        $path   = getcwd ();
        $path   = str_replace ('\\', '/', $path).'/';
        if (strrpos ($path, '/') < strlen ($path)-1) { $path .= '/';    }        
        
        $file   = $path.'robots.txt';
        
        $fso->write ($file, $fstream);
        
        chmod ($file, 0755);
    }
    
    private function deleteSitemap ()
    {
        $path   = getcwd ();
        $path   = str_replace ('\\', '/', $path).'/';
        if (strrpos ($path, '/') < strlen ($path)-1) { $path .= '/';    }        
        
        $file   = $path.'sitemap.xml';
        
        unlink ($file);        
    }
    
    private function saveSitemap ($fstream) {
        $fso    = new Fso ();
        $path   = getcwd ();
        $path   = str_replace ('\\', '/', $path).'/';
        if (strrpos ($path, '/') < strlen ($path)-1) { $path .= '/';    }        
        
        $file   = $path.'sitemap.xml';
        
        $fso->write ($file, $fstream);
        
        chmod ($file, 0755);
    }
    
    private function fetchModels ()
    {
        $query      = 'SELECT ';
        $query     .=   '`m`.`name` AS "model", ';
        $query     .=   '`col` ';
        $query     .= 'FROM ';
        $query     .=  '`model_definitions` ';
        $query     .= 'INNER JOIN ';
        $query     .=  '`models` m ';
        $query     .= 'ON ';
        $query     .=   '`model_definitions`.`model_id`=`m`.`ID`;';
        
        $result     = $this->query ($query);
        $return     = array ();

        if ($result)
        {
            foreach ($result as $row)
            {
                if (!isset ($return[$row['model']]))    { $return[$row['model']] = array ();    }
                
                $return[$row['model']][]    = $row['col'];
            }
        }
        
        return $return;
    }
    
    private function fetchRoutes ()
    {
        $query  = 'SELECT `route_id`, `model`, `bookmark_column` FROM `seo_models`;';

        return $this->query ($query);
    }
    
    private function deleteSeoModel ($routeID)
    {
        $query  = 'DELETE FROM `seo_models` WHERE `route_id`="'.$routeID.'";';
        
        $this->query ($query);
    }
    
    private function insertSeoModel ($routeID, $seoModel, $seoColumn)
    {
        $query  = 'INSERT IGNORE INTO `seo_models` (`route_id`, `model`, `bookmark_column`) ';
        $query .= 'VALUES ("'.$routeID.'", "'.$seoModel.'", "'.$seoColumn.'");';

        return $this->query ($query);
    }
    
    private function fetchDynamicRoutes ($routeID)
    {
        $routes = array ();
        
        $query  = 'SELECT ';
        $query .=   '`model`, ';
        $query .=   '`bookmark_column` ';
        $query .= 'FROM ';
        $query .=   '`seo_models` ';
        $query .= 'WHERE ';
        $query .=   '`route_id`="'.$routeID.'";';

        $result = $this->query ($query);
        
        if ($result)
        {
            $model  = $result[0]['model'];
            $column = $result[0]['bookmark_column'];
            
            $query  = 'SELECT `'.strtolower ($column).'` FROM `'.strtolower ($model).'`;';

            $rows   = $this->query ($query);

            foreach ($rows as $route)
            {
                $routes[]   = $route['bookmark'];
            }
        }

        return $routes;
    }
    
    private function unmapFrequency ($num)
    {
        $map    = array 
        (
            0   => 'always',
            1   => 'hourly',
            2   => 'daily',
            3   => 'weekly',
            4   => 'monthly',
            5   => 'yearly',
            6   => 'never'
        );
        
        return isset ($map[$num]) ? $map[$num] : $map[5];
    }
    
    private function unmapPriority ($num)
    {
        $map    = array 
        (
            0   => 0.0,
            1   => 0.1,
            2   => 0.2,
            3   => 0.3,
            4   => 0.4,
            5   => 0.5,
            6   => 0.6,
            7   => 0.7,
            8   => 0.8,
            9   => 0.9,
            10  => 1
        );
        
        return isset ($map[$num]) ? $map[$num] : $map[5];
    }
}