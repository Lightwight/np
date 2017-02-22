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
 * set $config['env'] to 
 * 
 * a) 'development' if you are in development environment
 * b) 'live' if you are in live environment
 * 
 * Depending your setting the core will load single js and css files
 * for easier debugging possibilites in development environment or
 * compress js and css files to single files for a better performance
 * in live environment.
 */
$config['env']      = 'development';
//$config['env']      = 'live';

/*
 * set $config['test'] to
 * 
 * a) true, if you want to unit-test your progress
 * b) false, if you don't want to unit-test your progress
 */
$config['test']     = false;

$config['log']      = array 
(
    /*
     * set $config['log']['responseErrors'] to
     * 
     * a) true, if you want to log all response errors into the database
     * b) false, if you don't want to log all response errors into the database
     * 
     * response errors are i.e. 404
     */
    'responseErrors'    => false,
    
    /*
     * set $config['log']['sqlQueries'] to
     * 
     * a) true, if you want to log all sql-queries into the database
     * b) false, if you don't want to log all sql-queries into the database
     * 
     * note that the query for loggin a sql-query won't be logged
     */
    'sqlQueries'        => false
);

/*
 * set up $config['sql'] variables for your database connection
 */
$config['sql']      = array
(
    'host'          => '[YOUR_HOST]',
    'db'            => '[YOUR_DATABASE]',
    'user'          => '[YOUR_DATABASE_USERNAME]',
    'pass'          => '[YOUR_DATABASE_PASSWORD]',
    'lock_timeout'  => 60 
);

/*
 * set $config['OS'] to the runnig server os.
 * 
 * currently supported are
 * 
 * a) 'windows'
 * b) 'linux'
 * 
 * this is neccessary for the phantomjs-script
 */
$config['OS']   = 'linux';

/*
 * set $config['server']['domain'] to your web domain
 * 
 * i.e. https://www.yourdomain.com
 */
$config['server']   = array
( 
    'domain'    => 'https://www.yourdomain.com',
);

$config['client']   = array 
(
    /*
     * set $config['client']['mobileDetect'] to
     * 
     * a) true, if you want to detect mobile devices
     * b) false, if you don't want to detect mobile devices
     * 
     * if you choose a) then the custom folder 'mobile' will be
     * used for detected mobile devices. Otherwise the custom folder
     * 'desktop' will be used for all devices.
     */
    'mobileDetect'      => true,
    
    /*
     * set $sonfig['client']['forceMobileDetect'] to
     * 
     * a) true, if you want to force all devices detect as mobile devices.
     * b) false, if you don't want to force all devices detect as mobile devices.
     * 
     * If you choose a) then you must set $config['client']['mobileDetect'] to true,
     * otherwise the forceMobileDetect setting will be ignored.
     * 
     * This setting is still usefull if you want to test your mobile page on
     * a desktop browser. 
     * 
     */
    'forceMobileDetect' => false,

    /*
     * set $config['client']['tabletDetect'] to
     * 
     * a) true, if you want to detect tablet devices
     * b) false, if you don't want to detect tablet devices
     * 
     * if you choose a) then the custom folder 'tablet' will be
     * used for detected tablet devices. Otherwise the custom folder
     * 'desktop' will be used for all devices.
     */
    'tabletDetect'      => true,

    /*
     * set $sonfig['client']['forceTabletDetect'] to
     * 
     * a) true, if you want to force all devices detect as tablet devices.
     * b) false, if you don't want to force all devices detect as tablet devices.
     * 
     * If you choose a) then you must set $config['client']['tabletDetect'] to true,
     * otherwise the forceTabletDetect setting will be ignored.
     * 
     * This setting is still usefull if you want to test your tablet page on
     * a desktop browser. 
     * 
     */
    'forceTabletDetect' => false
);

$config['auth'] = array 
(
    /*
     * set up your confirmation link page.
     */
    'confirmation_link' => 'http://www.yourdomain.com/auth/register/confirmation/',
    
    /*
     * set up your password reset link page.
     */
    'pw_reset_link'     => 'http://www.yourdomain.com/auth/reset/password/',

    /*
     * set up your login page (not the link to your login page)
     */
    'page'                  => 'Login',

    /*
     * set up the default group of users which are visiting your page
     */
    'default_group'         => 'Visitor',
    
    /*
     * set up the default group for registered users
     */
    'registration_group'    => 'Customer'
);


/* TODO: Deprecated - remove */
$config['css']      = array
(
    'minify'    => true
);

/* TODO: Deprecated - remove */
$config['js']       = array
(
    'minify'    => false
);

$config['routes']   = array 
(
    /*
     * set up your default custom entry point
     */
    'custom'        => '/',
    
    /*
     * set up your default admin entry point
     */
    'admin'        => '/admin',
    
    /*
     * set up your default 404-page
     */
    'not_found'     => 'PageNotFound'
);

/*
 * set up your salt for password hashing
 */
$config['salt']     = 'mysalt';

/*
 * set up your dummy image. This image wil be used
 * for not existing images called by the browser.
 */
$config['dummies']  = array
(
    'image' => '/assets/images/placeholder/noimage.png'
);

/*
 * set up your smtp configuration
 */
$config['smtp']     = array
(
    'host'      => 'mail.hoster.net',
    'auth'      => true,
    'username'  => 'xyz@mail.net',
    'password'  => 'xyz',
    'secure'    => 'tls',
    'port'      => 587,
    
    'from'      => 'from@mail.net',
    'fromName'  => 'Your name in here',
    
    'signature' => array
    (
        'html'  => 'your signature in html',
        'plain' => 'your signature in plain text'
    ),
    
    // If in development mode, set delay as int for
    // the amount of seconds for the time of email send.
    'delay'    => 0
);

$config['session'] = array 
(
    'security_code'         => 'do a random sec code',
    'lock_to_user_agent'    => true,
    'lock_to_user_ip'       => false,
    'cookie_domain'         => '.yourdomain.com'
);

$config['bootstrap'] = array
(
    'layout'    => 'bootstrap.html'
);

// Content Security Policy configuration :
$config['CSP']  = array 
(
    'default-src'   => array 
    (
        "'self'"
    ),
    
    'script-src'    => array
    (
        "'self'",
        "'unsafe-inline'",
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/',
        'https://www.google.com/recaptcha/',
        'https://www.gstatic.com/recaptcha/',
        'https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/',
        "https://www.google-analytics.com/analytics.js 'unsafe-eval'",
        "https://maps.googleapis.com/ 'unsafe-eval'"
    ),
    
    'frame-src'     => array
    (
        "'self'",
        'https://www.google.com/',
        'https://maps.google.com/',
    ),
    
    'child-src'     => array
    (
        "'self'",
        'https://www.google.com/',
        'https://maps.google.com/',
    ),
    
    'style-src'     => array
    (
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com/'
    ),
    
    'font-src'      => array
    (
        "'self'",
        'https://fonts.gstatic.com/'
    ),
    
    'img-src'       => array
    (
        "'self'",
        'https://www.google-analytics.com/',
        'https://csi.gstatic.com/',
        'https://maps.gstatic.com/',
        'https://maps.googleapis.com/',
        'https://stats.g.doubleclick.net/',
        'https://mts.googleapis.com/',
        'data:'
    )
);

// Google recaptcha configuration:
$config['recaptcha']    = array
(
    'siteKey'   => '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
    'secretKey' => '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
    'hostname'  => 'yourdomain.com'
);

// homepage language configuration:
$config['language'] = array
(
    'default'       => 'DE', // set your default homepage language
    'autodetect'    => true  // set language detection by client browser preferred languages
);