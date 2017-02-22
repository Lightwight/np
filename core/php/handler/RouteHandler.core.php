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

class RouteHandler extends HandlerHelper
{
    private static $instance    = null;
    
    private $params             = null;
    
    private $needDefaults       = null;
    
    private $requestHandler     = null;
    private $assetsHandler      = null;
    
    private $defPageFetcher     = null;
    private $pageFetcher        = null;
    
    private $origin             = null;
    private $route              = null;
    private $routeID            = null;
    private $scope              = null;
    private $item               = false;
    
    public static function getInstance ($route = null)
    {
        if (self::$instance !== null)   
        { 
            if ($route) { self::$route = $route;    }  
        }
        else                            
        { 
            self::$instance = new self ($route);      
        }
        
        return self::$instance;
    }    
    
    private function __construct ($route) 
    {
        if (is_string ($route) && strlen ($route) > 0)   
        {
            $oConfig        = Config::getInstance ();
            
            $this->route    = $route;
            $this->routeID  = $this->fetchRouteID ($route);
            $this->scope    = $oConfig->getScope ();
        }
        
        $this->requestHandler   = RequestHandler::getInstance ();
        $this->assetsHandler    = AssetsHandler::getInstance ();
    }
    
    private function __clone () {}

    public function getRoute ()     { return $this->route;                  }

    public function resolveRoute ()
    {
        if (!$this->isACrawlerRequest () && !$this->isNPSeoBot ())
        {
            return $this->requestHandler->isJson () ? $this->fetchRoute () : $this->fetchStaticContent ();
        }
        else if (!$this->isNPSeoBot ())
        {
            $rParams    = $this->requestHandler->getParameters ();
            $origin     = $rParams['origin'];

            $config     = Config::getInstance ();
            $setting    = $config->getSettings ();

            $domain     = isset ($setting['server']['domain']) ? $setting['server']['domain'] : '';
            $path       = getcwd ();
            $path       = str_replace ('\\', '/', $path).'/';
            if (strrpos ($path, '/') < strlen ($path)-1) { $path .= '/';    }

            // Dump the requested page content
            $client             = \JonnyW\PhantomJs\Client::getInstance ();
            $location           = $path.'core/phantomjs/partials/';
            
            $client->getProcedureCompiler()->disableCache();
            $serviceContainer   = \JonnyW\PhantomJs\DependencyInjection\ServiceContainer::getInstance();
    
            $procedureLoader    = $serviceContainer->get('procedure_loader_factory')
            ->createProcedureLoader ($location);            

            $client->getProcedureLoader()->addLoader ($procedureLoader);

            $client->isLazy ();
            $client->getEngine ()->addOption('--ssl-protocol=TLSv1');
            $client->getEngine ()->addOption('--ignore-ssl-errors=true');
            
            $request    = $client->getMessageFactory()->createRequest();
            $response   = $client->getMessageFactory()->createResponse();   

            $request->setMethod ('GET');
            $request->setUrl ($domain.$origin);    
            
            $client->send ($request, $response);
            
            echo $response->getContent ();
            exit;
        }
        else if ($this->isNPSeoBot ())
        {
            $reqHandler = RequestHandler::getInstance ();
            $params     = $reqHandler->getParameters ();

            if (isset ($params['defaults']) && (int)$params['defaults'] === 1)
            {       
                return json_encode ($this->fetchRoute ());
            }
            else
            {
                return $this->fetchStaticContent (true, $params['origin']);
            }
        }
    }
    
    public function getRouteID ()
    {
        return $this->routeID;
    }

    private function fetchRouteID ($route)
    {
        $oSql   = Sql::getInstance ();
        
        if ($route)
        {
            $query  = 'SELECT `ID` FROM `routes` WHERE `route`="'.$oSql->real_escape_string ($route).'";';
            
            $result = $oSql->query ($query);
            
            return $result && isset ($result[0]['ID']) ? (int)$result[0]['ID'] : null;
        }
        
        return null;
    }
    
