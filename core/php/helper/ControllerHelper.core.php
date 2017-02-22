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

/*
 *  Say ty to: https://crackstation.net/hashing-security.htm#phpsourcecode
 * 
 * it solved the security implementation of hashing data (i.e. Registration Password)
 */

define ('PBKDF2_HASH_ALGORITHM', 'sha256');
define ('PBKDF2_ITERATIONS', 1000);
define ('PBKDF2_SALT_BYTE_SIZE', 24);
define ('PBKDF2_HASH_BYTE_SIZE', 24);

define ('HASH_SECTIONS', 4);
define ('HASH_ALGORITHM_INDEX', 0);
define ('HASH_ITERATION_INDEX', 1);
define ('HASH_SALT_INDEX', 2);
define ('HASH_PBKDF2_INDEX', 3);

class ControllerHelper extends HandlerHelper
{
    protected function meta ()
    {
        return (isset ($_SESSION['np_meta'])) && count ($_SESSION['np_meta']) > 0 ? $_SESSION['np_meta'] : false;
    }
    
    protected function unsetMeta ($key)
    {
        if (isset ($_SESSION['np_meta']) && isset ($_SESSION['np_meta'][$key]))
        {
            unset ($_SESSION['np_meta'][$key]);
        }
    }
    
    protected function pagination ($model, $total, $limit)
    {
        $_SESSION['pagination'][$model]['total']    = (int)$total;
        $_SESSION['pagination'][$model]['limit']    = (int)$limit;
    }

    protected function loggedIn ()  { return Auth::loggedIn ();     }
    protected function user ()      { return Auth::getUser ();      }
    
    protected function isGroup ($groupID)
    {
        $user   = Auth::getUser ();

        return is_array ($user) && isset ($user['group']) && (int)$user['group'] === (int)$groupID;
    }
    
    protected function userID ()    { return Auth::userID ();       }
    protected function clientID ()  
    {
        return NPCookie::clientID ();
        
        return $clientID !== 0 ? sha1 ($clientID) : 0; 
    }

    protected function setting ($config, $setting = null) 
    {
        $oConfig    = Config::getInstance();
        $settings   = $oConfig->getSettings();
        
        if ($setting) 
        {
            return isset ($settings[$config]) && isset ($settings[$config][$setting]) ? $settings[$config][$setting] : '';
        }
        else 
        {
            return isset ($settings[$config]) ? $settings[$config] : null;
        }
    }
    
    /*
     * Returns the hash of ZebraSession
     */
    protected function sessionHash ()
    {
        $sql        = Sql::getInstance ();
        $config     = Config::getInstance ();
        $settings   = $config->getSettings ();
        
        $secCode    = isset ($settings['session']['security_code']) ? $settings['session']['security_code'] : '6CbMr[-wZMuk,c,';
        $lToAgent   = isset ($settings['session']['lock_to_user_agent']) ? $settings['session']['lock_to_user_agent'] !== false : true;
        $lToIP      = isset ($settings['session']['lock_to_user_ip']) ? $settings['session']['lock_to_user_ip'] !== false : false;

        $hash       = '';

        // if we need to identify sessions by also checking the user agent
        if ($lToAgent && isset ($_SERVER['HTTP_USER_AGENT']))   
        {
            $hash .= $_SERVER['HTTP_USER_AGENT'];
        }

        // if we need to identify sessions by also checking the host
        if ($lToIP && isset ($_SERVER['REMOTE_ADDR']))
        {
            $hash .= $_SERVER['REMOTE_ADDR'];
        }

        // append this to the end
        $hash .= $secCode;
        
        return md5 ($sql->real_escape_string ($hash));
    }
    
