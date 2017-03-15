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

require_once $path.'plugins/checkout/php/CheckoutController.php';

class CartController extends ProductsHelper
{
    /*
     * add article to cart
     */
    public function postArticle ($article)
    {
        $ignoreStock    = $this->setting ('payment', 'ignoreStock');

        // First of all we need to compare the Article of the Client data
        // with the Article given in database.
        // This is neccessary to prevent hacking the article values
        // (i.e. the client user manipulated the article price)
        // and to confirm that the article values hasn't changed meanwhile:
        $article_id     = $article['article_id'];
        $product        = $this->getProductByArticleID ($article_id);

        if ($product)
        {
            $cart           = NPCookie::getCookie ('cart', array ());            
            
            $oversaleable   = $product['oversaleable'];
            $deliverable    = $product['deliverable'];
            
            $mProduct       = new Model ('Products', true);
            $cAmount        = isset ($cart[$article_id]) && isset ($cart[$article_id]['amount']) ? (int)$cart[$article_id]['amount'] : 0;
            
            $rAgio          = round ((float)$article['agio'], 2);
            $rPrice         = round ((float)$article['price'], 2);
            $rTax           = round ((float)$article['tax'], 2);
            $rAmount        = $article['amount'] + $cAmount;
            
            $uAgio          = round ($product['agio'], 2);
            $uPrice         = round ($product['price'], 2);
            $uTax           = round ($product['tax'], 2);
            $uStock         = $product['stock'];
            
            $dAgio          = round((float)$uAgio, 2);
            $dPrice         = round((float)$uPrice, 2);
            $dTax           = round ((float)$uTax, 2);
            $dStock         = $uStock;

            // Check if this article isnt affected by db-changes:
            $dChanges       = $product['changed'] = $rAgio !== $dAgio || $rPrice !== $dPrice || $rTax !== $dTax;

            // Check if the wished Amount is available:
            $available      = $product['available'] = !$oversaleable ? ($dStock) > 0 && (int)$dStock >= (int)$rAmount : $deliverable;

            // if no db changes and product is available
            // then add it/update it to/in cart (session)
            if (!$dChanges && $available)
            {
                $updated    = $this->updateCart ($product, $article_id, $uPrice, $uAgio, $uTax, $uStock, $rAmount);

                if (!$updated)  { return $this->getError (ErrorCodeHelper::$_SQL_ERROR_ON_UPDATE); }
            }

            $product['amount']  = (int)$rAmount;
            
            unset ($product['rank']);
            unset ($product['searched']);
            unset ($product['title']);
            
            $add    = array 
            (
                'product'           => $product,
                'cart'              => $this->getCart (),
                'delivery'          => $this->getDeliveryCosts (),
                'differsFromOrder'  => $this->differsFromOrder ()
            );

            $mProduct->add ($add);
            
            return $mProduct;
        }

        return $this->getError (ErrorCodeHelper::$_REQ_EMPTY_RESULT);
    }
    
    /*
     * Deprecated - used for JTL WaWi
     */
    public function postJTLArticle ($article)
    {
        $ignoreStock    = $this->setting ('payment', 'ignoreStock');

        // First of all we need to compare the Article of the Client data
        // with the Article given in database.
        // This is neccessary to prevent hacking the article values
        // (i.e. the client user manipulated the article price)
        // and to confirm that the article values hasn't changed meanwhile:
        $mArticles      = new Model ('Articles');
        $mVarVals       = new Model ('Article_variation_value');

        $article_id     = $article['article_id'];
                
        $resArticle     = $mArticles->findBy ('ArtikelNo', $article_id)->result ();
        $resVarVal      = $mVarVals->findBy ('ArtikelNr', $article_id)->result ();
        $product        = $this->getProductByArticleID ($article_id);

        if ($resArticle && $product)
        {
            $cart       = NPCookie::getCookie ('cart', array ());            

            $mProduct   = new Model ('Products', true);
            $cAmount    = isset ($cart[$article_id]) && isset ($cart[$article_id]['amount']) ? (int)$cart[$article_id]['amount'] : 0;
            
            $rAgio      = round ((float)$article['agio'], 2);
            $rPrice     = round ((float)$article['price'], 2);
            $rTax       = round ((float)$article['tax'], 2);
            $rAmount    = $article['amount'] + $cAmount;
            
            $uAgio      = $product['agio'] = $resVarVal ? round ($resVarVal->get ('Aufpreis'), 2) : 0;
            $uPrice     = round ($resArticle->get ('ArtikelVKNetto'), 2);
            $uTax       = round ($resArticle->get ('ArtikelMwSt'), 2);
            $uStock     = $resArticle->get ('ArtikelLagerbestand');
            
            $dAgio      = round((float)$uAgio, 2);
            $dPrice     = round((float)$uPrice, 2);
            $dTax       = round ((float)$uTax, 2);
            $dStock     = $resArticle->get ('ArtikelLagerbestand');

            // Check if this article isnt affected by db-changes:
            $dChanges   = $product['changed'] = $rAgio !== $dAgio || $rPrice !== $dPrice || $rTax !== $dTax;

            // Check if the wished Amount is available:
            $available  = $product['available'] = !$ignoreStock ? ($dStock) > 0 && (int)$dStock >= (int)$rAmount : $ignoreStock >= (int)$rAmount;

            // if no db changes and product is available
            // then add it/update it to/in cart (session)
            if (!$dChanges && $available)
            {
                $updated    = $this->updateCart ($article_id, $uPrice, $uAgio, $uTax, $uStock, $rAmount);

                if (!$updated)  { return $this->getError (ErrorCodeHelper::$_SQL_ERROR_ON_UPDATE); }
            }

            $product['amount']  = (int)$rAmount;
            
            unset ($product['rank']);
            unset ($product['searched']);
            unset ($product['title']);
            
            $add    = array 
            (
                'product'           => $product,
                'cart'              => $this->getCart (),
                'delivery'          => $this->getDeliveryCosts (),
                'differsFromOrder'  => $this->differsFromOrder ()
            );

            $mProduct->add ($add);
            
            return $mProduct;
        }

        return $this->getError (ErrorCodeHelper::$_REQ_EMPTY_RESULT);
    }
    
