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

class CheckoutResolver extends ControllerHelper
{
    public function resolveParameters_get ($type)   {}
    
    public function resolveParameters_post ($type)
    {
        $contents   = array ();
        $parameters = array ();
        
        parse_str (file_get_contents ('php://input'), $contents);

        if (isset ($contents[$type]))
        {
            $parameters = $contents[$type];

            if (isset ($parameters['delivery']))
            {
                return $this->resolveDelivery ($parameters['delivery']);
            }
            else if (isset ($parameters['payment']))
            {
                return $this->resolvePayment ($parameters['payment']);
            }
            else if (isset ($parameters['confirm']))
            {
                return array ('checkout' => array ('confirm' => true));
            }
            else if (isset ($parameters['company']))
            {
                return $this->resolveCompany ($parameters['company']);
            }
            else if (isset ($parameters['address']))
            {
                return $this->resolveAddress ($parameters['address']);
            }
            else if (isset ($parameters['order']))
            {
                return $this->resolveOrder ($parameters['order']);
            }
            else if (isset ($parameters['cart']))
            {
                return $this->resolveCartArticle ($parameters['cart']);
            }
        }
    }
    
    private function resolveOrder ($parameters)
    {
        $checkout   = array ();

        $user       = isset ($parameters['user']) ? filter_var ($parameters['user'], FILTER_SANITIZE_STRING, FILTER_REQUIRE_ARRAY) : false;
        $company    = isset ($parameters['company']) ? filter_var ($parameters['company'], FILTER_SANITIZE_STRING, FILTER_REQUIRE_ARRAY) : false;

        $billing    = isset ($parameters['billing']) ? filter_var ($parameters['billing'], FILTER_SANITIZE_STRING, FILTER_REQUIRE_ARRAY) : false;
        $shipping   = isset ($parameters['shipping']) ? filter_var ($parameters['shipping'], FILTER_SANITIZE_STRING, FILTER_REQUIRE_ARRAY) : false;
        
        $uGender    = $user && isset ($user['gender']) && ($user['gender'] === 'male' || $user['gender'] === 'female') ? $user['gender'] : false;
        $uPrename   = $user && isset ($user['prename']) && strlen (trim ($user['prename'])) > 0 ? trim ($user['prename']): false;
        $uName      = $user && isset ($user['name']) && strlen (trim ($user['name'])) > 0 ? trim ($user['name']): false;
        $uEmail     = $user && isset ($user['email']) && strlen (trim ($user['email'])) > 0 ? filter_var (trim ($user['email']), FILTER_VALIDATE_EMAIL) : false;
        
        $cCompany   = $company && isset ($company['company']) && strlen (trim ($company['company'])) > 0 ? trim ($company['company']) : false;
        $cUstID     = $company && isset ($company['ustid']) && strlen (trim ($company['ustid'])) > 0 ? trim ($company['ustid']) : false;
        
        $bCountry   = $billing && isset ($billing['country']) && strlen (trim ($billing['country'])) > 0 ? trim ($billing['country']) : false;
        $bStreet    = $billing && isset ($billing['street']) && strlen (trim ($billing['street'])) > 0 ? trim ($billing['street']) : false;
        $bPostal    = $billing && isset ($billing['postal']) && strlen (trim ($billing['postal'])) > 0 ? trim ($billing['postal']) : false;
        $bCity      = $billing && isset ($billing['city']) && strlen (trim ($billing['city'])) > 0 ? trim ($billing['city']) : false;
        
        $sGender    = $shipping && isset ($shipping['gender']) && strlen (trim ($shipping['gender'])) > 0 ? trim ($shipping['gender']) : false;
        $sName      = $shipping && isset ($shipping['name']) && strlen (trim ($shipping['name'])) > 0 ? trim ($shipping['name']) : false;
        $sPrename   = $shipping && isset ($shipping['prename']) && strlen (trim ($shipping['prename'])) > 0 ? trim ($shipping['prename']) : false;
        $sCountry   = $shipping && isset ($shipping['country']) && strlen (trim ($shipping['country'])) > 0 ? trim ($shipping['country']) : false;
        $sStreet    = $shipping && isset ($shipping['street']) && strlen (trim ($shipping['street'])) > 0 ? trim ($shipping['street']) : false;
        $sPostal    = $shipping && isset ($shipping['postal']) && strlen (trim ($shipping['postal'])) > 0 ? trim ($shipping['postal']) : false;
        $sCity      = $shipping && isset ($shipping['city']) && strlen (trim ($shipping['city'])) > 0 ? trim ($shipping['city']) : false;
        
        if ($uGender || $uPrename ||$uName || $uEmail)
        {
            $checkout['user']   = array ();
            
            if ($uGender)   { $checkout['user']['gender'] = $uGender;   }
            if ($uPrename)  { $checkout['user']['prename'] = $uPrename; }
            if ($uName)     { $checkout['user']['name'] = $uName;       }
            if ($uEmail)    { $checkout['user']['email'] = $uEmail;     }
        }
        
        if ($cCompany || $cUstID)
        {
            $checkout['company']    = array ();
            
            if ($cCompany)  { $checkout['company']['company'] = $cCompany;  }
            if ($cUstID)    { $checkout['company']['ustid'] = $cUstID;      }
        }
        
        if ($bCountry || $bStreet || $bPostal || $bCity)
        {
            $checkout['billing']    = array ();
            
            if ($bCountry)  { $checkout['billing']['country'] = $bCountry;  }
            if ($bStreet)   { $checkout['billing']['street'] = $bStreet;    }
            if ($bPostal)   { $checkout['billing']['postal'] = $bPostal;    }
            if ($bCity)     { $checkout['billing']['city'] = $bCity;        }
        }
        
        if ($sCountry || $sStreet || $sPostal || $sCity)
        {
            $checkout['shipping']   = array ();
            
            if ($sGender)   { $checkout['shipping']['gender'] = $sGender;   }
            if ($sName)     { $checkout['shipping']['name'] = $sName;       }
            if ($sPrename)  { $checkout['shipping']['prename'] = $sPrename; }
            if ($sCountry)  { $checkout['shipping']['country'] = $sCountry; }
            if ($sStreet)   { $checkout['shipping']['street'] = $sStreet;   }
            if ($sPostal)   { $checkout['shipping']['postal'] = $sPostal;   }
            if ($sCity)     { $checkout['shipping']['city'] = $sCity;       }
        }

        return count ($checkout) > 0 ? array ('checkout' => array ('order' => $checkout)) : array ('checkout' => array ('order' => false));
    }
    
