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

class PaymentHelper extends ControllerHelper
{
    protected $PAYMENT_GATEWAY_PAYPALEXPRESS    = 'PayPal_Express';
    protected $PAYMENT_GATEWAY_BANK_TRANSFER    = 'Bank_Transfer';
    protected $PAYMENT_GATEWAY_COD              = 'Cod';
    protected $PAYMENT_GATEWAY_DEBIT            = 'Debit';
    
    private $gateways   = array ('PayPal_Express', 'Bank_Transfer', 'Cod', 'Debit');
    
    private $gatewayHelper  = array
    (
        'paypal_express'    => 'PayPal_Express',
        'bank_transfer'     => 'Bank_Transfer',
        'cod'               => 'Cod',
        'debit'             => 'Debit'
    );
    
    protected function confirmOrder ($delivery = false, $delivery_gateway = false)
    {
        $cartController = new CartController ();
        $order          = $this->getActiveOrder ();
        $dPosted        = $this->postDelivery ($order->get ('id'), $delivery, $delivery_gateway);

        $orderMail      = $this->setting ('payment', 'email');

        $payer_id       = $order ? $order->get ('payer_id') : false;
        
        $isCOD          = $delivery ? $delivery['cod'] > 0 : false;
        $dCOD           = $delivery ? $delivery['cod'] : 0;
        $dTotal         = $delivery ? $delivery['total'] : 0;

        if ($dPosted && !$cartController->differsFromOrder () && $order && !empty ($payer_id))
        {
            $products           = $this->getOrderedProducts ();
            $paymentMap         = array ('paypal_express' => 'PayPal Express', 'bank_transfer' => 'Überweisung', 'cod' => 'Nachnahme', 'debit' => 'SEPA Lastschrift');

            $gateway            = $this->setPaymentGateway ($this->gatewayHelper[$order->get ('gateway')]);
            
            $data['token']      = $_GET['token']    = $order->get ('gateway_token');
            $data['payerID']    = $_GET['PayerID']  = $order->get ('payer_id');
            $data['amount']     = $gateway->getProductsTotal ();
            $data['currency']   = 'EUR';

            $response           = $gateway->completePurchase ($data);
            
            $mail               = $order->get ('email');
            $gender             = $order->get ('gender') === 'male' ? 'Herr' : 'Frau';
            $prename            = $order->get ('prename');
            $name               = $order->get ('name');
            $kdnr               = $order->get ('user_id') > 0 ? $order->get ('user_id') : 'Kein Kunde';
            $ordGateway         = $order->get ('gateway');

            $payment            = isset ($paymentMap[$ordGateway]) ? $paymentMap[$ordGateway] : 'Keine Angabe';

            $sh_gender          = $order->get ('shipping_gender') === 'male' ? 'Herr' : 'Frau';
            $sh_name            = $order->get ('shipping_name');
            $sh_prename         = $order->get ('shipping_prename');
            $sh_street          = $order->get ('shipping_street');
            $sh_postal          = $order->get ('shipping_postal');
            $sh_city            = $order->get ('shipping_city');
            $b_street           = $order->get ('billing_street');
            $b_postal           = $order->get ('billing_postal');
            $b_city             = $order->get ('billing_city');
            
            $title              = $gender === 'Herr' ? 'Lieber Herr ' : 'Liebe Frau ';
            
            $subject            = 'SHOP Bestellübersicht #'.$order->get ('id');
            
            $altBody            = 'Vielen Dank für Ihren Einkauf!'."\r\n\r\n";
            $altBody           .= $title.$name.','."\r\n\r\n";
            $altBody           .= 'Vielen Dank für Ihre Bestellung bei shop.de'."\r\n\r\n";
            $altBody           .= 'Nachfolgend haben wir zur Kontrolle die von Ihnen aufgegebene Bestellung aufgelistet.'."\r\n";
            $altBody           .= 'Bei Fragen, Unklarheiten oder Problemen zu Ihrer Bestellung rufen Sie uns bitte unter der Service-Nummer 0049 (0) 0254654 an oder'."\r\n";
            $altBody           .= 'antworten Sie einfach auf diese Nachricht.'."\r\n\r\n";
            $altBody           .= 'Mit freundlichen Grüßen'."\r\n\e\n";
            $altBody           .= 'Ihr Service-Team von shop.de'."\r\n\r\n\r\n\r\n";
            $altBody           .= 'Ihre bei uns gespeicherte Lieferadresse lautet:'."\r\n";
            $altBody           .= $sh_gender."\r\n";
            $altBody           .= $sh_prename.' '.$sh_name."\r\n";
            $altBody           .= $sh_street."\r\n";
            $altBody           .= $sh_postal.' '.$sh_city."\r\n\r\n";
            $altBody           .= 'Kundennummer:  '.$kdnr."\r\n";
            $altBody           .= 'Lieferservice: '.$delivery_gateway."\r\n";
            $altBody           .= 'Zahlungsart:   '.$payment."\r\n\r\n";
            $altBody           .= 'Ihre bei uns gespeicherte Rechnungsaddresse lautet:'."\r\n";
            $altBody           .= $gender."\r\n";
            $altBody           .= $prename.' '.$name."\r\n";
            $altBody           .= $b_street."\r\n";
            $altBody           .= $b_postal.' '.$b_city."\r\n\r\n";
            $altBody           .= 'Wir haben Ihre Bestellung wie folgt aufgenommen:'."\r\n\r\n";
            $altBody           .= 'Anzahl Artikelname Artikelnummer Preis (EUR)'."\r\n";
            
            $body               = '<b>Vielen Dank f&uuml;r Ihren Einkauf!</b><br><br>';
            $body              .= $title.$name.',<br><br>';
            $body              .= 'Vielen Dank f&uuml;r Ihre Bestellung bei shop.de<br><br>';
            $body              .= 'Nachfolgend haben wir zur Kontrolle die von Ihnen aufgegebene Bestellung aufgelistet.<br>';
            $body              .= 'Bei Fragen, Unklarheiten oder Problemen zu Ihrer Bestellung rufen Sie und bitte unter der Service-Nummer 0049 (0) 0254654 an oder<br>';
            $body              .= 'antworten Sie einfach auf diese Nachricht.<br><br>';
            $body              .= 'Mit freundlichen Gr&uuml;ßen<br><br>';
            $body              .= 'Ihr Service-Team von shop.de<br><br><br><br>';
            $body              .= 'Ihre bei uns gespeicherte Lieferadresse lautet:<br>';
            $body              .= $sh_gender.'<br>';
            $body              .= $sh_prename.' '.$sh_name.'<br>';
            $body              .= $sh_street.'<br>';
            $body              .= $sh_postal.' '.$sh_city.'<br><br>';
            $body              .= 'Kundennummer:  '.$kdnr.'<br>';
            $body              .= 'Lieferservice: '.$delivery_gateway.'<br>';
            $body              .= 'Zahlungsart:   '.$payment.'<br><br>';
            $body              .= 'Ihre bei uns gespeicherte Rechnungsaddresse lautet:<br>';
            $body              .= $gender.'<br>';
            $body              .= $prename.' '.$name.'<br>';
            $body              .= $b_street.'<br>';
            $body              .= $b_postal.' '.$b_city.'<br><br>';
            $body              .= 'Wir haben Ihre Bestellung wie folgt aufgenommen:<br><br>';
            $body              .= '<table>';
            $body              .=   '<tr>';
            $body              .=       '<th>Anzahl</th><th>Artikelname</th><th>Artikelnummer</th><th>Preis (EUR)</th>';
            $body              .=   '</tr>';
            
            $total              = 0;
            
            foreach ($products as $product)
            {
                $price          = $product['price'] + $product['agio'];
                $tax            = $product['tax'];
                $amount         = $product['amount'];
                $gross          = round (((1+($tax/100)) * $price), 2) * $amount;
                $total         += $gross;
                
                $altBody       .= $amount.' '.$product['name'].' '.$product['article_id'].' '.number_format ($gross, 2, ',', '.')."\r\n";
                
                $body          .= '<tr>';
                $body          .=   '<td>'.$amount.'</td><td>'.$product['name'].'</td><td>'.$product['article_id'].'</td><td>'.number_format ($gross, 2, ',', '.').'</td>';
                $body          .= '</tr>';
            }
            
            $altBody           .= "\r\n\r\n";
            $altBody           .= 'Warenwert in EUR: '.number_format ($total, 2, ',', '.')."\r\n";
            $altBody           .= 'Versandkosten in EUR: '.$dTotal."\r\n";
            
            if ($isCOD)
            {
                $altBody       .= 'Versandgebühren in EUR: '.number_format ($dCOD, 2, ',', '.')."\r\n";
            }
            
            $altBody           .= 'Gesamtkosten in EUR: '.number_format (($total+$dTotal+$dCOD), 2, ',', '.')."\r\n";
            
            $altBody           .= 'Alle Preise inkl. MwSt.'."\r\n\r\n";
            $altBody           .= 'Damit Ihre Ware so schnell wir möglich bei Ihnen ankommt, kann Ihre Bestellung aus mehreren'."\r\n";
            $altBody           .= 'Teilsendungen bestehen.'."\r\n\r\n";
            $altBody           .= 'Rücktrittsrecht'."\r\n";
            $altBody           .= 'Sie können innerhalb von 2 Wochen ab Erhalt der Ware ohne Angabe von Gründen vom Vertrag'."\r\n";
            $altBody           .= 'zurücktreten. Vom Rücktrittsrecht ausgenommen sind unter anderem gekennzeichnete Pools, Maß- und'."\r\n";
            $altBody           .= 'Sonderanfertigungen, bereits genutzte bzw. entsiegelte Artikel und Waren, die aufgrund ihrer Beschaffenheit'."\r\n";
            $altBody           .= 'nicht für eine Rücksendung geeignet sind. Weitere Einzelheiten dazu finden Sie in unseren AGB (Link http://www.shop.de/agb)'."\r\n\r\n";
            $altBody           .= 'Gewährleistung'."\r\n";
            $altBody           .= 'Die Gewährleistung erfolgt nach den gesetzlichen Bestimmungen (Gewährleistungsfrist 24 Monate ab'."\r\n";
            $altBody           .= 'Warenerhalt)';

            $body              .= '</table><br><br>';
            $body              .= 'Warenwert in EUR: '.number_format ($total, 2, ',' , '.').'<br>';
            
            $body              .= 'Versandkosten in EUR: '.number_format ($dTotal, 2, ',', '.').'<br>';

            if ($isCOD)
            {
                $body          .= 'Versandgeb&uuml;hren in EUR: '.number_format ($dCOD, 2, ',', '.').'<br>';
            }
            
            $body              .= 'Gesamtkosten in EUR: '.number_format (($total+$dTotal+$dCOD), 2, ',', '.').'<br>';
            
            $body              .= 'Alle Preise inkl. MwSt.<br><br>';
            $body              .= 'Damit Ihre Ware so schnell wir m&ouml;glich bei Ihnen ankommt, kann Ihre Bestellung aus mehreren<br>';
            $body              .= 'Teilsendungen bestehen.<br><br>';
            $body              .= '<b>R&uuml;cktrittsrecht</b><br>';
            $body              .= 'Sie k&ouml;nnen innerhalb von 2 Wochen ab Erhalt der Ware ohne Angabe von Gr&uuml;nden vom Vertrag<br>';
            $body              .= 'zur&uuml;cktreten. Vom R&uuml;cktrittsrecht ausgenommen sind unter anderem gekennzeichnete Pools, Ma&szlig;- und<br>';
            $body              .= 'Sonderanfertigungen, bereits genutzte bzw. entsiegelte Artikel und Waren, die aufgrund ihrer Beschaffenheit<br>';
            $body              .= 'nicht für eine R&uuml;cksendung geeignet sind. Weitere Einzelheiten dazu finden Sie in unseren AGB (Link <a href="http://www.shop.de/agb">AGB\'s</a>)<br><br>';
            $body              .= '<b>Gew&auml;hrleistung</b><br>';
            $body              .= 'Die Gew&auml;hrleistung erfolgt nach den gesetzlichen Bestimmungen (Gew&auml;hrleistungsfrist 24 Monate ab<br>';
            $body              .= 'Warenerhalt)';

            $mailedToService    = $this->mail ($orderMail, '(Customer order) '.$subject, $body, $altBody);
            $mailedToCustomer   = $this->mail ($mail, $subject, $body, $altBody);
            
            if ($mailedToService !== true)
            {
                $this->saveError ($order->get ('id'), 'Mail to Service <'.$orderMail.'> failed: '.$mailedToService->getError ());
                
                $order->set ('error', 1);
            }
            
            if ($mailedToCustomer !== true)
            {
                $this->saveError ($order-get ('id'), 'Mail to Customer <'.$mail.'> failed: '.$mailedToCustomer->getError ());
                
                $order->set ('error', 1);
            }
            
            if ($response->isSuccessful ())
            {
                NPCookie::deleteCookie ('cart');

                $order->set ('confirmed', 1);
                $order->set ('confirmed_at', date ('Y-m-d H:i:s', time ()));

                return $order->update ();    
            }
            else
            {
                $error      = $response->getMessage ();
                $errType    = strpos ($error, 'exceeded the maximum number of payment') !== false ? $this->PAY_ERR_TOO_MANY_TOKEN_REQUESTS : $this->PAY_ERR_INVALID_ARGS;
                
                $this->saveError ($order->get ('id'), $response->getMessage ());

                return $this->getError (ErrorCodeHelper::$_PAYMENT_TOO_MANY_TOKEN_REQUESTS);
            }        
        }
        
        return $this->getError (ErrorCodeHelper::$_REQ_EMPTY_RESULT);
    }
    
