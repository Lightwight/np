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

class HandlerHelper
{
    protected $REQ_ERR_UNKNOWN                      = 0;
    protected $AUTH_ERR_UNAUTHORIZED                = 520;
    protected $MAIL_ERR_SEND                        = 560;
    protected $REQ_ERR_INVALID_ARGS                 = 580;
    protected $REQ_ERR_NOT_FOUND                    = 581;
    protected $RSP_ERR_NOT_IMPLEMENTED              = 582;
    protected $RSP_ERR_FORBIDDEN                    = 583;
    protected $PAY_ERR_INVALID_ARGS                 = 600;
    protected $PAY_ERR_TOO_MANY_TOKEN_REQUESTS      = 601;
    protected $SQL_ERR_ON_DELETE                    = 1011;
    protected $SQL_ERR_UNKNOWN_COLUMN               = 1054;
    protected $SQL_ERR_NOT_FOUND                    = 1055;
    protected $SQL_ERR_DUPLICATE_ENTRY              = 1062;
    protected $SQL_ERR_PARSE_ERROR                  = 1064;
    protected $SQL_ERR_ON_POST                      = 2000;
    protected $SQL_ERR_ON_UPDATE                    = 2001;
    
    protected function error ($errorNumber, $sendHeader = true)
    {
        return new ErrorHandler ($errorNumber, $sendHeader);
    }
    
    protected function errorMessage ($errorNumber, $sendHeader = true)
    {
        return new ErrorHandler ($errorNumber, $sendHeader, true);
    }

    protected function prepareOutput ($result)
    {
        $fetched    = array ();

        $isModel    = is_object ($result) && get_class ($result) === 'Model';
        $isError    = is_object ($result) && get_class ($result) === 'ErrorHandler';
        
        if ($isModel)   { $result = $result->result (); }

        $isManip    = is_object ($result) && get_class ($result) === 'ModelManip';
        
        if (is_array ($result))
        {
            foreach ($result as $manip)
            {
                if (is_object ($manip) && get_class ($manip) === 'ModelManip')
                {
                    $error      = $manip->getError ();
                    $row        = $manip->getRow ();    
                    $name       = $manip->getName ();

                    if (!array_key_exists ($name, $fetched))
                    {
                        $fetched[$name]    = array ();
                    }

                    if (count ($error) > 0)
                    {
                        $fetched[$name][]  = $error;
                    }
                    else if ($row)
                    {
                        $fetched[$name][]  = $row;
                    }
                }
                else if (is_array ($manip))
                {
                    foreach ($manip as $subManip)
                    {

                        $error      = $subManip->getError ();
                        $row        = $subManip->getRow ();    
                        $name       = $subManip->getName ();

                        if (!array_key_exists ($name, $fetched))
                        {
                            $fetched[$name]    = array ();
                        }

                        if (count ($error) > 0)
                        {
                            $fetched[$name][]  = $error;
                        }
                        else if ($row)
                        {
                            $fetched[$name][]  = $row;
                        }
                    }
                }
                else
                {
                    return $result;
                }
            }
        }
        else if ($isManip)
        {
            $error      = $result->getError ();
            $row        = $result->getRow ();    
            $name       = $result->getName ();

            if (count ($error) > 0)
            {
                $fetched[$name] = $error;
            }
            else if ($row)
            {
                $fetched[$name] = $row;
            }                        
        }        
        else if ($isError)
        {
            $fetched    = $result->getError ();
        }
        else
        {
            $fetched    = $result;
        }

        return $fetched;
    }
    
    protected function isACrawlerRequest ()
    {
        $crawlerDetect  = new CrawlerDetect ();

        return $crawlerDetect->isCrawler ();
    }    
    
    protected function isNPSeoBot ()
    {
        return $_SERVER['HTTP_USER_AGENT'] === 'NP-SEO-BOT';
    }
}