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

require_once 'Autoload.core.php';

class NP
{
    private $requestHandler     = null;
    private $responseHandler    = null;
    
    public function __construct ()   
    { 
        // If a bot is trying to crawl the page, then dont start session/cookie logic
        if (!$this->isACrawlerRequest ())
        {
            // Don't run core, if it isnt a html or json request or file-upload
            // This will happen, if there are undefined image-sources requested by
            // the client. If that happens and we would run the core, then
            // it would handle the request as a CSRF-Attack. Obviously it isnt.
            // So we stop it:
            $sAccept    = isset ($_SERVER['HTTP_ACCEPT']) ? $_SERVER['HTTP_ACCEPT'] : false;
            $isFUpload  = isset ($_FILES) && is_array ($_FILES) && count ($_FILES) > 0;
            $vAccept    = strpos ($sAccept, '/json') !== false || strpos ($sAccept, '/html') || $isFUpload;

            if (!$vAccept)
            {
                $isImage    = strpos ($sAccept, 'image/') !== false;

                if ($isImage)   { $this->sendDummyImage (); }
            }
            else
            {
                $oSql       = Sql::getInstance ();
                $config     = Config::getInstance ();
                $settings   = $config->getSettings ();

                $secCode    = isset ($settings['session']['security_code']) ? $settings['session']['security_code'] : '6CbMr[-wZMuk,c,';
                $lToAgent   = isset ($settings['session']['lock_to_user_agent']) ? $settings['session']['lock_to_user_agent'] !== false : true;
                $lToIP      = isset ($settings['session']['lock_to_user_ip']) ? $settings['session']['lock_to_user_ip'] !== false : false;

                $conn       = $oSql->getConnection ();
                $session    = new ZebraSession ($conn, $secCode, 172800);

                NPCookie::init ();

                if (isset ($_SESSION['np_meta']))
                {
                    foreach ($_SESSION['np_meta'] as $key => $val)
                    {
                        $_GET[$key] = $val;
                    }
                }
            }
        }
    }
    
    public function resolve ()
    {
        // Check if system is setup correctly:
        $oSystemCheck   = new SystemCheck ();
        
        $oSystemCheck->addChecker (new HtaccessDiagnoser ());
        $oSystemCheck->check ();

        if ($oSystemCheck->passed ())
        {
            $this->requestHandler   = RequestHandler::getInstance ();

            $this->requestHandler->resolveRequest ();

            $this->responseHandler  = ResponseHandler::getInstance ();

            $params         = $this->requestHandler->getParameters ();

            if (!$this->isACrawlerRequest ())
            {
                $type           = $this->requestHandler->getType ();
                $class          = strtoupper (substr ($type, 0, 1)).substr ($type, 1);
                $handler        = $this->requestHandler->getHandler ();

                $isJson         = $this->requestHandler->isJson ();
                $validToken     = $isJson ? NPToken::validateToken () : true;

                if ($validToken)
                {
                    $pluginHandler  = 'resolve'.$class;

                    if (method_exists ('NP', $handler)) 
                    {
                        return $this->$handler ($params); 
                    }
                    else if (class_exists ($class.'Handler') && method_exists ($class.'Handler', $pluginHandler))
                    {                    
                        $reqType        = $this->requestHandler->getMethod ();
                        $pluginClass    = $class.'Handler';

                        $oClass         = $pluginClass::getInstance ($reqType);
                        $result         = $oClass->$pluginHandler ($params);

                        $isLoggedIn     = Auth::loggedIn ();

                        if (is_array ($result) && !isset ($result['auth']))
                        {
                            $result['auth'] = array ('loggedIn' => $isLoggedIn ? 1 : 0);
                        }

                        NPCookie::sendCookies ();

                        return $isJson ? json_encode ($result) : (is_array ($result) ? json_encode ($result) : $result); 
                    }
                    else
                    {
                        NPCookie::sendCookies ();

                        $responder  = ResponseCodes::getInstance ();

                        $responder->setResponseCode (ResponseCodes::RSP_ERR_NOT_FOUND);
                        $responder->send ();
                    }
                }
                else
                {
                    NPCookie::sendCookies ();

                    $response       = array ('err' => 700);

                    $errorHandler   = new ErrorHandler (700, true);

                    $responder      = ResponseCodes::getInstance ();

                    $responder->setResponseCode (ResponseCodes::RSP_ERR_GONE);
                    $responder->send ($response);
                }
            }
            else 
            {
                return $this->handleRoute ($params); 
            }
        }
        
        return json_encode ($oSystemCheck->getErrors ());
    }
    
