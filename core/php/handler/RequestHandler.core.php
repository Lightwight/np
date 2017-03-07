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

class RequestHandler
{
    private static $instance        = null;
    
    private static $method          = null;
    private static $type            = null;
    private static $typeName        = null;
    private static $parameters      = array ();
    private static $handler         = null;
    private static $handle          = null;
    private static $isJson          = null;
    
    private static $typeFilters     = array
    (
        // Physically:
        'string'            => FILTER_SANITIZE_SPECIAL_CHARS,
        'html'              => FILTER_UNSAFE_RAW,
        'date'              => FILTER_SANITIZE_SPECIAL_CHARS,
        'number'            => FILTER_SANITIZE_NUMBER_FLOAT,
        'boolean'           => FILTER_VALIDATE_BOOLEAN,
        'mail'              => FILTER_VALIDATE_EMAIL,
        'password'          => FILTER_SANITIZE_SPECIAL_CHARS,
        
        // Virtuals:
        'virtual_string'    => FILTER_SANITIZE_SPECIAL_CHARS,
        'virtual_html'      => FILTER_UNSAFE_RAW,
        'virtual_date'      => FILTER_SANITIZE_SPECIAL_CHARS,
        'virtual_number'    => FILTER_SANITIZE_NUMBER_FLOAT,
        'virtual_boolean'   => FILTER_VALIDATE_BOOLEAN,
        'virtual_mail'      => FILTER_VALIDATE_EMAIL,
        'virtual_password'  => FILTER_SANITIZE_SPECIAL_CHARS,
        'virtual_object'    => FILTER_UNSAFE_RAW
    );
    
    private static $typeFlags       = array
    (
        'number'            => FILTER_FLAG_ALLOW_FRACTION,
        'virtual_number'    => FILTER_FLAG_ALLOW_FRACTION,
        'virtual_object'    => FILTER_FORCE_ARRAY
    );
    
    public static function getInstance()
    { 
        return (self::$instance !== null)? self::$instance : self::$instance = new self;    
    }
    
    private function __construct (){}
    private function __clone (){}
    
    public function resolveRequest ()
    {
        self::isJson ();

        $method             = self::resolveRequestMethod ();
        $resolveType        = 'resolveType_'.$method;
        $resolveTypeName    = 'resolveTypeName_'.$method;

        $fncExists          = method_exists ('RequestHandler', $resolveType);
        $fncExists          = $fncExists && method_exists ('RequestHandler', $resolveTypeName);

        if ($fncExists)
        {
            self::$resolveType ();
            self::$resolveTypeName ();

            $resolveParameters  = 'resolveParameters_'.$method.'_'.self::$type;
            $fncsParamsExists   = method_exists ('RequestHandler', $resolveParameters);

            if ($fncsParamsExists) 
            { 
                self::$resolveParameters ();  
            }
            else                    
            {
                $class              = strtoupper (substr (self::$type, 0, 1)).substr(self::$type, 1).'Resolver';
                $resolveParameters  = 'resolveParameters_'.$method;

                $methodExists       = class_exists ($class) && method_exists ($class, $resolveParameters);

                if ($methodExists)
                {
                    $resolver           = $class;
                    $oClass             = new $resolver ();
                    
                    self::$parameters   = $oClass->$resolveParameters (self::$type);
                }
                else
                {
                    $responder  = ResponseCodes::getInstance ();

                    $responder->setResponseCode (ResponseCodes::RSP_ERR_NOT_FOUND);
                    $responder->send ();
                }
            }

            self::createHandler ();
            self::createHandle ();

            if (self::$handler)
            {
                $classHandler   = 'Request'.strtoupper (substr (self::$type, 0, 1)).substr (self::$type, 1).'Handler';
                $classRequest   = strtoupper (substr (self::$type, 0, 1)).substr (self::$type, 1).'Request';
                
                $method         = 'resolveParameters'.  strtoupper (substr (self::$method, 0, 1)).substr (self::$method, 1);

                if (class_exists ($classHandler) && method_exists ($classHandler, $method))
                {
                    // Hook custom request handler:
                    $handlerParams      = self::$handler->$method (self::$parameters);
                    self::$parameters   = array_merge (self::$parameters, $handlerParams);
                }
                else if (class_exists ($classRequest) && method_exists ($classRequest, $method))
                {
                    $handlerParams      = self::$handler->$method (self::$parameters);
                    
                    self::$parameters   = array_merge (self::$parameters, $handlerParams);
                }
                else
                {
                    $responder  = ResponseCodes::getInstance ();

                    $responder->setResponseCode (ResponseCodes::RSP_ERR_NOT_FOUND);
                    $responder->send ();
                }
            }
            else
            {
                 // Error Code method not allowed!
            }
        }
        else
        {
            // Try to get plugin method
            // Error Code method not allowed!
        }
    }
    