    protected function deleteActiveOrder ()
    {
        $order          = $this->getActiveOrder ();
        $deleted        = true;

        if ($order)
        {
            $orderID        = $order->get ('id');
            $mOrders        = new Model ('Orders');
            $mUserOrders    = new Model ('User_orders');

            $resOrders      = $mOrders->findBy ('order_id', $orderID)->result ();
            $resUserOrders  = $mUserOrders->findBy ('id', $orderID)->result ();
            

            if ($resUserOrders)
            {
                if (is_array ($resUserOrders))
                {
                    foreach ($resUserOrders as $manipUserOrder)
                    {
                        $manipUserOrder->set ('deleted', 1);
                        
                        if (!$manipUserOrder->updated () && $deleted) 
                        {
                            $deleted    = false;
                        }
                    }
                }
                else
                {
                    $resUserOrders->set ('deleted', 1);
                    
                    if (!$resUserOrders->update () && $deleted)
                    {
                        $deleted    = false;
                    }
                }
            }

            if ($resOrders)
            {
                if (is_array ($resOrders))
                {
                    foreach ($resOrders as $manipOrder)
                    {
                        $manipOrder->set ('deleted', 1);
                        
                        if (!$manipOrder->update () && $deleted)
                        {
                            $deleted    = false;
                        }
                    }
                }
                else
                {
                    $resOrders->set ('deleted', 1);
                    
                    if (!$resOrders->update () && $deleted)
                    {
                        $deleted    = false;
                    }
                }
            }
        }

        return $deleted;
    }

