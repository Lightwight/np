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

class NewsController extends ControllerHelper
{
    public function initPlugin ()       
    { 
        $route      = $this->getRoute ();
        $mRP        = new Model ('Route_plugins');
        $resRP      = $mRP
                        ->innerJoin ('routes', 'id', 'route_plugins', 'route_id', 'routes', 'enabled', 'route_enabled')
                        ->innerJoin ('plugins', 'id', 'route_plugins', 'plugin_id', 'plugins', 'plugin_name')
                        ->findBy ('route', $route)
                        ->findBy ('plugin_name', 'News')
                        ->result ();        
        
        $mContent   = new Model ('Page_content', true);
        $result     = $mContent
                        ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'route_id')
                        ->innerJoin ('routes', 'ID', 'route_page_content', 'route_id', 'routes', 'ID')
                        ->findBy ('route', $route)
                        ->findBy ('type', 'plugin-news')
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

            return $result;        
        }
    }

    public function getNews ()           { return 0; }

    public function addNews ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id   = $params['news']['add']['news']['route_id'];
            $src        = $params['news']['add']['news']['src'];
            $type       = $params['news']['add']['news']['type'];
            $title      = $params['news']['add']['news']['title'];
            $content    = $params['news']['add']['news']['content'];
            $newsOrder  = $params['news']['add']['news']['order'];

            $mRPContent = new Model ('Route_page_content');
            $resRP      = $mRPContent->findBy ('route_id', $route_id)->result ();

            $exists     = false;
            $newsID     = 1;
            $userID     = Auth::userID ();

            if ($resRP)
            {
                $contentID  = $resRP->get ('page_content_id');

                $mContent   = new Model ('Page_content');
                $result     = $mContent
                                ->findBy ('content_id', $contentID)
                                ->findBy ('type', 'plugin-news')
                                ->result ();

                if ($result)
                {
                    $exists     = true;
                    $rNews      = $result->getRow ();

                    $news       = json_decode ($rNews['content'], true);
                    $data       = array_reduce ($news, function ($a, $b) {
                        return @$a['id'] > $b['id'] ? $a : $b;
                    });

                    $newsID     = $data['id'] + 1;
                }
                else
                {
                    $news       = array ();
                }

                $news[] = array
                (
                    'id'            => $newsID,
                    'src'           => $src,
                    'type'          => $type,
                    'title'         => $title,
                    'content'       => $content,
                    'order'         => $newsOrder
                );

                if ($exists)
                {
                    $result->set ('content', json_encode ($news));
                    $result->set ('user_id', $userID);

                    return $result->update () ? $newsID : $this->getError (ErrorCodeHelper::$_SQL_ERROR_ON_UPDATE);
                }
                else
                {
                    $contentRow = array 
                    (
                        'content_id'    => $contentID,
                        'content'       => json_encode ($news),
                        'type'          => 'plugin-news',
                        'version'       => 1,
                        'user_id'       => $userID
                    );

                    $mContent->resetResult ();

                    return $mContent->add ($contentRow)->result ()->post () ? $newsID : $this->getError (ErrorCodeHelper::$_SQL_ERROR_ON_POST);
                }
            }
        }
        
        return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
    }
    
    public function updateNews ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id   = $params['news']['route_id'];
            $news       = $params['news']['update'];

            $mContent   = new Model ('Page_content');
            $result     = $mContent
                            ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'page_content_id')
                            ->findBy ('route_id', $route_id)
                            ->findBy ('type', 'plugin-news')
                            ->result ();

            if ($result)
            {
                $result->set ('content', json_encode ($news));

                return $result->update ();
            }

            return $this->getError (ErrorCodeHelper::$_SYS_ERR_UNKNOWN);
        }
        
        return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
    }
    
    public function deleteNews ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id   = $params['news']['del']['news']['route_id'];
            $news_id    = $params['news']['del']['news']['news_id'];        

            $mContent   = new Model ('Page_content');
            $result     = $mContent
                            ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'page_content_id')
                            ->findBy ('route_id', $route_id)
                            ->findBy ('type', 'plugin-news')
                            ->result ();

            if ($result && !is_array ($result))
            {

                $news   = json_decode ($result->get('content'), true);
                $order  = false;

                foreach ($news as $key => $newsItem)
                {

                    if ($newsItem['id'] === $news_id)
                    {
                        $order  = $newsItem['order'];

                        unset ($news[$key]);
                    }
                    else if ($order !== false && $newsItem['order'] > $order)
                    {
                        $news[$key]['order']--;
                    }
                }

                $news   = array_values ($news);

                $result->set ('content', json_encode ($news));

                return $result->update ();
            }

            return $this->getError (ErrorCodeHelper::$_REQ_INVALID_ARGS);
        }
        return $this->getEerror (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
    }
}