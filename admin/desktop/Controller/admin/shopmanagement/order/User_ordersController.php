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

class User_ordersController extends ControllerHelper implements ControllerInterface 
{
    public function getModel (\Model $model, $params) 
    {
        $orderID        = (int)$params > 0 ? (int)$params : false;
        $isAuthorized   = $this->isGroup (1);

        if ($isAuthorized && $orderID)
        {
            $mOrders    = new Model ('Orders');
            $mProducts  = new Model ('Products');
            
            $order      = $model
                    ->findBy ('id', $orderID)
                    ->clear ('bic')
                    ->clear ('client_id')
                    ->clear ('gateway_token')
                    ->clear ('iban')
                    ->clear ('payer_id')
                    ->clear ('token')
                    ->clear ('created_at')                    
                    ->result ();

            if ($order)
            {
                $resOrders      = $mOrders->findBy ('order_id', $order->get ('id'))->result ();
                $articles       = array ();
                $priceTotal     = 0;
                $deliveryCosts  = 0;

                foreach ($resOrders as $pKey => $resOrder)
                {
                    $resProduct = $mProducts
                                    ->leftJoin ('article_manufacturers', 'manufacturer_id', 'products', 'manufacturer_id', 'article_manufacturers', 'name', 'manufacturer')
                                    ->findBy ('article_id', $resOrder->get ('article_id'))
                                    ->clear ('agio')
                                    ->clear ('pack_unit')
                                    ->clear ('oversaleable')
                                    ->clear ('publish_date')
                                    ->clear ('searched')
                                    ->clear ('stock')
                                    ->clear ('tax')
                                    ->clear ('top_offer')
                                    ->clear ('viewed')
                                    ->clear ('price')
                                    ->result ();

                    if ($resProduct)
                    {
                        $article            = array_merge ($resProduct->getRow (), $resOrder->getRow ());
                        $article['price']   = $article['price_brutto'];
                        $priceTotal        += !$this->ignoreProduct ($article) ? $article['price'] : 0;

                        unset ($article['price_brutto']);

                        $articles[] = $article;
                    }
                    else if ($resOrder->get ('ref_article_id') === 'delivery')
                    {
                        $deliveryCosts  = $resOrder->get ('price_brutto');
                    }
                }

                $mOrders->resetResult ();
                $mProducts->resetResult ();

                $order->set ('total', $priceTotal);
                $order->set ('delivery_costs', $deliveryCosts);
                $order->set ('price_total', ($priceTotal + $deliveryCosts));
                $order->set ('articles', $articles);

                return $order;
            }  
        } 
        else if (!$orderID)
        {
            return $this->getError (ErrorCodeHelper::$_REQ_INVALID_ARGS);
        }
        return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
    }

    public function postModel (\Model $model)   {}

    public function updateModel(\Model $model)
    {
        $userOrder  = $model->result ();
                
        if ($this->isGroup (1))
        {
            $userOrder->set ('processing', $userOrder->get ('processing'));
            $userOrder->set ('delivered', $userOrder->get ('delivered'));
            $userOrder->set ('paid', $userOrder->get ('paid'));
            $userOrder->set ('done', $userOrder->get ('done'));
            
            return $userOrder->update ();
        }
        
        return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
    }
    
    public function deleteModel (\Model $model)         {}
    public function uploadFile (\Model $model, $file)   {}
    
    private function ignoreProduct ($article)
    {
        return (int)$article['enabled'] === 0 || (int)$article['deliverable'] === 0 || (int)$article['available'] === 0 || (int)$article['deleted'] === 1;
    }
}