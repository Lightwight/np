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

class ErrorHandler extends ControllerHelper
{
    /* Preassign the error code */
    private $currentCode                = 200;
    
    /* return error*/
    private $error                      = false;
    
    /* return error as message*/
    private $sendErrorMessage           = false;
    
    /*
     * Error types:
     * 
     * - InternalError  [0 - 99]
     * - SQLError       [100 - 499]
     * - FileError      [500 - 519]
     * - AuthError      [520 - 539]
     * - ModelError     [540 - 559}
     * - MailError      [560 - 579]
     * - RequestError   [580 - 599]
     * - PaymentError   [600 - 619]
     */
    
    private $errorNumber;
    
    /* Internal Error number key-mappings*/    
    private $errors = array
    (
        /*
         * Internal Errors
         */
        0       => 0,       // Error number does not exist

        /*
         * All Ok
         */
        200     => 200,
        
        /*
         * Auth Errors
         */
        520     => 520,     // Unauthorized user
        
        /*
         * Mail Errors
         */
        560     => 560,     // Mail send error
        
        /*
         * Request Errors
         */
        580     => 580,     // Request error: invalid arguments
        581     => 581,     // Request error: nothing fetched
        582     => 582,     // Request error: not implemented
        583     => 583,     // Request error: not allowed
        
        /*
         * SQL Errors
         */
        1011    => 100,     // MySql HY000 (ER_CANT_DELETE_FILE): Error on delete
        1054    => 101,     // MySql SQLSTATE: 42S22 (ER_BAD_FIELD_ERROR): Unknown column %s in %S
        1055    => 404,     // MySql SQLSTATE: EMPTY RESULT
        1062    => 102,     // MySql SQLSTATE: 23000 (ER_DUP_ENTRY): Duplicate entry (Record already exists)        
        1064    => 103,     // MySql SQLSTATE: 42000 (ER_PARSE_ERROR): %s near '%s' at line %
        2000    => 104,     // MySql ERROR ON POST
        2001    => 105,     // MySql ERROR ON UPDATE
        
        /*
         * Payment Errors
         */
        600     => 600,     // Invalid Payment parameters,
        601     => 601,     // Too many requests with used token
        
        /*
         * Injection prevention errors
         */
        700     => 700      // possible session hijacking detected (could also be a session loose)
        
    );
    
    private $errorsMap = array
    (
        0       => 'Unknown Error occured',
        200     => 'All ok',
        520     => 'Unauthorized user',
        560     => 'Mail send error',
        580     => 'Request error: invalid arguments',
        581     => 'Request error: nothing fetched',
        582     => 'Request error: not implemented',
        583     => 'Request error: not allowed',
        600     => 'Invalid Payment parameters',
        601     => 'Too many requests with used token',
        700     => 'Possible session hijacking/csrf attack. User lost session.',
        1011    => 'MySql HY000 (ER_CANT_DELETE_FILE): Error on delete',
        1054    => 'MySql SQLSTATE: 42S22 (ER_BAD_FIELD_ERROR): Unknown column %s in %S',
        1055    => 'MySql SQLSTATE: EMPTY RESULT',
        1062    => 'MySql SQLSTATE: 23000 (ER_DUP_ENTRY): Duplicate entry (Record already exists)',
        1064    => 'MySql SQLSTATE: 42000 (ER_PARSE_ERROR): %s near \'%s\' at line %',
        2000    => 'MySql ERROR ON POST',
        2001    => 'MySql ERROR ON UPDATE',
    );
    
    private $responseCodes = array
    (
        200     => 200,
        0       => 500,
        
        520     => 401,
        
        560     => 503,
        
        580     => 406,
        581     => 404,
        582     => 501,
        583     => 403,
        
        600     => 406,
        601     => 429,
        
        700     => 410,
        
        1011    => 409,
        1054    => 409,
        1055    => 404,
        1062    => 409,
        1064    => 500,
        2000    => 500,
        2001    => 500
    );
    