    public function updateArticle ($article)
    {
        $ignoreStock    = $this->setting ('payment', 'ignoreStock');
        
        // First of all we need to compare the Article of the Client data
        // with the Article given in database.
        // This is neccessary to prevent hacking the article values
        // (i.e. the client user manipulated the article price)
        // and to confirm that the article values hasn't changedd meanwhile:
        $article_id     = $article['article_id'];
        $product        = $this->getProductByArticleID ($article_id);

        if ($product)
        {
            $mProduct       = new Model ('Products', true);
            
            $oversaleable   = $product['oversaleable'];
            $deliverable    = $product['deliverable'];
            
            $rAgio          = round ((float)$article['agio'], 2);
            $rPrice         = round ((float)$article['price'], 2);
            $rTax           = round ((float)$article['tax'], 2);
            $rAmount        = (int)$article['amount'];
            
            $uAgio          = round ($product['agio'], 2);
            $uPrice         = round ($product['price'], 2);
            $uTax           = round ($product['tax'], 2);
            $uStock         = $dStock = $product['stock'];
            
            $dAgio          = round ((float)$uAgio, 2);
            $dPrice         = round ((float)$uPrice, 2);
            $dTax           = round ((float)$uTax, 2);
            
            // Check if this article isnt affected by db-changes:
            $dChanges       = $product['changed'] = $rAgio !== $dAgio || $rPrice !== $dPrice || $rTax !== $dTax;

            // Check if the wished Amount is available:
            $available      = $product['available'] = !$oversaleable ? ($dStock) > 0 && (int)$dStock >= (int)$rAmount : $deliverable;

            // if no db changes and product is available
            // then add it/update it to/in cart (session)
            if (!$dChanges && $available)
            {
                $updated    = $this->updateCart ($product, $article_id, $uPrice, $uAgio, $uTax, $uStock, $rAmount);

                if (!$updated)  { return $this->getError (ErrorCodeHelper::$_SQL_ERROR_ON_UPDATE); }
            }

            $product['amount']  = (int)$rAmount;

            unset ($product['rank']);
            unset ($product['searched']);
            unset ($product['title']);
            
            $add    = array 
            (
                'product'           => $product,
                'cart'              => $this->getCart (),
                'delivery'          => $this->getDeliveryCosts (),
                'differsFromOrder'  => $this->differsFromOrder ()
            );
            
            $mProduct->add ($add);
            
            return $mProduct;
        }

        return $this->getError (ErrorCodeHelper::$_REQ_EMPTY_RESULT);
    }
    
    public function removeArticle ($article_id)
    {
        $cart_articles  = NPCookie::getCookie ('cart', array ());

        if (isset ($cart_articles[$article_id]))
        {
            unset ($cart_articles[$article_id]);

            $removed    = NPCookie::setCookie ('cart', $cart_articles, 1209600);
            
            $mCheckout  = new Model ('Checkout', true);
            $mCheckout->add (array ('differsFromOrder' => $this->differsFromOrder()));
            
            return $removed ? $mCheckout->result () : $this->getError (ErrorCodeHelper::$_SQL_ERROR_ON_DELETE);
        }
        
        return $this->getError (ErrorCodeHelper::$_REQ_EMPTY_RESULT);
    }
    
