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

$path   = getcwd ();
$path   = str_replace ('\\', '/', $path).'/';

if (strrpos ($path, '/') < strlen ($path)-1) { $path .= '/';    }

require_once $path.'plugins/checkout/php/CartController.php';
require_once $path.'plugins/checkout/php/PaymentHelper.php';
require_once $path.'plugins/checkout/php/DeliveryHelper.php';

class CheckoutController extends PaymentHelper
{
    private $code   = 'lEO0@^Z(!d*PUNCv';
            
    public function initPlugin ()       { return $this->getCheckout (); }
    public function getAddress ()       { return $this->getCheckout (); }
    public function getUser ()          { return $this->getCheckout (); }
    public function getVerification ()  { return $this->getCheckout (); }
    
    public function getPayment ($confirmation_code)   
    {
        $this->updatePayerID ($confirmation_code);

        return $this->getCheckout (); 
    }
    
    public function postOrder ($params)
    {
        $mCompany       = new Model ('User_companies');
        $mBilling       = new Model ('User_billings');
        $mShipping      = new Model ('User_shippings');

        $resCompany     = false;
        $resBilling     = false;
        $resShipping    = false;
        
        $uID            = 0;
        $uGender        = false;
        $uPrename       = false;
        $uName          = false;
        $uEmail         = false;
        
        $cCompany       = false;
        $cUstID         = false;
        
        $bCountry       = false;
        $bStreet        = false;
        $bPostal        = false;
        $bCity          = false;
        
        $sCountry       = false;
        $sStreet        = false;
        $sPostal        = false;
        $sCity          = false;
        
        $pGateway       = false;
        $pPayerID       = false;

        if ($this->loggedIn())
        {
            $resCompany     = $mCompany->findBy ('user_id', $this->userID ())->result ();
            $resBilling     = $mBilling->findBy ('user_id', $this->userID ())->result ();
            $resShipping    = $mShipping->findBy ('user_id', $this->userID ())->result ();
        }

        $currentOrder   = $this->getActiveOrder ();
        $newOrder       = false;
    
        $clientID       = $this->clientID ();

        $hasUser        = isset ($params['user']) && is_array ($params['user']) && count ($params['user']) > 0;
        $hasCompany     = isset ($params['company']) && is_array ($params['company']) && count ($params['company']) > 0;
        $hasBilling     = isset ($params['billing']) && is_array ($params['billing']) && count ($params['billing']) > 0;
        $hasShipping    = isset ($params['shipping']) && is_array ($params['shipping']) && count ($params['shipping']) > 0;
        $hasPayment     = isset ($params['payment']) && is_array ($params['payment']) && count ($params['payment']) > 0;

        $iban           = isset ($params['iban']) && !empty ($params['iban']) ? $params['iban'] : false;
        $bic            = isset ($params['bic']) && !empty ($params['bic']) ? $params['bic'] : false;
        $owner          = isset ($params['owner']) && !empty ($params['owner']) ? $params['owner'] : false;
        $mref_date      = isset ($params['mandat_ref_date']) && !empty ($params['mandat_ref_date']) ? $params['mandat_ref_date'] : false;

        $validOrder     = true;
   
        if ($hasUser)
        {
            $user       = $params['user'];

            $uID        = $this->loggedIn () ? $this->userID () : 0;
            $uGender    = isset ($user['gender']) ? $user['gender'] : false;
            $uPrename   = isset ($user['prename']) ? $user['prename'] : false;
            $uName      = isset ($user['name']) ? $user['name'] : false;
            $uEmail     = isset ($user['email']) ? $user['email'] : false;
            
            $newOrder   = array ();
            
            if ($uGender)   { $newOrder['gender'] = $uGender;   }
            if ($uPrename)  { $newOrder['prename'] = $uPrename; }
            if ($uName)     { $newOrder['name'] = $uName;       }
            if ($uEmail)    { $newOrder['email'] = $uEmail;     }
            
            if ($uGender || $uPrename || $uName || $uEmail) { $newOrder['user_id'] = $uID;  }

//            $this->updateAuthUser ($uGender, $uPrename, $uName);
        }

        if ($hasCompany)
        {
            $company    = $params['company'];
            
            $cCompany   = isset ($company['company']) ? $company['company'] : false;
            $cUstID     = isset ($company['ustid']) ? $company['ustid'] : false;
            
            if (!is_array ($newOrder))  { $newOrder = array (); }
            
            if ($cCompany)  { $newOrder['company'] = $cCompany; }
            if ($cUstID)    { $newOrder['ustid'] = $cUstID;     }

            if ($this->loggedIn () && !$resCompany) { $this->postCompany ($cCompany, $cUstID); }
        }

        if ($hasBilling)
        {
            $billing    = $params['billing'];
            
            $bCountry   = isset ($billing['country']) ? $billing['country'] : false;
            $bStreet    = isset ($billing['street']) ? $billing['street'] : false;
            $bPostal    = isset ($billing['postal']) ? $billing['postal'] : false;
            $bCity      = isset ($billing['city']) ? $billing['city'] : false;

            if (!is_array ($newOrder))  { $newOrder = array (); }
            
            if ($bCountry)  { $newOrder['billing_country'] = $bCountry; }
            if ($bStreet)   { $newOrder['billing_street'] = $bStreet;   }
            if ($bPostal)   { $newOrder['billing_postal'] = $bPostal;   }
            if ($bCity)     { $newOrder['billing_city'] = $bCity;       }

            if ($this->loggedIn () && !$resBilling) { $this->postBillingAddress ($billing); }
        }
                 
        if ($hasShipping)
        {
            $shipping   = $params['shipping'];
            
            $sGender    = isset ($shipping['gender']) ? $shipping['gender'] : false;
            $sName      = isset ($shipping['name']) ? $shipping['name'] : false;
            $sPrename   = isset ($shipping['prename']) ? $shipping['prename'] : false;
            $sCountry   = isset ($shipping['country']) ? $shipping['country'] : false;
            $sStreet    = isset ($shipping['street']) ? $shipping['street'] : false;
            $sPostal    = isset ($shipping['postal']) ? $shipping['postal'] : false;
            $sCity      = isset ($shipping['city']) ? $shipping['city'] : false;
            
            if (!is_array ($newOrder))  { $newOrder = array (); }
            
            if ($sGender)   { $newOrder['shipping_gender'] = $sGender;      }
            if ($sName)     { $newOrder['shipping_name'] = $sName;          }
            if ($sPrename)  { $newOrder['shipping_prename'] = $sPrename;    }
            if ($sCountry)  { $newOrder['shipping_country'] = $sCountry;    }
            if ($sStreet)   { $newOrder['shipping_street'] = $sStreet;      }
            if ($sPostal)   { $newOrder['shipping_postal'] = $sPostal;      }
            if ($sCity)     { $newOrder['shipping_city'] = $sCity;          }
            
            if ($this->loggedIn () && !$resShipping) { $this->postShippingAddress ($shipping);  }
        }

        if ($hasPayment)
        {
            $payment    = $params['payment'];

            $pGateway   = isset ($payment['gateway']) ? $payment['gateway'] : false;
            $pPayerID   = isset ($payment['payerID']) ? $payment['payerID'] : false;
            
            if (!is_array ($newOrder))  { $newOrder = array (); }
            
            if ($pGateway)              { $newOrder['gateway'] = $pGateway;     }
            if ($pPayerID)              { $newOrder['payer_id'] = $pPayerID;    }
        }

        if ($hasPayment && $pGateway && $pGateway === 'debit')
        {
            if ($iban && ($bic || $billing['country'] === 'Deutschland') && $owner && $mref_date)
            {
                $newOrder['iban']               = $iban;
                $newOrder['bic']                = $bic;
                $newOrder['owner']              = $owner;
                $newOrder['mandat_ref_date']    = $mref_date;
            }
            else
            {
                $validOrder         = false;
            }
        }

        if ($validOrder && is_array ($newOrder) && count ($newOrder) > 0)
        {
            if ($currentOrder)
            {
                if ($uGender && $uGender !== $currentOrder->get ('gender'))     { $currentOrder->set ('gender', $uGender);      }
                if ($uPrename && $uPrename !== $currentOrder->get ('prename') ) { $currentOrder->set ('prename', $uPrename);    }
                if ($uName && $uName !== $currentOrder->get ('name'))           { $currentOrder->set ('name', $uName);          }
                if ($uEmail && $uEmail !== $currentOrder->get ('email'))        { $currentOrder->set ('email', $uEmail);        }
                if ($uID && $uID !== $currentOrder->get ('user_id') && $currentOrder->get ('user_id') === 0)    { $currentOrder->set ('user_id', $uName);       }
                
                if ($cCompany && $cCompany !== $currentOrder->get ('company'))  { $currentOrder->set ('company', $cCompany);    }
                if ($cUstID && $cUstID !== $currentOrder->get ('ustid'))        { $currentOrder->set ('ustid', $cUstID);        }
                
                if ($bCountry && $bCountry !== $currentOrder->get ('billing_country'))  { $currentOrder->set ('billing_country', $bCountry);    }
                if ($bStreet && $bStreet !== $currentOrder->get ('billing_street'))     { $currentOrder->set ('billing_street', $bStreet);      }
                if ($bPostal && $bPostal !== $currentOrder->get ('billing_postal'))     { $currentOrder->set ('billing_postal', $bPostal);      }
                if ($bCity && $bCity !== $currentOrder->get ('billing_city'))           { $currentOrder->set ('billing_city', $bCity);          }
                
                if ($sGender && $sGender !== $currentOrder->get ('shipping_gender'))    { $currentOrder->set ('shipping_gender', $sGender);     }
                if ($sName && $sName !== $currentOrder->get ('shipping_name'))          { $currentOrder->set ('shipping_name', $sName);         }
                if ($sPrename && $sPrename !== $currentOrder->get ('shipping_prename')) { $currentOrder->set ('shipping_prename', $sPrename);   }
                if ($sCountry && $sCountry !== $currentOrder->get ('shipping_country')) { $currentOrder->set ('shipping_country', $sCountry);   }
                if ($sStreet && $sStreet !== $currentOrder->get ('shipping_street'))    { $currentOrder->set ('shipping_street', $sStreet);     }
                if ($sPostal && $sPostal !== $currentOrder->get ('shipping_postal'))    { $currentOrder->set ('shipping_postal', $sPostal);     }
                if ($sCity && $sCity !== $currentOrder->get ('shipping_city'))          { $currentOrder->set ('shipping_city', $sCity);         }
                
                if ($pGateway && $pGateway !== $currentOrder->get ('gateway'))          { $currentOrder->set ('gateway', $pGateway);            }
                if (($pPayerID || $pPayerID === '') && $pPayerID !== $currentOrder->get ('payer_id'))         { $currentOrder->set ('payer_id', $pPayerID);           }
                
                if ($iban && ($bic || $billing['country'] === 'Deutschland') && $owner && $mref_date)
                {
                    $currentOrder->set ('iban', $iban);
                    $currentOrder->set ('bic', $bic);
                    $currentOrder->set ('owner', $owner);
                    $currentOrder->set ('mandat_ref_date', $mref_date);
                }
                
                $currentOrder->set ('client_id', $clientID);
                
                $updated    = $currentOrder->update ();

                return $updated ? 1 : $this->getError (ErrorCodeHelper::$_SQL_ERROR_ON_UPDATE);
            }
            else
            {
                $mOrder     = new Model ('User_orders');
                $mOrder->add ($newOrder);

                $resOrder   = $mOrder->result ();
                
                $resOrder->set ('client_id', $clientID);
                
                $posted     = $resOrder->post ();

                return $posted ? 1 : $this->getError (ErrorCodeHelper::$_SQL_ERROR_ON_POST);
            }
        }

        return $this->getError (ErrorCodeHelper::$_PAYMENT_IVALID_PAYMENT_DATA);
    }
    