    private function resolveAddress ($parameters)
    {
        $result     = null;
        $address    = array ();
        $billing    = isset ($parameters['billing']) ? filter_var ($parameters['billing'], FILTER_SANITIZE_STRING, FILTER_REQUIRE_ARRAY) : false;
        $shipping   = isset ($parameters['shipping']) ? filter_var ($parameters['shipping'], FILTER_SANITIZE_STRING, FILTER_REQUIRE_ARRAY) : false;

        $bCountry   = $billing && isset ($billing['country']) ? trim (filter_var ($billing['country'], FILTER_SANITIZE_STRING)) : false;
        $bStreet    = $billing && isset ($billing['street']) ? trim (filter_var ($billing['street'], FILTER_SANITIZE_STRING)) : false;
        $bPostal    = $billing && isset ($billing['postal']) ? trim (filter_var ($billing['postal'], FILTER_SANITIZE_STRING)) : false;
        $bCity      = $billing && isset ($billing['city']) ? trim (filter_var ($billing['city'], FILTER_SANITIZE_STRING)) : false;
        
        $sGender    = $shipping && isset ($shipping['gender']) && $shipping['gender'] === 'female' ? 'female' : 'male';
        $sName      = $shipping && isset ($shipping['name']) ? trim (filter_var ($shipping['name'], FILTER_SANITIZE_STRING)) : false;
        $sPrename   = $shipping && isset ($shipping['prename']) ? trim (filter_var ($shipping['prename'], FILTER_SANITIZE_STRING)) : false;
        $sCountry   = $shipping && isset ($shipping['country']) ? trim (filter_var ($shipping['country'], FILTER_SANITIZE_STRING)) : false;
        $sStreet    = $shipping && isset ($shipping['street']) ? trim (filter_var ($shipping['street'], FILTER_SANITIZE_STRING)) : false;
        $sPostal    = $shipping && isset ($shipping['postal']) ? trim (filter_var ($shipping['postal'], FILTER_SANITIZE_STRING)) : false;
        $sCity      = $shipping && isset ($shipping['city']) ? trim (filter_var ($shipping['city'], FILTER_SANITIZE_STRING)) : false;
        
        if (!empty ($bCountry) || !empty ($bStreet) || !empty ($bPostal) || !empty ($bCity))
        {
            $address['billing']     = array ();
            
            if (!empty ($bCountry)) { $address['billing']['country']    = $bCountry;    }
            if (!empty ($bStreet))  { $address['billing']['street']     = $bStreet;     }
            if (!empty ($bPostal))  { $address['billing']['postal']     = $bPostal;     }
            if (!empty ($bCity))    { $address['billing']['city']       = $bCity;       }
        }
        
        if (!empty ($sCountry) || !empty ($sStreet) || !empty ($sPostal) || !empty ($sCity) || !empty ($sGender) || !empty ($sName) || !empty ($sPrename)) 
        {
            $address['shipping']    = array ();
            
            if (!empty ($sGender))  { $address['shipping']['gender']    = $sGender;     }
            if (!empty ($sName))    { $address['shipping']['name']      = $sName;       }
            if (!empty ($sPrename)) { $address['shipping']['prename']   = $sPrename;    }
            if (!empty ($sCountry)) { $address['shipping']['country']   = $sCountry;    }
            if (!empty ($sStreet))  { $address['shipping']['street']    = $sStreet;     }
            if (!empty ($sPostal))  { $address['shipping']['postal']    = $sPostal;     }
            if (!empty ($sCity))    { $address['shipping']['city']      = $sCity;       }
            
            $result  = array ('checkout' => array ('address' => $address));
        }
        
        return $result;
    }
    