    protected function mail ($to, $subject, $body, $altBody)
    {
        $config             = Config::getInstance();
        $settings           = $config->getSettings();
        $smtp               = isset ($settings['smtp']) ? $settings['smtp'] : false;

        $mailer             = new PHPMailer ();
        $mailer->CharSet    = 'UTF-8';
        $mailer->SMTPDebug  = isset ($smtp['debug']) && $smtp['debug'] === true;

        $host       = $smtp && isset ($smtp['host']) ? $smtp['host'] : false;
        $auth       = $smtp && isset ($smtp['auth']) ? $smtp['auth'] : true;
        $username   = $smtp && isset ($smtp['username']) ? $smtp['username'] : false;
        $password   = $smtp && isset ($smtp['password'])? $smtp['password'] : false;
        $secure     = $smtp && isset ($smtp['secure'])? $smtp['secure'] : 'tls';
        $port       = $smtp && isset ($smtp['port'])? $smtp['port'] : 587;
        $from       = $smtp && isset ($smtp['from'])? $smtp['from'] : false;
        $fromName   = $smtp && isset ($smtp['fromName'])? $smtp['fromName'] : 'Unknown';
        
        $signature  = $smtp && isset ($smtp['signature'])? $smtp['signature'] : false;
        $htmlSign   = $signature && isset ($signature['html'])? $signature['html'] : false;
        $plainSign  = $signature && isset ($signature['plain'])? $signature['plain'] : false;

        if ($host && $username && $password && $from)
        {
            $mailer->IsSMTP();

            $mailer->Host       = $host;
            $mailer->SMTPAuth   = true;
            $mailer->Username   = $username;
            $mailer->Password   = $password;
            $mailer->SMTPSecure = $secure;

            $mailer->Port       = $port;

            $mailer->From       = $from;
            $mailer->FromName   = $fromName;

            $mailer->addAddress ($to);

            $mailer->isHtml (true);

            $mailer->Subject    = $subject;
            $mailer->Body       = $body.($htmlSign ? '<br><br>_________________<br><br>'.'<div style="font-size:12px;">'.$htmlSign.'</div>' : '');
            $mailer->AltBody    = $altBody.($plainSign ? "\r\n\r\n".'_________________'."\r\n\r\n".$htmlSign : '');        
        }

        return $mailer->send () ? true : $this->error ($this->MAIL_ERR_SEND);
    }
    
    protected function hash ($value)
    {
        $oConfig    = Config::getInstance();
        $settings   = $oConfig->getSettings ();
        
        if (isset ($settings['env']) && $settings['env'] === 'development') 
        {
            return $value;
        }
        else
        {
            $salt = base64_encode (mcrypt_create_iv (PBKDF2_SALT_BYTE_SIZE, MCRYPT_DEV_URANDOM));
        
            return  PBKDF2_HASH_ALGORITHM.":".PBKDF2_ITERATIONS.":".$salt.":".base64_encode ($this->pbkdf2 (PBKDF2_HASH_ALGORITHM, $value, $salt, PBKDF2_ITERATIONS, PBKDF2_HASH_BYTE_SIZE, true));
        }
    }
    
    protected function validate_hash ($value, $hash)
    {
        $oConfig    = Config::getInstance();
        $settings   = $oConfig->getSettings ();
        
        if (isset ($settings['env']) && $settings['env'] === 'development') 
        {
            return $value === $hash;
        }
        else
        {
            $params     = explode (':', $hash);

            if( count ($params) < HASH_SECTIONS) { return false;    }

            $pbkdf2     = base64_decode ($params[HASH_PBKDF2_INDEX]);

            return $this->slow_equals(
                $pbkdf2,
                $this->pbkdf2 ($params[HASH_ALGORITHM_INDEX], $value, $params[HASH_SALT_INDEX], (int)$params[HASH_ITERATION_INDEX], strlen ($pbkdf2), true)
            );        
        }
    }
    
    protected function getRoute ()
    {
        $helper = RouteHandler::getInstance ();
        
        return $helper->getRoute ();
    }
    
    protected function getRouteID ()
    {
        $helper = RouteHandler::getInstance ();
        
        return $helper->getRouteID ();
    }

