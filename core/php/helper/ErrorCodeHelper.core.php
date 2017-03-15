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

/*
 * Abstract class error codes equals database table error codes
 */
abstract class ErrorCodeHelper
{
    /* Authentification or rigths errors: */ 
    public static $_AUTH_UNAUTHORIZED               = 1;
    public static $_AUTH_LOST_SESSION               = 8;
    public static $_AUTH_NOT_ENOUGH_PRIVILEGES      = 16;
    public static $_AUTH_SESSION_LOST_OR_HIJACKED   = 17;

    /* Mail errors */
    public static $_MAIL_ERR_SEND                   = 2;

    /* SQL errors: */ 
    public static $_SQL_ERROR_ON_DELETE             = 9;
    public static $_SQL_INVALID_ARGUMENTS           = 10;
    public static $_SQL_EMPTY_RESULT                = 11;
    public static $_SQL_DUPLICATE_ENTRY             = 12;
    public static $_SQL_SYNTAX_ERROR                = 13;
    public static $_SQL_ERROR_ON_POST               = 14;
    public static $_SQL_ERROR_ON_UPDATE             = 15;
    public static $_SQL_UNKNOWN_COLUMN              = 18;

    /* Payment errors: */ 
    public static $_PAYMENT_IVALID_PAYMENT_DATA     = 6;
    public static $_PAYMENT_TOO_MANY_TOKEN_REQUESTS = 7;

    /* User request errors: */
    public static $_REQ_INVALID_ARGS                = 3;
    public static $_REQ_EMPTY_RESULT                = 4;



    /* System errors: */ 
    public static $_SYS_ERR_UNKNOWN                  = 0;
    public static $_SYS_ERR_NOT_IMPLEMENTED          = 5;
}