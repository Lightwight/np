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

class HTMLTreeBuilder
{
    private static $instance    = null;
    
    private static $fso         = null;
    private static $config      = null;
    private static $folder      = '/';
    private static $isMobile    = null;
    private static $isTablet    = null;
    private static $scope       = null;
    
    public static function getInstance ()   { return (self::$instance !== null) ? self::$instance : self::$instance = new self; }
    
    private function __construct () 
    {
        if (self::$config === null) { self::$config = Config::getInstance ();   }
        if (self::$fso === null)    { self::$fso = new Fso ();                  }

        if (self::$isMobile === null)
        {
            self::$isMobile = self::$config->isMobile ();
            self::$isTablet = self::$config->isTablet ();    
        }
        
        self::$scope    = self::$config->getScope ();
    }
    
    private function __clone () {}
    
    public function generate ($layout, $block = 'all', $folder = '/')
    {
        self::$folder   = strrpos ($folder, '/') < strlen ($folder) - 1 ? $folder.'/' : $folder;

        return self::parseComponents ($layout, $block);
    }

    public static function hasHeaderAndFooter ($layout)
    {
        $htmlLayout         = $this->fetchLayout ($layout);
        $regexHeader        = '/\<header\>.*\<\/header\>/im';
        $regexFooter        = '/\<footer\>.*\<\/footer\>/im';
        
        $matchesHeader      = array ();
        $matchesFooter      = array ();

        preg_match_all ($regexHeader, $htmlLayout, $matchesHeader, PREG_PATTERN_ORDER);
        preg_match_all ($regexFooter, $htmlLayout, $matchesFooter, PREG_PATTERN_ORDER);
        
        return array
        ( 
            'header' => isset ($matchesHeader[0]) && count ($matchesHeader[0]) > 0,
            'footer' => isset ($matchesFooter[0]) && count ($matchesFooter[0]) > 0
        );
    }
    
    private static function parseComponents ($layout, $block)
    {
        // Read the layout-html:
        $htmlLayout     = self::fetchLayout ($layout);

        if ($block === 'main')          { $htmlLayout = self::extract ('main', $htmlLayout);    }        
        else if ($block === 'header')   { $htmlLayout = self::extract ('header', $htmlLayout);  }
        else if ($block === 'footer')   { $htmlLayout = self::extract ('footer', $htmlLayout);  }
        
        $htmlLayout     = self::parseYields ($htmlLayout);
        $htmlLayout     = self::parsePartials ($htmlLayout);

        return $htmlLayout;
    }

    private static function extract ($block, $layout)
    {
        $regexExtract   = '/\<'.$block.'\>.*\<\/'.$block.'\>/ims';
        $matches        = array ();

        preg_match_all ($regexExtract, $layout, $matches, PREG_PATTERN_ORDER);

        return (isset ($matches[0]) && count ($matches[0]) > 0) ? $matches[0][0] : '';
    }
    
    public static function parseHooks ($layout)
    {
        // Read the layout-html:
        $stream             = self::fetchLayout ($layout);
        
        $regexPlaceholder   = '/\{{2}\#{1}hook{1}\s*(\"|\'){1}([a-zA-Z0-9_-]*)\1\}{2}/ims';
        $matches            = array();

        $hooks              = array();
        $replacer           = array();

        // Replace with preg_replace instead of str_replace (shorter code):
        preg_match_all ($regexPlaceholder, $stream, $matches, PREG_PATTERN_ORDER);

        if (isset ($matches[0]) && count ($matches[0]) > 0)
        {
            $mHooks     = $matches[0];
            $hookIDS    = $matches[2];
            
            foreach ($mHooks as $inx => $hook)
            {
                $tmpStream  = substr ($stream, strpos ($stream, $hook));
                $tmpStream  = str_replace ($hook, '', $tmpStream);
                $tmpStream  = substr ($tmpStream, 0, strpos ($tmpStream, '{{/hook}}'));
                $tmpStream  = trim ($tmpStream);
                
                $tmpStream  = self::parseYields ($tmpStream);
                $tmpStream  = self::parsePartials ($tmpStream);
                
                $hooks[]    = array (
                    'id'    => $hookIDS[$inx],
                    'html'  => $tmpStream
                );
            }            
        }

        return $hooks;
    }

