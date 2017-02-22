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

class NPToken 
{
    private function __construct()  {}
    private function __clone ()     {} 

    public static function insert ($response)
    {
        if (is_array ($response))
        {
            $response['tokens']['csrf'] = self::generateToken ();
        }
        
        return $response;
    }
    /*
     * deprecated. system is using generateToken directly on first site call
     */
    public static function insertHTMLToken ($html)
    {
        $htmlToken  = '{{#csrf-token}}';
        
        $posOBody   = strpos ($html, '<body');
        $posToken   = strpos ($html, $htmlToken);
        
        $hasToken   = $posOBody !== false && $posToken !== false && $posOBody < $posToken;
        
        if ($hasToken)
        {
            return str_replace ($htmlToken, '<div id="csrf_token" style="display:none">'.self::generateToken().'</div>', $html);
        }
        
        return false;
    }
    
    public static function validateToken ()
    {
        $sessToken  = self::getToken ();

        if ($sessToken)
        {
            $reqToken   = filter_input (INPUT_GET, 'csrf', FILTER_SANITIZE_STRING);

            if (!$reqToken)
            {
                $reqToken   = filter_input (INPUT_POST, 'csrf', FILTER_SANITIZE_STRING);
            }

            if (!$reqToken)
            {
                $contents   = array ();

                parse_str (file_get_contents ('php://input'), $contents);

                if (isset ($contents['csrf']))
                {
                    $reqToken   = filter_var ($contents['csrf'], FILTER_SANITIZE_STRING);
                }
            }

            return $reqToken === $sessToken;
        }
        
        return false;
    }
    
    public static function generateToken ()
    {
        $sessToken  = self::getToken ();

        return $sessToken ? $sessToken : self::setToken ();
    }
    
    private static function getToken ()
    {
        return isset ($_SESSION['tokens']) && isset ($_SESSION['tokens']['csrf']) && is_string ($_SESSION['tokens']['csrf']) ? $_SESSION['tokens']['csrf'] : false;
    }
    
    private static function setToken ()
    {
        if (!isset ($_SESSION['tokens']))   { $_SESSION['tokens'] = array ();   }
        
        $_SESSION['tokens']['csrf'] = CryptoLib::randomString (256);
        
        return $_SESSION['tokens']['csrf'];
    }
}