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

require str_replace ('\\' ,'/', getcwd()).'/core/php/helper/RouteHelper.core.php';

require_once str_replace ('\\' ,'/', getcwd()).'/vendor/autoload.php';

spl_autoload_register ('npAutoload', false, true);  

function npAutoload ($class, $customRoute = false, $scope = 'custom')
{
    if ($class !== 'Mobile_Detect')
    {
        require_once str_replace ('\\' ,'/', getcwd()).'/config.php';
        
        $require        = false;
        $fDest          = false;

        $detectMobile   = isset ($config['client']) && isset ($config['client']['mobileDetect']) ? $config['client']['mobileDetect'] === true : false;
        $detectTablet   = isset ($config['client']) && isset ($config['client']['tabletDetect']) ? $config['client']['tabletDetect'] === true : false;
        
        $forceMobile    = $detectMobile === true &&  isset ($config['client']['forceMobileDetect']) ? $config['client']['forceMobileDetect'] === true : false;
        $forceTablet    = $detectTablet === true &&  isset ($config['client']['forceTabletDetect']) ? $config['client']['forceTabletDetect'] === true : false;
        
        $isMobile       = false;
        $isTablet       = false;

        $mobileDetector = new Mobile_Detect ();

        $subPath        = '/desktop/';
        
        if ($detectMobile)
        {
            $isMobile       = $forceMobile || ($mobileDetector->isMobile () && !$mobileDetector->isTablet ());
            $subPath        = '/mobile/';
        }
        
        if ($detectTablet)
        {
            $isTablet       = $forceTablet || ($mobileDetector->isTablet ());
            $subPath        = '/tablet/';
        }
        
        $hClass         = strtoupper (substr ($class, 0, 1)).substr ($class, 1);
        $lClass         = strtolower (substr ($class, 0, 1)).substr ($class, 1);
        $lClass         = str_replace ('Resolver', '', $lClass);
        $lClass         = str_replace ('Controller', '', $lClass);
        $lClass         = str_replace ('Handler', '', $lClass);

        $path           = str_replace ('\\' ,'/', getcwd());
        if (strrpos ($path, '/') != strlen ($path) - 1) { $path .= '/'; }

        if (!$customRoute)
        {
            $route                          = RouteHelper::getRouteForAutoload ();

            $corePath                       = 'core/php/';
            $coreControllerPath             = 'core/php/controller/';
            $coreHandlePath                 = 'core/php/handler/';
            $coreHelperPath                 = 'core/php/helper/';
            $coreInterfacePath              = 'core/php/interfaces/';
            $coreDiagnoserPath              = 'core/php/diagnoser/';

            $pluginPath                     = 'plugins/'.$lClass.'/php/';
            $controllerPath                 = $scope.$subPath.'Controller'.($route ? $route : '');

            $addonPath                      = 'addons/'.$lClass.'/';
            $defaultControllerPath          = $scope.$subPath.'Controller/defaults/';
            $pagesPath                      = $scope.$subPath.'Pages/';

            $coreFile                       = $path.$corePath.$hClass.'.core.php';
            $coreControllerFile             = $path.$coreControllerPath.$hClass.'.core.php';
            $coreHandleFile                 = $path.$coreHandlePath.$hClass.'.core.php';
            $pluginFile                     = $path.$pluginPath.$hClass.'.php';
            $coreHelperFile                 = $path.$coreHelperPath.$hClass.'.core.php';
            $coreInterfaceFile              = $path.$coreInterfacePath.$hClass.'.core.php';
            $coreDiagnoserFile              = $path.$coreDiagnoserPath.$hClass.'.core.php';
            $controllerFile                 = $path.$controllerPath.$hClass.'.php';
            $addonFile                      = $path.$addonPath.$hClass.'.php';
            $defaultControllerFile          = $path.$defaultControllerPath.$hClass.'.php';
            $pagesFile                      = $path.$pagesPath.$hClass.'/php/'.$hClass.'.php';
            $include                        = $coreFile;

            if ($class)
            if (!file_exists ($include))            { $include = $coreControllerFile;           }
            if (!file_exists ($include))            { $include = $coreHandleFile;               }
            if (!file_exists ($include))            { $include = $pluginFile;                   }
            if (!file_exists ($include))            { $include = $addonFile;                    }

            if (!file_exists ($include))            { $include = $coreHelperFile;               }
            if (!file_exists ($include))            { $include = $coreInterfaceFile;            }
            if (!file_exists ($include))            { $include = $coreDiagnoserFile;            }
            if (!file_exists ($include) && $route)  { $include = $controllerFile;               }
            if (!file_exists ($include))            { $include = $defaultControllerFile;        }
            if (!file_exists ($include))            { $include = $pagesFile;                    }

            if (file_exists ($include))             { require_once $include; return true;       }
            else                                    { return false;                             }
        }
        else
        {
            $route              = str_replace ('*', '', $customRoute);
            $defRoute           = RouteHelper::getDefaultRoute ();

            $customPath                     = $defRoute !== $customRoute ? $path.$scope.$subPath.'Controller'.$route : $path.$scope.$subPath.'Controller/defaults/';
            $defaultControllerPath          = $scope.$subPath.'Controller/defaults/';
            
            if (strrpos ($customPath, '/') < strlen ($customPath) - 1)  { $customPath .= '/';   }

            $customFile         = $customPath.$class.'.php';
            $defaultFile        = $defaultControllerPath.$class.'.php';

            if (file_exists ($customFile))          { require_once $customFile; return true;    }
            else if (file_exists ($defaultFile))    { require_once $defaultFile; return true;   }
            else                                    { return false;                             }
        }
    }
}