    protected function memory_limit ()
    {
        $val    = trim (ini_get ('memory_limit'));
        $last   = strtolower ($val[strlen ($val)-1]);
        $num    = (int)substr ($val, 0, strlen ($val)-1);

        switch ($last) 
        {
            case 'g':
                $num *= 1024;
            case 'm':
                $num *= 1024;
            case 'k':
                $num *= 1024;
        }
        
        return $num;
    }
    
    protected function query ($query)
    {
        $sql    = Sql::getInstance ();
        
        return $sql->query ($query);
    }
    
    protected function escape_string ($string)
    {
        $sql    = Sql::getInstance ();
        
        return $sql->real_escape_string ($string);
    }

    protected function validUploadableFileSize ($file)
    {
        //select maximum upload size
        $max_upload     = self::return_bytes (ini_get ('upload_max_filesize'));
        
        //select post limit
        $max_post       = self::return_bytes (ini_get ('post_max_size'));
        
        //select memory limit
        $memory_limit   = self::return_bytes (ini_get ('memory_limit'));
        
        // return the smallest of them, this defines the real limit
        $max            = min ($max_upload, $max_post, $memory_limit);
        $fSize          = isset ($file['size']) ? $file['size'] : $max + 1;
        $isError        = isset ($file['error']);
        
        return $max > $fSize || $isError;       
    }
    
    protected function validCaptcha ($captchaCode)
    {
        return NPCaptcha::validateCaptcha ($captchaCode);
    }

    private function pbkdf2 ($algorithm, $password, $salt, $count, $key_length, $raw_output = false)
    {
        $algorithm  = strtolower ($algorithm);
        
        if (!in_array ($algorithm, hash_algos(), true))
        {
            trigger_error('PBKDF2 ERROR: Invalid hash algorithm.', E_USER_ERROR);
        }
        
        if ($count <= 0 || $key_length <= 0)
        {
            trigger_error('PBKDF2 ERROR: Invalid parameters.', E_USER_ERROR);
        }

        if (function_exists("hash_pbkdf2")) {
            // The output length is in NIBBLES (4-bits) if $raw_output is false!
            if (!$raw_output) {
                $key_length = $key_length * 2;
            }
            
            return hash_pbkdf2($algorithm, $password, $salt, $count, $key_length, $raw_output);
        }

        $hash_length = strlen(hash($algorithm, "", true));
        $block_count = ceil($key_length / $hash_length);

        $output     = "";
        
        for($i = 1; $i <= $block_count; $i++) 
        {
            // $i encoded as 4 bytes, big endian.
            $last   = $salt.pack ("N", $i);
            
            // first iteration
            $last   = $xorsum = hash_hmac ($algorithm, $last, $password, true);
            
            // perform the other $count - 1 iterations
            for ($j = 1; $j < $count; $j++) 
            {
                $xorsum ^= ($last = hash_hmac($algorithm, $last, $password, true));
            }
            
            $output .= $xorsum;
        }

        if ($raw_output)    { return substr ($output, 0, $key_length);          }
        else                { return bin2hex (substr($output, 0, $key_length)); }
    }
    
    private function slow_equals ($a, $b)
    {
        $diff   = strlen ($a) ^ strlen ($b);
        
        for ($i = 0; $i < strlen ($a) && $i < strlen ($b); $i++)
        {
            $diff |= ord($a[$i]) ^ ord($b[$i]);
        }
        
        return $diff === 0;
    }
    
    private static function return_bytes ($val) 
    {
        $val    = trim ($val);
        $last   = strtolower ($val[strlen ($val)-1]);
        $num    = (int)substr ($val, 0, strlen ($val)-1);

        switch ($last) 
        {
            case 'g':
                $num *= 1024;
            case 'm':
                $num *= 1024;
            case 'k':
                $num *= 1024;
        }

        return $num;
    }
}