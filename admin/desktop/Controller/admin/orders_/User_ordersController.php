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

class User_ordersController extends ControllerHelper
{
    public function getModel (Model $model, $params)
    {
        $code   = $this->setting ('payment', 'secure_code');
        $result = $model->result ();
        
        if ($result)
        {
            foreach ($result as $order)
            {
                $iban   = $order->get ('iban');
                if (!empty ($iban))
                {
                    $order->set ('iban', CryptoLib::decryptData ($iban, $code));
                }

                $bic    = $order->get ('bic');
                if (!empty ($bic))  
                {
                    $order->set ('bic', CryptoLib::decryptData ($bic, $code));
                }

                $owner  = $order->get ('owner');
                if (!empty ($owner))
                {
                    $order->set ('owner', CryptoLib::decryptData ($owner, $code));
                }
                
                $order->set ('client_id', '');
                $order->set ('gateway_token', '');
                $order->set ('payer_id', '');
                $order->set ('token', '');
            }
        }

        return $result;
    }
    
    public function postModel (Model $model)    {}
    public function updateModel (Model $model)  {}
    public function deleteModel (Model $model)  {}
}