    protected function refund ()
    {
        $order      = $this->getActiveOrder ();
        $gateway    = $order->get ('gateway');
        
        if (array_key_exists ($gateway, $this->gatewayHelper))
        {
            $method     = 'prepare'.$this->gatewayHelper[$gateway];

            $oGateway   = $this->$method ();
            
            $oGateway->refund ();
        }
    }
    
    protected function setPaymentGateway ($gateway)
    {
        if (in_array ($gateway, $this->gateways))
        {
            $method = 'prepare'.$gateway;

            return $this->$method ();
        }
    }
    
    protected function updatePayerID ($internalToken)
    {
        $order      = $this->getActiveOrder ('token', $internalToken);
        $payer_id   = $order ? $order->get ('payer_id') : '';

        if ($order && empty ($payer_id))
        {
            $gateway    = $order->get ('gateway');
            
            if (array_key_exists ($gateway, $this->gatewayHelper))
            {

                $method     = 'prepare'.$this->gatewayHelper[$gateway];

                $oGateway   = $this->$method ();

                return $oGateway->updatePayerID ($order);
            }
        }
        
        return $order && !empty ($payer_id);
    }

    public function getOrderedProducts ()
    {
        $userOrder      = $this->getActiveOrder ();
        $products       = array ();

        if ($userOrder)
        {
            $mOrders    = new Model ('Orders');
            $resOrders  = $mOrders->findBy ('order_id', $userOrder->get ('id'))->findBy ('deleted', 0)->result ();

            if ($resOrders && !is_array ($resOrders)) { $resOrders = array ($resOrders);  }
           
            if ($resOrders)
            {
                foreach ($resOrders as $resOrder) 
                {
                    $mProduct       = new Model ('Products', true);
                    $mArticle       = new Model ('Articles');
                    $mArticleRel    = new Model ('Article_variation_value', true);
                    $mAttr          = new Model ('Article_attributes');
                    
                    if (strlen ($resOrder->get ('ref_article_id')) > 0)
                    {
                        $resProduct     = $mProduct->findBy ('article_id', $resOrder->get ('ref_article_id'))->result ();
                        $resArticle     = $mArticle->findBy ('ArtikelNo', $resOrder->get ('ref_article_id'))->result ();
                        $resArticleRel  = $mArticleRel->findBy ('ArtikelNr', $resOrder->get ('ref_article_id'))->result ();
                        $resAttr        = $mAttr->findBy ('article_id', $resOrder->get ('ref_article_id'))->findBy ('name', 'size')->result ();
                    }
                    else
                    {
                        $resProduct     = $mProduct->findBy ('article_id', $resOrder->get ('article_id'))->result ();
                        $resArticle     = $mArticle->findBy ('ArtikelNo', $resOrder->get ('article_id'))->result ();
                        $resArticleRel  = $mArticleRel->findBy ('ArtikelNr', $resOrder->get ('article_id'))->result ();
                        $resAttr        = $mAttr->findBy ('article_id', $resOrder->get ('article_id'))->findBy ('name', 'size')->result ();
                    }

                    if ($resProduct)
                    {
                        $mCategories        = new Model ('Product_categories');
                        $resCategory        = $mCategories->findBy ('product_id', $resProduct->get ('id'))->result ();

                        if ($resCategory)
                        {
                            $resProduct->set ('category_id', $resCategory->get ('category_id'));
                        }
                        
                        $mPayments          = new Model ('Article_payments');
                        $resPayments        = $mPayments->findBy ('article_id', $resProduct->get ('article_id'))->result ();
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

                        $product                        = $resProduct->getRow (); 
                        $product['amount']              = $resOrder->get ('amount');
                        $product['weight']              = $resArticle ? $resArticle->get ('Gewicht') : 1;
                        $product['size']                = $resAttr ? $resAttr->get ('value') : 5;
                        $product['agio']                = $resArticleRel ? $resArticleRel->get ('Aufpreis') : 0;
                        $product['payment_gateways']    = $arrPayments;
                        
                        $products[]                     = $product;
                    }
                }
            }
        }

        return count ($products) > 0 ? $products : array ();
    }

