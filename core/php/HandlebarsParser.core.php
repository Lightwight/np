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

class HandlebarsParser 
{
    public static function parseTemplate ($template)
    {
        $needs      = self::matchNeeds ($template);

        $models     = $needs['models'];
        $plugins    = $needs['plugins'];
        
        $template   = self::cleanTemplate ($template);

        return array ('html' => $template, 'models' => $models, 'plugins' => $plugins);
    }

    private static function cleanTemplate ($template)
    {
        $regex          = "/\{{2}\#{1}need\s*([a-zA-Z0-9_-]*)\s*([a-zA-Z0-9_-]*)\}{2}/ims";
        $matches        = array ();
        $result         = array ();
        
        preg_match_all ($regex, $template, $matches, PREG_PATTERN_ORDER);
        
        if (count ($matches[0]) > 0)
        {
            $result = $matches[0];
            
            foreach ($result as $match)
            {
                $template   = str_replace ($match, '', $template);
            }
        }
        
        return $template;
    }
    
    private static function matchNeeds ($template) 
    {
        $regex          = "/\{{2}\#{1}need\s*([a-zA-Z0-9_-]*)\s*([a-zA-Z0-9_-]*)\}{2}/ims";
        $matches        = array ();
        $needs          = array ('models' => array(), 'plugins' => array ());
        $result         = array ();

        preg_match_all ($regex, $template, $matches, PREG_PATTERN_ORDER);
        
        if (count ($matches[0]) > 0)
        {
            $result     = $matches[0];
            
            foreach ($result as $key => $match)
            {
                $type   = $matches[1][$key];
                
                if ($type === 'model')
                {
                    $needs['models'][]  = strtolower ($matches[2][$key]);
                }
                else if ($type === 'plugin') 
                {
                    $needs['plugins'][] = strtolower ($matches[2][$key]);
                }
            }
        }
        
        return $needs;
    }
}