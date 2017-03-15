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

class SliderController extends ControllerHelper
{
    public function initPlugin ()       
    { 
        $route      = $this->getRoute ();
        $mRP        = new Model ('Route_plugins');
        $resRP      = $mRP
                        ->innerJoin ('routes', 'id', 'route_plugins', 'route_id', 'routes', 'enabled', 'route_enabled')
                        ->innerJoin ('plugins', 'id', 'route_plugins', 'plugin_id', 'plugins', 'plugin_name')
                        ->findBy ('route', $route)
                        ->findBy ('plugin_name', 'slider')
                        ->result ();
        
        $mContent   = new Model ('Page_content', true);
        $result     = $mContent
                        ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'route_id')
                        ->innerJoin ('routes', 'ID', 'route_page_content', 'route_id', 'routes', 'ID')
                        ->findBy ('route', $route)
                        ->findBy ('type', 'plugin-slider')
                        ->result ();
        
        if ($result)
        {
            $result->set ('content', $resRP && (int)$resRP->get ('enabled') === 1 ? json_decode ($result->get ('content')) : array ());
            $result->set ('id', '');
            $result->set ('plugin_enabled', $resRP && (int)$resRP->get ('enabled') === 1 ? 1 : 0);
            $result->set ('user_id', '');
            $result->set ('content_id', '');
            $result->set ('version', '');
        }
        
        return $result;        
    }

    public function getSlider ()           { return 0; }

    public function addSlide ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id   = $params['slider']['add']['slide']['route_id'];
            $src        = $params['slider']['add']['slide']['src'];
            $title      = $params['slider']['add']['slide']['title'];
            $seo_title  = $params['slider']['add']['slide']['seo_title'];
            $seo_alt    = $params['slider']['add']['slide']['seo_alt'];
            $type       = $params['slider']['add']['slide']['type'];
            $slideOrder = $params['slider']['add']['slide']['order'];

            $mRPContent = new Model ('Route_page_content');
            $resRP      = $mRPContent->findBy ('route_id', $route_id)->result ();

            $exists     = false;
            $slideID    = 1;
            $userID     = Auth::userID ();

            if ($resRP)
            {
                $contentID  = $resRP->get ('page_content_id');

                $mContent   = new Model ('Page_content');
                $result     = $mContent
                                ->findBy ('content_id', $contentID)
                                ->findBy ('type', 'plugin-slider')
                                ->result ();

                if ($result)
                {
                    $exists     = true;
                    $rSlide     = $result->getRow ();

                    $slides     = json_decode ($rSlide['content'], true);
                    $data       = array_reduce ($slides, function ($a, $b) {
                        return @$a['id'] > $b['id'] ? $a : $b;
                    });

                    $slideID    = $data['id'] + 1;
                }
                else
                {
                    $slides     = array ();
                }

                $slides[]   = array
                (
                    'id'            => $slideID,
                    'src'           => $src,
                    'title'         => $title,
                    'seo_title'     => $seo_title,
                    'seo_alt'       => $seo_alt,
                    'type'          => $type,
                    'order'         => $slideOrder
                );

                if ($exists)
                {
                    $result->set ('content', json_encode ($slides));
                    $result->set ('user_id', $userID);

                    return $result->update () ? $slideID : $this->getError (ErrorCodeHelper::$_SQL_ERROR_ON_UPDATE);
                }
                else
                {
                    $contentRow = array 
                    (
                        'content_id'    => $contentID,
                        'content'       => json_encode ($slides),
                        'type'          => 'plugin-slider',
                        'version'       => 1,
                        'user_id'       => $userID
                    );

                    $mContent->resetResult ();

                    return $mContent->add ($contentRow)->result ()->post () ? $slideID : $this->getError (ErrorCodeHelper::$_SQL_ERROR_ON_POST);
                }
            }
        }
        
        return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
    }
    
    public function updateSlides ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id   = $params['slider']['route_id'];
            $slides     = $params['slider']['update'];

            $mContent   = new Model ('Page_content');
            $result     = $mContent
                            ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'page_content_id')
                            ->findBy ('route_id', $route_id)
                            ->findBy ('type', 'plugin-slider')
                            ->result ();

            if ($result)
            {
                $result->set ('content', json_encode ($slides));

                return $result->update ();
            }

            return $this->getError (ErrorCodeHelper::$_SQL_UNKNOWN_COLUMN);
        }
        
        return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
    }
    
    public function deleteSlide ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id   = $params['slider']['del']['slide']['route_id'];
            $slide_id   = $params['slider']['del']['slide']['slide_id'];        

            $mContent   = new Model ('Page_content');
            $result     = $mContent
                            ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'page_content_id')
                            ->findBy ('route_id', $route_id)
                            ->findBy ('type', 'plugin-slider')
                            ->result ();

            if ($result && !is_array ($result))
            {

                $slides = json_decode ($result->get('content'), true);
                $order  = false;

                foreach ($slides as $key => $slide)
                {

                    if ($slide['id'] === $slide_id)
                    {
                        $order  = $slide['order'];

                        unset ($slides[$key]);
                    }
                    else if ($order !== false && $slide['order'] > $order)
                    {
                        $slides[$key]['order']--;
                    }
                }

                $slides = array_values ($slides);

                $result->set ('content', json_encode ($slides));

                return $result->update ();
            }

            return $this->getError (ErrorCodeHelper::$_REQ_INVALID_ARGS);
        }
        
        return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
    }
}