    public function getActiveOrder ($column = false, $value = false)
    {
        $mUserOrders    = new Model ('User_orders');

        $resUserOrders  = $mUserOrders->findBy ('client_id', $this->clientID ())->findBy ('confirmed', 0)->findBy ('deleted', 0)->result ();

        if (!$resUserOrders && Auth::loggedIn ())
        {
            $mUserOrders    = new Model ('User_orders');
            $resUserOrders  = $mUserOrders->findBy ('user_id', Auth::userID ())->findBy ('confirmed', 0)->findBy ('deleted', 0)->result ();
        }

        if ($resUserOrders) 
        {
            if ($column && $value)
            {
                return $resUserOrders->get ($column) === $value ? $resUserOrders : false;
            }
            
            return $resUserOrders;
        }

        return false;
    }

    private function saveError ($order_id, $error)
    {
        $mOrderErrors   = new Model ('Order_errors');
        $mOrderErrors->add (array ('order_id' => $order_id, 'error' => $error));

        $manip          = $mOrderErrors->result ();
        
        $manip->post ();
    }
    
    private function preparePayPal_Express ()
    {
        $mode           = $this->setting ('env');
        $settings       = $this->setting ('payment', 'paypal');
        
        $orderTitle     = $this->setting ('payment', 'orderTitle');
        $paysettings    = $mode === 'live' ? $settings['live'] : $settings['test'];

        $gateway        = Omnipay\Omnipay::create ('PayPal_Express');
        
        $gateway->setUsername ($paysettings['user']);
        $gateway->setPassword ($paysettings['pass']);
        $gateway->setSignature ($paysettings['signature']);
        $gateway->setTestMode ($mode !== 'live');
        
        return new PaymentWrapper ($gateway, $paysettings, $orderTitle, 'paypal_express');
    }
    
