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

class NPCookie 
{
    private static $connection;
    private static $code;
    private static $table;
    private static $lock_timeout;
    
    private static $domain;
    
    // Client fingerprint
    private static $cid             = false;
    
    private static $initialized     = false;
    private static $cookies_sent    = false;
    
    private static $cookies         = array ();
    
    private function __construct()  {}
    private function __clone ()     {} 
    
    public static function init ()
    {
        if (!self::$initialized)
        {
            $sql                = Sql::getInstance ();
            $config             = Config::getInstance ();
            $settings           = $config->getSettings ();
            
            ini_set ('session.cookie_httponly', 1);
            ini_set ('session.use_only_cookies', 1);

            self::$connection   = $sql->getConnection ();
            self::$code         = isset ($settings['session']['security_code']) ? $settings['session']['security_code'] : '6CbMr1#[-wZMuLdk,c,';
            self::$table        = 'cookies';
            self::$lock_timeout = 60;
            self::$domain       = isset ($settings['session']) && isset ($settings['session']['cookie_domain']) ? $settings['session']['cookie_domain'] : '';

            if (!self::$cid)
            {
                self::$cid      = filter_input (INPUT_GET, 'cid', FILTER_SANITIZE_NUMBER_INT);
            }

            if (!self::$cid)
            {
                self::$cid      = filter_input (INPUT_POST, 'cid', FILTER_SANITIZE_NUMBER_INT);
            }

            if (!self::$cid)
            {
                $contents   = array ();
                
                parse_str (file_get_contents ('php://input'), $contents);
                
                if (isset ($contents['cid']))
                {
                    self::$cid  = filter_var ($contents['cid'], FILTER_SANITIZE_NUMBER_INT);
                }
            }

            if (!isset ($_COOKIE['sessid']) || $_COOKIE['sessid'] !== session_id ())
            {
                self::$cid  = false;
            }

            // First run the garbage collector:
            self::gc ();
            
            self::$initialized  = true;
        }
    }
    
    private static function regenerateSession ()
    {
        // Hold last request time for concurrent ajax request handle (prevent system false hijacking flag):
        $lastRequest                = isset ($_SESSION['LAST_REQUEST']) ? $_SESSION['LAST_REQUEST'] : time ();
        $_SESSION['LAST_REQUEST']   = time ();

        // If last query is older than 5 seconds then we assume all ajax requests has been fired
        // Then the session has to be regenerated:
        if ($lastRequest < time () - 5)
        {
            // Regenerate Session and hold the old one for the concurrent ajax requests:
            session_regenerate_id (false);
//            session_regenerate_id (true);
            
            // Generate new session id and close both sessions for further usage
//            $newSession = session_id ();
//            session_write_close();

            // Set session ID to the new one, and start it back up again
//            session_id ($newSession);
//            session_start ();
        }
    }
    
