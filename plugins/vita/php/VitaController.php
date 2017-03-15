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

class VitaController extends ControllerHelper
{
    public function initPlugin ()       
    { 
        $route      = $this->getRoute ();
        $mRP        = new Model ('Route_plugins');
        $resRP      = $mRP
                        ->innerJoin ('routes', 'id', 'route_plugins', 'route_id', 'routes', 'enabled', 'route_enabled')
                        ->innerJoin ('plugins', 'id', 'route_plugins', 'plugin_id', 'plugins', 'plugin_name')
                        ->findBy ('route', $route)
                        ->findBy ('plugin_name', 'Vita')
                        ->result ();
        
        $mContent   = new Model ('Page_content', true);
        $result     = $mContent
                        ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'route_id')
                        ->innerJoin ('routes', 'ID', 'route_page_content', 'route_id', 'routes', 'ID')
                        ->findBy ('route', $route)
                        ->findBy ('type', 'plugin-vita')
                        ->result ();

        if ($result) 
        {

            $contents       = json_decode ($result->get ('content'));
            
            $contents->main_content = nl2br ($contents->main_content);
            
            if (is_array ($contents->vitas))
            {
                foreach ($contents->vitas as $key => $content)
                {
                    $contents->vitas[$key]->content = nl2br ($content->content);
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

    public function getVita ()           { return 0; }

    public function addVita ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id   = $params['vitas']['add']['vita']['route_id'];
            $from       = $params['vitas']['add']['vita']['from'];
            $to         = $params['vitas']['add']['vita']['to'];
            $content    = $params['vitas']['add']['vita']['content'];
            $vitaOrder  = $params['vitas']['add']['vita']['order'];

            $mRPContent = new Model ('Route_page_content');
            $resRP      = $mRPContent->findBy ('route_id', $route_id)->result ();

            $exists     = false;
            $vitaID     = 1;
            $userID     = Auth::userID ();

            if ($resRP)
            {
                $contentID  = $resRP->get ('page_content_id');

                $mContent   = new Model ('Page_content');
                $result     = $mContent
                                ->findBy ('content_id', $contentID)
                                ->findBy ('type', 'plugin-vita')
                                ->result ();

                if ($result)
                {
                    $exists     = true;
                    $rVita      = $result->getRow ();

                    $vData      = json_decode ($rVita['content'], true);
                    $vitas      = $vData['vitas'];
                    $data       = array_reduce ($vitas, function ($a, $b) {
                        return @$a['id'] > $b['id'] ? $a : $b;
                    });

                    $vitaID     = $data['id'] + 1;
                }
                else
                {
                    $vData  = array
                    (
                        'main_type'     => '',
                        'main_src'      => '',
                        'main_title'    => '',
                        'main_content'  => '',
                        'vitas'         => array ()
                    );

                    $vitas  = array ();
                }

                $vitas[]   = array
                (
                    'id'            => $vitaID,
                    'from'          => $from,
                    'to'            => $to,
                    'content'       => $content,
                    'order'         => $vitaOrder
                );

                $vData['vitas'] = $vitas;

                if ($exists)
                {
                    $result->set ('content', json_encode ($vData));
                    $result->set ('user_id', $userID);

                    return $result->update () ? $vitaID : $this->getError (ErrorCodeHelper::$_SQL_ERROR_ON_UPDATE);
                }
                else
                {
                    $contentRow = array 
                    (
                        'content_id'    => $contentID,
                        'content'       => json_encode ($vData),
                        'type'          => 'plugin-vita',
                        'version'       => $resRP->get ('version') + 1,
                        'user_id'       => $userID
                    );

                    $mContent->resetResult ();

                    return $mContent->add ($contentRow)->result ()->post () ? $vitaID : $this->getError (ErrorCodeHelper::$_SQL_ERROR_ON_POST);
                }
            }
        }
        
        return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
    }
    
    public function updateVita ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id   = $params['vitas']['route_id'];
            $type       = $params['vitas']['update']['main_type'];
            $src        = $params['vitas']['update']['main_src'];
            $title      = $params['vitas']['update']['main_title'];
            $content    = $params['vitas']['update']['main_content'];
            $vitas      = $params['vitas']['update']['vitas'];

            $mContent   = new Model ('Page_content');
            $result     = $mContent
                            ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'page_content_id')
                            ->findBy ('route_id', $route_id)
                            ->findBy ('type', 'plugin-vita')
                            ->result ();

            $post   = array
            (
                'main_type'     => $type,
                'main_src'      => $src,
                'main_title'    => $title,
                'main_content'  => $content,
                'vitas'         => $vitas
            );

            if ($result)
            {
                $result->set ('content', json_encode ($post));
                $result->set ('user_id', Auth::userID ());

                return $result->update ();
            }
            else
            {
                $mRPContent = new Model ('Route_page_content');
                $resRP      = $mRPContent->findBy ('route_id', $route_id)->result ();

                if ($resRP)
                {
                    return $mContent->add (array (
                        'type'          => 'plugin-vita',
                        'content_id'    => $resRP->get ('page_content_id'),
                        'user_id'       => Auth::userID (),
                        'route_id'      => $route_id,
                        'content'       => json_encode ($post),
                        'version'       => $resRP->get ('version') + 1
                    ))
                    ->result ()
                    ->post ();
                }
            }

            return $this->getError (ErrorCodeHelper::$_SQL_UNKNOWN_COLUMN);
        }
        
        return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
    }
    
    public function deleteVita ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id   = $params['vitas']['del']['vita']['route_id'];
            $vita_id    = $params['vitas']['del']['vita']['vita_id'];        

            $mContent   = new Model ('Page_content');
            $result     = $mContent
                            ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'page_content_id')
                            ->findBy ('route_id', $route_id)
                            ->findBy ('type', 'plugin-vita')
                            ->result ();

            if ($result && !is_array ($result))
            {
                $content    = json_decode ($result->get('content'), true);
                $vitas      = isset ($content['vitas']) && is_array ($content['vitas'])? $content['vitas'] : array ();
                $order  = false;

                foreach ($vitas as $key => $vita)
                {

                    if ($vita['id'] === $vita_id)
                    {
                        $order  = $vita['order'];

                        unset ($vitas[$key]);
                    }
                    else if ($order !== false && $vita['order'] > $order)
                    {
                        $vitas[$key]['order']--;
                    }
                }

                $content['vitas']   = array_values ($vitas);
                
                $result->set ('content', json_encode ($content));

                return $result->update ();
            }

            return $this->getError (ErrorCodeHelper::$_REQ_INVALID_ARGS);
        }
        
        return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
    }
}