    public function postAddress ($params)
    {
        $hasBilling     = isset ($params['billing']) && is_array ($params['billing']) && count ($params['billing']) > 0;
        $hasShipping    = isset ($params['shipping']) && is_array ($params['shipping']) && count ($params['shipping']) > 0;
        
        if ($this->loggedIn ())
        {
            $billingPosted      = $hasBilling ? $this->postBillingAddress ($params['billing']) : true;
            $shippingPosted     = $hasShipping ? $this->postShippingAddress ($params['shipping']) : true;
            
            return $billingPosted && $shippingPosted;
        }
        
        return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
    }
    
    private function updateAuthUser ($gender, $prename, $name)
    {
        $curUser        = Auth::getUser ();

        $curGender      = trim ($curUser['gender']);
        $curPrename     = trim ($curUser['prename']);
        $curName        = trim ($curUser['name']);
        
        $hasGender      = !empty ($curGender);
        $hasPrename     = !empty ($curPrename);
        $hasName        = !empty ($curName);

        $uGender        = empty ($curGender) ? $gender : $curGender;
        $uPrename       = empty ($curPrename) ? $prename : $curPrename;
        $uName          = empty ($curName) ? $name : $curName;

        Auth::changeUser ($uPrename, $uName, $uGender);
    }
    
