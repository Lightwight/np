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

class AuthHandler extends HandlerHelper
{
    private static $instance    = null;
    
    private $method             = 'get';
    
    public static function getInstance($method)    { return ( self::$instance !== null )? self::$instance : self::$instance = new self ($method);    }    
    
    private function __construct ($method = 'get') 
    {
        $this->method   = strtolower (substr ($method, 0, 1)).substr ($method, 1);
    }
    
    private function __clone(){}
    
    public function setMethod ($method) { $this->method = strtolower (substr ($method, 0, 1)).substr ($method, 1);  }
    
    public function resolveAuth ($params)
    {
        if ($this->method === 'post')  { return $this->postAuth ($params);     }
    }
    
    private function postAuth ($params)
    {
        $login              = isset ($params['login']);
        $logout             = isset ($params['logout']);
        $register           = isset ($params['register']);
        $adminRegister      = isset ($params['adminRegister']);
        $resetConfirm       = isset ($params['reset']);
        $setNewPass         = isset ($params['setnew']);
        $changeUser         = isset ($params['user']);
        $adminChangeUser    = isset ($params['adminChangeUser']);
        $removeUser         = isset ($params['remove']);
        
        if ($login)                 { return $this->handleLogin ($params['login']);                     }
        else if ($logout)           { return $this->handleLogout ();                                    }
        else if ($register)         { return $this->handleRegister ($params['register']);               }
        else if ($adminRegister)    { return $this->handleAdminRegister ($params['adminRegister']);     }
        else if ($resetConfirm)     { return $this->handleResetPassword ($params['reset']);             }
        else if ($setNewPass)       { return $this->handleSetNewPassword ($params['setnew']);           }
        else if ($changeUser)       { return $this->handleChangeUser ($params['user']);                 }
        else if ($adminChangeUser)  { return $this->handleAdminChangeUser ($params['adminChangeUser']); }
        else if ($removeUser)       { return $this->handleRemoveUser ($params['remove']);               }
    }
    
    private function handleLogin ($params)
    {
        if (isset ($params['email']) && isset ($params['password']))
        {
            $controller     = new AuthController;
            $row            = array ('email' => $params['email'], 'password' => $params['password'], 'stayLoggedIn' => $params['stayLoggedIn']);

            $oModel         = new Model ('Users');
            $result         = $controller->login ($oModel->add ($row));
            
            return $this->prepareOutput ($result);
        }          
    }
    
    private function handleLogout ()
    {
        $controller     = new AuthController;
        $result         = $controller->logout ();

        return $this->prepareOutput ($result);
    }
    
    private function handleRegister ($params)
    {
        $email              = $params['email'];
        $password           = $params['password'];
        
        if ($email !== '' && $password !== '')
        {
            $controller     = new AuthController;
            $row            = array ('email' => $email, 'password' => $password);
            
            $oModel         = new Model ('Register');
            $result         = $controller->register ($oModel->add ($row));

            return $this->prepareOutput ($result);
        }        
    }
    
    private function handleAdminRegister ($params)
    {
        $gender             = $params['gender'];
        $name               = $params['name'];
        $prename            = $params['prename'];
        $email              = $params['email'];
        $group              = $params['group'];
        
        if (($gender === 'male' || $gender === 'female') && $email !== '' && $name !== '' && $prename !== '' && $group > 0)
        {
            $controller     = new AuthController;
            $registerRow    = array 
            (
                'email'     => $email,
                'password'  => ''
            );
            
            $userRow        = array
            (
                'gender'    => $gender, 
                'name'      => $name,
                'prename'   => $prename,
                'group'     => $group,
                'email'     => $email
            );
            
            $registerModel  = new Model ('Register');
            $userModel      = new Model ('Users');
            
            $result         = $controller->adminRegister ($registerModel->add ($registerRow), $userModel->add ($userRow));

            return $this->prepareOutput ($result);
        }        
    }
    
    private function handleResetPassword ($params)
    {
        $email  = $params['email'];
        
        if ($email !== '')
        {
            $controller     = new AuthController;
            $result         = $controller->sendResetPasswordLink ($email);
            
            return $this->prepareOutput ($result);
        }        
    }
    
    private function handleSetNewPassword ($params)
    {
        $pw_reset   = $params['pw_reset'];
        $pw_temp    = $params['pw_temp'];
        $password   = $params['password'];
        
        if ($pw_reset !== '' && $pw_temp !== '' && $password !== '')
        {
            $controller     = new AuthController;
            $result         = $controller->setNewPassword ($pw_reset, $pw_temp, $password);
            
            return $this->prepareOutput ($result);
        }        
    }     
    
    private function handleChangeUser ($params)
    {
        $controller     = new AuthController;
        $result         = $controller->changeUser ($params['prename'], $params['name'], $params['gender'], $params['company'], $params['ustid']);

        return $this->prepareOutput ($result);
    }
    
    private function handleAdminChangeUser ($params)
    {
        $controller     = new AuthController;
        $result         = $controller->adminChangeUser ($params['prename'], $params['name'], $params['gender'], $params['email'], $params['group'], $params['userID']);

        return $this->prepareOutput ($result);
    }
    
    private function handleRemoveUser ($userID)
    {
        $controller     = new AuthController;
        $result         = $controller->removeUser ($userID);

        return $this->prepareOutput ($result);
    }
}