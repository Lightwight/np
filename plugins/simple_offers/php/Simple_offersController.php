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

class Simple_offersController extends ControllerHelper
{
    public function initPlugin ()       
    { 
        $route      = $this->getRoute ();
        $mRP        = new Model ('Route_plugins');
        $resRP      = $mRP
                        ->innerJoin ('routes', 'id', 'route_plugins', 'route_id', 'routes', 'enabled', 'route_enabled')
                        ->innerJoin ('plugins', 'id', 'route_plugins', 'plugin_id', 'plugins', 'plugin_name')
                        ->findBy ('route', $route)
                        ->findBy ('plugin_name', 'Simple Offers')
                        ->result ();
        
        $mContent   = new Model ('Page_content', true);
        $result     = $mContent
                        ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'route_id')
                        ->innerJoin ('routes', 'ID', 'route_page_content', 'route_id', 'routes', 'ID')
                        ->findBy ('route', $route)
                        ->findBy ('type', 'plugin-simple_offers')
                        ->result ();

        if ($result) 
        {
            $contents   = json_decode ($result->get ('content'));
            
            if (is_array ($contents))
            {
                foreach ($contents as $key => $content)
                {
                    $contents[$key]->content = nl2br ($content->content);
                }
            }
            
            $result->set ('content', $resRP && (int)$resRP->get ('enabled') === 1 ? $contents : array ());
            $result->set ('id', '');
            $result->set ('plugin_enabled', $resRP && (int)$resRP->get ('enabled') === 1 ? 1 : 0);
            $result->set ('user_id', '');
            $result->set ('content_id', '');
            $result->set ('version', '');
        }

        return $result;        
    }

    public function getOffers ()           { return 0; }

    public function addOffer ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id   = $params['simple_offers']['add']['offer']['route_id'];
            $src        = $params['simple_offers']['add']['offer']['src'];
            $title      = $params['simple_offers']['add']['offer']['title'];
            $content    = $params['simple_offers']['add']['offer']['content'];
            $type       = $params['simple_offers']['add']['offer']['type'];
            $offerOrder = $params['simple_offers']['add']['offer']['order'];

            $mRPContent = new Model ('Route_page_content');
            $resRP      = $mRPContent->findBy ('route_id', $route_id)->result ();

            $exists     = false;
            $offerID    = 1;
            $userID     = Auth::userID ();

            if ($resRP)
            {
                $contentID  = $resRP->get ('page_content_id');

                $mContent   = new Model ('Page_content');
                $result     = $mContent
                                ->findBy ('content_id', $contentID)
                                ->findBy ('type', 'plugin-simple_offers')
                                ->result ();

                if ($result)
                {
                    $exists     = true;
                    $rOffer     = $result->getRow ();

                    $offers     = json_decode ($rOffer['content'], true);
                    $data       = array_reduce ($offers, function ($a, $b) {
                        return @$a['id'] > $b['id'] ? $a : $b;
                    });

                    $offerID    = $data['id'] + 1;
                }
                else
                {
                    $offers     = array ();
                }

                $offers[]   = array
                (
                    'id'            => $offerID,
                    'src'           => $src,
                    'title'         => $title,
                    'content'       => $content,
                    'type'          => $type,
                    'order'         => $offerOrder
                );

                if ($exists)
                {
                    $result->set ('content', json_encode ($offers));
                    $result->set ('user_id', $userID);

                    return $result->update () ? $offerID : $this->error ($this->SQL_ERR_ON_UPDATE);
                }
                else
                {
                    $contentRow = array 
                    (
                        'content_id'    => $contentID,
                        'content'       => json_encode ($offers),
                        'type'          => 'plugin-simple_offers',
                        'version'       => 1,
                        'user_id'       => $userID
                    );

                    $mContent->resetResult ();

                    return $mContent->add ($contentRow)->result ()->post () ? $offerID : $this->error ($this->SQL_ERR_ON_POST);
                }
            }
        }
        
        return $this->error ($this->AUTH_ERR_UNAUTHORIZED);
    }
    
    public function updateOffers ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id   = $params['simple_offers']['route_id'];
            $offers     = $params['simple_offers']['update'];

            $mContent   = new Model ('Page_content');
            $result     = $mContent
                            ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'page_content_id')
                            ->findBy ('route_id', $route_id)
                            ->findBy ('type', 'plugin-simple_offers')
                            ->result ();

            if ($result)
            {
                $result->set ('content', json_encode ($offers));

                return $result->update ();
            }

            return $this->error ($this->SQL_ERR_UNKNOWN_COLUMN);
        }
        
        return $this->error ($this->AUTH_ERR_UNAUTHORIZED);
    }
    
    public function deleteOffer ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id   = $params['simple_offers']['del']['offer']['route_id'];
            $offer_id   = $params['simple_offers']['del']['offer']['offer_id'];        

            $mContent   = new Model ('Page_content');
            $result     = $mContent
                            ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'page_content_id')
                            ->findBy ('route_id', $route_id)
                            ->findBy ('type', 'plugin-simple_offers')
                            ->result ();

            if ($result && !is_array ($result))
            {
                $offers = json_decode ($result->get('content'), true);
                $order  = false;

                foreach ($offers as $key => $offer)
                {

                    if ($offer['id'] === $offer_id)
                    {
                        $order  = $offer['order'];

                        unset ($offers[$key]);
                    }
                    else if ($order !== false && $offer['order'] > $order)
                    {
                        $offers[$key]['order']--;
                    }
                }

                $offers = array_values ($offers);

                $result->set ('content', json_encode ($offers));

                return $result->update ();
            }

            return $this->error ($this->REQ_ERR_INVALID_ARGS);
        }
        
        return $this->error ($this->AUTH_ERR_UNAUTHORIZED);
    }
}