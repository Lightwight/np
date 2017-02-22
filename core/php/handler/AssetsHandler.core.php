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

class AssetsHandler
{
    private static $instance            = null;
    
    private static $config              = null;
    private static $fso                 = null;
    
    private static $settings            = '';
    private static $environment         = '';
    private static $test                = true;
    
    private static $header              = '';
    
    private static $plainJS             = false;
    
    private static $isMobile            = false;
    private static $isTablet            = false;
    
    private static $coreDesktopJS       = '';
    private static $coreTabletJS        = '';
    private static $coreMobileJS        = '';

    private static $coreDesktopCSS      = '';
    private static $coreTabletCSS       = '';
    private static $coreMobileCSS       = '';
    
    private static $pluginJS            = '';
    private static $pluginCSS           = '';
    
    private static $customDesktopJS     = '';
    private static $customTabletJS      = '';
    private static $customMobileJS      = '';

    private static $customDesktopCSS    = '';
    private static $customTabletCSS     = '';
    private static $customMobileCSS     = '';
    
    private static $testJS              = '';
    private static $testCSS             = '';
    
    private static $linkDesktopJS       = '<script type="text/javascript" src="/cache/app.js"></script>';
    private static $linkTabletJS        = '<script type="text/javascript" src="/cache/app.tablet.js"></script>';
    private static $linkMobileJS        = '<script type="text/javascript" src="/cache/app.mobile.js"></script>';

    private static $linkDesktopCSS      = '<link type="text/css" href="/cache/app.css" rel="stylesheet">';
    private static $linkTabletCSS       = '<link type="text/css" href="/cache/app.tablet.css" rel="stylesheet">';
    private static $linkMobileCSS       = '<link type="text/css" href="/cache/app.mobile.css" rel="stylesheet">';
    
    private static $jsOpener            = '<script type="text/javascript" src="';
    private static $jsCloser            = '"></script>';
    
    private static $cssOpener           = '<link type="text/css" href="';
    private static $cssCloser           = '" rel="stylesheet">';
    
    public static function getInstance()    { return ( self::$instance !== null )? self::$instance : self::$instance = new self;    }    
    
    private function __construct(){}
    private function __clone(){}
    
    public function includeAssets ($header, $plainJS = false)
    {
        self::$config       = Config::getInstance ();
        self::$fso          = new Fso ();
        self::$header       = $header;

        self::$settings     = self::$config->getSettings ();
        
        self::$environment  = isset (self::$settings['env']) ? self::$settings['env'] : 'live';
        self::$test         = isset (self::$settings['test']) ? self::$settings['test'] : true;
        self::$plainJS      = $plainJS;

        self::$isTablet     = self::$config->isTablet ();
        self::$isMobile     = self::$config->isMobile ();
        
        self::prepareAssets ();
        
        return self::$header;
    }
    
    private static function prepareAssets ()
    {
        self::prepareCoreAssets ();
        self::preparePluginAssets ();
        self::prepareScopeAssets ();
        self::prepareTestAssets ();
                
        self::mergeAssets ();
    }
    
