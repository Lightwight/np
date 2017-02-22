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

class RequestRouteHandler implements RequestHandlerInterface 
{
    private static $instance        = null;
    
    public static function getInstance ()    { return ( self::$instance !== null )? self::$instance : self::$instance = new self;   }
    
    private function __construct () {}
    private function __clone () {}

    public function resolveParametersGet ($params)  { return self::resolveRoute ($params);  }
    public function resolveParametersPost ($params) { return self::resolveRoute ();         }
    public function resolveParametersDelete ($id)   {}
    
    public function getHandle ()    { return self::$handle; }
    
    private static function resolveRoute ($params)
    { 
        $requestHandler = RequestHandler::getInstance ();
        $config         = Config::getInstance ();
        $settings       = $config->getSettings ();
        $defaultRoute   = $settings['routes']['custom'];
        $domain         = $settings['server']['domain'];

        if (strrpos ($domain, '/') < strlen($domain) - 1)   { $domain .= '/';   }
        
        $route          = (isset ($params['route']) && $params['route'] !== '') ? $params['route'] : $defaultRoute;
        $testRoute      = (isset ($params['origin']) && $params['origin'] !== '') ? $params['origin'] : $defaultRoute;

        if ($testRoute !== $defaultRoute && !$requestHandler->isJson ())
        {
            if (!self::isACrawlerRequest () && !self::isNPSeoBot ())
            {
                foreach ($_GET as $key => $val)
                {
                    $tmpKey = filter_var ($key, FILTER_SANITIZE_STRING);

                    if ($key !== 'route' && $key !== 'type')
                    {
                        if (!isset ($_SESSION['np_meta']))  { $_SESSION['np_meta'] = array ();  }

                        $_SESSION['np_meta'][$key]  = filter_input (INPUT_GET, $key, FILTER_SANITIZE_STRING);
                    }
                }

                $redirectTo         = '#/'.$testRoute;

                NPCookie::sendCookies ();

                header ('Location: '.$domain.$redirectTo);
                header ('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');

                exit;
            }
        }

        $params['route']    = $route;

        return $params;
    }
    
    
    private static function isACrawlerRequest ()
    {
        $crawlerDetect  = new CrawlerDetect ();

        return $crawlerDetect->isCrawler ();
    }      
    
    private static  function isNPSeoBot ()
    {
        return $_SERVER['HTTP_USER_AGENT'] === 'NP-SEO-BOT';
    }
}