    private function resolveCompany ($parameters)
    {
        $result     = null;
        
        $company    = isset ($parameters['company']) ? trim (filter_var ($parameters['company'], FILTER_SANITIZE_STRING)) : false;
        $ustid      = isset ($parameters['ustid']) ? trim (filter_var ($parameters['ustid'], FILTER_SANITIZE_STRING)) : false;
        
        if ($company && $ustid && !empty ($company) && !empty ($ustid))
        {
            $result = array
            (
                'checkout'  => array
                (
                    'company'   => array
                    (
                        'company'           => $company,
                        'ustid'             => $ustid
                    )
                )
            );
        }
        
        return $result;
    }
    
    private function resolveDelivery ($parameters)
    {
        $result     = null;
        
        $gateway    = isset ($parameters['gateway']) ? filter_var ($parameters['gateway'], FILTER_SANITIZE_MAGIC_QUOTES, FILTER_SANITIZE_FULL_SPECIAL_CHARS) : false;

        if ($gateway)
        {
            $result = array
            (
                'checkout'  => array
                (
                    'delivery'  => array
                    (
                        'gateway' => $gateway
                    )
                )
            );
        }
        
        return $result;
    }
    
    private function resolvePayment ($parameters)
    {
        $result     = null;

        $order      = isset ($parameters['order']) ? filter_var ($parameters['order'], FILTER_SANITIZE_STRING, FILTER_REQUIRE_ARRAY) : false;
        $user       = $order && isset ($order['user']) ? filter_var ($order['user'], FILTER_SANITIZE_STRING, FILTER_REQUIRE_ARRAY) : false;
        $company    = $order && isset ($order['company']) ? filter_var ($order['company'], FILTER_SANITIZE_STRING, FILTER_REQUIRE_ARRAY) : false;
        $billing    = $order && isset ($order['billing']) ? filter_var ($order['billing'], FILTER_SANITIZE_STRING, FILTER_REQUIRE_ARRAY) : false;
        $shipping   = $order && isset ($order['shipping']) ? filter_var ($order['shipping'], FILTER_SANITIZE_STRING, FILTER_REQUIRE_ARRAY) : false;
        $payment    = $order && isset ($order['payment']) && isset ($order['payment']['gateway']) ? trim (filter_var ($order['payment']['gateway'], FILTER_SANITIZE_SPECIAL_CHARS)) : false;        
        $iban       = $order && isset ($order['payment']) && isset ($order['payment']['iban']) ? trim (filter_var ($order['payment']['iban'], FILTER_SANITIZE_SPECIAL_CHARS)) : false;        
        $bic        = $order && isset ($order['payment']) && isset ($order['payment']['bic']) ? trim (filter_var ($order['payment']['bic'], FILTER_SANITIZE_SPECIAL_CHARS)) : false;
        $owner      = $order && isset ($order['payment']) && isset ($order['payment']['owner']) ? trim (filter_var ($order['payment']['owner'], FILTER_SANITIZE_SPECIAL_CHARS)) : false;
        $mref_date  = $order && isset ($order['payment']) && isset ($order['payment']['mandat_ref_date']) ? trim (filter_var ($order['payment']['mandat_ref_date'], FILTER_SANITIZE_STRING)) : false;
        $products   = $order && isset ($order['products']) ? filter_var ($order['products'], FILTER_SANITIZE_STRING, FILTER_REQUIRE_ARRAY) : false;

        if ($user && $billing && $shipping && $payment && strlen ($payment) > 0 && $products && count ($products) > 0)
        {            
            $id         = $this->loggedIn () ? $this->userID () : 0;

            $email      = isset ($user['email']) ? filter_var ($user['email'], FILTER_SANITIZE_EMAIL) : false;
            $email      = $email && strlen (trim ($email)) > 0 ? trim ($email) : false;
            
            $gender     = isset ($user['gender']) ? filter_var ($user['gender'], FILTER_SANITIZE_STRING): false;
            $gender     = $gender && strlen (trim ($gender)) > 0 ? trim ($gender) : false;
            
            $prename    = isset ($user['prename']) ? filter_var ($user['prename'], FILTER_SANITIZE_STRING) : false;
            $prename    = $prename && strlen (trim ($prename)) > 0 ? trim ($prename) : false;            
            
            $name       = isset ($user['name']) ? filter_var ($user['name'], FILTER_SANITIZE_STRING) : false;
            $name       = $name && strlen (trim ($name)) > 0 ? trim ($name) : false;            
            
            $compName    = isset ($company['company']) ? filter_var ($company['company'], FILTER_SANITIZE_STRING) : '';
            $compName    = $compName && strlen (trim ($compName)) > 0 ? trim ($compName) : '';                        
            
            $ustid      = isset ($company['ustid']) ? filter_var ($company['ustid'], FILTER_SANITIZE_STRING) : '';
            $ustid      = $ustid && strlen (trim ($ustid)) > 0 ? trim ($ustid) : '';                        

            $bCity      = isset ($billing['city']) ? filter_var ($billing['city'], FILTER_SANITIZE_STRING) : false;
            $bCity      = $bCity && strlen (trim ($bCity)) > 0 ? trim ($bCity) : false;                                    
            
            $bCountry   = isset ($billing['country']) ? filter_var ($billing['country'], FILTER_SANITIZE_STRING) : false;
            $bCountry   = $bCountry && strlen (trim ($bCountry)) > 0 ? trim ($bCountry) : false;                                    
            
            $bPostal    = isset ($billing['postal']) ? filter_var ($billing['postal'], FILTER_SANITIZE_STRING) : false;
            $bPostal    = $bPostal && strlen (trim ($bPostal)) > 0 ? trim ($bPostal) : false;                                    
            
            $bStreet    = isset ($billing['street']) ? filter_var ($billing['street'], FILTER_SANITIZE_STRING) : false;
            $bStreet    = $bStreet && strlen (trim ($bStreet)) > 0 ? trim ($bStreet) : false;                                    
            
            $sCity      = isset ($shipping['city']) ? filter_var ($shipping['city'], FILTER_SANITIZE_STRING) : false;
            $sCity      = $sCity && strlen (trim ($sCity)) > 0 ? trim ($sCity) : false;
            
            $sCountry   = isset ($shipping['country']) ? filter_var ($shipping['country'], FILTER_SANITIZE_STRING) : false;
            $sCountry   = $sCountry && strlen (trim ($sCountry)) > 0 ? trim ($sCountry) : false;
            
            $sPostal    = isset ($shipping['postal']) ? filter_var ($shipping['postal'], FILTER_SANITIZE_STRING) : false;
            $sPostal    = $sPostal && strlen (trim ($sPostal)) > 0 ? trim ($sPostal) : false;
            
            $sStreet    = isset ($shipping['street']) ? filter_var ($shipping['street'], FILTER_SANITIZE_STRING) : false;
            $sStreet    = $sStreet && strlen (trim ($sStreet)) > 0 ? trim ($sStreet) : false;

            $products   = $this->checkProducts ($products);

            $validData  = $products && $id !== false && $email && $gender && $prename && $name
                         && $bCity && $bCountry && $bPostal && $bStreet
                         && $sCity && $sCountry && $sPostal && $sStreet;

            if ($validData)
            {
                $result = array
                (
                    'checkout'  => array 
                    (
                        'payment'   => array
                        (
                            'user'  => array
                            (
                                'id'            => $id,
                                'email'         => $email,
                                'gender'        => $gender,
                                'prename'       => $prename,
                                'name'          => $name
                            ),
                            
                            'company'   => array
                            (
                                'company'       => $compName,
                                'ustid'         => $ustid
                            ),
                            
                            'billing'   => array 
                            (
                                'city'      => $bCity,
                                'country'   => $bCountry,
                                'postal'    => $bPostal,
                                'street'    => $bStreet
                            ),

                            'shipping'  => array
                            (
                                'city'      => $sCity,
                                'country'   => $sCountry,
                                'postal'    => $sPostal,
                                'street'    => $sStreet                                  
                            ),
                            
                            'products'          => $products,
                            'payment'           => $payment,
                            
                            'iban'              => $iban,
                            'bic'               => $bic,
                            'owner'             => $owner,
                            'mandat_ref_date'   => $mref_date
                        ),
                    )
                );
            }
        }

        return $result;
    }
    