    private function postBillingAddress ($params)
    {
        $success            = false;
        $isNew              = false;

        $bCountry           = isset ($params['country']) ? $params['country'] : false;
        $bStreet            = isset ($params['street']) ? $params['street'] : false;
        $bPostal            = isset ($params['postal']) ? $params['postal'] : false;
        $bCity              = isset ($params['city']) ? $params['city'] : false;

        $userID             = $this->userID ();

        $mUserBillings      = new Model ('User_billings');
        $resUserBillings    = $mUserBillings->findBy ('user_id', $userID)->result ();

        if ($resUserBillings)
        {
            if (is_array ($resUserBillings))    { $resUserBillings = $resUserBillings[0];   }

            $mCheckoutBilling   = new Model ('Checkout_billings');
            $resChekoutBilling  = $mCheckoutBilling->findBy ('ID', $resUserBillings->get ('checkout_billing_id'))->result ();

            if ($resChekoutBilling)
            {
                if ($bCountry)  { $resChekoutBilling->set ('country', $bCountry); }
                if ($bStreet)   { $resChekoutBilling->set ('street', $bStreet);   }
                if ($bPostal)   { $resChekoutBilling->set ('postal', $bPostal);   }
                if ($bCity)     { $resChekoutBilling->set ('city', $bCity);       }

                $updated    = $resChekoutBilling->update ();
                $success    = $updated ? true : false;
            }                
        }
        else
        {
            $newUserBilling = array ();
            $newBilling     = array ();
            $isNew          = true;

            if ($bCountry)  { $newBilling['country']    = $bCountry;    }
            if ($bStreet)   { $newBilling['street']     = $bStreet;     }
            if ($bPostal)   { $newBilling['postal']     = $bPostal;     }
            if ($bCity)     { $newBilling['city']       = $bCity;       }

            if (count ($newBilling) > 0)
            {
                $mCheckoutBilling   = new Model ('Checkout_billings');

                $mCheckoutBilling->add ($newBilling);

                $newBilling     = $mCheckoutBilling->result ();
                $posted         = $newBilling->post ();

                if ($posted)
                {
                    $mUserBillings->add (array ('user_id' => $userID, 'checkout_billing_id' => $posted));
                    $newUserBilling     = $mUserBillings->result ();

                    $posted = $newUserBilling->post ();
                }

                $success    = $posted ? true : false;
            }
        }
        
        if ($success)
        {
            return 1;
        }
        
        $error  = new ErrorHandler (ErrorCodeHelper::$_SQL_SYNTAX_ERROR);
        
        return $error->getError ();
    }
    