    private static function prepareCoreAssets ()
    {
        $fso                = self::$fso;
        
        $sitePath           = self::$config->getPath ();
        
        $jsSharedPath       = $sitePath.'core/shared/js';
        $jsDesktopPath      = $sitePath.'core/desktop/js';
        $jsTabletPath       = $sitePath.'core/tablet/js';
        $jsMobilePath       = $sitePath.'core/mobile/js';

        $cssSharedPath      = $sitePath.'core/shared/css';
        $cssDesktopPath     = $sitePath.'core/desktop/css';
        $cssTabletPath      = $sitePath.'core/tablet/css';
        $cssMobilePath      = $sitePath.'core/mobile/css';
        
        $jsDesktopFile      = 'cache/app.js';
        $jsTabletFile       = 'cache/app.tablet.js';
        $jsMobileFile       = 'cache/app.mobile.js';

        $cssDesktopFile     = 'cache/app.css';        
        $cssTabletFile      = 'cache/app.tablet.css';
        $cssMobileFile      = 'cache/app.mobile.css';
        
        $jsSharedStream     = '';
        $jsDesktopStream    = '';
        $jsTabletStream     = '';
        $jsMobileStream     = '';

        $cssSharedStream    = '';        
        $cssDesktopStream   = '';
        $cssTabletStream    = '';
        $cssMobileStream    = '';        
        
        if (self::$environment === 'live')
        {
            if (!file_exists ($sitePath.$jsDesktopFile) || !file_exists ($sitePath.$jsTabletFile) || !file_exists ($sitePath.$jsMobileFile))
            {
                $jsSharedStream     = $fso->dirRecursive ($jsSharedPath, array ('js'), false);
            }
            
            if (!file_exists ($sitePath.$cssDesktopFile) || !file_exists ($sitePath.$cssTabletFile) || !file_exists ($sitePath.$cssMobileFile))
            {
                $cssSharedArray     = $fso->dirRecursive ($cssSharedPath, array ('css'), false);
                
                foreach ($cssSharedArray as $cssFile)     { $cssSharedStream .= "\n\n".$fso->read ($cssFile); }
            }
            
            if (!file_exists($sitePath.$jsDesktopFile))
            {
                $jsDesktopStream    = array_merge ($jsSharedStream, $fso->dirRecursive ($jsDesktopPath, array ('js'), false));
            }
            
            if (!file_exists($sitePath.$jsTabletFile))
            {
                $jsTabletStream     = array_merge ($jsSharedStream, $fso->dirRecursive ($jsTabletPath, array ('js'), false));
            }
            
            if (!file_exists($sitePath.$jsMobileFile))
            {
                $jsMobileStream     = array_merge ($jsSharedStream, $fso->dirRecursive ($jsMobilePath, array ('js'), false));
            }
            
            if (!file_exists ($sitePath.$cssDesktopFile))
            {
                $cssDesktopStream   = $cssSharedStream;
                $cssArray           = $fso->dirRecursive ($cssDesktopPath, array ('css'), false);                
                
                foreach ($cssArray as $cssFile)     { $cssDesktopStream .= "\n\n".$fso->read ($cssFile); }
            }
            
            if (!file_exists ($sitePath.$cssTabletFile))
            {
                $cssTabletStream    = $cssSharedStream;
                $cssArray           = $fso->dirRecursive ($cssTabletPath, array ('css'), false);                
                
                foreach ($cssArray as $cssFile)     { $cssTabletStream .= "\n\n".$fso->read ($cssFile); }
            }
            
            if (!file_exists ($sitePath.$cssMobileFile))
            {
                $cssMobileStream    = $cssSharedStream;
                $cssArray           = $fso->dirRecursive ($cssMobilePath, array ('css'), false);                
                
                foreach ($cssArray as $cssFile)     { $cssMobileStream .= "\n\n".$fso->read ($cssFile); }
            }
        }
        else
        {
            $jsSharedArray      = $fso->dirRecursive ($jsSharedPath, array ('js'), false);
            $jsDesktopArray     = array_merge ($jsSharedArray, $fso->dirRecursive ($jsDesktopPath, array ('js'), false));
            $jsTabletArray      = array_merge ($jsSharedArray, $fso->dirRecursive ($jsTabletPath, array ('js'), false));
            $jsMobileArray      = array_merge ($jsSharedArray, $fso->dirRecursive ($jsMobilePath, array ('js'), false));

            $cssSharedArray     = $fso->dirRecursive ($cssSharedPath, array ('css'), false);
            $cssDesktopArray    = array_merge ($cssSharedArray, $fso->dirRecursive ($cssDesktopPath, array ('css'), false));
            $cssTabletArray     = array_merge ($cssSharedArray, $fso->dirRecursive ($cssTabletPath, array ('css'), false));
            $cssMobileArray     = array_merge ($cssSharedArray, $fso->dirRecursive ($cssMobilePath, array ('css'), false));
            
            $jsDesktopStream    = $jsDesktopArray;
            $jsTabletStream     = $jsTabletArray;
            $jsMobileStream     = $jsMobileArray;
            
            $cssDesktopStream   = $cssDesktopArray;
            $cssTabletStream    = $cssTabletArray;
            $cssMobileStream    = $cssMobileArray;
        }

        self::$coreDesktopJS    = $jsDesktopStream;
        
        self::$coreTabletJS     = $jsTabletStream;
        self::$coreMobileJS     = $jsMobileStream;

        self::$coreDesktopCSS   = $cssDesktopStream;
        self::$coreTabletCSS    = $cssTabletStream;
        self::$coreMobileCSS    = $cssMobileStream;
    }
    
