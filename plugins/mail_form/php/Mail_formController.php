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

class Mail_formController extends ControllerHelper
{
    public function initPlugin ()       
    { 
        $route      = $this->getRoute ();
        $mRP        = new Model ('Route_plugins');
        $resRP      = $mRP
                        ->innerJoin ('routes', 'id', 'route_plugins', 'route_id', 'routes', 'enabled', 'route_enabled')
                        ->innerJoin ('plugins', 'id', 'route_plugins', 'plugin_id', 'plugins', 'plugin_name')
                        ->findBy ('route', $route)
                        ->findBy ('plugin_name', 'Mail Form')
                        ->result ();
        
        $mContent   = new Model ('Page_content', true);
        $result     = $mContent
                        ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'route_id')
                        ->innerJoin ('routes', 'ID', 'route_page_content', 'route_id', 'routes', 'ID')
                        ->findBy ('route', $route)
                        ->findBy ('type', 'plugin-mail_form')
                        ->result ();

        $content    = $resRP && (int)$resRP->get ('enabled') === 1 ? json_decode ($result->get ('content'), true) : array ();

        if (isset ($content['main_subject']))   { unset ($content['main_subject']);    }
        if (isset ($content['main_receiver']))  { unset ($content['main_receiver']);   }
        
        if ($result)
        {
            if (isset ($content['main_content']))
            {
                $content['main_content']    = nl2br ($content['main_content']);
            }
            
            $result->set ('content', $content);
            $result->set ('id', '');
            $result->set ('plugin_enabled', $resRP && (int)$resRP->get ('enabled') === 1 ? 1 : 0);
            $result->set ('user_id', '');
            $result->set ('content_id', '');
            $result->set ('version', '');
            $result->set ('main_receiver', '');
            $result->set ('main_subject', '');
        }