    private function checkProducts ($products)
    {
        $postProducts   = count ($products);
        $foundProducts  = array ();

        foreach ($products as $product)
        {
            if (isset ($product['amount']) && count ((int)$product['amount']) > 0) 
            {
                $hasVariations  = isset ($product['selectedVariations']) && is_array ($product['selectedVariations']) && count ($product['selectedVariations']) > 0;

                if ($hasVariations)
                {
                    $variation          = $product['selectedVariations'][0];
                    $keys               = explode ('-', $variation);
                    $keyPorperty        = $keys[0];
                    $keyPorpertyValue   = $keys[1];

                    $mVarVals   = new Model ('Article_variation_value');
                    $resVarVals = $mVarVals->findBy ('KeyEigenschaft', $keyPorperty)->findBy ('KeyEigenschaftWert', $keyPorpertyValue)->result ();

                    if ($resVarVals && !is_array ($resVarVals) && strlen ($resVarVals->get ('ArtikelNr')) > 0)
                    {
                        $mArticle   = new Model ('Articles');
                        $resArticle = $mArticle->findBy ('ArtikelNo', $resVarVals->get ('ArtikelNr'))->result ();

                        if ($resArticle)
                        {
                            $foundProducts[]  = array 
                            (
                                'article_id'        => $resArticle->get ('ArtikelNo'),
                                'amount'            => (int)$product['amount'],
                                'price'             => $resArticle->get ('ArtikelVKNetto'),
                                'tax'               => $resArticle->get ('ArtikelMwSt'),
                                'ref_article_id'    => $product['article_id']
                            );
                        }
                    }
                    else 
                    {
                        // TODO: implement variation without ArticleNr.
                       $mArticle    = new Model ('Articles');
                       $resArticle  = $mArticle->findBy ('ArtikelNo', $product['article_id'])->result ();
                       
                       if ($resArticle && !is_array ($resArticle))
                       {
                            $foundProducts[]  = array 
                            (
                                'article_id'    => $resArticle->get ('ArtikelNo'),
                                'amount'        => (int)$product['amount'],
                                'price'         => $resArticle->get ('ArtikelVKNetto'),
                                'tax'           => $resArticle->get ('ArtikelMwSt')
                            );
                       }
                    }
                } else {
                    $mArticle    = new Model ('Products');
                    $resArticle  = $mArticle->findBy ('article_id', $product['article_id'])->result ();

                    if ($resArticle && !is_array ($resArticle))
                    {
                        $foundProducts[]  = array 
                        (
                            'article_id'    => $resArticle->get ('article_id'),
                            'amount'        => (int)$product['amount'],
                            'price'         => $resArticle->get ('price'),
                            'tax'           => $resArticle->get ('tax')
                        );
                    }
                }           
            }
        }

        return count ($products) > 0 && count ($products) === count ($foundProducts) ? $foundProducts : false;
    }
    