    private static function preparePluginAssets ()
    {
        $fso            = self::$fso;
        $sitePath       = self::$config->getPath ();
        
        $jsArray        = array ();
        $cssArray       = array ();
        
        $jsStream       = '';
        $cssStream      = '';
        
        if (self::$environment === 'live')
        {
            if (!file_exists ($sitePath.'cache/app.js') || !file_exists ($sitePath.'cache/app.tablet.js') || !file_exists ($sitePath.'cache/app.mobile.js'))
            {
                $jsStream   = $fso->dirRecursive ($sitePath.'plugins/', array ('js'), false);                
            }
            
            if (!file_exists ($sitePath.'cache/app.css') || !file_exists ($sitePath.'cache/app.tablet.css') || !file_exists ($sitePath.'cache/app.mobile.css'))
            {
                $cssArray       = $fso->dirRecursive ($sitePath.'plugins/', array ('css'), false);                
                
                foreach ($cssArray as $cssFile)     { $cssStream   .= "\n\n".$fso->read ($cssFile); }
            }
        }
        else
        {
            $plHelper       = PluginHelper::getInstance ();
            $plugins        = $plHelper->listPluginsInDirectory ();
                
            if (is_array ($plugins) && count ($plugins) > 0) 
            {
                foreach ($plugins as $path)
                {
                    $jsArray        = array_merge ($jsArray, $fso->dirRecursive ($path.'/js/', array ('js'), false));
                    $cssArray       = array_merge ($cssArray, $fso->dirRecursive ($path.'/css/', array ('css'), false));
                }   
            }

            $jsStream       = $jsArray;
            $cssStream      = $cssArray;
        }

        self::$pluginJS     = $jsStream;
        self::$pluginCSS    = $cssStream;
    }    
    
    private static function prepareScopeAssets ()
    {
        $scopes             = self::getScopes ();

        if (self::$environment === 'live')
        {
            self::$customDesktopJS  = array ();
            self::$customTabletJS   = array ();
            self::$customMobileJS   = array ();
            
            self::$customDesktopCSS = '';
            self::$customTabletCSS  = '';
            self::$customMobileCSS  = '';

            
            foreach ($scopes as $scope)
            {
                $preparedScopeAssets        = self::prepareScopeAsset ($scope);
;
                self::$customDesktopJS      = array_merge (self::$customDesktopJS, $preparedScopeAssets['desktop']['js']);
                self::$customTabletJS       = array_merge (self::$customTabletJS, $preparedScopeAssets['tablet']['js']);
                self::$customMobileJS       = array_merge (self::$customMobileJS, $preparedScopeAssets['mobile']['js']);

                self::$customDesktopCSS    .= $preparedScopeAssets['desktop']['css'];
                self::$customTabletCSS     .= $preparedScopeAssets['tablet']['css'];
                self::$customMobileCSS     .= $preparedScopeAssets['mobile']['css'];
            }
        }
        else
        {
            self::$customDesktopJS  = array ();
            self::$customTabletJS   = array ();
            self::$customMobileJS   = array ();
            
            self::$customDesktopCSS = array ();
            self::$customTabletCSS  = array ();
            self::$customMobileCSS  = array ();
            
            foreach ($scopes as $scope)
            {
                $preparedScopeAssets        = self::prepareScopeAsset ($scope);

                self::$customDesktopJS      = array_merge (self::$customDesktopJS, $preparedScopeAssets['desktop']['js']) ;
                self::$customTabletJS       = array_merge (self::$customTabletJS, $preparedScopeAssets['tablet']['js']);
                self::$customMobileJS       = array_merge (self::$customMobileJS, $preparedScopeAssets['mobile']['js']);

                self::$customDesktopCSS     = array_merge (self::$customDesktopCSS, $preparedScopeAssets['desktop']['css']);
                self::$customTabletCSS      = array_merge (self::$customTabletCSS, $preparedScopeAssets['tablet']['css']);
                self::$customMobileCSS      = array_merge (self::$customMobileCSS, $preparedScopeAssets['mobile']['css']);
            }
        }
    }
    
