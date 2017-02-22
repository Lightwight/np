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

class LogHelper 
{
    private static $instance                = null;
    private static $logPath                 = null;
    private static $logFile                 = null;
    
    private static $logResponseErrors       = false;
    
    public static function getInstance ()    
    { 
        if (self::$logPath === null)
        {
            $oConfig        = Config::getInstance ();
            $settings       = $oConfig->getSettings ();
            $localPath      = $oConfig->getPath ();
            
            self::$logResponseErrors    = isset ($settings['log']) && isset ($settings['log']['responseErrors']) && $settings['log']['responseErrors'] === true;
        }
        
        self::setupLogger ($localPath);
        
        return (self::$instance !== null) ? self::$instance : self::$instance = new self;
    }    
    
    private function __construct (){}
    private function __clone (){}
    
    private static function setupLogger ($path)
    {
        $fso    = new Fso ();
        
        $fso->mkdir ($path.'log');
        
        self::$logFile  = $path.'log/log.txt';
    }
    
    public function log ($message)
    {
        if (self::$logResponseErrors)
        {
            $fso        = new Fso ();
            $trace      = debug_backtrace ();
            $crlf       = "\r\n";
            
            $divider    = str_repeat ('=', 20).$crlf;
            $file       = str_pad ('File:', 10);
            $line       = str_pad ('Line:', 10);
            $log        = str_pad ('Log: ', 10).$message.$crlf;
            
            if (is_array ($trace) && count ($trace) > 0)
            {
                $file  .= $trace[0]['file'];
                $line  .= $trace[0]['line'];
            }
            
            $file      .= $crlf;
            $line      .= $crlf;
            
            $output     = $divider.$file.$line.$log.$divider;
            
            $fso->write (self::$logFile, $output);
        }
    }
}