    private function postShippingAddress ($params)
    {
        $success            = false;
        $isNew              = false;

        $sGender            = isset ($params['gender']) ? $params['gender'] : false;
        $sName              = isset ($params['name']) ? $params['name'] : false;
        $sPrename           = isset ($params['prename']) ? $params['prename'] : false;
        $sCountry           = isset ($params['country']) ? $params['country'] : false;
        $sStreet            = isset ($params['street']) ? $params['street'] : false;
        $sPostal            = isset ($params['postal']) ? $params['postal'] : false;
        $sCity              = isset ($params['city']) ? $params['city'] : false;

        $userID             = $this->userID ();

        $mUserShippings     = new Model ('User_shippings');
        $resUserShippings   = $mUserShippings->findBy ('user_id', $userID)->result ();

        if ($resUserShippings)
        {
            if (is_array ($resUserShippings))    { $resUserShippings = $resUserShippings[0];   }

            $mCheckoutShipping  = new Model ('Checkout_shippings');
            $resChekoutShipping = $mCheckoutShipping->findBy ('ID', $resUserShippings->get ('checkout_shipping_id'))->result ();

            if ($resChekoutShipping)
            {
                if ($sGender)   { $resChekoutShipping->set ('gender', $sGender);    }
                if ($sName)     { $resChekoutShipping->set ('name', $sName);        }
                if ($sPrename)  { $resChekoutShipping->set ('prename', $sPrename);  }
                if ($sCountry)  { $resChekoutShipping->set ('country', $sCountry);  }
                if ($sStreet)   { $resChekoutShipping->set ('street', $sStreet);    }
                if ($sPostal)   { $resChekoutShipping->set ('postal', $sPostal);    }
                if ($sCity)     { $resChekoutShipping->set ('city', $sCity);        }

                $updated    = $resChekoutShipping->update ();
                $success    = $updated ? true : false;
            } 
        }
        else
        {
            $newUserShipping    = array ();
            $newShipping        = array ();
            $isNew              = true;

            if ($sGender)   { $newShipping['gender']    = $sGender;     }
            if ($sName)     { $newShipping['name']      = $sName;       }
            if ($sPrename)  { $newShipping['prename']   = $sPrename;    }
            if ($sCountry)  { $newShipping['country']   = $sCountry;    }
            if ($sStreet)   { $newShipping['street']    = $sStreet;     }
            if ($sPostal)   { $newShipping['postal']    = $sPostal;     }
            if ($sCity)     { $newShipping['city']      = $sCity;       }

            if (count ($newShipping) > 0)
            {
                $mCheckoutShipping  = new Model ('Checkout_shippings');

                $mCheckoutShipping->add ($newShipping);

                $newShipping    = $mCheckoutShipping->result ();
                $posted         = $newShipping->post ();

                if ($posted)
                {
                    $newUserShipping    = array ('user_id' => $userID, 'checkout_shipping_id' => $posted);

                    $mUserShippings->add ($newUserShipping);
                    $newUserShipping    = $mUserShippings->result ();

                    $posted = $newUserShipping->post ();
                }

                $success    = $posted ? true : false;
            }
        }
        
        if ($success)
        {
            return 1;
        }
        
        $error  = new ErrorHandler (ErrorCodeHelper::$_SQL_SYNTAX_ERROR);
        
        return $error->getError ();
    }
    
