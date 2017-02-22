<?php

/*
 * Copyright (C) 2015 cross
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Description of NPToken
 *
 * @author cross
 */
class NPCaptcha 
{
    private function __construct()  {}
    private function __clone ()     {} 

    public static function getCaptchaKey ()
    {
        $config         = Config::getInstance ();
        $setting        = $config->getSettings ();
        
        return array_key_exists ('recaptcha', $setting) && array_key_exists ('siteKey', $setting['recaptcha']) ? $setting['recaptcha']['siteKey'] : false;
    }
    
    public static function validateCaptcha ($captchaCode)
    {
        $config             = Config::getInstance ();
        $setting            = $config->getSettings ();
        
        $captchaSecretKey   = array_key_exists ('recaptcha', $setting) && array_key_exists ('secretKey', $setting['recaptcha']) ? $setting['recaptcha']['secretKey'] : false;
        $captchaHostName    = array_key_exists ('recaptcha', $setting) && array_key_exists ('hostname', $setting['recaptcha']) ? $setting['recaptcha']['hostname'] : false;
        $valid              = false;
        
        if (!isset ($_SESSION['recaptcha'][$captchaCode]))
        {
            $url                = 'https://www.google.com/recaptcha/api/siteverify?secret='.$captchaSecretKey.'&response='.$captchaCode;

            $curl               = curl_init ();

            curl_setopt ($curl, CURLOPT_URL, $url);
            curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt ($curl, CURLOPT_TIMEOUT, 15);
            curl_setopt ($curl, CURLOPT_SSL_VERIFYPEER, 1);
            curl_setopt ($curl, CURLOPT_SSL_VERIFYHOST, 2); 

            $result             = curl_exec ($curl);
            $verify             = json_decode ($result);

            curl_close ($curl);

            $valid  = $verify->success === true && $verify->hostname === $captchaHostName;
            
            $_SESSION['recaptcha'][$captchaCode]    = $valid;
        }
        else
        {
            $valid  = $_SESSION['recaptcha'][$captchaCode] === true;
        }


        if (isset ($_SESSION['recaptcha']) && is_array ($_SESSION['recaptcha']) && count ($_SESSION['recaptcha']) > 0)
        {
            foreach ($_SESSION['recaptcha'] as $key => $value)
            {
                if ($key !== $captchaCode)
                {
                    unset ($_SESSION['recaptcha'][$key]);
                }
            }
        }

        return $valid;
    }
}