    private function prepareBank_Transfer ()
    {
        return new PaymentWrapper (false, null, null, 'bank_transfer');
    }
    
    private function prepareCod ()
    {
        return new PaymentWrapper (false, null, null, 'cod');
    }
    
    private function prepareDebit ()
    {
        return new PaymentWrapper (false, null, null, 'debit');
    }
    
    private function postDelivery ($order_id, $delivery, $gateway)
    {
        $sql        = Sql::getInstance ();
        
        $mOrders    = new Model ('Orders');
        $existings  = $mOrders->findBy ('order_id', $order_id)->findBy ('ref_article_id', 'delivery')->result ();
        
        if (!is_array ($existings)) { $existings = array ($existings);  }

        foreach ($existings as $existing)
        {
            if ($existing)
            {
                $query  = 'DELETE FROM `orders` WHERE `ID`="'.$existing->get ('id').'";';

                $sql->query ($query);
            }
        }

        $deliver    = array
        (
            'order_id'          => $order_id,
            'ref_article_id'    => 'delivery',
            'article_id'        => 'Versandart: '.$gateway,
            'amount'            => 1,
            'price_brutto'      => (float)$delivery['total']+(float)$delivery['cod'],
            'tax'               => 19
        );
        
        $mOrderPost = new Model ('Orders');
        $model      = $mOrderPost->add ($deliver)->result ();

        return $model->post ();
    }
}