    public function postCompany ($company, $ustid)
    {
        if ($this->loggedIn ())
        {
            $userID             = $this->userID ();
            $mUserCompanies     = new Model ('User_companies');
            $resCompanies       = $mUserCompanies->findBy ('user_id', $userID)->result ();
            $activeOrder        = $this->getActiveOrder ();
            
            if ($resCompanies)
            {
                $resCompanies->set ('company', $company);
                $resCompanies->set ('ustid', $ustid);
                
                $updated    = $resCompanies->update ();
                $success    = $updated ? true : false;
            }
            else
            {
                $newCompany = array ('user_id' => $userID, 'company' => $company, 'ustid' => $ustid);

                $mUserCompanies->add ($newCompany);
                
                $newCompany = $mUserCompanies->result ();
        
                $posted     = $newCompany->post ();

                $success    = $posted ? true : false;
            }
            
            return $success ? 1 : $this->getError (ErrorCodeHelper::$_REQ_INVALID_ARGS);
        }
        else if (!$this->loggedIn())
        {
            return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
        }
        
        return $this->getError (ErrorCodeHelper::$_REQ_EMPTY_RESULT);
    }
    
    public function confirmOrder ($dInfo = false, $gateway = false)
    {
        $map            = array ('dhl' => 'DHL', 'ups' => 'UPS', 'hermes' => 'Hermes');
        $order          = $this->getActiveOrder ();
        $deliveries     = $this->getDeliveryGateways ($order->get ('gateway') === 'cod');
        $delivery       = $order->get ('delivery');
        $gateway        = isset ($map[$delivery]) ? $map[$delivery] : false;
        $dInfo          = $gateway && isset ($deliveries[$gateway]) ? $deliveries[$gateway] : false;

        return parent::confirmOrder ($dInfo, $gateway);
    }
    
    public function setDelievery ($delivery)
    {
        $order  = $this->getActiveOrder ();

        $order->set ('delivery', $delivery);
        
        return $order->update ();
    }
    
    public function payPerPaypal_express ($user, $company, $billing, $shipping, $products)
    {
        $this->unsetMeta ('PayerID');

        $params = array
        (
            'user'      => $user,
            'company'   => $company,
            'billing'   => $billing,
            'shipping'  => $shipping,
            'payment'   => array ('payerID' => ''),
        );
        
        if ($this->postOrder ($params))
        {
            $mCheckout  = new Model ('Checkout', true);            
            $gateway    = $this->setPaymentGateway ($this->PAYMENT_GATEWAY_PAYPALEXPRESS);

            $gateway->setUser ($user);
            $gateway->setCompany ($company);
            $gateway->setBilling ($billing);
            $gateway->setShipping ($shipping);
            $gateway->setProducts ($products);
            
            $redirect               = $gateway->purchase ();
            
            $this->setDelievery ('dhl');
            
            $checkout               = $this->getCheckout ()->result ()->getRow ();
            $checkout['redirect']   = $redirect;
            
            $mCheckout->add ($checkout);
            
            return $mCheckout->result ();
        } 
        
        $this->getAddress (ErrorCodeHelper::$_REQ_INVALID_ARGS);
                
        return 0;
    }
    
    public function payPerCod ($user, $company, $billing, $shipping, $products)
    {
        $this->unsetMeta ('PayerID');
        
        $params = array
        (
            'user'      => $user,
            'company'   => $company,
            'billing'   => $billing,
            'shipping'  => $shipping,
            'payment'   => array ('payerID' => CryptoLib::randomString (10))
        );

        if ($this->postOrder ($params))
        {
            $mCheckout  = new Model ('Checkout', true);
            $gateway    = $this->setPaymentGateway ($this->PAYMENT_GATEWAY_COD);

            $gateway->setProducts ($products);
            
            $redirect               = $gateway->purchase ();
            
            $this->setDelievery ('dhl');
            
            $checkout               = $this->getCheckout ()->result ()->getRow ();
            $checkout['redirect']   = $redirect;

            $checkout['order']['payment']['gateway']   = 'cod';

            $mCheckout->add ($checkout);

            return $mCheckout->result ();
        }
        
        $this->getError (ErrorCodeHelper::$_REQ_INVALID_ARGS);

        return 0;
    }
    