    private $responseCodeMap = array
    (
        /* 200 - ALL_OK */        
        200     => 'REQ_OK',
        
        /* 4xx - Client-Error */        
        400     => 'RSP_ERR_BAD_REQUEST',
        401     => 'RSP_ERR_UNAUTHORIZED',
        402     => 'RSP_ERR_PAYMENT_REQUIRED',
        403     => 'RSP_ERR_FORBIDDEN',
        404     => 'RSP_ERR_NOT_FOUND',
        405     => 'RSP_ERR_METHOD_NOT_ALLOWED',
        406     => 'RSP_ERR_NOT_ACCEPTABLE',
        407     => 'RSP_ERR_PROXY_AUTH_REQUIRED',
        408     => 'RSP_ERR_REQUEST_TIMEOUT',
        409     => 'RSP_ERR_CONFLICT',
        410     => 'RSP_ERR_GONE',
        411     => 'RSP_ERR_LENGTH_REQUIRED',
        412     => 'RSP_ERR_PRECONDITION_FAILED',
        413     => 'RSP_ERR_REQ_ENT_TOO_LARGE',
        414     => 'RSP_ERR_REQ_URL_TOO_LONG',
        415     => 'RSP_ERR_UNSUPP_MEDIA_TYPE',
        416     => 'RSP_ERR_RANGE_NOT_SATISFIABLE',
        417     => 'RSP_ERR_EXPECTATION_FAILED',
        418     => 'RSP_ERR_IM_A_TEAPOT',
        421     => 'RSP_ERR_TOO_MANY_CONNECTIONS',
        422     => 'RSP_ERR_UNPROC_ENTITY',
        423     => 'RSP_ERR_LOCKED',
        424     => 'RSP_ERR_FAILED_DEPENDENCY',
        425     => 'RSP_ERR_UNORDERED_COLLECTION',
        426     => 'RSP_ERR_UPGRADE_REQUIRED',
        428     => 'RSP_ERR_PRECONDITION_REQUIRED',
        429     => 'RSP_ERR_TOO_MANY_REQUESTS',
        431     => 'RSP_ERR_REQ_HEADER_TOO_LARGE',
    
        /* 5xx - Sever-Error */
        500     => 'RSP_ERR_INTERNAL_SERVER_ERROR',
        501     => 'RSP_ERR_NOT_IMPLEMENTED',
        502     => 'RSP_ERR_BAD_GATEWAY',
        503     => 'RSP_ERR_SERVICE_UNAVAILABLE',
        504     => 'RSP_ERR_GATEWAY_TIMEOUT',
        505     => 'RSP_ERR_HTTP_VERSION_NOT_SUP',
        506     => 'RSP_ERR_VARIANT_NEGOTIATES',
        507     => 'RSP_ERR_INSUFFICIENT_STORAGE',
        508     => 'RSP_ERR_LOOP_DETECTED',
        509     => 'RSP_ERR_BANDWIDTH_EXCEEDED',
        510     => 'RSP_ERR_NOT_EXTENDED'
    );
    
    public function __construct ($errorNumber, $sendHeader = true, $sendErrorMessage = false)  
    { 
        $sendHeader                 = is_bool ($sendHeader) ? $sendHeader : true;
        $this->sendErrorMessage     = $sendErrorMessage;
        
        
        if (isset ($this->errors[$errorNumber]) )
        {
            $this->errorNumber  = $errorNumber;
            $this->error        = array ('err' => $this->errors[$errorNumber]);
        }
        else
        {
            $this->errorNumber  = 0;
            $this->error        = array ('err' => $this->errors[0]);
        }

        if ($sendHeader)
        {
            $config             = Config::getInstance ();
            $settings           = $config->getSettings ();
            
            if (isset ($settings['log']) 
                && isset ($settings['log']['responseErrors'])
                && $settings['log']['responseErrors'] === true
            ) {
                $this->logError ();
            }
            
            $errHelper          = ErrorHelper::getInstance ();
            $errHelper->setResponseCode ($this->responseCodes[$this->errorNumber]);
        }
    }
    
    public function getError ()         
    {
        return $this->sendErrorMessage ? $this->getErrorMessage () : $this->error;  
    }
    
    public function getErrorMessage ()  
    {
        $mErrors    = new Model ('Errors');
        $resError   = $mErrors
                        ->findBy ('error_id', $this->errorNumber)
                        ->orFindBy ('error_id', 0)
                        ->orderBy ('error_id', 'desc')
                        ->result ();
        
        $error          = $this->error;
        $error['msg']   = is_array ($resError) ? $resError[0]->get ('message') : $resError->get ('message');
        
        return $error;
    }
    
    private function logError ()
    {
        $mError     = new Model ('Response_errors', false);
        
        $getData    = $_GET;
        $postData   = array ();
        parse_str (file_get_contents ('php://input'), $postData);
        
        $request    = array ('get' => $getData, 'post' => $postData);
        
        $rowError   = array 
        (
            'user_id'           => $this->loggedIn () ? $this->userID () : 0,
            'rsp_code'          => $this->responseCodes[$this->errorNumber],
            'rsp_text'          => $this->responseCodeMap[$this->responseCodes[$this->errorNumber]],
            'internal_code'     => $this->errorNumber,
            'internal_text'     => $this->errorsMap[$this->errorNumber],
            'request'           => json_encode ($request),
            'error_stack'       => json_encode (debug_backtrace ())
        );

        $mError->add ($rowError);
        
        $resultError    = $mError->result ();

        $resultError->post ();
    }
}