    public function getType ()          { return self::$type;                           }
    public function getMethod ()        { return self::$method;                         }
    public function getHandler ()       { return self::$handle? self::$handle : false;  }
    public function getParameters ()    { return self::$parameters;                     }

    public static function isJson ()
    {
        $isACrawlerRequest  = self::isACrawlerRequest();
        
        if (self::$isJson === null && !$isACrawlerRequest)
        {
            $isJson     = false;

            if (isset ($_SERVER['CONTENT_TYPE']))
            {
                $cType      = strtolower (filter_var ($_SERVER['CONTENT_TYPE'], FILTER_SANITIZE_SPECIAL_CHARS));
                $isJson     = strpos ($cType, 'application/json') !== false || strpos ($cType, 'text/json') !== false;
            } 
            
            self::$isJson   = $isJson;
        }
        else if ($isACrawlerRequest)
        {
            self::$isJson   = false;
        }
        
        return self::$isJson;
    }
    
    private static function resolveRequestMethod ()
    {
        self::$method   = strtolower (filter_var ($_SERVER['REQUEST_METHOD'], FILTER_SANITIZE_FULL_SPECIAL_CHARS, FILTER_NULL_ON_FAILURE));
        
        $crawlerDetect  = new CrawlerDetect ();
        
        if (!$crawlerDetect->isCrawler ())
        {    
            function return_bytes ($val) 
            {
                $val    = trim ($val);
                $last   = strtolower ($val[strlen ($val)-1]);
                $num    = (int)substr ($val, 0, strlen ($val)-1);

                switch ($last) 
                {
                    case 'g':
                        $num *= 1024;
                    case 'm':
                        $num *= 1024;
                    case 'k':
                        $num *= 1024;
                }

                return $num;
            }  
            
            //select maximum upload size
            $max_upload     = return_bytes (ini_get ('upload_max_filesize'));

            //select post limit
            $max_post       = return_bytes (ini_get ('post_max_size'));

            //select memory limit
            $memory_limit   = return_bytes (ini_get ('memory_limit'));

            // return the smallest of them, this defines the real limit
            $max            = min ($max_upload, $max_post, $memory_limit);
            $content_length = isset ($_SERVER['CONTENT_LENGTH']) ? $_SERVER['CONTENT_LENGTH'] : 0;
            
            if ((is_array ($_FILES) && count ($_FILES) > 0) || $content_length > $max)
            {
                $hasFiles                       = (is_array ($_FILES) && count ($_FILES) > 0);

                self::$parameters['files']      = $hasFiles ? $_FILES : array ('error' => UPLOAD_ERR_INI_SIZE);
                self::$parameters['type']       = 'fupload';
                self::$parameters['folder']     = isset ($_POST['folder']) ? (int)$_POST['folder'] : 1;
                self::$parameters['model']      = isset ($_POST['model']) ? filter_var ($_POST['model'], FILTER_SANITIZE_FULL_SPECIAL_CHARS) : false;
            }
            else
            {
                parse_str (file_get_contents ('php://input'), self::$parameters);
            }
        }
        else 
        {
            self::$method   = 'get';
        }
            
        return self::$method;
    }
    
    private static function resolveType_get ()   
    { 
        self::$type = filter_input (INPUT_GET, 'type', FILTER_SANITIZE_SPECIAL_CHARS, FILTER_NULL_ON_FAILURE);
    }
    
    private static function resolveType_post ()  
    { 
        self::$type = isset (self::$parameters['type']) ? filter_var (self::$parameters['type'], FILTER_SANITIZE_SPECIAL_CHARS) : false;
    }
    