    public static function sendCookies ()
    {
        if (!self::isACrawlerRequest ())
        {
            // Regenerate ID if not concurrency request (multiple requests)
            self::regenerateSession ();

            if (!self::$cookies_sent)
            {
                self::$cookies_sent = true;

                $cookies    = self::$cookies;

                foreach ($cookies as $name => $cookie)
                {
                    setcookie ('_'.$name, $cookie['cookie_id'], $cookie['expires'], '/', self::$domain, false, true);
                }
            }

            header ('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
            
            $_SESSION['SESSION_LOCKED'] = false;
        }
    }
    
    public static function setCookie ($name, $value, $expires = 60)
    {
        // Only proceed if initialized, the fingerprint was sent by the client
        // and the the corresponding cookie was sent by the client:
        if (self::$initialized && self::$cid)
        {
            // Prepare array for cookie ID Response if
            // not already done in updateCookie-method:
            if (!isset (self::$cookies[$name]))
            {
                self::$cookies[$name] = array 
                (
                    'cookie_id' => false,
                    'expires'   => $expires
                );
            }

            // Store cookie values in database:
            return self::saveCookie ($name, $value, (int)(time() + (int)$expires));
        }
        
        return false;
    }
    
    public static function getCookie ($name, $default_return = false)
    {
        // Only proceed if initialized, the fingerprint was sent by the client
        // and the the corresponding cookie was sent by the client:
        if (self::$initialized && self::$cid && self::validCookie ($name))
        {
            $dbCookies      = self::getDBCookies ($name);
            $dbCookie       = $dbCookies && count ($dbCookies) === 1 ? $dbCookies[0] : false;

            return $dbCookie ? unserialize ($dbCookie['cookie_data']) : $default_return;
        }
        
        return $default_return;
    }
    
    public static function deleteCookie ($name)
    {
        // Only proceed if initialized, the fingerprint was sent by the client
        // and the the corresponding cookie was sent by the client:
        if (self::$initialized && self::$cid && self::validCookie ($name))
        {
            $sql        = Sql::getInstance ();

            $cookie_id  = self::getCookieID ($name);

            $query      = 'DELETE FROM ';
            $query     .= '`'.self::$table.'` ';
            $query     .= 'WHERE ';
            $query     .=   '`cookie_id`="'.$cookie_id.'";';
            
            $sql->query ($query);
        }
    }
    
    public static function clientID ()
    {
        return self::$cid ? self::$cid : 0;
    }

    private static function saveCookie ($name, $value, $expires)
    {
        $cookie = self::postDBCookie ($name, $value, $expires);

        if ($cookie !== false)
        {
            self::$cookies[$name]['cookie_id']   = $cookie[0];
            self::$cookies[$name]['expires']     = $cookie[1];

            return true;
        }
        
        return false;
    }
    
    private static function postDBCookie ($name, $value, $expires)
    {
        $sql        = Sql::getInstance ();

        $cookie_id  = self::getCookieID ($name);
        $value      = $sql->real_escape_string (serialize ($value));

        $query  = 'INSERT INTO `'.self::$table.'` ';
        $query .= '(';
        $query .=   '`cookie_id`,';
        $query .=   '`cookie_name`,';
        $query .=   '`cookie_data`,';
        $query .=   '`cookie_expires`';
        $query .= ')';
        $query .= 'VALUES ';
        $query .= '(';
        $query .=   '"'.$cookie_id.'",';
        $query .=   '"'.$sql->real_escape_string ($name).'",';
        $query .=   '"'.$value.'",';
        $query .=   '"'.$expires.'"';
        $query .= ')';
        $query .= 'ON DUPLICATE KEY UPDATE ';
        $query .=   'cookie_data = "'.$value.'",';        
        $query .=   'cookie_expires = "'.$expires.'";';

        if (!isset ($_COOKIE['_'.$name]))   { $_COOKIE['_'.$name] = $cookie_id; }

        return $sql->query ($query, $name, self::$lock_timeout) !== false ? array ($cookie_id, $expires) : false;
    }
    
    private static function getDBCookies ($cookie_name)
    {
        $sql            = Sql::getInstance ();
        
        $cookie_name    = $sql->real_escape_string ($cookie_name);
        $cookie_id      = self::getCookieID ($cookie_name);

        $query  = 'SELECT ';
        $query .=   '`cookie_id`,';
        $query .=   '`cookie_name`,';
        $query .=   '`cookie_data`,';
        $query .=   '`cookie_expires` ';
        $query .= 'FROM ';
        $query .=   '`'.self::$table.'` ';
        $query .= 'WHERE ';
        $query .=   '`cookie_id` = "'.$cookie_id.'" ';
        $query .= 'AND ';
        $query .=   '`cookie_name` = "'.$cookie_name.'" ';
        $query .= 'AND ';
        $query .=   '`cookie_expires` > "'.time ().'";';

        return $sql->query ($query, $cookie_name, self::$lock_timeout);
    }
    
    private static function gc ()
    {
        $sql    = Sql::getInstance ();
        
        $query  = 'DELETE FROM ';
        $query .=   '`'.self::$table.'` ';
        $query .= 'WHERE ';
        $query .=   '`cookie_expires` < "'.time ().'";';

        $sql->query ($query);
    }
    
    private static function validCookie ($name)
    {
        return isset ($_COOKIE['_'.$name]) && $_COOKIE['_'.$name] === self::getCookieID ($name);
    }
    
    private static function getCookieID ($name)
    {
        return md5 (self::$cid.':'.$name.'/'.self::$code);
    }
    
    private static function isACrawlerRequest ()
    {
        $crawlerDetect  = new CrawlerDetect ();
        
        return $crawlerDetect->isCrawler ();
    }

}