class GatewayDummyResponder
{
    public function isSuccessful () { return true;  }
}


class GatewayDummySend 
{
    public function send () { return new GatewayDummyResponder ();  }
}

class GatewayDummy
{
    public function setNoShipping ($num)            {                                   }
    public function purchase ($purchase)            { return new GatewayDummySend ();   }
    public function completePurchase ($purchase)    { return new GatewayDummySend ();   }
    public function refund ($purchase)              { return new GatewayDummySend ();   }
    public function capture ($purchase)             { return new GatewayDummySend ();   }
}

class PaymentWrapper extends ControllerHelper
{
    private $gateway;
    private $paysettings;
    private $user;
    private $company;
    private $billing;
    private $shipping;
    private $products;
    private $order;
    
    private $gatewayName;
    private $paymentToken;
    
    private $title      = '';
    private $returnUrl  = '';
    private $cancelUrl  = '';
    
    public function __construct ($gateway = null, $paysettings = null, $title = null, $gateway_name = null)
    {
        $this->gateway      = $gateway ? $gateway : new GatewayDummy ();
        $this->paysettings  = $paysettings;
        $this->order        = false;
        $this->title        = $title;
        
        $this->returnUrl    = $paysettings['returnUrl'];
        $this->cancelUrl    = $paysettings['cancelUrl'];

        $this->gatewayName  = $gateway_name;
    }
    
    public function setUser ($user)         { $this->user = $user;          }
    public function setCompany ($company)   { $this->company = $company;    }    
    public function setBilling ($billing)   { $this->billing = $billing;    }    
    public function setShipping ($shipping) { $this->shipping = $shipping;  }    
    public function setProducts ($products) { $this->products = $this->prepareProducts ($products); }
    
    public function purchase ()
    {
        $currentOrder   = $this->getActiveOrder ();
        $orderID        = $currentOrder ? $currentOrder->get ('id') : false;

        if ($orderID)
        {
            if ($this->postInternalToken ($orderID))
            {
                $this->deleteProducts ($orderID);
                $this->postProducts ($orderID);

                $response   = $this->gateway->purchase ($this->prepareOrder ($orderID))->send ();

                if ($response)
                {
                    if ($response->isSuccessful ())
                    {
                        return true;
                    } 
                    else if ($response->isRedirect ())
                    {
                        if ($this->updateGatewayToken ($orderID, $response->getTransactionReference()))
                        {
                            // redirect to offsite payment gateway
                            return $response->getRedirectUrl ();
                        }
                    } 
                    else 
                    {
                        // payment failed: display message to customer
                        return $response->getMessage();
                    }        
                }            
            }
        }
        
        return false;
    }
    
    public function completePurchase ($purchase)
    {
        return $this->gateway->completePurchase ($purchase)->send ();
    }
    