    private function fetchStaticContent ($isNPBot = false, $np_route = false)
    {
        if (isset ($_SESSION['client']['scope']))   { unset ($_SESSION['client']['scope']); }
        
        $staticContent  = StaticContent::getInstance ();
        $layoutHandler  = LayoutHandler::getInstance ();

        $route          = $np_route ? '/'.$np_route : '/'.$this->route;
        $route          = str_replace ('//', '/', $route);

        $header         = $this->assetsHandler->includeAssets ($staticContent->getHeader ());

        // Insert important information for the client:
        // 
        // 1) the token for submitting form data
        // 2) the google captcha key (anti bot protection)
        // 3) the client device type (mobile, tablet or desktop)
        //
        $jsLiteral      = '<script type="text/javascript">';
        $jsLiteral     .=   'np.INITIAL_DATA = {';
        $jsLiteral     .=       'csrf_token: \''.NPToken::generateToken ().'\',';
        $jsLiteral     .=       'client_device: \''.NPClient::getClientDeviceType ().'\',';
        $jsLiteral     .=       'captcha: \''.NPCaptcha::getCaptchaKey ().'\',';
        $jsLiteral     .=       'is_bot: '.($isNPBot ? 'true' : 'false');
        $jsLiteral     .=   '};';
        $jsLiteral     .= '</script>';
        
        if ($header)
        {
            $result     = null;
            $layoutData = array
            (
                'seo_keywords'      => '',
                'seo_description'   => '',
                'title'             => ''
            );
            
            if ($route)
            {
                $oSql           = Sql::getInstance ();

                $query          = 'SELECT `ID`, `force` FROM `routes` WHERE `route` = "'.$route.'";';
                $result         = $oSql->query ($query);

                if ($result && is_array ($result) && isset ($result[0]) && isset ($result[0]['ID']))
                {
                    $layoutData     = $layoutHandler->getLayout ($result[0]['ID']);
                }   
            }
            
            $bootLayout     = $layoutHandler->getBoostrap ();
            $header         = $this->insertSeoTags ($header, $layoutData); 
            $footer         = $staticContent->getFooter ();
            
            $this->sendHeader ();
            
            return $header.$jsLiteral.$bootLayout.$footer;
        }
        else
        {
            echo 'NP SECURITY ISSUE: Missing body-tag in static header. Please insert "&lt;body&gt" without quotes. This is necceary for the csrf prevention.';

            exit;
        }
    }
    
    private function sendHeader ()
    {
        $config         = Config::getInstance ();
        $settings       = $config->getSettings ();
        $cspHeaders     = array_key_exists ('CSP', $settings) ? $settings['CSP'] : array ();
        $sendCSP        = '';
        
        if (count ($cspHeaders) > 0)
        {
            foreach ($cspHeaders as $cspHeader => $values)
            {
                $sendCSP   .= $cspHeader.' '.implode (' ', $values).';';
            }
            
//            header ('Access-Control-Allow-Origin: *');
//            header ('Access-Control-Allow-Methods: GET, POST');
                
            header ("X-WebKit-CSP: ".$sendCSP);
            header ("X-Content-Security-Policy: ".$sendCSP);
            header ("Content-Security-Policy: ".$sendCSP);
        }
    }
    
    private function insertSeoTags ($header, $metaData)
    {
        if (strpos ($header, '{{#meta-description}}') !== false && isset ($metaData['seo_description']))
        {
            $header = str_replace ('{{#meta-description}}', '<meta name="description" content="'.$metaData['seo_description'].'">', $header);
        }
        
        if (strpos ($header, '{{#meta-keywords}}') !== false && isset ($metaData['seo_keywords']))
        {
            $keywords   = $metaData['seo_keywords'];
            $keywords   = explode (' ', $keywords);
            $seo_keys   = '';
            
            foreach ($keywords as $keyword)
            {
                if (trim ($keyword) !== '') { $seo_keys  .= trim ($keyword).', ';   }
            }
            
            if (strlen ($seo_keys) > 1) { $seo_keys = substr ($seo_keys, 0, strlen ($seo_keys)-2);  }
            
            if (!empty ($seo_keys))
            {
                $header     = str_replace ('{{#meta-keywords}}', '<meta name="keywords" content="'.$seo_keys.'">', $header);
            }
        }
        
        if (strpos ($header, '{{#title}}') !== false && isset ($metaData['title']))
        {
            $header = str_replace ('{{#title}}', '<title>'.$metaData['title'].'</title>', $header);
        }
        
        $header = str_replace ('{{#meta-description}}', '', $header);        
        $header = str_replace ('{{#meta-keywords}}', '', $header);
        $header = str_replace ('{{#title}}', '', $header);
                    
        return $header;
    }

    private function fetchRoute ()
    {
        if (!is_string ($this->route) || empty ($this->route))
        {
            $errHelper  = ErrorHelper::getInstance ();
            $errHelper->setResponseCode (404);
        }

        $this->params           = $this->requestHandler->getParameters ();

        $this->defPageFetcher   = new PageFetcher ();
        $this->pageFetcher      = new PageFetcher ();

        $this->origin           = isset ($this->params['origin']) ? $this->params['origin'] : $this->route;
        $this->needDefaults     = !$this->sentDefaults ();
        $this->item             = isset ($this->params['item']) ? $this->params['item'] : false;

        return self::parseRoute ();
    }
    
