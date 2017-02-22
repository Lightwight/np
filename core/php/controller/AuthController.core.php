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

class AuthController extends ControllerHelper
{
    public function login ($model)
    {
        $result     = $model->result();
        $user       = $result ? $result : false;
        
        return $user ? Auth::login ($user->get ('email'), $user->get ('password'), $user->get ('stayLoggedIn')) : $this->error ($this->REQ_ERR_INVALID_ARGS);
    }
    
    public function logout ()
    {
        return Auth::logout ();
    }
    
    public function register ($model)
    {
        $user   = $model->result ();
        
        return $user ? Auth::register ($user) : $this->error ($this->REQ_ERR_INVALID_ARGS);
    }
    
    public function getRegisterConfirmation ($code)
    {
        return Auth::registerConfirmation ($code);
    }
    
    public function sendResetPasswordLink ($email)
    {
        return Auth::sendResetPasswortLink ($email);
    }

    public function getResetPassword ($pw_reset)
    {
        return Auth::validateResetPasswordLink ($pw_reset);
    }
    
    public function setNewPassword ($pw_reset, $pw_temp, $password)
    {
        return Auth::setNewPassword ($pw_reset, $pw_temp, $password);
    }
    
    public function changeUser ($prename, $name, $gender, $company, $ustid)
    {
        return Auth::changeUser ($prename, $name, $gender, $company, $ustid);
    }
}