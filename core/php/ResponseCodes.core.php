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

class ResponseCodes 
{
    /* 1xx - Information */
    const RSP_INF_CONTINTUE             = 100;
    const RSP_INF_SWITCHING_PROTOCOLS   = 101;
    const RSP_INF_PROCESSING            = 102;
    
    /* 2xx - Successfull operation */
    const RSP_SUCC_OK                   = 200;
    const RSP_SUCC_CREATED              = 201;
    const RSP_SUCC_ACCEPTED             = 202;
    const RSP_SUCC_NON_AUTHORITATIVE    = 203;
    const RSP_SUCC_NO_CONTENT           = 204;
    const RSP_SUCC_RESET_CONTENT        = 205;
    const RSP_SUCC_PARTIAL_CONTENT      = 206;
    const RSP_SUCC_MULTI_STATUS         = 207;
    const RSP_SUCC_ALREADY_REPORTED     = 208;
    const RSP_SUCC_IM_USED              = 226;
    
    /* 3xx - Redirection */
    const RSP_RED_MULTIPLE_CHOICES      = 300;
    const RSP_RED_MOVED_PERM            = 301;
    const RSP_RED_FOUND                 = 302;
    const RSP_RED_SEE_OTHER             = 303;
    const RSP_RED_NOT_MODIFIED          = 304;
    const RSP_RED_USE_PROXY             = 305;
    const RSP_RED_TMP_REDIRECT          = 307;
    const RSP_RED_PERM_REDIRECT         = 308;
    
    /* 4xx - Client-Error */
    const RSP_ERR_BAD_REQUEST           = 400;
    const RSP_ERR_UNAUTHORIZED          = 401;
    const RSP_ERR_PAYMENT_REQUIRED      = 402;
    const RSP_ERR_FORBIDDEN             = 403;
    const RSP_ERR_NOT_FOUND             = 404;
    const RSP_ERR_METHOD_NOT_ALLOWED    = 405;
    const RSP_ERR_NOT_ACCEPTABLE        = 406;
    const RSP_ERR_PROXY_AUTH_REQUIRED   = 407;
    const RSP_ERR_REQUEST_TIMEOUT       = 408;
    const RSP_ERR_CONFLICT              = 409;
    const RSP_ERR_GONE                  = 410;
    const RSP_ERR_LENGTH_REQUIRED       = 411;
    const RSP_ERR_PRECONDITION_FAILED   = 412;
    const RSP_ERR_REQ_ENT_TOO_LARGE     = 413;
    const RSP_ERR_REQ_URL_TOO_LONG      = 414;
    const RSP_ERR_UNSUPP_MEDIA_TYPE     = 415;
    const RSP_ERR_RANGE_NOT_SATISFIABLE = 416;
    const RSP_ERR_EXPECTATION_FAILED    = 417;
    const RSP_ERR_IM_A_TEAPOT           = 418;
//    const RSP_ERR_POLICY_NOT_FULLFILLED = 420; <-- Not supportet by some Apache Versions!!!
    const RSP_ERR_TOO_MANY_CONNECTIONS  = 421;
    const RSP_ERR_UNPROC_ENTITY         = 422;
    const RSP_ERR_LOCKED                = 423;
    const RSP_ERR_FAILED_DEPENDENCY     = 424;
    const RSP_ERR_UNORDERED_COLLECTION  = 425;
    const RSP_ERR_UPGRADE_REQUIRED      = 426;
    const RSP_ERR_PRECONDITION_REQUIRED = 428;
    const RSP_ERR_TOO_MANY_REQUESTS     = 429;
    const RSP_ERR_REQ_HEADER_TOO_LARGE  = 431;
    
    /* 5xx - Sever-Error */
    const RSP_ERR_INTERNAL_SERVER_ERROR = 500;
    const RSP_ERR_NOT_IMPLEMENTED       = 501;
    const RSP_ERR_BAD_GATEWAY           = 502;
    const RSP_ERR_SERVICE_UNAVAILABLE   = 503;
    const RSP_ERR_GATEWAY_TIMEOUT       = 504;
    const RSP_ERR_HTTP_VERSION_NOT_SUP  = 505;
    const RSP_ERR_VARIANT_NEGOTIATES    = 506;
    const RSP_ERR_INSUFFICIENT_STORAGE  = 507;
    const RSP_ERR_LOOP_DETECTED         = 508;
    const RSP_ERR_BANDWIDTH_EXCEEDED    = 509;
    const RSP_ERR_NOT_EXTENDED          = 510;
    
    /* Preassign the error code */
    private $currentCode                = 200;    

    /* Preassign singleton instance */
    static private $instance            = null;
    
    /* return singleton instance */
    static public function getInstance()
    {
        if( self::$instance === null )  { self::$instance = new self;   }
        
        return self::$instance;
    }
    
    private function __construct()   {}
    private function __clone()       {}
    
    public function getResponseCode()           { return $this->currentCode;    }
    public function setResponseCode( $code )    { $this->currentCode = $code;   }
    
    public function send ($data = null)
    {
        $reqHandler     = RequestHandler::getInstance();
        
        http_response_code ($this->currentCode);

        if ($data !== null) 
        { 
            echo $reqHandler->isJson () ? json_encode ($data) : $data; 
        }
        
        exit;
    }
}