    public function payPerDebit ($user, $company, $billing, $shipping, $products, $iban, $bic, $owner, $mref_date)
    {
        $code       = $this->setting ('payment', 'secure_code');
        
        if (!$code) { $code = $this->code;  }
        
        $this->unsetMeta ('PayerID');

        $params = array
        (
            'user'      => $user,
            'company'   => $company,
            'billing'   => $billing,
            'shipping'  => $shipping,
            'payment'   => array ('payerID' => CryptoLib::randomString (10), 'gateway' => 'debit')
        );
        
        if (!empty ($iban))
        {
            $params['iban']             = CryptoLib::encryptData ($iban, $code);
        }
        
        if (!empty ($bic))
        {
            $params['bic']              = CryptoLib::encryptData ($bic, $code);
        }
        
        if (!empty ($owner))
        {
            $params['owner']            = CryptoLib::encryptData ($owner, $code);
        }
        
        if (!empty ($mref_date))
        {
            $params['mandat_ref_date']  = $mref_date;
        }
        
        if ($this->postOrder ($params))
        {
            $mCheckout  = new Model ('Checkout', true);
            $gateway    = $this->setPaymentGateway ($this->PAYMENT_GATEWAY_DEBIT);

            $gateway->setProducts ($products);
            
            $redirect               = $gateway->purchase ();
            
            $this->setDelievery ('dhl');
            
            $checkout               = $this->getCheckout ()->result ()->getRow ();
            $checkout['redirect']   = $redirect;

            $checkout['order']['payment']['gateway']   = 'debit';

            $mCheckout->add ($checkout);

            return $mCheckout->result ();
        }
        
        $this->getError (ErrorCodeHelper::$_REQ_INVALID_ARGS);
        
        return 0;        
    }
    
    public function payPerBank_transfer ($user, $company, $billing, $shipping, $products)
    {
        $this->unsetMeta ('PayerID');
        
        $params = array
        (
            'user'      => $user,
            'company'   => $company,
            'billing'   => $billing,
            'shipping'  => $shipping,
            'payment'   => array ('payerID' => CryptoLib::randomString (10))
        );
        
        if ($this->postOrder ($params))
        {
            $mCheckout  = new Model ('Checkout', true);
            $gateway    = $this->setPaymentGateway ($this->PAYMENT_GATEWAY_BANK_TRANSFER);

            $gateway->setProducts ($products);

            $redirect               = $gateway->purchase ();

            $this->setDelievery ('dhl');

            $checkout               = $this->getCheckout ()->result ()->getRow ();
            $checkout['redirect']   = $redirect;

            $checkout['order']['payment']['gateway']   = 'bank_transfer';

            $mCheckout->add ($checkout);

            return $mCheckout->result ();
        }
        
        $this->getError (ErrorCodeHelper::$_REQ_INVALID_ARGS);
        
        return 0;
    }
    
