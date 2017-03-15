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

/* Error overview:
*    4xx - Client-Errors:
*
*    400     => 'RSP_ERR_BAD_REQUEST',
*    401     => 'RSP_ERR_UNAUTHORIZED',
*    402     => 'RSP_ERR_PAYMENT_REQUIRED',
*    403     => 'RSP_ERR_FORBIDDEN',
*    404     => 'RSP_ERR_NOT_FOUND',
*    405     => 'RSP_ERR_METHOD_NOT_ALLOWED',
*    406     => 'RSP_ERR_NOT_ACCEPTABLE',
*    407     => 'RSP_ERR_PROXY_AUTH_REQUIRED',
*    408     => 'RSP_ERR_REQUEST_TIMEOUT',
*    409     => 'RSP_ERR_CONFLICT',
*    410     => 'RSP_ERR_GONE',
*    411     => 'RSP_ERR_LENGTH_REQUIRED',
*    412     => 'RSP_ERR_PRECONDITION_FAILED',
*    413     => 'RSP_ERR_REQ_ENT_TOO_LARGE',
*    414     => 'RSP_ERR_REQ_URL_TOO_LONG',
*    415     => 'RSP_ERR_UNSUPP_MEDIA_TYPE',
*    416     => 'RSP_ERR_RANGE_NOT_SATISFIABLE',
*    417     => 'RSP_ERR_EXPECTATION_FAILED',
*    418     => 'RSP_ERR_IM_A_TEAPOT',
*    421     => 'RSP_ERR_TOO_MANY_CONNECTIONS',
*    422     => 'RSP_ERR_UNPROC_ENTITY',
*    423     => 'RSP_ERR_LOCKED',
*    424     => 'RSP_ERR_FAILED_DEPENDENCY',
*    425     => 'RSP_ERR_UNORDERED_COLLECTION',
*    426     => 'RSP_ERR_UPGRADE_REQUIRED',
*    428     => 'RSP_ERR_PRECONDITION_REQUIRED',
*    429     => 'RSP_ERR_TOO_MANY_REQUESTS',
*    431     => 'RSP_ERR_REQ_HEADER_TOO_LARGE',
*
*    5xx - Sever-Errors:
*    500     => 'RSP_ERR_INTERNAL_SERVER_ERROR',
*    501     => 'RSP_ERR_NOT_IMPLEMENTED',
*    502     => 'RSP_ERR_BAD_GATEWAY',
*    503     => 'RSP_ERR_SERVICE_UNAVAILABLE',
*    504     => 'RSP_ERR_GATEWAY_TIMEOUT',
*    505     => 'RSP_ERR_HTTP_VERSION_NOT_SUP',
*    506     => 'RSP_ERR_VARIANT_NEGOTIATES',
*    507     => 'RSP_ERR_INSUFFICIENT_STORAGE',
*    508     => 'RSP_ERR_LOOP_DETECTED',
*    509     => 'RSP_ERR_BANDWIDTH_EXCEEDED',
*    510     => 'RSP_ERR_NOT_EXTENDED'
*/

class ErrorHandler
{
    /* passed error number via c'tor */
    private $errno  = false;

    /* return error */
    private $error  = false;
    
    public function __construct ($errno)
    { 
        $config             = Config::getInstance ();
        $settings           = $config->getSettings ();
        
        $this->errno        = $errno;
        $this->error        = $this->fetchError ();

        if (isset ($settings['log']) 
            && isset ($settings['log']['responseErrors'])
            && $settings['log']['responseErrors'] === true
        ) {
            $this->logError ($this->error);
        }

        $errHelper          = ErrorHelper::getInstance ();
        $errHelper->setResponseCode ($errno);
    }
    
    public function getError ($returnAsObject = false)         
    {
        if ($returnAsObject)
        {
            return $this;
        }

        return array
        (
            'error' => $this->error->get ('response_code'),
            'msg'   => $this->error->get ('message')
        );
    }
    
    private function fetchError ()
    {
        $mErrors    = new Model ('Errors');
        $resError   = $mErrors
                        ->findBy ('error_id', $this->errno)
                        ->orFindBy ('error_id', 0)
                        ->orderBy ('error_id', 'desc')
                        ->result ();
        
        if (is_array ($resError))
        {
            $resError   = $resError[0];
        }
        
        return $resError;
    }
    
    private function logError ($error)
    {
        $mError     = new Model ('Response_errors', false);
        
        $getData    = $_GET;
        $postData   = array ();

        parse_str (file_get_contents ('php://input'), $postData);
        
        $request    = array ('get' => $getData, 'post' => $postData);
        
        $rowError   = array 
        (
            'user_id'           => $this->loggedIn () ? $this->userID () : 0,
            'rsp_code'          => $error->get ('response_code'),
            'rsp_text'          => $error->get ('message'),
            'internal_code'     => $this->errno,
            'request'           => json_encode ($request),
            'error_stack'       => json_encode (debug_backtrace ())
        );

        $mError->add ($rowError);
        
        $resultError    = $mError->result ();

        $resultError->post ();
    }
}