    private function handleRoute ($params)
    {
        if (isset ($params['route']))
        {
            $route          = $params['route'];

            $routeHandler   = RouteHandler::getInstance ($route);
            $routeData      = $routeHandler->resolveRoute ();

            NPCookie::sendCookies ();

            return $this->responseHandler->resolve ($this->requestHandler, $routeData);
        }
        else
        {
            // TODO: METHOD NOT ALLOWED
            return;
        }
    }
    
    private function handleDefinition ($params)
    {
        if (isset ($params['definition']))
        {
            $definition         = $params['definition'];
            
            $definitionHandler  = DefinitionHandler::getInstance ();
        
            $definitionData     = $definitionHandler->resolveDefinition ($definition, 1);
        
            NPCookie::sendCookies ();
            
            return $this->responseHandler->resolve ($this->requestHandler, $definitionData);
        }
        else 
        {
            // TODO: METHOD NOT ALLOWED
            return;
        }
    }
    
    private function handleModel ($params)
    {
        if (isset ($params['model']))
        {
            $reqType            = $this->requestHandler->getMethod ();
            $modelHandler       = ModelHandler::getInstance ();
            
            $modelHandler->setMethod ($reqType);

            $modelData          = $modelHandler->resolveModel ($params);

            NPCookie::sendCookies ();
            
            return $this->responseHandler->resolve ($this->requestHandler, $modelData);
        }
        else
        {
            // TODO: METHOD NOT ALLOWED
            return;
        }
    }
    
    private function handleAuth ($params)
    {

        if (isset ($params['auth']))
        {
            $reqType        = $this->requestHandler->getMethod ();
            $authHandler    = AuthHandler::getInstance ($reqType);

            $authData       = $authHandler->resolveAuth ($params['auth']);

            NPCookie::sendCookies ();
            
            return $this->responseHandler->resolve ($this->requestHandler, $authData);            
        }
        else
        {
            $error  = new ErrorHandler (582);

            return json_encode ($error->getErrorMessage ());
        }
    }
    
    private function handleFupload ($files)
    {
        if (isset ($files['files']))
        {
            NPCookie::init ();

            $mediathek  = new MediathekController ();
            
            $folder     = isset ($files['folder']) ? (int)$files['folder'] : 1;
            $model      = isset ($files['model']) ? $files['model'] : false;

            $uploaded   = $mediathek->saveMedia ($files['files'], $folder, $model);

            header ('Content-Type: application/json');

            return json_encode (array ('files' => $uploaded));
        }
        else
        {
            return;
        }            
    }
    
    private function handleLang ($lang)
    {
        $langHelper     = new LanguageHelper ();
        $langHelper->setLanguage ($lang['lang']);

        NPCookie::sendCookies ();

        return true;
    }
    
    private function sendDummyImage ()
    {
        $config     = Config::getInstance ();
        $settings   = $config->getSettings ();
        $imageDummy = isset ($settings['dummies']) && isset ($settings['dummies']['image']) ? $settings['dummies']['image'] : false;
        $path       = getcwd ();
        $path       = str_replace ('\\', '/', $path).'/';

        if (strrpos ($path, '/') < strlen ($path)-1) { $path .= '/';    }

        if ($imageDummy)
        {
            $src    = $path.$imageDummy;
            $src    = str_replace ('//', '/', $src);
            
            header ('Content-type: image/png');            

            if (file_exists ($src)) { readfile ($src);  }
            else                    { echo '';          }
            
            exit;
        }
    }
    
    private function isACrawlerRequest ()
    {
        $crawlerDetect  = new CrawlerDetect ();
        
        return $crawlerDetect->isCrawler ();
    }
}

$np = new NP();