    public function refund ()
    {
        $order          = $this->getActiveOrder ();
        $token          = $order->get ('token');
        $gateway_token  = $order->get ('gateway_token');
        $payerID        = $order->get ('payer_id');

        if ($order && !empty ($payerID) && !empty ($token))
        {
            $refundData = array
            (
                'token'                 => $token,
                'transactionReference'  => $gateway_token,
                'payerID'               => $payerID,
                'amount'                => $this->getProductsTotal (),
                'currency'              => 'EUR'
            );
            
            $response   = $this->gateway->refund ($refundData)->send ();
            
            return $response->isSuccessful () ? true : $response->getMessage ();
        }
        
        return false;
    }
    
    public function getProductsTotal ()
    {
        $order      = $this->getActiveOrder ();
        $total      = 0;
        
        if ($order)
        {
            $orderID    = $order->get ('id');
            $mOrders    = new Model ('Orders');
            $resOrders  = $mOrders->findBy ('order_id', $orderID)->result ();

            if ($resOrders)
            {
                if (!is_array ($resOrders)) { $resOrders = array ($resOrders);  }
                
                foreach ($resOrders as $resOrder)
                {
                    $mVarVal        = new Model ('Article_variation_value');
                    $mProduct       = new Model ('Products');
                    
                    $resProduct     = $mProduct->findBy ('article_id', $resOrder->get ('article_id'))->result ();
                    $resVarVal      = $mVarVal->findBy ('ArtikelNr', $resOrder->get ('article_id'))->result ();
                    
                    if ($resProduct && !is_array ($resProduct))
                    {
                        $agio   = $resVarVal ? (float)$resVarVal->get ('Aufpreis') : 0;
                        $price  = (float)$resProduct->get ('price');
                        $tax    = (int)$resProduct->get ('tax');
                        $amount = (int)$resOrder->get ('amount');

                        $total += round (((1+($tax/100)) * ($price+$agio)) * $amount, 2);
                    }
                }
            }
        }
        
        return $total;
    }
    
    public function capture ($data)
    {
        return $this->gateway->capture ($data)->send ();
    }
    
    public function getActiveOrder ()
    {
        $mUserOrders    = new Model ('User_orders');
        $resUserOrders  = $mUserOrders->findBy ('client_id', $this->clientID ())->findBy ('confirmed', 0)->findBy ('deleted', 0)->result ();

        if (!$resUserOrders && $this->loggedIn ())
        {
            $mUserOrders    = new Model ('User_orders');
            $resUserOrders  = $mUserOrders->findBy ('user_id', $this->userID ())->findBy ('confirmed', 0)->findBy ('deleted', 0)->result ();
        }
        
        return $resUserOrders ? $resUserOrders : false;
    }
    
    public function updatePayerID ($order)
    {
        $meta       = $this->meta ();
        $payerID    = isset ($meta['PayerID']) && strlen (trim ($meta['PayerID'])) > 0 ? trim ($meta['PayerID']) : false;

        if ($payerID)
        {
            $order->set ('payer_id', $payerID);
            
            return $order->update ();
        }
        
        return false;
    }
    
    private function prepareProducts ($products)
    {
        if (is_array ($products))
        {
            foreach ($products as $key => $product)
            {
                $mArticleVal            = new Model ('Article_variation_value');
                $resArticleVal          = $mArticleVal->findBy ('ArtikelNr', $product['article_id'])->result ();
                $products[$key]['agio'] = $resArticleVal ? $resArticleVal->get ('Aufpreis') : 0;
            }
        }
        
        return $products;
    }
    
    private function prepareOrder ($orderID)
    {
        $products       = $this->products;
        $shippingCosts  = 5.90;
        $total          = 0;
        
        
        foreach ($products as $product)
        {
            $price  = (float)$product['price'] + (float)$product['agio'];
            $tax    = (float)$product['tax'];
            $amount = (int)$product['amount'];
            
            $total += ((1+($tax/100)) * $price) * $amount;
        }
        
        $total  = round ($total, 2) + $shippingCosts;
        $card   = $this->getCard ();
        
        $order  = array
        (
            'amount'                => $total,
            'currency'              => 'EUR',
            'transactionID'         => $this->paymentToken,
            'description'           => $this->title.' #'.$orderID.' (inkl. 19% MwSt.)',
            'returnUrl'             => $this->returnUrl.'/'.$this->paymentToken,
            'cancelUrl'             => $this->cancelUrl.'/'.$this->paymentToken,
            'card'                  => $card,
            'addressOverride'       => 1,
            'noshipping'            => 1
        );

        return $order;
    }
    