        return $result;        
    }

    public function getMailForm ()           { return 0; }

    public function sendMail ($params)
    {
        $formData   = $params['mail_form']['send'];
        $captcha    = $formData['captcha'];

        if ($this->validCaptcha ($captcha))
        {
            // TODO: Implement $to-logic
            $to         = '';
            $subject    = 'Kontaktanfrage von pm.de';
            $gender     = $formData['gender'] === 'male' ? 'Herr' : 'Frau';
            $phone      = !empty ($formData['phone']) ? $formData['phone'] : 'keine Angabe';

            $body       = $gender.' '.$formData['name'].' hat die folgende Anfrage gestellt:<br><br>';
            $body      .= $formData['message'].'<br><br>';
            $body      .= '_______________________________<br>';
            $body      .= 'Die Kontaktdaten sind:<br><br>';
            $body      .= 'Anrede: '.$gender.' '.$formData['name'].'<br>';
            $body      .= 'Firma: '.$formData['company'].'<br>';
            $body      .= 'E-Mail: '.$formData['mail'].'<br>';
            $body      .= 'Telefon: '.$phone;

            $altBody    = $gender.' '.$formData['name'].' hat die folgende Anfrage gestellt:'."\r\n\r\n";
            $altBody   .= $formData['message']."\r\n\r\n";
            $altBody   .= '_______________________________'."\r\n";            
            $altBody   .= 'Die Kontaktdaten sind:'."\r\n\r\n";
            $altBody   .= 'Anrede: '.$gender.' '.$formData['name']."\r\n";
            $altBody   .= 'Firma: '.$formData['company']."\r\n";
            $altBody   .= 'E-Mail: '.$formData['mail']."\r\n";
            $altBody   .= 'Telefon: '.$phone;

            return $this->mail ($to, $subject, $body, $altBody);
        }
        
        return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
    }
    
    public function addMailForm ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id       = $params['mail_form']['add']['field']['route_id'];
            $type           = $params['mail_form']['add']['field']['type'];
            $label          = $params['mail_form']['add']['field']['label'];
            $placeholder    = $params['mail_form']['add']['field']['placeholder'];
            $tmpValues      = $params['mail_form']['add']['field']['values'];
            $fieldOrder     = $params['mail_form']['add']['field']['order'];
            $values         = array ();
            $maxValueID     = 1;

            $mRPContent = new Model ('Route_page_content');
            $resRP      = $mRPContent->findBy ('route_id', $route_id)->result ();

            $exists     = false;
            $fieldID    = 1;
            $userID     = Auth::userID ();

            if ($resRP)
            {
                $contentID  = $resRP->get ('page_content_id');

                $mContent   = new Model ('Page_content');
                $result     = $mContent
                                ->findBy ('content_id', $contentID)
                                ->findBy ('type', 'plugin-mail_form')
                                ->result ();

                if ($result)
                {
                    $exists     = true;
                    $rForm      = $result->getRow ();

                    $fData      = json_decode ($rForm['content'], true);
                    $fields     = $fData['fields'];
                    $data       = array_reduce ($fields, function ($a, $b) {
                        return @$a['id'] > $b['id'] ? $a : $b;
                    });
                    
                    $maxValueID = 1;
                    
                    foreach ($fields as $field)
                    {
                        foreach ($field['values'] as $value)
                        {
                            if ($value['id'] > $maxValueID)
                            {
                                $maxValueID = $value['id'] + 1;
                            }
                        }
                    }
                    
                    $fieldID    = $data['id'] + 1;
                }
                else
                {
                    $fData  = array
                    (
                        'main_type'     => '',
                        'main_src'      => '',
                        'main_title'    => '',
                        'main_content'  => '',
                        'fields'        => array ()
                    );

                    $fields = array ();
                }

                foreach ($tmpValues as $value)
                {
                    $value['id']    = $maxValueID++;
                    $values[]       = $value;
                }
                
                $fields[]   = array
                (
                    'id'            => $fieldID,
                    'type'          => $type,
                    'label'         => $label,
                    'placeholder'   => $placeholder,
                    'values'        => $values,
                    'order'         => $fieldOrder
                );

                $fData['fields']    = $fields;

                if ($exists)
                {
                    $result->set ('content', json_encode ($fData));
                    $result->set ('user_id', $userID);

                    return $result->update () ? $fieldID : $this->getError (ErrorCodeHelper::$_SQL_ERROR_ON_UPDATE);
                }
                else
                {
                    $contentRow = array 
                    (
                        'content_id'    => $contentID,
                        'content'       => json_encode ($fData),
                        'type'          => 'plugin-mail_form',
                        'version'       => $resRP->get ('version') + 1,
                        'user_id'       => $userID
                    );

                    $mContent->resetResult ();

                    return $mContent->add ($contentRow)->result ()->post () ? $fieldID : $this->getError (ErrorCodeHelper::$_SQL_ERROR_ON_POST);
                }
            }
        }
        
        return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
    }
    
    public function updateMailForm ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id   = $params['mail_form']['route_id'];
            $type       = $params['mail_form']['update']['main_type'];
            $src        = $params['mail_form']['update']['main_src'];
            $title      = $params['mail_form']['update']['main_title'];
            $content    = $params['mail_form']['update']['main_content'];
            $subject    = $params['mail_form']['update']['main_subject'];
            $receiver   = $params['mail_form']['update']['main_receiver'];
            $fields     = $params['mail_form']['update']['fields'];

            $mContent   = new Model ('Page_content');
            $result     = $mContent
                            ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'page_content_id')
                            ->findBy ('route_id', $route_id)
                            ->findBy ('type', 'plugin-mail_form')
                            ->result ();

            $post   = array
            (
                'main_type'     => $type,
                'main_src'      => $src,
                'main_title'    => $title,
                'main_content'  => $content,
                'main_subject'  => $subject,
                'main_receiver' => $receiver,
                'fields'        => $fields
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
                        'type'          => 'plugin-mail_form',
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
    
    public function deleteMailFormField ($params)
    {
        if ($this->isGroup (1))
        {
            $route_id   = $params['mail_form']['del']['field']['route_id'];
            $field_id   = $params['mail_form']['del']['field']['field_id'];        

            $mContent   = new Model ('Page_content');
            $result     = $mContent
                            ->innerJoin ('route_page_content', 'page_content_id', 'page_content', 'content_id', 'route_page_content', 'page_content_id')
                            ->findBy ('route_id', $route_id)
                            ->findBy ('type', 'plugin-mail_form')
                            ->result ();

            if ($result && !is_array ($result))
            {
                $form   = json_decode ($result->get('content'), true);
                $fields = isset ($form['fields']) ? $form['fields'] : array ();
                $order  = false;

                foreach ($fields as $key => $field)
                {

                    if ($field['id'] === $field_id)
                    {
                        $order  = $field['order'];

                        unset ($fields[$key]);
                    }
                    else if ($order !== false && $field['order'] > $order)
                    {
                        $fields[$key]['order']--;
                    }
                }

                $form['fields'] = array_values ($fields);
                
                $result->set ('content', json_encode ($form));

                return $result->update ();
            }

            return $this->getError (ErrorCodeHelper::$_REQ_INVALID_ARGS);
        }
        
        return $this->getError (ErrorCodeHelper::$_AUTH_UNAUTHORIZED);
    }
}