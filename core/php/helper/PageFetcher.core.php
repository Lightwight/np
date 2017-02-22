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

class PageFetcher extends HandlerHelper
{
    private $fetched            = false;
    
    private $isDefault          = false;
    
    private $route              = false;
    private $item               = false;
    
    private $routeID            = false;
    private $forceRoute         = 0;
    private $routeFolder        = false;
    
    private $layoutSettings     = false;
    
    private $header             = false;
    private $main               = false;
    private $footer             = false;
    
    private $hooks              = false;
    
    private $definitions        = false;
    
    private $method             = false;
    
    private $needPlugins        = false;
    private $plugins            = false;
    
    private $needModels         = false;
    private $models             = false;
    
    private $united             = array();
    
    public function fetch ($route = false, $item = false)
    {
        if (!$this->fetched)
        {
            $this->fetched  = true;

            $this->setupConfig ($route, $item);
            $this->setupUnited ();

            $this->setupRoute ();
            $this->setupRouteFolder ();

            if ($this->routeID)
            {
                $this->setupLayoutSettings ();
                $this->buildHTML ();
                $this->buildHooks ();
                $this->buildHandlebars ();
                $this->setupPlugins ();
                $this->fetchPlugins ();
                $this->setupModels ();
                
                $this->fetchModels ();


                $this->setupDefinitions ();
            }

            return $this->unite ();
        }
        
        return $this->united;
    }
    
    public function getRoute ()
    {
        if (!$this->fetched)    { $this->setupConfig ();    }
        
        return $this->route;
    }
    
    private function setupUnited ()
    {
        $this->united['header'] = array ('html' => '');

        if (!$this->isDefault)  { $this->united['main'] = array ('html' => ''); }
        
        $this->united['footer'] = array ('html' => '');
    }
    
    private function unite ()
    {
        $this->uniteHeader ();
        $this->uniteMain ();
        $this->uniteFooter ();
        $this->unitePlugins ();
        $this->uniteDefinitions ();
        $this->uniteModels ();
        $this->uniteHooks ();
        $this->uniteForceRoute ();

        return $this->united;
    }
    
    private function uniteHeader ()
    {
        $this->united['header']['html']     = isset ($this->header['html']) ? $this->header['html'] : '';
    }
    
    private function uniteMain ()
    {
        if (!$this->isDefault)
        {
            $this->united['main']['html']   = isset ($this->main['html']) ? $this->main['html'] : '';
        }
    }
    
    private function uniteFooter ()
    {
        $this->united['footer']['html']     = isset ($this->footer['html']) ? $this->footer['html'] : '';
    }
    
    private function unitePlugins ()
    {
        $plugins    = $this->plugins;
        
        if ($plugins)
        {
            if (!array_key_exists ('plugins', $this->united))
            {
                $this->united['plugins']    = array ();
            }
            
            foreach ($plugins as $plugin => $pluginData)
            {
                $this->united['plugins'][$plugin]   = $pluginData;
            }
        }
    }
    
    private function uniteDefinitions ()
    {
        if ($this->definitions)
        {
            $this->united['definitions']    = $this->definitions;
        }
    }
    
    private function uniteModels ()
    {
        if ($this->models)
        {
            $this->united['models'] = $this->models;
        }
    }
    
    private function uniteHooks ()
    {
        if ($this->hooks)
        {
            $this->united['hooks']  = $this->hooks;
        }
    }
    
    private function uniteForceRoute ()
    {
        $this->united['forceRoute'] = $this->forceRoute;
    }

    private function setupConfig ($route, $item)
    {
        $oConfig            = Config::getInstance ();
        $config             = $oConfig->getSettings ();
        $scope              = $oConfig->getScope ();

        if ($route && is_string ($route) && strlen ($route) > 0)
        {
            $this->route        = strtolower ($route);
        }
        else 
        {
            $this->isDefault    = true;
            $this->route        = isset ($config['routes']) && isset ($config['routes'][$scope]) ? $config['routes'][$scope] : false;
        }
    
        $this->item     = is_string ($item) && strlen ($item) > 0 ? $item : false;
    }
    
    private function setupRoute ()
    {
        $result     = null;

        if ($this->route)
        {
            $oSql           = Sql::getInstance ();

            $query          = 'SELECT `ID`, `force` FROM `routes` WHERE `route` = "'.$this->route.'";';
            $result         = $oSql->query ($query);
        }

        $this->routeID      = (is_array ($result) && count ($result) > 0 && isset ($result[0]['ID'])) ? $result[0]['ID'] : false;
        $this->forceRoute   = (is_array ($result) && count ($result) > 0 && isset ($result[0]['force'])) ? (int)$result[0]['force'] : 0;
    }
    
    private function setupRouteFolder () 
    {
        if ($this->route)
        {
            $this->routeFolder  = str_replace ('*', '', $this->route);
        }
    }

    private function setupLayoutSettings ()
    {
        $layoutHandler  = LayoutHandler::getInstance ();
        $result         = $layoutHandler->getLayout ($this->routeID);

        $this->layoutSettings   = is_array ($result) && count ($result) > 0 && isset ($result['ID']) && (int)$result['ID'] > 0 ? $result : false;
    }
    