    private function getCard ()
    {
        $user       = $this->user;
        $company    = $this->company;
        $billing    = $this->billing;
        $shipping   = $this->shipping;
        
        $cardData = array
        (
            'firstName'         => $user['prename'],
            'lastName'          => $user['name'],
            'email'             => $user['email'],
            
            'company'           => $company['company'],
            
            'billingAddress1'   => $billing['street'],
            'billingCity'       => $billing['city'],
            'billingPostcode'   => $billing['postal'],
            'billingState'      => $billing['country'],
            'billingCountry'    => 'DE',
            
            'shippingAddress1'  => $shipping['street'],
            'shippingCity'      => $shipping['city'],
            'shippingPostcode'  => $shipping['postal'],
            'shippingState'     => $shipping['country'],
            'shippingCountry'   => 'DE'
        );

        return new \Omnipay\Common\CreditCard ($cardData);
    }
    
    private function updateGatewayToken ($orderID, $token)
    {
        $mUserOrders    = new Model ('User_orders');
        $userOrders     = $mUserOrders->findBy ('id', $orderID)->result ();
        
        if ($userOrders && !is_array ($userOrders))
        {
            $userOrders->set ('gateway_token', $token);
            
            $updated    = $userOrders->update ();

            return $updated !== false;
        }
        
        return false;
    }

    private function postInternalToken ($orderID)
    {
        $this->paymentToken = md5 (uniqid (rand(), true));
        
        $mUserOrder         = new Model ('User_orders');
        $userOrder          = $mUserOrder->findBy ('id', $orderID)->result ();
        
        $userOrder->set ('gateway', $this->gatewayName);
        $userOrder->set ('token', $this->paymentToken);
        
        $userOrderUpdated   = $userOrder->update ();
        
        return $userOrderUpdated ? true : false;
    }
    
    private function deleteProducts ($orderID)
    {
        $mOrderProducts     = new Model ('Orders');
        $resOrderProducts   = $mOrderProducts->findBy ('order_id', $orderID)->result ();

        if ($resOrderProducts)
        {
            if (is_array ($resOrderProducts))
            {
                foreach ($resOrderProducts as $resOrderProduct) 
                {
                    $resOrderProduct->delete ();
                }
            }
            else 
            {
                $resOrderProducts->delete ();
            }
        }
    }
    
    private function postProducts ($orderID)
    {
        $products   = $this->products;

        foreach ($products as $product)
        {
            $articleID      = $product['article_id'];
            $refArticleID   = isset ($product['ref_article_id']) && strlen ($product['ref_article_id']) > 0 ? $product['ref_article_id'] : '';
            $amount         = $product['amount'];
            $price          = (float)$product['price'] + (float)$product['agio'];
            $tax            = (float)$product['tax'];
            $total          = round (((1+($tax/100)) * $price) * $amount, 2);
            
            $testOrder      = new Model ('Orders');                
            $mOrder         = new Model ('Orders');                

            $resOrder       = $testOrder->findBy ('order_id', $orderID)->findBy ('article_id', $articleID)->result ();
            
            if ($resOrder)
            {
                if ($resOrder->get ('amount') !== $amount || (int)$resOrder->get ('deleted') === 1)
                {
                    
                    $resOrder->set ('amount', $amount);
                    $resOrder->set ('price_brutto', $total);
                    $resOrder->set ('tax', $tax);
                    $resOrder->set ('deleted', 0);
                    
                    $updated    = $resOrder->update ();
                    
                    if (!$updated)  { return 0; }
                }
            }
            else
            {
                $mOrder->add (array 
                (
                    'order_id'          => $orderID, 
                    'article_id'        => $articleID, 
                    'ref_article_id'    => $refArticleID, 
                    'amount'            => $amount,
                    'price_brutto'      => $total,
                    'tax'               => $tax
                ));

                $order          = $mOrder->result ();
                $orderPosted    = $order->post ();

                if (!$orderPosted)  { return 0; }
            }
        }

        return 1;
    }
}