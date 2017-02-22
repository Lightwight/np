<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/**

    @package ate
    @author CP - cpeters@gruen.net
    @copyright Christian Peters
    @license All rights reserved
    @version $Id$ 

*/
ini_set ('display_startup_errors',0);
error_reporting (0);

ini_set ('display_errors', 1);
ini_set ('display_startup_errors', 1);
error_reporting (E_ALL);

// Only for crawler test purposes:
//if ($_SERVER['HTTP_USER_AGENT'] !== 'NP-SEO-BOT')
//{
//    $_SERVER['HTTP_USER_AGENT'] = 'NP-SEO-BOT';
//    $_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 (compatible; Sosospider/2.0; +http://help.soso.com/webspider.htm)';
//}

if (stripos($_SERVER['REQUEST_METHOD'], 'HEAD') !== FALSE) {
    echo 'OK';
    exit();
}

require 'core/php/NP.core.php';

echo $np->resolve();