    public function getCart ()
    {
        $products       = false;
        $cart           = NPCookie::getCookie ('cart', array ());
        $ignoreStock    = $this->setting ('payment', 'ignoreStock');
        
        if (count ($cart) > 0)
        {
            $sessProducts   = $cart;
            $products       = array ();
            
            foreach ($sessProducts as $articleID => $sessProduct)
            {
                $product    = $this->getProductByArticleID ($articleID);
                
                if ($product)
                {
                    $pPrice     = (float)$product['price'];
                    $pAgio      = isset ($product['agio']) ? (float)$product['agio'] : 0;
                    $pTax       = (float)$product['tax'];
                    $pStock     = (int)$product['stock'];

                    $sPrice     = (float)$sessProduct['price'];
                    $sAgio      = (float)$sessProduct['agio'];
                    $sTax       = (float)$sessProduct['tax'];
                    $sAmount    = (int)$sessProduct['amount'];

                    $product['changed']     = $pPrice !== $sPrice || $pAgio !== $sAgio || $pTax !== $sTax;
                    $product['available']   = !$ignoreStock ? $pStock > 0 && ($pStock-$sAmount) > 0 : $pStock > 0 && ($ignoreStock-$sAmount) > 0;
                    $product['amount']      = (int)$sAmount;
                    $product['gross']       = round ($product['price'] * (($product['tax'] / 100)+1), 2);

                    if ($product['changed'])
                    {
                        if ($pPrice !== $sPrice)    { $product['oldPice'] = $sessProduct['price'];  }
                        if ($pAgio !== $sAgio)      { $product['oldAgio'] = $sessProduct['agio'];   }
                        if ($pTax !== $sTax)        { $product['oldAgio'] = $sessProduct['tax'];    }
                    }

                    $products[] = $this->prepareForClientCart ($product);
                }
            }
        }

        return $products;
    }
    
    private function getDeliveryCosts ()
    {
        $ctrl       = new PaymentHelper ();
        $order      = $ctrl->getActiveOrder ();
        
        $cart       = NPCookie::getCookie ('cart');
        
        if ($order)
        {
            $isCod      = $order->get ('gateway') === 'cod' ? true : false;

            if ($isCod) { DeliveryHelper::setCOD (true);    }

            foreach ($cart as $article_id => $product) 
            {
                $mArticle       = new Model ('Articles');
                $mArtAttrs      = new Model ('Article_attributes');

                $resArticle     = $mArticle->findBy ('ArtikelNo', $article_id)->result ();
                $resArtAttrs    = $mArtAttrs->findBy ('article_id', $article_id)->findBy ('name', 'size')->result ();

                if ($resArticle && $resArtAttrs)
                {
                    $weight     = (float)$resArticle->get ('Gewicht');
                    $size       = (float)$resArtAttrs->get ('value');
                    $price      = $this->calcTotal ($product['price'], $product['agio'], $product['tax']);
                    $amount     = (int)$product['amount'];

                    for ($i=0; $i<$amount; $i++ ) {
                        DeliveryHelper::addToPackage ($article_id, $size, $weight, $price);
                    }
                }
            }

            return DeliveryHelper::calcPackage ();
        } else {
            return 0;
        }
    }

    private function updateCart ($product, $article_id, $uPrice, $uAgio, $uTax, $uStock, $amount)
    {
        $cart   = NPCookie::getCookie ('cart', array ());
        
        if (!isset ($cart[$article_id]))    { $cart[$article_id] = array ();            }
        
        $cart[$article_id]['price']         = $uPrice;
        $cart[$article_id]['agio']          = $uAgio;
        $cart[$article_id]['tax']           = $uTax;
        $cart[$article_id]['stock']         = $uStock;
        $cart[$article_id]['amount']        = $amount;
        $cart[$article_id]['time']          = time ();
        $cart[$article_id]['category']      = $product['category'];
        $cart[$article_id]['category_id']   = $product['category_id'];
        
        // Try to save cart for 14 Days:
        return NPCookie::setCookie ('cart', $cart, 1209600);
    }
    
    private function prepareForClientCart ($product)
    {
        if (isset ($product['rank']))       { unset ($product['rank']);     }
        if (isset ($product['searched']))   { unset ($product['searched']); }
        if (isset ($product['viewed']))     { unset ($product['viewed']);   }
        
        return $product;
    }
    
    public function differsFromOrder ()
    {
        $mProducts  = new Model ('Products');
        $ctrl       = new CheckoutController ();
        
        $ordered    = $ctrl->mapOrderedProducts ();
        $cart       = NPCookie::getCookie ('cart', array ());
        
        if (is_array ($ordered)) 
        {
            foreach ($ordered as $productID => $orderProduct)
            {
                $mProducts->orFindBy ('article_id', $productID);
            }
            
            $result = $mProducts->result ();
            
            if ($result && !is_array ($result)) { $result = array ($result);    }

            foreach ($result as $product)
            {
                $prID   = $product->get ('article_id');
                
                if (!array_key_exists ($prID, $cart) && (int)$product->get ('deleted') === 1)
                {
                    unset ($ordered[$prID]);
                }
            }
        }

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
    
    private function calcTotal ($netto, $agio, $tax, $amount = 1)
    {
        return round ((($netto + $agio)*$amount) * (($tax / 100)+1), 2);
    }
}