    private static function prepareScopeAsset ($scope) 
    {
        $fso                = self::$fso;
        $sitePath           = self::$config->getPath ();

        $jsDesktopFile      = 'cache/app.js';
        $jsTabletFile       = 'cache/app.tablet.js';
        $jsMobileFile       = 'cache/app.mobile.js';

        $cssDesktopFile     = 'cache/app.css';
        $cssTabletFile      = 'cache/app.tablet.css';
        $cssMobileFile      = 'cache/app.mobile.css';
        
        $jsDesktopPath      = $sitePath.$scope.'/desktop/Assets/js/';
        $jsTabletPath       = $sitePath.$scope.'/tablet/Assets/js/';
        $jsMobilePath       = $sitePath.$scope.'/mobile/Assets/js/';

        $cssDesktopPath     = $sitePath.$scope.'/desktop/Assets/css/';
        $cssTabletPath      = $sitePath.$scope.'/tablet/Assets/css/';
        $cssMobilePath      = $sitePath.$scope.'/mobile/Assets/css/';

        $jsDesktopStream    = '';
        $jsTabletStream     = '';
        $jsMobileStream     = '';

        $cssDesktopStream   = '';
        $cssTabletStream    = '';
        $cssMobileStream    = '';
        
        if (self::$environment === 'live')
        {
            if (!file_exists ($sitePath.$jsDesktopFile))
            {
                $jsDesktopStream    = $fso->dirRecursive ($jsDesktopPath, array ('js'), false);
            }

            if (!file_exists ($sitePath.$jsTabletFile))
            {
                $jsTabletStream     = $fso->dirRecursive ($jsTabletPath, array ('js'), false);
            }
            
            if (!file_exists ($sitePath.$jsMobileFile))
            {
                $jsMobileStream     = $fso->dirRecursive ($jsMobilePath, array ('js'), false);
            }
            
            if (!file_exists ($sitePath.$cssDesktopFile))
            {
                $cssArray       = $fso->dirRecursive ($cssDesktopPath, array ('css'), false);
            
                foreach ($cssArray as $cssFile) { $cssDesktopStream .= "\n\n".$fso->read ($cssFile); }
            }

            if (!file_exists ($sitePath.$cssTabletFile))
            {
                $cssArray       = $fso->dirRecursive ($cssTabletPath, array ('css'), false);
            
                foreach ($cssArray as $cssFile) { $cssTabletStream .= "\n\n".$fso->read ($cssFile); }
            }
            
            if (!file_exists ($sitePath.$cssMobileFile))
            {
                $cssArray       = $fso->dirRecursive ($cssMobilePath, array ('css'), false);
            
                foreach ($cssArray as $cssFile) { $cssMobileStream .= "\n\n".$fso->read ($cssFile); }
            }
        }
        else
        {
            $jsDesktopStream    = $fso->dirRecursive ($jsDesktopPath, array ('js'), false);
            $jsTabletStream     = $fso->dirRecursive ($jsTabletPath, array ('js'), false);
            $jsMobileStream     = $fso->dirRecursive ($jsMobilePath, array ('js'), false);
            
            $cssDesktopStream   = $fso->dirRecursive ($cssDesktopPath, array ('css'), false);
            $cssTabletStream    = $fso->dirRecursive ($cssTabletPath, array ('css'), false);
            $cssMobileStream    = $fso->dirRecursive ($cssMobilePath, array ('css'), false);
        }
        
        return array
        (
            'desktop'   => array
            (
                'js'    => is_array ($jsDesktopStream) ? $jsDesktopStream : array (),
                'css'   => $cssDesktopStream
            ),
            
            'tablet'    => array
            (
                'js'    => is_array ($jsTabletStream) ? $jsTabletStream : array (),
                'css'   => $cssTabletStream
            ),
            
            'mobile'    => array
            (
                'js'    => is_array ($jsMobileStream) ? $jsMobileStream : array (),
                'css'   => $cssMobileStream
            )
        );
    }
    
    private static function getScopes ()
    {
        $oSql   = Sql::getInstance ();
        
        $scopes = array ();
        $query  = 'SELECT `name` FROM `route_scopes`';
        $result = $oSql->query ($query);
        
        if (is_array ($result))
        {
            foreach ($result as $row)
            {
                $scopes[]   = $row['name'];
            }
        }
        
        return $scopes;
    }
    