    private static function parseYields ($html)
    {
        $regexPlaceholder   = '/\{{2}\#{1}yield\s*[a-zA-Z0-9_-]*\s*\}{2}/ims';
        $matches            = array();
        
        $yields             = array();
        $replacer           = array();
        
        // Replace with preg_replace instead of str_replace (shorter code):
        preg_match_all ($regexPlaceholder, $html, $matches, PREG_PATTERN_ORDER);
        
        if (isset ($matches[0]) && count ($matches[0]) > 0)
        {
            $matches    = $matches[0];
            
            foreach ($matches as $placeholder)
            {
                $yield              = str_replace ('{{#yield ', '', $placeholder);
                $yield              = str_replace ('}}', '', $yield);
                
                $yields[$yield]     = self::fetchTemplate ($yield);
            }
            
            foreach ($yields as $key => $replace)
            {
                $html   = str_replace ('{{#yield '.$key.'}}', $replace, $html);
            }
        }      

        return $html;
    }
    
    public static function parsePartials ($html, $test = false) 
    {
        $regexPlaceholder   = '/\{{2}\#partial([^\}{2}]+)\}{2}/ims';
        $regexParams        = '/\:[a-zA-Z\_0-9]+\={1}(\"|\')[a-zA-Z\_0-9\#\.]+\1{1}/ims';
        
        $matches            = array ();
        $setters            = array ();
        
        // Replace with preg_replace instead of str_replace (shorter code):
        preg_match_all ($regexPlaceholder, $html, $matches, PREG_PATTERN_ORDER);

        if (count ($matches[0]) > 0)
        {
            foreach ($matches[1] as $key => $partialData)
            {
                preg_match_all ($regexParams, $partialData, $matchesParams, PREG_PATTERN_ORDER);
                
                if (count ($matchesParams[0])>0)
                {
                    $setters    = $matchesParams[0];
                    $partial    = trim (preg_replace ($regexParams, '', $partialData));
                }
                else
                {
                    $partial    = trim ($partialData);
                }

                $html   = str_replace ($matches[0][$key], self::fetchPartial ($partial), $html);

                if (count ($setters) > 0)
                {
                    foreach ($setters as $setter)
                    {
                        $set    = substr ($setter, 0, strpos ($setter, '='));
                        $param  = '='.substr ($setter, strrpos ($setter, '=')+1);
                        
                        $html   = preg_replace ('/\={1}'.$set.'/ims', $param, $html);
                    }
                }
                
                if (strpos ($html, '{{#partial') !== false) 
                {
                    $html   = self::parsePartials ($html, true);
                }
            }
        }

        return $html;
    }
    
    private static function fetchLayout ($layout)
    {
        $path           = self::$config->getPath ();
        $subPath        = '/desktop/';
        
        if (self::$isMobile)        { $subPath = '/mobile/';    } 
        else if (self::$isTablet)   { $subPath = '/tablet/';    }

        $layoutPath     = $path.self::$scope.$subPath.'Layouts/';

        return self::$fso->read ($layoutPath.$layout.'.html');
    }
    
    private static function fetchTemplate ($template)
    {
        $path           = self::$config->getPath ();
        $subPath        = '/desktop/';
        
        if (self::$isMobile)        { $subPath = '/mobile/';    } 
        else if (self::$isTablet)   { $subPath = '/tablet/';    }

        $templatePath   = $path.self::$scope.$subPath.'Templates'.self::$folder;

        return self::$fso->read ($templatePath.$template.'.html');
    }
    
    private static function fetchPartial ($partial)
    {
        $path           = self::$config->getPath ();
        $subPath        = '/desktop/';
        
        if (self::$isMobile)        { $subPath = '/mobile/';    } 
        else if (self::$isTablet)   { $subPath = '/tablet/';    }

        $templatePath   = $path.self::$scope.$subPath.'Partials/';

        return self::$fso->read ($templatePath.$partial.'.html');
    }
}