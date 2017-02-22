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

class RoutesController extends ControllerHelper implements ControllerInterface
{
    public function getModel (\Model $model, $params) 
    {
        $params         = explode ('/', $params);
        $page           = (int)$params[0] > 0 ? (int)$params[0] : 1;
        $mRPContent     = new Model ('Route_page_content');
        $resRPContent   = $mRPContent->findBy ('route_id', $page)->result ();

        if (!$resRPContent)
        {
            $mContent   = new Model ('Page_content');
            $max        = $mContent->max ('content_id') + 1;
            
            $mRPContent->resetResult ();
            $mRPContent->add (array ('route_id' => $page, 'page_content_id' => $max))->result ()->post ();
            
            $mContent
                ->add (array ('content_id' => $max, 'content' => '', 'type' => 'content', 'version' => '1', 'user_id' => Auth::userID ()))
                ->result ()
                ->post ();
        }

        $result = $model
                ->innerJoin ('route_scopes', 'ID', 'routes', 'scope_id', 'route_scopes', 'name', 'scope')
                ->leftJoin ('route_page_content', 'route_id', 'routes', 'ID', 'route_page_content', 'enabled', 'content_enabled')
                ->leftJoin ('page_content', 'content_id', 'route_page_content', 'page_content_id', 'page_content', 'content')
                ->leftJoin ('page_content', 'content_id', 'route_page_content', 'page_content_id', 'page_content', 'version')
                ->leftJoin ('page_content', 'content_id', 'route_page_content', 'page_content_id', 'page_content', 'type')
                ->leftJoin ('page_content', 'content_id', 'route_page_content', 'page_content_id', 'page_content', 'date', 'content_date')
                ->leftJoin ('users', 'ID', 'page_content', 'user_id', 'name', 'user')
                ->findBy ('ID', $page)
                ->findBy ('type', 'content')
                ->findBy ('customizable', 1)
                ->orderBy ('version', 'desc')
                ->limit (0, 1)
                ->result ();

        return $result;
    }
    
    public function postModel(\Model $model)    {}

    public function updateModel (\Model $model)  
    {
        if ($this->isGroup (1))
        {
            $content_id     = 1;
            $version        = 1;

            $mContent       = new Model ('Page_content');
            $mRPContent     = new Model ('Route_page_content');

            $rowRoute       = $model->result ();

            $rowRPContent   = $mRPContent
                                ->findBy ('route_id', $rowRoute->get ('id'))
                                ->result ();

            if (!$rowRPContent)
            {
                $rowPageContent = $mContent
                                    ->orderBy ('content_id', 'desc')
                                    ->limit (0, 1)
                                    ->result ();

                if ($rowPageContent)
                {
                    $content_id = $rowPageContent->get ('content_id') + 1;

                    $mContent->resetResult ();
                }

                $mRPContent->resetResult ();

                $mRPContent->add (array
                (
                    'route_id'          => $rowRoute->get ('id'),
                    'page_content_id'   => $content_id,
                    'enabled'           => $rowRoute->get ('content_enabled')
                ))->result ()->post ();
            }
            else
            {
                $rowRPContent->set ('enabled', $rowRoute->get ('content_enabled'))->update ();
            }

            $rowContent     = $mContent
                                ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'page_content_id')
                                ->findBy ('route_id', $rowRoute->get ('id'))
                                ->orderBy ('version', 'desc')
                                ->limit (0, 1)
                                ->result ();

            $mContent->resetResult ();

            $rowRoute->set ('title', $rowRoute->get ('title'));
            $rowRoute->set ('enabled', $rowRoute->get ('enabled'));
            $rowRoute->set ('force', $rowRoute->get ('force'));
            $rowRoute->set ('route', $rowRoute->get ('route'));

            $rowRoute->set ('seo_description', $rowRoute->get ('seo_description'));
            $rowRoute->set ('seo_keywords', $rowRoute->get ('seo_keywords'));
            $rowRoute->set ('seo_frequency', $rowRoute->get ('seo_frequency'));
            $rowRoute->set ('seo_priority', $rowRoute->get ('seo_priority'));
            $rowRoute->set ('crawlable', $rowRoute->get ('crawlable'));

            $seoChanged =   $this->seoChanged ($rowRoute);

            if ($rowContent)
            {
                $content_id = $rowContent->get ('content_id');
                $version    = $rowContent->get ('version') + 1;
            }

            $posted = $mContent->add (array
            (
                'content_id'    => $content_id,
                'content'       => $rowRoute->get ('content'),
                'version'       => $version,
                'user_id'       => $this->userID (),
                'type'          => 'content'
            ))->result ()->post ();

            $updated    = $rowRoute->update ();

            if ($updated && $seoChanged)
            {
                $this->exportRobots ();
                $this->exportSitemap ();
            }

            return $posted && $updated ? 1 : $this->error ($this->SQL_ERR_ON_UPDATE);
        }
        else
        {
            return $this->error ($this->AUTH_ERR_UNAUTHORIZED);
        }
    }

    public function deleteModel(\Model $model)  {}
    
    private function seoChanged ($row)
    {
        $mRoute     = new Model ('Routes');
        $origin     = $mRoute->findBy ('ID', $row->get ('id'))->result ();

        return $origin && 
               ($origin->get ('seo_frequency') !== $row->get ('seo_frequency') 
                || $origin->get ('seo_priority') !== $row->get ('seo_priority')
                || $origin->get ('crawlable') !== $row->get ('crawlable')
                || $origin->get ('title') !== $row->get ('title')
                || $origin->get ('seo_description') !== $row->get ('seo_description')
                || $origin->get ('seo_keyword') !== $row->get ('seo_keywords')); 
    }
    
    private function exportRobots ()
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
        }
    }
    
    private function deleteRobots () 
    {
        $path   = getcwd ();
        $path   = str_replace ('\\', '/', $path).'/';
        if (strrpos ($path, '/') < strlen ($path)-1) { $path .= '/';    }        
        
        $file   = $path.'robots.txt';
        
        if (is_file ($file))    { unlink ($file);   }
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
    
    private function exportSitemap ()
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
        }
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
    
    private function deleteSitemap ()
    {
        $path   = getcwd ();
        $path   = str_replace ('\\', '/', $path).'/';
        if (strrpos ($path, '/') < strlen ($path)-1) { $path .= '/';    }        
        
        $file   = $path.'sitemap.xml';
        
        if (is_file ($file))    { unlink ($file);   }
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

    public function uploadFile (\Model $model, $file)   {}
}