    private static function resolveType_delete ()   
    { 
        self::$type = isset (self::$parameters['type']) ? filter_var (self::$parameters['type'], FILTER_SANITIZE_SPECIAL_CHARS) : false;
    }

    private static function resolveTypeName_post ()      
    { 
        if (self::$type)
        {
            self::$typeName = filter_input (INPUT_GET, self::$type, FILTER_SANITIZE_SPECIAL_CHARS, FILTER_NULL_ON_FAILURE);
        }
    }
    
    private static function resolveTypeName_delete ()    
    { 
        if (self::$type)
        {
//            self::$typeName = filter_input( INPUT_, $string, $filter, FILTER_NULL_ON_FAILURE );
        }
    }
    
    private static function resolveTypeName_get ()       
    {
        if (self::$type)
        {
            self::$typeName = filter_input (INPUT_GET, self::$type, FILTER_SANITIZE_SPECIAL_CHARS, FILTER_NULL_ON_FAILURE);
        }
    }

    private static function resolveParameters_get_route ()   
    {
        $pluginHandler  = new PluginHandler ();
        $oConfig        = Config::getInstance ();
        $oSql           = Sql::getInstance ();
        $settings       = $oConfig->getSettings ();

        $defaultRoute   = isset ($settings['routes']) && isset ($settings['routes']['custom']) ? $settings['routes']['custom'] : '/';
        $search         = trim ($oSql->real_escape_string (self::$typeName));
        
        if ($search === '')                 { $search = $defaultRoute;  }
        if (self::isACrawlerRequest ())     { $search = '/'.$search;    }
        $search         = str_replace ('//', '/', $search);
        
        $item           = false;
        
        $origin         = $search;
        
        $query          = 'SELECT ';
        $query         .=   '`route`, ';
        $query         .=   's.`name` as "scope" ';
        $query         .= 'FROM ';
        $query         .=   '`routes` ';
        $query         .= 'INNER JOIN ';
        $query         .=   '`route_scopes` as s ';
        $query         .= 'ON ';
        $query         .=   '`scope_id`=s.`ID` ';
        $query         .= 'WHERE ';
        $query         .=   '`route`="'.$search.'";';

        $result         = $oSql->query ($query);

        if (is_array ($result) && count ($result) === 1)
        {
            $route  = $result[0]['route'];
            $scope  = $result[0]['scope'];
        }
        else
        {
            $route  = false;
            $scope  = 'custom';
        }

        if (!$route)
        {
            $route_parts    = explode ('/', $search);
            $routes         = array ();
            $item           = false;
            $last           = '';

            if (is_array ($route_parts) && count($route_parts) > 0)
            {
                foreach ($route_parts as $part)
                {
                    $routes[]   = $oSql->real_escape_string ($last.$part.'/*');
                    $last      .= $part.'/';
                }

                $routes = array_reverse ($routes) ;

                foreach ($routes as $key => $link)
                {
                    $query  = 'SELECT ';
                    $query .=   '`route`,';
                    $query .=   's.`name` AS "scope" ';
                    $query .= 'FROM ';
                    $query .=   '`routes` ';
                    $query .= 'INNER JOIN ';
                    $query .=   '`route_scopes` AS s ';
                    $query .= 'ON ';
                    $query .=   '`routes`.`scope_id`=s.`ID` ';
                    $query .= 'WHERE ';
                    $query .=   '`route`="'.$link.'";';
                    
                    $result = $oSql->query ($query);

                    if (is_array ($result) && count ($result) === 1)
                    {
                        $route      = strtolower ($result[0]['route']);
                        $scope      = strtolower ($result[0]['scope']);

                        $search     = str_replace (substr ($route, 0, strlen ($route)-1), '', $search);
                        
                        $items      = explode ('/', $search);
                        $item       = '';
                        
                        foreach ($items as $subitem)
                        {
                            $item  .= $oSql->real_escape_string (filter_var ($subitem, FILTER_SANITIZE_STRING)). '/';
                        }

                        if (strrpos ($item, '/') === strlen ($item) - 1) 
                        {
                            $item   = substr ($item, 0, strlen ($item) - 1);
                        }
                        
                        break;
                    }
                }
            }
        }

        $oConfig->setScope ($scope);
        
        self::$parameters[self::$type]      = $route;
        self::$parameters['item']           = $item;
        self::$parameters['origin']         = $origin;
        self::$parameters['defaults']       = filter_input (INPUT_GET, 'defaults', FILTER_SANITIZE_SPECIAL_CHARS, FILTER_NULL_ON_FAILURE);
        self::$parameters['plugin']         = $pluginHandler->getByRoute ($route);
    }
    
