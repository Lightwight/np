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

class SystemCheck 
{
    private $checkers   = array ();
    private $failers    = array ();
    
    public function __construct ()  {}
    
    public function addChecker ($checker)
    {
        $this->checkers[]   = $checker;
    }
    
    public function check ()
    {
        $checkers   = $this->checkers;

        foreach ($checkers as $checker) { $checker->check ();   }
    }
    
    public function passed ()
    {
        $checkers   = $this->checkers;
        $passed     = true;
        
        foreach ($checkers as $checker)
        {
            if ($checker->result () !== true)
            {
                $passed             = false;
                $this->failers[]    = $checker;
            }
        }
        
        return $passed;
    }
    
    public function getErrors ()
    {
        $failers    = $this->failers;
        $errors     = array ();

        foreach ($failers as $failer)
        {
            $errors[$failer->getName ()]    = $failer->getError ();
        }

        return $errors;
    }
}