    private function resolveCartArticle ($cart)
    {
        
        $type           = isset ($cart['add']) ? 'add' : (isset ($cart['update']) ? 'update' : (isset ($cart['remove']) ? 'remove' : false));  

        if ($type)
        {
            $product        = $cart[$type];
            $article_id     = filter_var ($product['article_id'], FILTER_SANITIZE_STRING);
            
            if ($type !== 'remove')
            {
                $agio           = filter_var ($product['agio'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                $price          = filter_var ($product['price'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                $tax            = filter_var ($product['tax'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                $amount         = filter_var ($product['amount'], FILTER_SANITIZE_NUMBER_INT);
                
                if ($article_id !== false && $agio !== false && $price !== false && $tax !== false && $amount !== false && $amount > 0)
                {
                    return array
                    (
                        'checkout'  => array
                        (
                            $type  => array
                            (
                                'article_id'    => $article_id,
                                'agio'          => $agio,
                                'price'         => $price,
                                'tax'           => $tax,
                                'amount'        => $amount
                            )
                        )
                    );
                }
            }
            else if ($article_id !== false)
            {
                return array
                (
                    'checkout'  => array
                    (
                        $type  => array
                        (
                            'article_id'    => $article_id
                        )
                    )
                );
            }
        }
        
        return false;
    }
}