    private static function resolveParameters_post_page ()      {}
    private static function resolveParameters_delete_page ()    {}
    
    private static function resolveParameters_post_fupload ()   {}
    
    private static function resolveParameters_get_auth () 
    {
        self::$parameters['auth']   = null;

        $params         = filter_input_array (INPUT_GET, FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
        $authParams     = isset ($params['auth']) ? $params['auth'] : false;

        if ($authParams)
        {
            if (isset ($authParams['reset']) && isset ($authParams['reset']['password']))
            {
                $oSql       = Sql::getInstance ();
                $pw_reset   = $oSql->real_escape_string (filter_var ($authParams['reset']['password'], FILTER_SANITIZE_STRING));
                
                self::$parameters['auth']   = array
                (
                    'reset' => array
                    (
                        'pw_reset'  => $pw_reset
                    )
                );
            }
            else if (isset ($authParams['register']) && isset ($authParams['register']['confirmation']))
            {
                $reg_code   = $authParams['register']['confirmation'];
                
                self::$parameters['auth']   = array
                (
                    'register'  => array
                    (
                        'confirmation_code'  => $reg_code
                    )
                );
            }
        }
    }
    
    private static function resolveParameters_post_auth ()     
    {
        $authParams                 = isset (self::$parameters['auth']) ? self::$parameters['auth'] : false;
        self::$parameters['auth']   = null;

        if ($authParams)
        {
            if (isset ($authParams['login']) && isset ($authParams['login']['email']) && isset ($authParams['login']['password']))
            {
                $oSql           = Sql::getInstance ();
                $email          = $oSql->real_escape_string (filter_var ($authParams['login']['email'], FILTER_VALIDATE_EMAIL));
                $password       = $authParams['login']['password'];
                $stayLoggedIn   = isset ($authParams['login']['stayLoggedIn']) ? filter_var ($authParams['login']['stayLoggedIn'], FILTER_VALIDATE_BOOLEAN) : false;
                
                self::$parameters['auth']   = array 
                (
                    'login'     => array 
                    (
                        'email'         => $email,
                        'password'      => $password,
                        'stayLoggedIn'  => $stayLoggedIn
                    )
                );
            }   
            else if (isset ($authParams['logout']))
            {
                self::$parameters['auth']   = array ('logout' => true);
            }
            else if (isset ($authParams['register']) && isset ($authParams['register']['email']) && isset ($authParams['register']['password']))
            {
                $oSql       = Sql::getInstance ();
                $email      = $oSql->real_escape_string (filter_var ($authParams['register']['email'], FILTER_VALIDATE_EMAIL));
                $password   = $authParams['register']['password'];
                
                self::$parameters['auth']   = array 
                (
                    'register'  => array 
                    (
                        'email'     => $email,
                        'password'  => $password
                    )
                );
            } 
            else if (isset ($authParams['adminRegister']) 
                     && isset ($authParams['adminRegister']['gender']) 
                     && isset ($authParams['adminRegister']['name'])
                     && isset ($authParams['adminRegister']['prename'])
                     && isset ($authParams['adminRegister']['group'])
                     && isset ($authParams['adminRegister']['email']))
            {
              
                $oSql       = Sql::getInstance ();
                $gender     = $authParams['adminRegister']['gender'] === 'male' ? 'male' : 'female';
                $name       = filter_var ($authParams['adminRegister']['name'], FILTER_SANITIZE_STRING);
                $prename    = filter_var ($authParams['adminRegister']['prename'], FILTER_SANITIZE_STRING);
                $email      = $oSql->real_escape_string (filter_var ($authParams['adminRegister']['email'], FILTER_VALIDATE_EMAIL));
                $group      = (int)$authParams['adminRegister']['group'];

                self::$parameters['auth']   = array 
                (
                    'adminRegister'  => array 
                    (
                        'gender'    => $gender,
                        'name'      => $name,
                        'prename'   => $prename,
                        'email'     => $email,
                        'group'     => $group
                    )
                );
            } 
            else if (isset ($authParams['adminChangeUser'])
                    && isset ($authParams['adminChangeUser']['gender'])
                    && isset ($authParams['adminChangeUser']['name'])
                    && isset ($authParams['adminChangeUser']['prename'])
                    && isset ($authParams['adminChangeUser']['email'])
                    && isset ($authParams['adminChangeUser']['group'])
                    && isset ($authParams['adminChangeUser']['id'])
            ) {
                $oSql       = Sql::getInstance ();
                $gender     = $authParams['adminChangeUser']['gender'] === 'male' ? 'male' : 'female';
                $name       = filter_var ($authParams['adminChangeUser']['name'], FILTER_SANITIZE_STRING);
                $prename    = filter_var ($authParams['adminChangeUser']['prename'], FILTER_SANITIZE_STRING);
                $email      = $oSql->real_escape_string (filter_var ($authParams['adminChangeUser']['email'], FILTER_VALIDATE_EMAIL));
                $group      = (int)$authParams['adminChangeUser']['group'];
                $userID     = (int)$authParams['adminChangeUser']['id'];

                self::$parameters['auth']   = array 
                (
                    'adminChangeUser'  => array 
                    (
                        'gender'    => $gender,
                        'name'      => $name,
                        'prename'   => $prename,
                        'email'     => $email,
                        'group'     => $group,
                        'userID'    => $userID
                    )
                );
            }
            else if (isset ($authParams['reset']) && isset ($authParams['reset']['email']))
            {
                $oSql       = Sql::getInstance ();
                $email      = $oSql->real_escape_string (filter_var ($authParams['reset']['email'], FILTER_VALIDATE_EMAIL));
                
                self::$parameters['auth']   = array
                (
                    'reset' => array
                    (
                        'email'     => $email
                    )
                );
            }
            else if (isset ($authParams['setnew']) 
                    && isset ($authParams['setnew']['pw_reset'])
                    && isset ($authParams['setnew']['pw_temp'])
                    && isset ($authParams['setnew']['password'])
            ) {
                $pw_reset   = $authParams['setnew']['pw_reset'];
                $pw_temp    = $authParams['setnew']['pw_temp'];
                $password   = $authParams['setnew']['password'];
                
                self::$parameters['auth']   = array
                (
                    'setnew'  => array
                    (
                        'pw_reset'  => $pw_reset,
                        'pw_temp'   => $pw_temp,
                        'password'  => $password
                    )
                );
            }
            else if (isset ($authParams['user']))
            {
                $gender     = isset ($authParams['user']['gender']) && ($authParams['user']['gender'] === 'male' || $authParams['user']['gender'] === 'female') ? $authParams['user']['gender'] : false;
                $prename    = isset ($authParams['user']['prename']) ? $authParams['user']['prename'] : false;
                $name       = isset ($authParams['user']['name']) ? $authParams['user']['name'] : false;
                $company    = isset ($authParams['user']['company']) ? $authParams['user']['company'] : false;
                $ustid      = isset ($authParams['user']['ustid']) ? $authParams['user']['ustid'] : false;
                
                self::$parameters['auth']   = array
                (
                    'user'  => array
                    (
                        'gender'            => $gender,
                        'prename'           => filter_var ($prename, FILTER_SANITIZE_STRING),
                        'name'              => filter_var ($name, FILTER_SANITIZE_STRING),
                        'company'           => filter_var ($company, FILTER_SANITIZE_STRING),
                        'ustid'             => filter_var ($ustid, FILTER_SANITIZE_STRING),
                    )
                );
            }
            else if (isset ($authParams['remove']))
            {
                $userID     = (int)$authParams['remove'];
                
                self::$parameters['auth']   = array
                (
                    'remove'  => $userID
                );
            }
        }        
    }
    
    private static function resolveParameters_get_definition ()   
    {
        self::$parameters[self::$type]  = self::$typeName;
    }
    
    private static function resolveParameters_post_definition ()     {}
    private static function resolveParameters_delete_definition ()   {}

    private static function resolveParameters_get_model ()   
    {
        self::$parameters['model']          = self::$typeName;
        self::$parameters[self::$typeName]  = filter_input (INPUT_GET, self::$typeName, FILTER_SANITIZE_SPECIAL_CHARS, FILTER_REQUIRE_ARRAY);
    }
    
    private static function resolveParameters_post_model ()
    {
        if (isset (self::$parameters['type']) 
            && isset (self::$parameters['model']) 
            && isset (self::$parameters[self::$parameters['model']])
            && isset (self::$parameters['route']))
        {
            $model              = self::$parameters['model'];
            
            $defHandler         = DefinitionHandler::getInstance ();
            $definition         = $defHandler->resolveDefinition ($model);
            $filtered           = array ();
            $filter             = $definition[$model];

            foreach ($filter as $key => $type)  
            { 
                if (!array_key_exists ($type, self::$typeFlags))
                {
                    $filter[$key]   = array ('filter' => self::$typeFilters[$type]);  
                }
                else
                {
                    $filter[$key]   = array ('filter' => self::$typeFilters[$type], 'flags' => self::$typeFlags[$type]);  
                }
            }

            if (count ($filter) > 0)
            {
                $datasets   = self::$parameters[$model];
                
                foreach ($datasets as $key => $dataset)
                {
                    $state  = isset ($dataset['state']) ? $dataset['state'] : false;
                    
                    unset (self::$parameters[$model][$key]);
                    
                    if (isset ($dataset['row']))
                    {
                        if (array_key_exists ('id', $dataset['row']))
                        {
                            $dataset['row']['ID']   = $dataset['row']['id'];
                            
                            unset ($dataset['row']['id']);
                        }
                        
                        $filtered[$key] = filter_var_array ($dataset['row'], $filter);
                        
                        foreach ($filtered[$key] as $inx => $val)
                        {
                            if (empty ($val) && $val !== 0 && $val !== '0') 
                            {
                                unset ($filtered[$key][$inx]);
                            }
                        }
                        
                        self::$parameters[$model][$key]['row'] = $filtered[$key];
                        
                        if ($state) { self::$parameters[$model][$key]['state'] = $state;    }
                    }
                }
            }
        }
    }
    
    private static function resolveParameters_delete_model ()   
    {
        $reqType                = self::$type;
        
        if (isset (self::$parameters['dataset']))
        {
            $model              = self::$parameters[$reqType];

            $defHandler         = DefinitionHandler::getInstance ();
            $definition         = $defHandler->resolveDefinition ($model);

            $filtered           = array ();
            $filter             = $definition[$model];

            foreach ($filter as $key => $type)  
            { 
                $filter[$key] = array ('filter' => self::$typeFilters[$type]);  
            }

            if (count ($filter) > 0)
            {
                $datasets   = self::$parameters['dataset'];

                foreach ($datasets as $key => $dataset)
                {
                    $filtered[$key] = filter_var_array ($dataset, $filter);
                }

                self::$parameters['dataset'] = $filtered;
            }
        }
    }
    
    private static function resolveParameters_post_lang ()   
    {
        self::$parameters['lang']   = filter_input (INPUT_POST, self::$type, FILTER_SANITIZE_SPECIAL_CHARS);
    }
    
    private static function createHandler ()
    {
        $class          = 'Request'.strtoupper (substr (self::$type, 0, 1)).substr (self::$type, 1).'Handler';
        $pluginClass    = strtoupper (substr (self::$type, 0, 1)).substr (self::$type, 1).'Request';

        if (self::$type && class_exists ($class)) 
        { 
            self::$handler = $class::getInstance();   
        }
        else if (self::$type && class_exists ($pluginClass))
        {
            self::$handler = $pluginClass::getInstance();   
        }
    }
    
    private static function createHandle ()
    {
        if (self::$type) 
        { 
            self::$handle = 'handle'.strtoupper (substr (self::$type, 0, 1)).substr (self::$type, 1);
        }
    }
    
    private static function isACrawlerRequest ()
    {
        $crawlerDetect  = new CrawlerDetect ();
        
        return $crawlerDetect->isCrawler ();
    }    
}