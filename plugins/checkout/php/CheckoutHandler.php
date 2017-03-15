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

class CheckoutHandler extends HandlerHelper
{
    private static $instance    = null;
    
    private $method             = 'get';
    
    public static function getInstance($method)    { return ( self::$instance !== null )? self::$instance : self::$instance = new self ($method);    }    
    
    private function __construct ($method = 'get') {
        $this->method   = strtolower (substr ($method, 0, 1)).substr ($method, 1);
    }
    
    private function __clone(){}
    
    public function resolveCheckout ($params)
    {
        if( $this->method === 'get' )           { return $this->fetchCheckout ($params);    }
        else if( $this->method === 'post' )     { return $this->postCheckout ($params);     }
    }
    
    public function fetchCheckout ($params)
    {
        $controller     = new CheckoutController ();

        $result         = $controller->getCheckout ();
        
        return $this->prepareOutput ($result);
    }
    
    public function postCheckout ($params) 
    {
        $isPaymethod        = isset ($params['checkout']['payment']);
        $isDelivery         = isset ($params['checkout']['delivery']);
        $isConfirmation     = isset ($params['checkout']['confirm']);
        $isCompany          = isset ($params['checkout']['company']);
        $isAddress          = isset ($params['checkout']['address']);
        $isOrder            = isset ($params['checkout']['order']);
        $isAddToCart        = isset ($params['checkout']['add']);
        $isUpdateCart       = isset ($params['checkout']['update']);
        $isRemoveFromCart   = isset ($params['checkout']['remove']);

        if ($isPaymethod)
        {
            $params         = $params['checkout']['payment'];

            $user           = $params['user'];
            $billing        = $params['billing'];
            $shipping       = $params['shipping'];
            $company        = $params['company'];
            $products       = $params['products'];
            
            $iban           = $params['iban'];
            $bic            = $params['bic'];
            $owner          = $params['owner'];
            $mref_date      = $params['mandat_ref_date'];
                    
            $method         = $params['payment'];
            $method         = 'payPer'.strtoupper (substr ($method, 0, 1)).substr ($method, 1);

            $controller     = new CheckoutController ();
        
            $exists         = method_exists ($controller, $method);

            if ($exists)
            {
                $result         = $controller->$method ($user, $company, $billing, $shipping, $products, $iban, $bic, $owner, $mref_date);

                return $this->prepareOutput ($result);
            }
        }
        else if ($isDelivery)
        {
//            $controller     = new CheckoutController ();
//            $result         = $controller->setDelievery ($params['checkout']['delivery']['gateway']);
//            
//            return $this->prepareOutput ($result);
        }
        else if ($isConfirmation)
        {
            $controller = new CheckoutController ();
            $result     = $controller->confirmOrder ();
            
            return $this->prepareOutput ($result);
        }
        else if ($isCompany)
        {
            $controller = new CheckoutController ();
            $result     = $controller->postCompany ($params['checkout']['company']['company'], $params['checkout']['company']['ustid']);
            
            return $this->prepareOutput ($result);
        }
        else if ($isAddress)
        {
            $controller = new CheckoutController ();
            $result     = $controller->postAddress ($params['checkout']['address']);

            return $this->prepareOutput ($result);
        }
        else if ($isOrder)
        {
            $controller = new CheckoutController ();
            $result     = $controller->postOrder ($params['checkout']['order']);

            return $this->prepareOutput ($result);
        }
        else if ($isAddToCart)
        {
            $path   = getcwd ();
            $path   = str_replace ('\\', '/', $path).'/';

            if (strrpos ($path, '/') < strlen ($path)-1) { $path .= '/';    }

            require_once $path.'plugins/checkout/php/CartController.php';

            $controller = new CartController ();
            $result     = $controller->postArticle ($params['checkout']['add']);
            
            return $this->prepareOutput ($result);
        }
        else if ($isUpdateCart)
        {
            $path   = getcwd ();
            $path   = str_replace ('\\', '/', $path).'/';

            if (strrpos ($path, '/') < strlen ($path)-1) { $path .= '/';    }

            require_once $path.'plugins/checkout/php/CartController.php';

            $controller = new CartController ();
            $result     = $controller->updateArticle ($params['checkout']['update']);
            
            return $this->prepareOutput ($result);
        }
        else if ($isRemoveFromCart)
        {
            $path   = getcwd ();
            $path   = str_replace ('\\', '/', $path).'/';

            if (strrpos ($path, '/') < strlen ($path)-1) { $path .= '/';    }

            require_once $path.'plugins/checkout/php/CartController.php';

            $controller = new CartController ();
            $result     = $controller->removeArticle ($params['checkout']['remove']['article_id']);
            
            return $this->prepareOutput ($result);
        }
        
        return $this->getError (ErrorCodeHelper::$_REQ_INVALID_ARGS);
    }
}