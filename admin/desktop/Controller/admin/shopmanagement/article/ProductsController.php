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

class ProductsController extends ControllerHelper implements ControllerInterface 
{
    public function getModel (\Model $model, $params) 
    {
        if ($this->isGroup (1))
        {
            $params     = explode ('/', $params);
            $id         = (int)$params[0] > 0 ? (int)$params[0] : 0;
            
            $product    = $this->getProduct ($model, $id);
            
            if ($product)
            {
                $product->set ('payment_gateways', $this->getPayments ($product));
            }
            else
            {
                return array ();
            }
            
            return $product;
        }
        
        return $this->error ($this->AUTH_ERR_UNAUTHORIZED);
    }
    
    private function getProduct ($model, $id)
    {
        return $id > 0 ? $model->findBy ('ID', $id)->result () : false;        
    }
    
    private function getPayments ($product)
    {
        $gResult    = false;
        $articleID  = $product ? $product->get ('article_id') : -1;

        $mPayments  = new Model ('Article_payments');
        $mResult    = $mPayments
                        ->findBy ('article_id', $articleID)
                        ->result ();
        
        if (!$mResult)
        {
            $mGateways          = new Model ('Article_payment_gateways');
            $gResult            = $mGateways->result ();

            return $this->createPaymentsFromGateways ($gResult);
        }
        else 
        {
            return $this->createPaymentsFromPayments ($mResult);
        }
    }
    
    private function createPaymentsFromPayments ($payments)
    {
        $result = array ();
        
        if ($payments)
        {
            if (!is_array ($payments))  { $payments = array ($payments);    }
            
            foreach ($payments as $payment)
            {
                $result[$payment->get ('gateway_id')]   = $payment->get ('enabled');
            }
        }
        
        return $result;
    }

    private function createPaymentsFromGateways ($gateways)
    {
        $result = array ();
        
        if ($gateways)
        {
            foreach ($gateways as $gateway)
            {
                $result[$gateway->get ('gateway_id')]   = 1;
            }
        }
        
        return $result;
    }

    public function postModel (\Model $model)           
    {
        if ($this->isGroup (1))
        {
            $breadcrumb = new BreadcrumbController ();
            $slugify    = new \Cocur\Slugify\Slugify ();
            $row        = $model->result ();

            $articleID  = (int)$model->getNext ('article_id');
            $name       = $row->get ('name');
            $slugged    = $slugify->slugify ($name, '-');
            $bookmark   = '/product/'.$slugged;

            if ($articleID < 1000) { $articleID = 1000;   }        

            $breadcrumb->addBreadcrumb ($slugged, $name);

            $postID     = $model->add (array (
                            'name'              => $name,
                            'article_id'        => $articleID,
                            'bookmark'          => $bookmark,
                            'enabled'           => false
                        ))->result ()->post ();

            if ($postID)
            {
                return array 
                (
                    'id'                => $postID,
                    'article_id'        => $articleID
                );
            }

            return $this->error ($this->SQL_ERR_ON_POST);
        }        
    }
    
    public function updateModel (\Model $model)          
    {
        $row        = $model->result ();
        $breadcrumb = new BreadcrumbController ();
        
        $slugify    = new \Cocur\Slugify\Slugify ();
        $slug       = $slugify->slugify ($row->get ('name'), '-');
        $name       = $row->get ('name');
                
        // Article - user view
        $row->set ('image', $row->get ('image'));
        $row->set ('name', $name);
        $row->set ('bookmark', '/product/'.$slug);
        $row->set ('title', $row->get ('title'));
        $row->set ('description', $row->get ('description'));
        
        // Article - global settings
        $row->set ('is_new', $row->get ('is_new'));
        $row->set ('enabled', $row->get ('enabled'));
        $row->set ('deliverable', $row->get ('deliverable'));
        $row->set ('top_offer', $row->get ('top_offer'));
        $row->set ('oversaleable', $row->get ('oversaleable'));
        
        // Article - settings
        $row->set ('category_id', $row->get ('category_id'));
        $row->set ('unit_id', $row->get ('unit_id'));
        $row->set ('weight', $row->get ('weight'));
        $row->set ('weight_unit', $row->get ('weight_unit'));
        $row->set ('pack_unit', $row->get ('pack_unit'));
        $row->set ('tax', $row->get ('tax'));
        $row->set ('price', $row->get ('price'));
        
        // Article - payment gateways
        $this->saveArticlePaymentGateways ($row);
        
        // Article - manufacturer
        $row->set ('manufacturer_id', $row->get ('manufacturer_id'));
        $row->set ('han', $row->get ('han'));
        
        // Article - supplier
        $row->set ('supplier_id', $row->get ('supplier_id'));
        $row->set ('supplier_tax', $row->get ('supplier_tax'));
        $row->set ('supplier_ek', $row->get ('supplier_ek'));
        
        // Article - warehouse
        $row->set ('warehouse_id', $row->get ('warehouse_id'));
        $row->set ('stock', $row->get ('stock'));
        
        $breadcrumb->addBreadcrumb ($slug, $name);
        
        return $row->update ();
    }
    
    public function deleteModel (\Model $model)         {}
    
    private function saveArticlePaymentGateways ($product)
    {
        $articleID  = $product ? $product->get ('article_id') : false;
        
        $mPayments  = new Model ('Article_payments');
        $rPayments  = $mPayments->findBy ('article_id', $articleID)->result ();
        
        if ($rPayments)
        {
            $this->updateArticlePaymentGateways ($product, $rPayments);
        }
        else
        {
            $this->postArticlePaymentGateways ($product);
        }
    }
    
    private function postArticlePaymentGateways ($product)
    {
        $mPayments  = new Model ('Article_payments');
        $articleID  = $product ? $product->get ('article_id') : false;
        $gateways   = $product->get ('payment_gateways');

        foreach ($gateways as $gateway_id => $enabled)
        {
            $post   = array 
            (
                'article_id'    => $articleID,
                'gateway_id'    => (int)$gateway_id,
                'enabled'       => (int)($enabled) === 0 ? 0 : 1
            );

            $mPayments->add ($post)->result ()->post ();
        }
    }
    
    private function updateArticlePaymentGateways ($product, $payments)
    {
        $pGateways  = $product->get ('payment_gateways');
        
        foreach ($payments as $payment)
        {
            $gatewayID  = $payment->get ('gateway_id');
            $enabled    = isset ($pGateways[$gatewayID]) && (int)$pGateways[$gatewayID] === 0 ? 0 : 1;
            
            $payment->set ('enabled', $enabled)->update ();
        }
    }

    public function uploadFile (\Model $model, $file)   {}
}