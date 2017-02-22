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

class GalleryController extends ControllerHelper
{
    public function initPlugin ()       
    { 
        $route      = $this->getRoute ();
        $mRP        = new Model ('Route_plugins');
        $resRP      = $mRP
                        ->innerJoin ('routes', 'id', 'route_plugins', 'route_id', 'routes', 'enabled', 'route_enabled')
                        ->innerJoin ('plugins', 'id', 'route_plugins', 'plugin_id', 'plugins', 'plugin_name')
                        ->findBy ('route', $route)
                        ->findBy ('plugin_name', 'Gallery')
                        ->result ();
        
        $mContent   = new Model ('Page_content', true);
        $result     = $mContent
                        ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'route_id')
                        ->innerJoin ('routes', 'ID', 'route_page_content', 'route_id', 'routes', 'ID')
                        ->findBy ('route', $route)
                        ->findBy ('type', 'plugin-gallery')
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

    public function getGalleries ()           { return 0; }

    public function addGallery ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id       = $params['gallery']['add']['gallery']['route_id'];
            $src            = $params['gallery']['add']['gallery']['src'];
            $thumbnail      = $params['gallery']['add']['gallery']['thumbnail'];
            $thumbnails     = $params['gallery']['add']['gallery']['thumbnails'];
            $title          = $params['gallery']['add']['gallery']['title'];
            $content        = $params['gallery']['add']['gallery']['content'];
            $type           = $params['gallery']['add']['gallery']['type'];
            $galleryOrder   = $params['gallery']['add']['gallery']['order'];

            $mRPContent     = new Model ('Route_page_content');
            $resRP          = $mRPContent->findBy ('route_id', $route_id)->result ();

            $exists         = false;
            $galleryID      = 1;
            $userID         = Auth::userID ();

            if ($resRP)
            {
                $contentID  = $resRP->get ('page_content_id');

                $mContent   = new Model ('Page_content');
                $result     = $mContent
                                ->findBy ('content_id', $contentID)
                                ->findBy ('type', 'plugin-gallery')
                                ->result ();

                if ($result)
                {
                    $exists     = true;
                    $rGallery   = $result->getRow ();

                    $galleries  = json_decode ($rGallery['content'], true);
                    $data       = array_reduce ($galleries, function ($a, $b) {
                        return @$a['id'] > $b['id'] ? $a : $b;
                    });

                    $galleryID  = $data['id'] + 1;
                }
                else
                {
                    $galleries  = array ();
                }

                $galleries[]   = array
                (
                    'id'            => $galleryID,
                    'src'           => $src,
                    'thumbnail'     => $thumbnail,
                    'thumbnails'    => $thumbnails,
                    'title'         => $title,
                    'content'       => $content,
                    'type'          => $type,
                    'order'         => $galleryOrder
                );

                if ($exists)
                {
                    $result->set ('content', json_encode ($galleries));
                    $result->set ('user_id', $userID);

                    return $result->update () ? $galleryID : $this->error ($this->SQL_ERR_ON_UPDATE);
                }
                else
                {
                    $contentRow = array 
                    (
                        'content_id'    => $contentID,
                        'content'       => json_encode ($galleries),
                        'type'          => 'plugin-gallery',
                        'version'       => 1,
                        'user_id'       => $userID
                    );

                    $mContent->resetResult ();

                    return $mContent->add ($contentRow)->result ()->post () ? $galleryID : $this->error ($this->SQL_ERR_ON_POST);
                }
            }
        }
        
        return $this->error ($this->AUTH_ERR_UNAUTHORIZED);
    }
    
    public function updateGallery ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id   = $params['gallery']['route_id'];
            $gallery    = $params['gallery']['update'];

            $mContent   = new Model ('Page_content');
            $result     = $mContent
                            ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'page_content_id')
                            ->findBy ('route_id', $route_id)
                            ->findBy ('type', 'plugin-gallery')
                            ->result ();
            
            if ($result)
            {
                $result->set ('content', json_encode ($gallery));

                return $result->update ();
            }

            return $this->error ($this->SQL_ERR_UNKNOWN_COLUMN);
        }
        
        return $this->error ($this->AUTH_ERR_UNAUTHORIZED);        
    }
    
    public function deleteGallery ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id   = $params['gallery']['del']['gallery']['route_id'];
            $gallery_id = $params['gallery']['del']['gallery']['gallery_id'];        

            $mContent   = new Model ('Page_content');
            $result     = $mContent
                            ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'page_content_id')
                            ->findBy ('route_id', $route_id)
                            ->findBy ('type', 'plugin-gallery')
                            ->result ();

            if ($result && !is_array ($result))
            {
                $galleries  = json_decode ($result->get('content'), true);
                $order      = false;

                foreach ($galleries as $key => $gallery)
                {

                    if ($gallery['id'] === $gallery_id)
                    {
                        $order  = $gallery['order'];

                        unset ($galleries[$key]);
                    }
                    else if ($order !== false && $gallery['order'] > $order)
                    {
                        $galleries[$key]['order']--;
                    }
                }

                $galleries  = array_values ($galleries);

                $result->set ('content', json_encode ($galleries));

                return $result->update ();
            }

            return $this->error ($this->REQ_ERR_INVALID_ARGS);
        }
        
        return $this->error ($this->AUTH_ERR_UNAUTHORIZED);
    }
}