    private static function prepareTestAssets ()
    {
        if (self::$environment === 'development' && self::$test === true) 
        {
            $fso            = self::$fso;
            $sitePath       = self::$config->getPath ();

            self::$testJS   = $fso->dirRecursive ($sitePath.'test/js/', array ('js'), false);
            self::$testCSS  = $fso->dirRecursive ($sitePath.'test/css/', array ('css'), false);
        }
    }
    
    private static function mergeAssets ()
    {
        $rxEntryPoint       = '/\<{1}\/{1}head\>{1}/im';
        $matches            = array();
        $header             = self::$header;
        $fso                = self::$fso;

        $sitePath           = self::$config->getPath ();

        $jsDesktopFile      = $sitePath.'cache/app.js';
        $jsTabletFile       = $sitePath.'cache/app.tablet.js';
        $jsMobileFile       = $sitePath.'cache/app.mobile.js';

        $cssDesktopFile     = $sitePath.'cache/app.css';
        $cssTabletFile      = $sitePath.'cache/app.tablet.css';
        $cssMobileFile      = $sitePath.'cache/app.mobile.css';

        preg_match ($rxEntryPoint, $header, $matches);

        if (count ($matches) > 0)
        {
            $match          = $matches[0];
            $tmpVal         = $header;

            $lVal           = substr ($tmpVal, 0, strpos ($tmpVal, $match));

            $rVal           = substr ($tmpVal, strpos ($tmpVal, $match) + strlen ($match));

            $fso->mkdir ($sitePath.'cache');
            
            if (self::$environment === 'live') 
            {
                $linkDesktopJS  = self::getJS ('live', $jsDesktopFile, self::$linkDesktopJS, self::$coreDesktopJS, self::$customDesktopJS); 
                $linkDesktopCSS = self::getCSS ('live', $cssDesktopFile, self::$linkDesktopCSS, self::$coreDesktopCSS, self::$customDesktopCSS);
                
                $linkTabletJS   = self::getJS ('live', $jsTabletFile, self::$linkTabletJS, self::$coreTabletJS, self::$customTabletJS); 
                $linkTabletCSS  = self::getCSS ('live', $cssTabletFile, self::$linkTabletCSS, self::$coreTabletCSS, self::$customTabletCSS);

                $linkMobileJS   = self::getJS ('live', $jsMobileFile, self::$linkMobileJS, self::$coreMobileJS, self::$customMobileJS); 
                $linkMobileCSS  = self::getCSS ('live', $cssMobileFile, self::$linkMobileCSS, self::$coreMobileCSS, self::$customMobileCSS);
            }
            else
            {
                $fso->deleteFile ($sitePath.'cache/app.js');
                $fso->deleteFile ($sitePath.'cache/app.mobile.js');

                $fso->deleteFile ($sitePath.'cache/app.css');
                $fso->deleteFile ($sitePath.'cache/app.mobile.css');
                
                $linkDesktopJS      = '';
                $linkTabletJS       = '';
                $linkMobileJS       = '';

                $linkDesktopCSS     = '';
                $linkTabletCSS      = '';
                $linkMobileCSS      = '';

                if (!self::$isMobile && !self::$isTablet)
                {
                    $linkDesktopJS  = self::getJS ('development', $sitePath, null, self::$coreDesktopJS, self::$customDesktopJS);
                    $linkDesktopCSS = self::getCSS ('development', $sitePath, null, self::$coreDesktopCSS, self::$customDesktopCSS);
                }
                else if (self::$isTablet)
                {
                    $linkTabletJS   = self::getJS ('development', $sitePath, null, self::$coreTabletJS, self::$customTabletJS);
                    $linkTabletCSS  = self::getCSS ('development', $sitePath, null, self::$coreTabletCSS, self::$customTabletCSS);
                }
                else 
                {
                    $linkMobileJS   = self::getJS ('development', $sitePath, null, self::$coreMobileJS, self::$customMobileJS);
                    $linkMobileCSS  = self::getCSS ('development', $sitePath, null, self::$coreMobileCSS, self::$customMobileCSS);
                }
            }
            
            if (!self::$isMobile && !self::$isTablet)
            {
                self::$header   = $lVal."\n".$linkDesktopCSS."\n".$linkDesktopJS.$match.$rVal."\n";            
            }
            else if (self::$isTablet)
            {
                self::$header   = $lVal."\n".$linkTabletCSS."\n".$linkTabletJS.$match.$rVal."\n";            
            }
            else 
            {
                self::$header   = $lVal."\n".$linkMobileCSS."\n".$linkMobileJS.$match.$rVal."\n";            
            }
        }
    }
    