    private function buildHTML ()
    {
        if ($this->layoutSettings)
        {
            $treeBuilder    = HTMLTreeBuilder::getInstance ();
            
            $layoutName     = $this->layoutSettings['layout'];
            
            $this->header   = $treeBuilder->generate ($layoutName, 'header', $this->routeFolder);

            if (!$this->isDefault)
            {
                $this->main = $treeBuilder->generate ($layoutName, 'main', $this->routeFolder);
            }
            
            $this->footer   = $treeBuilder->generate ($layoutName, 'footer', $this->routeFolder);
        }
    }
    
    private function buildHooks ()
    {
        $treeBuilder    = HTMLTreeBuilder::getInstance ();
        $layoutName     = $this->layoutSettings['layout'];
        $this->hooks    = $treeBuilder->parseHooks ($layoutName);
    }
            
    private function buildHandlebars ()
    {
        if ($this->header)  { $this->header = HandlebarsParser::parseTemplate ($this->header);  }
        if ($this->main)    { $this->main = HandlebarsParser::parseTemplate ($this->main);      }
        if ($this->footer)  { $this->footer = HandlebarsParser::parseTemplate ($this->footer);  }
    }
    
    private function getController ($model)
    {
        $oConfig            = Config::getInstance ();
        $scope              = $oConfig->getScope ();
        
        $hModel             = strtoupper (substr ($model, 0, 1)).substr ($model, 1);
        $class              = $hModel.'Controller';

        $classExists        = npAutoload ($class, $this->route, $scope);

        return $classExists ? new $class : false;
    }

    private function setupPlugins ()
    {
        $pluginContainer = array ();
        
        if ($this->header && count ($this->header['plugins']) > 0)
        {
            $pluginContainer[]  = $this->header['plugins'];
        }
        
        if ($this->main && count ($this->main['plugins']) > 0)
        {
            $pluginContainer[]  = $this->main['plugins'];
        }
        
        if( $this->footer && count( $this->footer['plugins'] ) > 0 )
        {
            $pluginContainer[]  = $this->footer['plugins'];
        }
        
        foreach ($pluginContainer as $plugins) 
        {
            foreach ($plugins as $plugin)
            {
                $this->needPlugins[] = $plugin;
            }
        }
    }  
    
    private function fetchPlugins ()
    {
        $this->plugins  = $this->queryPlugins ($this->needPlugins);
    }
    
    private function setupModels ()
    {
        $modelContainer = array ();

        if ($this->header && count ($this->header['models']) > 0)
        {
            $modelContainer[]   = $this->header['models'];
        }
        
        if ($this->main && count ($this->main['models']) > 0)
        {
            $modelContainer[]   = $this->main['models'];
        }
        
        if ($this->footer && count ($this->footer['models']) > 0)
        {
            $modelContainer[]   = $this->footer['models'];
        }

        foreach ($modelContainer as $models) 
        {
            foreach ($models as $model)
            {
                if (!$this->needModels || !in_array ($model, $this->needModels))
                {
                    $this->needModels[] = $model;
                }
            }
        }
    }
    
    private function fetchModels ()
    {
        $this->models   = $this->queryModels ($this->needModels, $this->method);
    }
    
    private function setupDefinitions ()
    {
        $definitions    = array ();
        
        if ($this->needModels)
        {
            foreach ($this->needModels as $model)
            {
                $result = $this->queryDefinition ($model);
                
                if (isset ($result[$model]))
                {
                    $definitions[$model] = $result[$model];
                }
            }
        }
        
        $this->definitions  = is_array ($definitions) && count ($definitions) > 0 ? $definitions : false;
    }
    
    private function queryDefinition ($model)
    {
        $defHandler     = DefinitionHandler::getInstance ();
        $definition     = array ();
        
        $hModel     = strtoupper (substr ($model, 0, 1)).substr ($model, 1);
        $result     = $defHandler->resolveDefinition ($model, 1);

        if (is_array ($result) && count ($result) > 0)    { $definition[$model] = $result[$hModel];   }
        
        return $definition;
    }
    
    private function queryPlugins ($plugins)
    {
        $fetched        = array();

        if ($plugins)
        {
            foreach ($plugins as $plugin)
            {
                $hPlugin            = strtoupper (substr ($plugin, 0, 1)).substr ($plugin, 1);
                
                $pluginHandler      = new PluginHandler ();
                $fetched[$hPlugin]  = $pluginHandler->handlePlugin ($plugin, ($this->item ? $this->item : null));
            }        
        }

        return count ($fetched) > 0 ? $fetched : false;
    }
    
    private function queryModels ($models, $method)
    {
        $fetched        = array();

        if ($models)
        {
            foreach ($models as $model)
            {
                $controller = $this->getController ($model);

                if ($controller)
                {
                    $result             = $controller->getModel (new Model ($model), ($this->item ? $this->item : null));

                    $fetched[$model]    = is_array ($result) ? $result : array ($result);
                }
            }        
        }

        return $fetched;
    }
}