    private function getCheckout ()
    {
        $cartController = new CartController ();
        $rspOrder       = array ();
        $rspSettings    = array ();
        $code           = $this->setting ('payment', 'secure_code');
        if (!$code)     { $code = $this->code;  }

        $order          = $this->getActiveOrder ();
        $cart           = $cartController->getCart ();

        if ($order)
        {
            $payer_id   = trim ($order->get ('payer_id'));
            $payGateway = $order->get ('gateway');
            $orderID    = $order->get ('id');
            $iban       = $order->get ('iban');
            $bic        = $order->get ('bic');
            $owner      = $order->get ('owner');
            $mref_date  = $order->get ('mandat_ref_date');
            
            if (!empty ($iban))
            {
                $iban   = CryptoLib::decryptData ($order->get ('iban'), $code);
            }
            
            if (!empty ($bic))
            {
                $bic    = CryptoLib::decryptData ($order->get ('bic'), $code);
            }
            
            if (!empty ($owner))
            {
                $owner  = CryptoLib::decryptData ($order->get ('owner'), $code);
            }

            $products       = $this->getOrderedProducts ();
            $availGateways  = $this->getAvailablePaymentGateways ($cart);
            
            $rspOrder       = array
            (
                'orderID'   => $orderID,
                'user'  => array
                (
                    'gender'    => $order->get ('gender'),
                    'name'      => $order->get ('name'),
                    'prename'   => $order->get ('prename'),
                    'email'     => $order->get ('email')
                ),
                
                'company'   => array
                (
                    'company'   => $order->get ('company'),
                    'ustid'     => $order->get ('ustid')
                ),
                
                'billing'   => array
                (
                    'country'   => $order->get ('billing_country'),
                    'city'      => $order->get ('billing_city'),
                    'postal'    => $order->get ('billing_postal'),
                    'street'    => $order->get ('billing_street')
                ),
                
                'shipping'  => array
                (
                    'gender'    => $order->get ('shipping_gender'),
                    'name'      => $order->get ('shipping_name'),
                    'prename'   => $order->get ('shipping_prename'),
                    'country'   => $order->get ('shipping_country'),
                    'city'      => $order->get ('shipping_city'),
                    'postal'    => $order->get ('shipping_postal'),
                    'street'    => $order->get ('shipping_street')
                ),
                
                'payment'   => array
                (
                    'gateway'           => $payGateway,
                    'iban'              => $iban,
                    'bic'               => $bic,
                    'owner'             => $owner,
                    'mandat_ref_date'   => $mref_date,
                    'verification'      => !empty ($payer_id) ? 1 : 0
                ),
                
                'gateways'          => $availGateways,
                'invalidGateway'    => $this->isInvalidGateway ($payGateway, $availGateways),
                
                'delivery'      => array
                (
                    'gateway'   => $order->get ('delivery')
                ),
                
                'delivery_gateways' => $this->getDeliveryGateways ($payGateway === 'cod'),
                
                'products'          => $products,
                'cartDiffers'       => $this->cartDiffersFromOrder ()
            );
        }
        
        if (Auth::loggedIn ())
        {
            $user           = Auth::getUser ();
            $userID         = $user['id'];
            
            $rspSettings    = array
            (
                'company'   => $this->getUserCompany ($userID),
                'billing'   => $this->getUserBillings ($userID),
                'shipping'  => $this->getUserShippings ($userID),
                'payment'   => array ('gateway' => 0),
                'delivery'  => array ('gateway' => '')
            );
        }
        
        $result         = new Model ('Checkout', true);
        
        $row            = array ();
        if (count ($rspOrder) > 0)      { $row['order'] = $rspOrder;        }
        if (count ($rspSettings) > 0)   { $row['settings'] = $rspSettings;  }
        if ($cart)                      { $row['cart'] = $cart;             }
        
        $result->add ($row);

        return $result;
    }    
    
    private function isInvalidGateway ($gateway, $gateways)
    {
        foreach ($gateways as $gValues)
        {
            if ($gValues['name'] === $gateway && $gValues['enabled'] === 0)
            {
                return true;
            }
        }
        
        return false;
    }
    
    private function getAvailablePaymentGateways ($products)
    {
        $mPaymentGateways   = new Model ('Article_payment_gateways');
        $resGateways        = $mPaymentGateways->result ();
        $arrGateways        = array ();

        if ($resGateways)
        {
            foreach ($resGateways as $gateway)
            {
                $arrGateways[$gateway->get ('gateway_id')]  = array
                (
                    'enabled'   => 1,
                    'prefix'    => $gateway->get ('prefix'),
                    'name'      => $gateway->get ('checkout_name'),
                    'plain'     => $gateway->get ('gateway_name')
                );
            }
        }
        
        if ($products && !is_array ($products))  { $products = array ($products);   }

        if ($products)
        {
            foreach ($products as $product)
            {
                $payments   = $this->getProductGateways ($product);

                foreach ($payments as $gateway_id => $enabled)
                {
                    $intEnabled = (int)$enabled;

                    if ($intEnabled === 0 && (!isset ($arrGateways[$gateway_id]) || $arrGateways[$gateway_id]['enabled'] === 1))
                    {
                        $arrGateways[$gateway_id]['enabled']    = 0;
                    }
                }
            }
        }
        
        return $arrGateways;
    }
    
    private function getProductGateways ($product)
    {
        $mPayments          = new Model ('Article_payments');
        $resPayments        = $mPayments->findBy ('article_id', $product['article_id'])->result ();
        $arrPayments        = array ();

        if ($resPayments)
        {
            if (!is_array ($resPayments))   { $resPayments = array ($resPayments);  }

            foreach ($resPayments as $payment)
            {
                $arrPayments[$payment->get ('gateway_id')]  = $payment->get ('enabled');
            }
        }
        else
        {
            $mGateways      = new Model ('Article_payment_gateways');
            $resGateways    = $mGateways->result ();

            if ($resPayments)
            {
                if (!is_array ($resGateways))   { $resGateways = array ($resGateways);  }

                foreach ($resGateways as $gateway)
                {
                    $arrPayments[$gateway->get ('gateway_id')]  = 1;
                }
            }
        }        

        return $arrPayments;
    }
    