    private function parseRoute ()
    {
        $this->needDefaults = !$this->isNPSeoBot () ? $this->needDefaults : true;
        
        $defaults       = $this->needDefaults || $this->isNPSeoBot () ? $this->defPageFetcher->fetch (false, $this->item) : false;
        $page           = $this->pageFetcher->fetch ($this->route, $this->item);
        $routePlugin    = $this->params['plugin'] ? $this->prepareRoutePlugin ($this->params['plugin']) : false;

        $defPlugins     = isset ($defaults['plugins']) ? $defaults['plugins'] : array ();
        $pagePlugins    = isset ($page['plugins']) ? $page['plugins'] : array ();
        
        $plugins        = array_merge ($defPlugins, $pagePlugins);
        if ($routePlugin)   { $plugins = array_merge ($plugins, $routePlugin);  }

        $definitions    = $this->mergeDefinitions ($defaults, $page);
        $models         = $this->mergeModels ($defaults, $page);
        $forceRoute     = isset ($page['forceRoute']) ? (int)$page['forceRoute'] : 0;

        if (isset ($page['plugins']))           { unset ($page['plugins']);         }
        if (isset ($page['definitions']))       { unset ($page['definitions']);     }
        if (isset ($page['models']))            { unset ($page['models']);          }
        if (isset ($page['forceRoute']))        { unset ($page['forceRoute']);      }
        
        if (isset ($defaults['plugins']))       { unset ($defaults['plugins']);     }
        if (isset ($defaults['definitions']))   { unset ($defaults['definitions']); }
        if (isset ($defaults['models']))        { unset ($defaults['models']);      }

        $paginations    = $this->getPaginations ();
        $layoutData     = Array ('seo_keywords' => '', 'seo_description' => '', 'title' => '');
        
        if ($this->route)
        {
            $oSql           = Sql::getInstance ();

            $query          = 'SELECT `ID`, `force` FROM `routes` WHERE `route` = "'.$this->route.'";';
            $result         = $oSql->query ($query);

            if ($result && is_array ($result) && isset ($result[0]) && isset ($result[0]['ID']))
            {
                $layoutHandler  = LayoutHandler::getInstance ();
                $layoutData     = $layoutHandler->getLayout ($result[0]['ID']);
            }   
        }

        $json   = $this->prepareRouteOutput ($defaults, $page, $definitions, $models, $plugins, $paginations, $forceRoute, $layoutData);

        return $this->cleanOutput ($json);
    }
    
    private function prepareRoutePlugin ($plugin)
    {
        $result                     = array ();
        $item                       = isset ($this->params['item']) ? $this->params['item'] : null;
        $pluginHandler              = new PluginHandler ();
        
        $result[$plugin]            = $pluginHandler->handleRoutePlugin ($plugin, $item);

        return $result;
    }
    
    private function mergeDefinitions ($defaults, $page)
    {
        $definitions    = array();
        
        if (isset ($defaults['definitions']))   { $definitions = $defaults['definitions'];                          }
        if (isset ($page['definitions']))       { $definitions = array_merge ($definitions, $page['definitions']);  }
        
        return count ($definitions) > 0 ? $definitions : false;
    }
    
    private function mergeModels ($defaults, $page)
    {
        $defaultModels  = $this->resolveModels ($defaults);
        $pageModels     = $this->resolveModels ($page);

        $insertedModels = $this->insertModels (array (), $defaultModels);
        $insertedModels = $this->insertModels ($insertedModels, $pageModels);

        $ids            = array ();
        $errors         = array ();
        $mergedModels   = array ();

        foreach ($insertedModels as $model => $rows)
        {
            if (!isset ($ids[$model]))              { $ids[$model] = array ();          }
            if (!isset ($errors[$model]))           { $errors[$model] = array ();       }            
            if (!isset ($mergedModels[$model]))     { $mergedModels[$model] = array (); }

            foreach ($rows as $manip)
            {
                $isError    = is_object ($manip) && get_class ($manip) === 'ErrorHandler';
                $row        = $this->prepareOutput ($manip);

                if (!$isError)
                {
                    if (!isset ($ids[$model][$row[$model]['id']]))
                    {
                        $ids[$model][$row[$model]['id']]    = true;
                        $mergedModels[$model][]             = $row[$model];
                    }
                }
                else
                {
                    if (!isset ($errors[$model][$row['err']])) 
                    {
                        $errors[$model][$row['err']]    = true;
                        $mergedModels[$model][]         = $row;
                    }
                }
            }
        }

        return count ($mergedModels) > 0 ? $mergedModels : false;
    }
    