    private static function getJS ($environment, $dest, $link = '', $coreJS = null, $customJS = null)
    {
        $fso        = new Fso ();    
        $minified   = '';

        if ($environment === 'live')
        {
            if (!file_exists ($dest))
            {
                foreach ($coreJS as $js)
                {
                    // ToDo: log on error:
                    $minified  .= MinifierHelper::minify ($fso->read ($js));
                }

                if (is_array (self::$pluginJS))
                {
                    foreach (self::$pluginJS as $js)
                    {
                        // ToDo: log on error:
                        $minified  .= MinifierHelper::minify ($fso->read ($js));
                    }
                }

                foreach ($customJS as $js)
                {
                    // ToDo: log on error:
                    $minified  .= MinifierHelper::minify ($fso->read ($js));
                }

                $fso->write ($dest, $minified);
            }
        }
        else
        {
            $link   = '';

            if (is_array ($coreJS) && count ($coreJS) > 0) 
            {
                foreach ($coreJS as $jsFile)
                {
                    $jsDest     = str_replace ($dest, '/', $jsFile);
                    $link      .= self::$jsOpener.$jsDest.self::$jsCloser;
                }
            }

            if (is_array (self::$pluginJS) && count (self::$pluginJS) > 0) 
            {
                foreach (self::$pluginJS as $jsFile)
                {
                    $jsDest     = str_replace ($dest, '/', $jsFile);
                    $link      .= self::$jsOpener.$jsDest.self::$jsCloser;
                }
            }

            if (is_array ($customJS) && count ($customJS) > 0) 
            {
                foreach ($customJS as $jsFile)
                {
                    $jsDest     = str_replace ($dest, '/', $jsFile);
                    $link      .= self::$jsOpener.$jsDest.self::$jsCloser;
                }
            }

            if (is_array (self::$testJS) && count (self::$testJS) > 0) 
            {
                foreach (self::$testJS as $jsFile)
                {
                    $jsDest     = str_replace ($dest, '/', $jsFile);
                    $link      .= self::$jsOpener.$jsDest.self::$jsCloser;
                }
            }
        }
        
        return $link;
    }

    private static function getCSS ($environment, $dest, $link = '', $coreCSS = null, $customCSS = null)
    {
        $fso    = new Fso ();
        
        if ($environment === 'live')
        {
            if (!file_exists ($dest))
            {
                $fso->write ($dest, $coreCSS.self::$pluginCSS.$customCSS);
            }        
        }
        else
        {
            $link   = '';

            if (is_array ($coreCSS) && count ($coreCSS) > 0) 
            {
                foreach ($coreCSS as $cssFile)
                {
                    $cssDest    = str_replace ($dest, '/', $cssFile);
                    $link      .= self::$cssOpener.$cssDest.self::$cssCloser;
                }
            }

            if (is_array (self::$pluginCSS) && count (self::$pluginCSS) > 0) 
            {
                foreach (self::$pluginCSS as $cssFile)
                {
                    $cssDest    = str_replace ($dest, '/', $cssFile);
                    $link      .= self::$cssOpener.$cssDest.self::$cssCloser;
                }
            }

            if (is_array ($customCSS) && count ($customCSS) > 0) 
            {
                foreach ($customCSS as $cssFile)
                {
                    $cssDest    = str_replace ($dest, '/', $cssFile);
                    $link      .= self::$cssOpener.$cssDest.self::$cssCloser;
                }
            }

            if (is_array (self::$testCSS) && count (self::$testCSS) > 0) 
            {
                foreach (self::$testCSS as $cssFile)
                {
                    $cssDest    = str_replace ($dest, '/', $cssFile);
                    $link      .= self::$cssOpener.$cssDest.self::$cssCloser;
                }
            }            
        }

        return $link;        
    }
}