    private function getUserCompany ($userID)
    {
        $result     = array ();
        $mCompany   = new Model ('User_companies');
        $resCompany = $mCompany->findBy ('user_id', $userID)->result ();

        if ($resCompany && !is_array ($resCompany))
        {
            $result = $resCompany->getRow ();
            
            unset ($result['user_id']);
            unset ($result['id']);
        }
        
        return count ($result) > 0 ? $result : 0;
    }
    
    private function getUserBillings ($userID)
    {
        $billings       = array ();
        
        $mUserBillings  = new Model ('User_billings');
        $resBillings    = $mUserBillings->findBy ('user_id', $userID)->result ();
        if ($resBillings && !is_array ($resBillings))   { $resBillings = array ($resBillings);  }

        if ($resBillings)
        {
            foreach ($resBillings as $billing)
            {
                $mCheckoutBillings  = new Model ('Checkout_billings');
                $resCheckoutBilling = $mCheckoutBillings->findBy ('id', $billing->get ('checkout_billing_id'))->result ();

                if ($resCheckoutBilling)
                {
                    $billings   = $resCheckoutBilling->getRow ();
                    unset ($billings['id']);
                    
                    break;
                }
            }
        }        
        
        return count ($billings) > 0 ? $billings : false;
    }
    
    private function getUserShippings ($userID)
    {
        $shippings      = array ();
        
        $mUserShippings = new Model ('User_shippings');
        $resShippings   = $mUserShippings->findBy ('user_id', $userID)->result ();
        
        if ($resShippings && !is_array ($resShippings)) { $resShippings = array ($resShippings);    }

        if ($resShippings)
        {
            foreach ($resShippings as $shipping)
            {
                $mCheckoutShippings     = new Model ('Checkout_shippings');
                $resCheckoutShipping    = $mCheckoutShippings->findBy ('id', $shipping->get ('checkout_shipping_id'))->result ();

                if ($resCheckoutShipping)
                {
                    $shippings  = $resCheckoutShipping->getRow ();
                    unset ($shippings['id']);
                    break;
                }
            }
        }        
        
        return count ($shippings) > 0 ? $shippings : false;
    }
    
    private function cartDiffersFromOrder ()
    {
        $ordered    = $this->mapOrderedProducts ();
        $cart       = NPCookie::getCookie ('cart', array ());
        $differs    = count ($ordered) !== count ($cart);
        
        foreach ($cart as $cArticle_id => $cProduct)
        {
            if (!isset ($ordered[$cArticle_id]) || $ordered[$cArticle_id]['amount'] !== $cProduct['amount']) 
            {
                $differs    = true;
                break;
            }
        }

        return $differs;
    }
    
    public function mapOrderedProducts ()
    {
        $ordered    = $this->getOrderedProducts ();

        $mapped     = array ();
        
        foreach ($ordered as $product)
        {
            $mapped[$product['article_id']] = array
            (
                'amount' => (int)$product['amount']
            );
        }
        
        return $mapped;
    }
    
    private function getDeliveryGateways ($isCod = false)
    {
        $order      = $this->getActiveOrder ();
        
        $cart       = NPCookie::getCookie ('cart');
        $isCod      = $order->get ('gateway') === 'cod' ? true : false;
        
        if ($isCod) { DeliveryHelper::setCOD (true);    }

//        if ($cart)
//        {
//            foreach ($cart as $article_id => $product) 
//            {
//                $mArticle       = new Model ('Articles');
//                $mArtAttrs      = new Model ('Article_attributes');
//
//                $resArticle     = $mArticle->findBy ('ArtikelNo', $article_id)->result ();
//                $resArtAttrs    = $mArtAttrs->findBy ('article_id', $article_id)->findBy ('name', 'size')->result ();
//
//                if ($resArticle && $resArtAttrs)
//                {
//                    $weight     = (float)$resArticle->get ('Gewicht');
//                    $size       = (float)$resArtAttrs->get ('value');
//                    $price      = $this->calcTotal ($product['price'], $product['agio'], $product['tax']);
//                    $amount     = (int)$product['amount'];
//
//                    for ($i=0; $i<$amount; $i++ ) {
//                        DeliveryHelper::addToPackage ($article_id, $size, $weight, $price);
//                    }
//                }
//            }
//        }

        return DeliveryHelper::calcPackage ();        
    }
    
    private function orderedProductsBySize ()
    {
        $products       = $this->getOrderedProducts ();
        
        usort ($products, function ($a, $b) {return $b['size']-$a['size'];});
        
        return $products;
    }
    
    private function calcTotal ($netto, $agio, $tax, $amount = 1)
    {
        return round ((($netto + $agio)*$amount) * (($tax / 100)+1), 2);
    }
}