    private function insertModels ($merged, $insertModels)
    {
        foreach ($insertModels as $model => $rows)
        {
            if (count ($rows) > 0)
            {
                if (!isset ($merged[$model]))   { $merged[$model] = array ();   }
                
                foreach ($rows as $row)     
                { 
                    $merged[$model][] = $row; 
                }
            }
        }
        
        return $merged;
    }
    
    private function resolveModels ($page)
    {
        $hasModels  = isset ($page['models']) && is_array ($page['models']) && count ($page['models']) > 0;
        
        return $hasModels ? $page['models'] : array ();
    }
    
    private function prepareRouteOutput ($defaults, $page, $definitions, $models, $plugins, $paginations, $forceRoute = 0, $metaTags)
    {
        $oConfig    = Config::getInstance ();
        
        $errHelper  = ErrorHelper::getInstance ();
        $errCode    = $errHelper->getResponseCode ();

        $json       = array ('route' => $this->origin);

        $json[$this->origin]    = $errCode === false ? $page : $errHelper->getErrorPage ($page);
        
        if ($this->needDefaults)
        {
            $langHelper     = new LanguageHelper ();
            
            $json[$this->origin]['defaults']            = $defaults;
            $json[$this->origin]['defaults']['route']   = $this->defPageFetcher->getRoute ();
            $json['lang']                               = strtolower ($langHelper->getLanguage ());
        }

        if ($definitions)               { $json['definitions'] = $definitions;                  }
        if ($models)                    { $json['models'] = $models;                            }
        if ($this->item)                { $json[$this->origin]['view'] = $this->resolveView (); }
        if ($paginations)               { $json['paginations'] = $paginations;                  }
        if (strlen ($this->item) > 0)   { $json[$this->origin]['bookmark'] = $this->item;       }

        $json['force']  = $forceRoute;
        $json['meta']['meta_keywords']      = $metaTags['seo_keywords'];
        $json['meta']['meta_description']   = $metaTags['seo_description'];
        $json['meta']['title']              = $metaTags['title'];
        $json['scope']                      = $oConfig->getScope ();
        $json['origin']                     = $this->route;
        
        if (Auth::loggedIn ())          { $json['auth'] = Auth::getUser (); }
        if (count ($plugins) > 0)       { $json['plugins'] = $plugins;      }

        return $json;
    }
    
    private function cleanOutput ($json)
    {
        $oConfig            = Config::getInstance ();
        $scope              = $oConfig->getScope ();
        $settings           = $oConfig->getSettings ();
        $isDefaultRoute     = isset ($settings['routes'][$scope]) && $settings['routes'][$scope] === $this->origin;

        if ($isDefaultRoute)
        {
            unset ($json[$this->origin]['header']);
            unset ($json[$this->origin]['footer']);
        }

        if (isset ($json[$this->origin]['header']['html']) && $json[$this->origin]['header']['html'] === '') { unset ($json[$this->origin]['header']); }
        if (isset ($json[$this->origin]['main'] ) && isset ($json[$this->origin]['main']['html']) && $json[$this->origin]['main']['html'] === '') { unset ($json[$this->origin]['main']);   }
        if (isset ($json[$this->origin]['footer']['html']) && $json[$this->origin]['footer']['html'] === '') { unset ($json[$this->origin]['footer']); }
        
        if (isset ($json[$this->origin]['definitions'] ) ) { unset ($json[$this->origin]['definitions']); }
        if (isset ($json[$this->origin]['defaults'] ) && isset ($json[$this->origin]['defaults']['definitions'])) { unset ($json[$this->origin]['defaults']['definitions']); }
    
        return $json;
    }
    
    private function resolveView ()
    {
        $parts  = str_replace ('/*', '', $this->route);
        $parts  = explode ('/', $parts);
        $view   = '';

        unset ($parts[0]);

        foreach ($parts as $key => $part) 
        {
            if ($key > 1)
            {
                $view .= strtoupper (substr ($part, 0, 1)).substr ($part, 1);
            }
            else
            {
                $view .= strtolower (substr ($part, 0, 1)).substr ($part, 1);
            }
        }
        
        return $view;
    }
    
    private function getPaginations ()
    {
        return isset ($_SESSION['pagination']) ? $_SESSION['pagination'] : false;
    }
    
    private function sentDefaults ()
    {
        if (!isset ($_SESSION['client']['scope']) || $_SESSION['client']['scope'] !== $this->scope)
        {
            $oConfig    = Config::getInstance ();

            $_SESSION['client']['scope']    = $oConfig->getScope ();

            return false;
        }

        return true;
    }
}