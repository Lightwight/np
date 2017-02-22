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

class Mail_formResolver extends ControllerHelper
{
    public function resolveParameters_get ($type)   {}
    
    public function resolveParameters_post ($type)
    {
        $contents   = array ();
        $parameters = array ();

        parse_str (file_get_contents ('php://input'), $contents);

        if (isset ($contents[$type]))
        {
            $parameters = $contents[$type];

            if (isset ($parameters['add']))
            {
                return $this->resolveAdd ($parameters['add']);
            }
            else if (isset ($parameters['update']))
            {
                return $this->resolveSave ($parameters['update']);
            }
            else if (isset ($parameters['del']))
            {
                return $this->resolveDelete ($parameters['del']);
            }
            else if (isset ($parameters['send']))
            {
                return $this->resolveSend ($parameters['send']);
            }
        }
    }
    
    private function resolveDelete ($parameters)
    {
        if (isset ($parameters['field']))
        {
            $params     = $parameters['field'];

            $routeID    = isset ($params['route_id']) ? (int)$params['route_id'] : -false;
            $fieldID    = isset ($params['field_id']) ? (int)$params['field_id'] : false;

            if ($routeID && $fieldID)
            {
                return array 
                (
                    'mail_form' => array 
                    (
                        'del'  => array
                        (
                            'field' => array
                            (
                                'route_id'      => $routeID,
                                'field_id'      => $fieldID
                            )
                        )
                    )
                );
            }
        }
    }
    
    private function resolveSend ($parameters) 
    {
        $gender     = isset ($parameters['gender']) && ($parameters['gender'] === 'male' || $parameters['gender'] === 'female') ? $parameters['gender'] : false;
        $name       = isset ($parameters['name']) ? filter_var ($parameters['name'], FILTER_SANITIZE_STRING) : false;
        $mail       = isset ($parameters['mail']) ? filter_var ($parameters['mail'], FILTER_SANITIZE_EMAIL) : false;
        $phone      = isset ($parameters['phone']) ? filter_var ($parameters['phone'], FILTER_SANITIZE_STRING) : '';
        $company    = isset ($parameters['company']) ? filter_var ($parameters['company'], FILTER_SANITIZE_STRING) : '';
        $message    = isset ($parameters['message']) ? filter_var ($parameters['message'], FILTER_SANITIZE_STRING /*| FILTER_SANITIZE_MAGIC_QUOTES*/) : '';
        $captcha    = isset ($parameters['captcha']) ? filter_var ($parameters['captcha'], FILTER_SANITIZE_STRING) : '';

        return array
        (
            'mail_form' => array 
            (
                'send'  => array
                (
                    'gender'    => $gender,
                    'name'      => $name,
                    'mail'      => $mail,
                    'phone'     => $phone,
                    'company'   => $company,
                    'message'   => $message,
                    'captcha'   => $captcha
                )
            )
        );
    }
    
    private function resolveSave ($parameters)
    {
        if (isset ($parameters['route_id']))
        {
            $fields         = isset ($parameters['fields']) ? $parameters['fields'] : array ();
            $routeID        = isset ($parameters['route_id']) ? (int)$parameters['route_id'] : false;
            $result         = array 
            (
                'fields'        => array (),
                'main_type'     => isset ($parameters['main_type']) ? filter_var ($parameters['main_type'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_HIGH | FILTER_FLAG_ENCODE_LOW) : '',
                'main_src'      => isset ($parameters['main_src']) ? filter_var ($parameters['main_src'], FILTER_SANITIZE_SPECIAL_CHARS) : '',
                'main_title'    => isset ($parameters['main_title']) ? filter_var ($parameters['main_title'], FILTER_SANITIZE_STRING) : '',
                'main_content'  => isset ($parameters['main_content']) ? filter_var ($parameters['main_content'], FILTER_UNSAFE_RAW) : '',
                'main_subject'  => isset ($parameters['main_subject']) ? filter_var ($parameters['main_subject'], FILTER_SANITIZE_STRING) : '',
                'main_receiver' => isset ($parameters['main_receiver']) ? filter_var ($parameters['main_receiver'], FILTER_SANITIZE_EMAIL) : ''
            );
            
            if (is_array ($fields) && count ($fields) > 0 && $routeID)
            {
                foreach ($fields as $field)
                {
                    $id             = isset ($field['id']) ? (int)$field['id'] : false;

                    $type           = isset ($field['type']) ? (int)$field['type'] : 0;
                    $label          = isset ($field['label']) ? filter_var ($field['label'], FILTER_SANITIZE_STRING) : '';
                    $placeholder    = isset ($field['placeholder']) ? filter_var ($field['placeholder'], FILTER_SANITIZE_STRING) : '';
                    $order          = isset ($field['order']) ? (int)$field['order'] : 1;

                    $values         = isset ($field['values']) && is_array ($field['values']) ? $field['values'] : array ();
                    $newValues      = array ();
                    
                    foreach ($values as $key => $value)
                    {
                        $newValues[]  = array
                        (
                            'value' => filter_var ($value['value'], FILTER_SANITIZE_STRING),
                            'order' => (int)$value['order'],
                            'id'    => (int)$value['id']
                        );
                    }
                    
                    $result['fields'][]   = array
                    (
                        'id'                => $id,
                        'type'              => $type,
                        'label'             => $label,
                        'placeholder'       => $placeholder,
                        'values'            => $newValues,
                        'order'             => $order
                    );
                }
            }

            return array
            (
                'mail_form'    => array
                (
                    'update'    => $result,
                    'route_id'  => $routeID
                )
            );
        }
    }
    
    private function resolveAdd ($parameters)
    {
        if (isset ($parameters['field']))
        {
            $params         = $parameters['field'];
            
            $routeID        = isset ($params['route_id']) ? (int)$params['route_id'] : false;
            $type           = isset ($params['type']) ? (int)$params['type'] : 0;
            $label          = isset ($params['label']) ? filter_var ($params['label'], FILTER_SANITIZE_STRING) : '';
            $placeholder    = isset ($params['placeholder']) ? filter_var ($params['placeholder'], FILTER_SANITIZE_STRING) : '';
            $values         = isset ($params['values']) && is_array ($params['values']) ? $params['values'] : array ();#
            $order          = isset ($params['order']) ? (int)$params['order'] : 1;

            foreach ($values as $key => $value)
            {
                $values[$key]   = array
                (
                    'value' => filter_var ($value['value'], FILTER_SANITIZE_STRING),
                    'order' => filter_var ($value['order'], FILTER_SANITIZE_STRING)
                );
            }
            
            if ($routeID)
            {
                return array 
                (
                    'mail_form' => array 
                    (
                        'add'  => array
                        (
                            'field' => array
                            (
                                'route_id'          => $routeID,
                                'type'              => $type,
                                'label'             => $label,
                                'placeholder'       => $placeholder,
                                'values'            => $values,
                                'order'             => $order
                            )
                        )
                    )
                );
            }
        }
    }
}