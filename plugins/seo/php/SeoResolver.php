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

class SeoResolver extends ControllerHelper
{
    public function resolveParameters_get ($type)   {}
    
    public function resolveParameters_post ($type)
    {
        $contents   = array ();
        $parameters = array ();
        
        parse_str (file_get_contents ('php://input'), $contents);

        if (isset ($contents[$type]))
        {
            $parameters = $contents[$type];

            if (isset ($parameters['export']))
            {
                return $this->resolveExport ($parameters['export']);
            }
            else if (isset ($parameters['save']))
            {
                return $this->resolveSave ($parameters['save']);
            }
        }
    }
    
    private function resolveExport ($parameters)
    {
        if ($this->isGroup (1) && isset ($parameters['robots']))
        {
            return array ('seo' => array ('export' => array ('robots' => true)));
        }
        else if ($this->isGroup (1) && isset ($parameters['sitemap']))
        {
            return array ('seo' => array ('export' => array ('sitemap' => true)));
        }
    }
    
    private function resolveSave ($parameters)
    {
        if ($this->isGroup (1) && isset ($parameters['route']))
        {
            $id         = isset ($parameters['route']['id']) ? (int)$parameters['route']['id'] : false;
            $route      = isset ($parameters['route']['route']) ? filter_var ($parameters['route']['route'], FILTER_SANITIZE_FULL_SPECIAL_CHARS) : false;
            $layout     = isset ($parameters['route']['layout']) ? filter_var ($parameters['route']['layout'], FILTER_SANITIZE_SPECIAL_CHARS) : '';
            $title      = isset ($parameters['route']['title']) ? filter_var ($parameters['route']['title'], FILTER_SANITIZE_SPECIAL_CHARS) : '';
            $force      = isset ($parameters['route']['force']) ? filter_var ($parameters['route']['force'], FILTER_VALIDATE_INT) : 0;
            $enabled    = isset ($parameters['route']['enabled']) ? filter_var ($parameters['route']['enabled'], FILTER_VALIDATE_INT) : 1;
            $deleted    = isset ($parameters['route']['deleted']) ? filter_var ($parameters['route']['deleted'], FILTER_VALIDATE_INT) : 0;
            $crawlable  = isset ($parameters['route']['crawlable']) ? filter_var ($parameters['route']['crawlable'], FILTER_VALIDATE_INT) : 0;
            
            $seo_keys   = isset ($parameters['route']['seo_keywords']) ? filter_var ($parameters['route']['seo_keywords'], FILTER_SANITIZE_SPECIAL_CHARS) : '';
            $seo_descr  = isset ($parameters['route']['seo_description']) ? filter_var ($parameters['route']['seo_description'], FILTER_SANITIZE_SPECIAL_CHARS) : '';
            $seo_model  = isset ($parameters['route']['seo_model']) ? filter_var ($parameters['route']['seo_model'], FILTER_SANITIZE_FULL_SPECIAL_CHARS) : false;
            $seo_column = isset ($parameters['route']['seo_column']) ? filter_var ($parameters['route']['seo_column'], FILTER_SANITIZE_FULL_SPECIAL_CHARS) : false;
            $seo_freq   = isset ($parameters['route']['seo_frequency']) ? filter_var ($parameters['route']['seo_frequency'], FILTER_VALIDATE_INT) : 4;
            $seo_prio   = isset ($parameters['route']['seo_priority']) ? filter_var ($parameters['route']['seo_priority'], FILTER_VALIDATE_INT) : 5;

            if ($id && $route)
            {
                return array 
                (
                    'seo' => array 
                    (
                        'save'  => array
                        (
                            'route' => array
                            (
                                'id'                => $id,
                                'route'             => $route,
                                'layout'            => $layout,
                                'title'             => $title,
                                'force'             => $force,
                                'enabled'           => $enabled,
                                'deleted'           => $deleted,
                                'crawlable'         => $crawlable,
                                'seo_keywords'      => $seo_keys,
                                'seo_description'   => $seo_descr,
                                'seo_model'         => $seo_model,
                                'seo_column'        => $seo_column,
                                'seo_frequency'     => $seo_freq,
                                'seo_priority'      => $seo_prio
                            )
                        )
                    )
                );
            }
        }
    }
}