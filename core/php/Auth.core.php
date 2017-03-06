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

class Auth
{
    public static function login ($email, $password, $stayLoggedIn)
    {
        $mUser  = new Model ('Users');
        $user   = $mUser->findBy ('email', $email)->result ();

        if ($user && CryptoLib::validateHash ($user->get ('password'), $password))
        {
            return self::setUser ($user->getRow (), $stayLoggedIn);
        }

        return new ErrorHandler (580, true);
    }

    public static function logout ()
    {
        unset ($_SESSION['auth']);
        
        NPCookie::deleteCookie ('auth');
        
        return true;
    }
    
    public static function loggedIn()   
    { 
        $cookieAuth = NPCookie::getCookie ('auth', false);

        if ($cookieAuth && !isset ($_SESSION['auth']))  { $_SESSION['auth'] = $cookieAuth;  }
        
        return isset ($_SESSION['auth']); 
    }   
    
    public static function register ($regUser, $sendMail = true)
    {
        $code       = CryptoLib::randomString (128);
        $hashedCode = CryptoLib::hash ($code, CryptoLib::generateSalt ());
        
        $user       = new Model ('Users');
        $reg        = new Model ('Register');

        $userRows   = $user->findBy ('email', $regUser->get ('email'))->result();
        $regRows    = $reg->findBy ('email', $regUser->get ('email'))->result();

        if (!$userRows)
        {
            if ($regRows)
            {
                $regRow = $regRows;

                $regRow->set ('password', CryptoLib::hash ($regUser->get ('password'), CryptoLib::generateSalt ()));
                $regRow->set ('confirmation_code', $hashedCode);
            }
            else
            {
                $regUser->set ('password', CryptoLib::hash ($regUser->get ('password'), CryptoLib::generateSalt ()));
                $regUser->set ('confirmation_code', $hashedCode);
            }

            $registered = !$regRows ? $regUser->post () : $regRow->update ();

            if ($registered)
            {
                if ($sendMail)
                {
                    $subject            = 'np.dev - Registrierungs E-Mail';

                    $body               = 'Herzlich Willkommen bei unserem Shop auf ihr-shop.de.<br><br>';
                    $body              .= 'Bitte klicken Sie auf den nachfolgenden Link, um Ihr Konto zu aktivieren<br><br>';
                    $body              .= 'Best&auml;tigungslink: <a href="'.self::setting ('auth', 'confirmation_link').$code.'">Hier klicken</a>';

                    $altBody            = 'Herzlich Willkommen bei unserem Shop auf ihr-shop.de.'."\r\n\r\n";
                    $altBody           .= 'Bitte rufen Sie den nachfolgenden Link in einem Browser auf, um Ihr Konto zu aktivieren'."\r\n\r\n";
                    $altBody           .= 'Bestätigungslink: '.self::setting ('auth', 'confirmation_link').$code;

                    $mailed             = self::mail ($regUser->get ('email'), $subject, $body, $altBody);

                    return $mailed ? 1 : $mailed;
                }

                return array
                (
                    'id'    => $registered,
                    'code'  => $code
                );
            }
            else 
            {
                return $user->getError ();
            }
        }
        else
        {
            return new ErrorHandler (1062);
        }        
    }
    
    public static function adminRegister ($registerModel, $userModel, $sendMail = true)
    {
        $code       = CryptoLib::randomString (128);
        $hashedCode = CryptoLib::hash ($code, CryptoLib::generateSalt ());
        
        $user       = new Model ('Users');
        $reg        = new Model ('Register');

        $userRows   = $user->findBy ('email', $userModel->get ('email'))->result ();
        $regRows    = $reg->findBy ('email', $registerModel->get ('email'))->result ();

        if (!$userRows)
        {
            if ($regRows)
            {
                $registeredModel    = $regRows;

                $registeredModel->set ('confirmation_code', $hashedCode);
            }
            else
            {
                $registerModel->set ('confirmation_code', $hashedCode);
            }

            // Add or update user in regitration table:
            $registered = !$regRows ? $registerModel->post () : $registeredModel->update ();

            if ($registered)
            {
                $gender     = $userModel->get ('gender');
                $prename    = $userModel->get ('prename');
                $name       = $userModel->get ('name');
                $groupID    = $userModel->get ('group');
                $email      = $userModel->get ('email');
                
                // Add user in users table:
                $userID     = self::registerConfirmation ($code, true);
                $changed    = $userID > 0 ? self::changeUser ($prename, $name, $gender, '', '', $userID) : false;
                $changed    = $changed ? self::setUserGroup ($userID, $groupID) : false;
                
                if ($changed)
                {
                    if ($sendMail)
                    {
                        return self::sendSetPasswortLink ($email) ? $userID : new ErrorHandler (560);
                    }
                    
                    return $userID;
                }
                
                return new ErrorHandler (580);
            }
            else 
            {
                return $registered->getError ();
            }
        }
        else
        {
            return new ErrorHandler (1062);
        }        
    }
    
    public static function registerConfirmation ($code, $returnID = false)
    {
        if ($code && trim ($code) !== '')
        {
            $mRegister      = new Model ('Register');
            $registrations  = $mRegister->findBy ('deleted', 0)->result ();

            if ($registrations && !is_array ($registrations))   { $registrations = array ($registrations);  }
            
            if ($registrations)
            {
                foreach ($registrations as $registration)
                {
                    $regCode    = $registration->get ('confirmation_code');
                    $regID      = $registration->get ('id');

                    if (CryptoLib::validateHash ($regCode, $code))
                    {
                        $regUsers       = new Model ('Register');
                        $regUser        = $regUsers->findBy ('id', $regID)->result ();
                        
                        $groupID        = self::getRegistrationGroup ();
                        
                        if ($groupID)
                        {
                            $email          = $regUser->get ('email');
                            $password       = $regUser->get ('password');
                            $userID         = self::insertUser ($email, $password, $groupID);

                            if ($userID)
                            {
                                $deleted    = self::deleteRegistration ($email);
                                
                                return !$returnID ? $deleted : $userID;
                            }
                        }
                    }
                }
            } 
        }
        
        return 0;        
    }
    
    private static function setResetPasswordLink ($email)
    {
        if ($email && is_string ($email) && trim ($email) !== '')
        {
            $mUser          = new Model ('Users');

            $existingUsers  = $mUser->findBy ('email', $email)->result ();
            $existingUser   = $existingUsers && !is_array ($existingUsers) ? $existingUsers : false;
            
            if ($existingUser)
            {
                $reset_code         = CryptoLib::randomString (128);
                $hReset_code        = CryptoLib::hash ($reset_code, CryptoLib::generateSalt ());
                
                $tmp_pass           = CryptoLib::randomString (128);
                $hTmp_pass          = CryptoLib::hash ($tmp_pass, CryptoLib::generateSalt ());
                
                $existingUser->set ('pw_reset', $hReset_code);
                $existingUser->set ('pw_temp', $hTmp_pass);             
                
                return $existingUser->update () ? array 
                        (
                            'reset_code'    => $reset_code,
                            'reset_pass'    => $tmp_pass
                        ) : false;
            }
            
            return false;
        }
        
        return false;
    }
    
    public static function sendResetPasswortLink ($email, $sendMail = false)
    {
        $resetData  = self::setResetPasswordLink ($email);
        
        if ($resetData)
        {
            $reset_code     = $resetData['reset_code'];
            $tmp_pass       = $resetData['reset_pass'];
            
            $subject            = 'np.dev - Passwort neu vergeben';

            $body               = 'Sie haben Ihr Passwort vergessen? Kein Problem!<br><br>';
            $body              .= 'Bitte klicken Sie auf den nachfolgenden Link, um Ihr Passwort zu ändern und<br>';
            $body              .= 'geben Sie in der darauf folgenden Seite in das Feld "Code" den unten angegebenen Code ein.<br><br>';
            $body              .= 'Link: <a href="'.self::setting ('auth', 'pw_reset_link').$reset_code.'">'.self::setting ('auth', 'pw_reset_link').$reset_code.'</a><br>';
            $body              .= 'Reset-Code: '.$tmp_pass;

            $altBody            = 'Sie haben Ihr Passwort vergessen? Kein Problem!'."\r\n\r\n";
            $altBody           .= 'Bitte rufen Sie den nachfolgenden Link auf, um Ihr Passwort zu ändern und'."\r\n";
            $altBody           .= 'geben Sie in der darauf folgenden Seite in das Feld "Code" den unten angegebenen Reset-Code ein.'."\r\n\r\n";
            $altBody           .= 'Link: '.self::setting ('auth', 'pw_reset_link').$reset_code."\r\n";
            $altBody           .= 'Reset-Code: '.$tmp_pass;

            $mailed             = self::mail ($email, $subject, $body, $altBody);

            return $mailed ? 1 : null;
        }
        
        return new ErrorHandler (600);
    }
    
    public static function sendSetPasswortLink ($email)
    {
        $resetData  = self::setResetPasswordLink ($email);
        
        if ($resetData)
        {
            $reset_code         = $resetData['reset_code'];
            $tmp_pass           = $resetData['reset_pass'];
            
            $subject            = 'np.dev - Vergeben Sie sich Ihr Passwort.';

            $body               = 'Sie können sich nun Ihr eigenes Passwort vergeben!<br><br>';
            $body              .= 'Bitte klicken Sie auf den nachfolgenden Link, um Ihr Passwort zu vergeben und<br>';
            $body              .= 'geben Sie in der darauf folgenden Seite in das Feld "Code" den unten angegebenen Code ein.<br><br>';
            $body              .= 'Link: <a href="'.self::setting ('auth', 'pw_reset_link').$reset_code.'">'.self::setting ('auth', 'pw_reset_link').$reset_code.'</a><br>';
            $body              .= 'Bestätigungs-Code: '.$tmp_pass;

            $altBody            = 'Sie können sich nun Ihr eigenes Passwort vergeben!'."\r\n\r\n";
            $altBody           .= 'Bitte rufen Sie den nachfolgenden Link auf, um Ihr Passwort zu vergeben und'."\r\n";
            $altBody           .= 'geben Sie in der darauf folgenden Seite in das Feld "Code" den unten angegebenen Reset-Code ein.'."\r\n\r\n";
            $altBody           .= 'Link: '.self::setting ('auth', 'pw_reset_link').$reset_code."\r\n";
            $altBody           .= 'Bestätigungs-Code: '.$tmp_pass;

            $mailed             = self::mail ($email, $subject, $body, $altBody);

            return $mailed ? 1 : null;
        }
        
        return new ErrorHandler (600);
    }
    
    public static function validateResetPasswordLink ($pw_reset)
    {
        if ($pw_reset && $pw_reset !== '')
        {
            $mUser          = new Model ('Users');
            $existingUsers  = $mUser->result ();
            
            if ($existingUsers && !is_array ($existingUsers))
            {
                $existingUsers  = array ($existingUsers);
            }
            
            if ($existingUsers)
            {
                foreach ($existingUsers as $existingUser)
                {
                    $dbPw_reset = $existingUser->get ('pw_reset');
                    
                    if ($dbPw_reset && CryptoLib::validateHash ($dbPw_reset, $pw_reset))
                    {
                        return $pw_reset;
                    } 
                }
            }
            
            return 0;
        }
        
        return 0;        
    }
    
    public static function setNewPassword ($pw_reset, $pw_temp, $password)
    {
        $mUsers     = new Model ('Users');

        $users      = $mUsers->result ();

        if ($users && !is_array ($users))   { $users  = array ($users); }

        if ($users)
        {
            foreach ($users as $user)
            {
                $dbPw_reset = $user->get ('pw_reset');
                $dbPw_temp  = $user->get ('pw_temp');
                
                if (is_string ($dbPw_reset) && trim ($dbPw_reset) !== ''
                    && is_string ($dbPw_temp) && trim ($dbPw_temp) !== ''
                    && CryptoLib::validateHash ($dbPw_reset, $pw_reset)
                    && CryptoLib::validateHash ($dbPw_temp, $pw_temp)
                ) {
                    return self::updatePassword ($user->get ('id'), $password);
                }
            }
            
            return new ErrorHandler (580);
        }
        
        return new ErrorHandler (581);
    }
    
    public static function changeUser ($prename, $name, $gender, $company = '', $ustid = '', $_userID = false)
    {
        $loggedIn   = self::loggedIn ();
        $userID     = !$_userID ? self::userID () : $_userID;

        $prename    = trim ($prename);
        $name       = trim ($name);
        $gender     = $gender === 'female' ? 'female' : 'male';

        if ($loggedIn && $userID) 
        {
            $sql            = Sql::getInstance ();

            $query          = 'UPDATE ';
            $query         .=   '`users` ';
            $query         .= 'SET ';
            $query         .= '`prename`="'.$sql->real_escape_string ($prename).'",';
            $query         .= '`name`="'.$sql->real_escape_string ($name).'",';
            $query         .= '`gender`="'.$sql->real_escape_string ($gender).'" ';
            $query         .= 'WHERE ';
            $query         .=   '`ID`="'.$userID.'";';

            $result         = $sql->query ($query);

            if ($result && $userID === self::userID ())
            {
                $cookie     = NPCookie::getCookie ('auth', array ());

                if ($prename)   
                { 
                    $cookie['prename'] = $_SESSION['auth']['prename'] = $prename;    
                }

                if ($name)      
                { 
                    $cookie['name'] = $_SESSION['auth']['name'] = $name;          
                }

                if ($gender)    
                { 
                    $cookie['gender'] = $_SESSION['auth']['gender'] = $gender;      
                }

                NPCookie::setCookie ('auth', $cookie);
            }

            if ($company || $ustid)
            {
                
                $mCompanies = new Model ('User_companies');
                $resCompany = $mCompanies
                                ->findBy ('user_id', $userID)
                                ->result ();

                if ($resCompany)
                {
                    $resCompany->set ('company', $company);
                    $resCompany->set ('ustid', $ustid);
                    
                    return $resCompany->update () ? 1 : 0;
                }
                else
                {
                    $mCompanies->resetResult ();
                    
                    $newRow = array 
                    (
                        'user_id'   => $userID,
                        'company'   => $company,
                        'ustid'     => $ustid
                    );
                  
                    return $mCompanies->add ($newRow)->result ()->post () ? 1 : 0;
                }
            }
            
            return $result === 1;
        }
        else
        {
            return new ErrorHandler (520);
        }        
    }
    
    public static function adminChangeUser ($prename, $name, $gender, $email, $group, $_userID = false)
    {
        $loggedIn   = self::loggedIn ();
        $userID     = !$_userID ? self::userID () : $_userID;

        if ($loggedIn && $userID) 
        {
            $mUser          = new Model ('Users');
            $resUser        = $mUser
                                ->findBy ('id', $userID)
                                ->excludeDeleted ()
                                ->result ();
            
            if ($resUser)
            {
                $resUser->set ('prename', $prename);
                $resUser->set ('name', $name);
                $resUser->set ('gender', $gender);
                $resUser->set ('email', $email);
                $resUser->set ('group', $group);
                
                $updated    = $resUser->update ();
                
                if ($updated)
                {
                    if (self::userID () === $userID)
                    {
                        $cookie     = NPCookie::getCookie ('auth', array ());

                        if ($prename)   
                        { 
                            $cookie['prename'] = $_SESSION['auth']['prename'] = $prename;    
                        }

                        if ($name)      
                        { 
                            $cookie['name'] = $_SESSION['auth']['name'] = $name;          
                        }

                        if ($gender)    
                        { 
                            $cookie['gender'] = $_SESSION['auth']['gender'] = $gender;      
                        }

                        NPCookie::setCookie ('auth', $cookie);
                    }
                    
                    return true;
                }
                else
                {
                    return new ErrorHandler (2001);
                }
            }
            else
            {
                return new ErrorHandler (1055);
            }
        }
        else
        {
            return new ErrorHandler (520);
        }        
    }

    public static function getUser ()    
    {
        return self::loggedIn () ? $_SESSION['auth'] : false;
    }    

    public static function userID ()       
    { 
        return self::loggedIn () ? (int)$_SESSION['auth']['id'] : false;  
    }
    
    public static function userGroup ()
    {
        return self::loggedIn () ? (int)$_SESSION['auth']['group'] : self::getDefaultGroup ();
    }
    
    private static function setUserGroup ($userID, $groupID)
    {
        $mUsers     = new Model ('Users');
        $user       = $mUsers
                        ->findBy ('id', $userID)
                        ->excludeDeleted ()
                        ->result ();
        
        if ($user)
        {
            return $user->set ('group', $groupID)->update ();
        }
        
        return false;
    }
    
    private static function setUser ($user, $stayLoggedIn) 
    { 
        $tmpCModel  = new Model ('User_companies');
        $tmpCompany = $tmpCModel
                        ->findBy ('user_id', (int)$user['id'])
                        ->asGroup ('Customer')
                        ->result ();
        
        $tmpModel   = new Model ('Users');
        $tmpUser    = $tmpModel
                        ->innerJoin ('auth_groups', 'ID', 'users', 'group', 'auth_groups', 'group', 'group_name')
                        ->findBy ('id', (int)$user['id'])
                        ->asGroup ('Customer')
                        ->result ();
   
        $company    = $tmpCompany ? $tmpCompany->getRow ('Customer') : array ('company' => '', 'ustid' => '');
        $user       = $tmpUser->getRow ('Customer');

        $user['company']    = $company['company'];
        $user['ustid']      = $company['ustid'];
        
        if (!isset ($_SESSION['auth'])) { $_SESSION['auth'] = array (); }
        
        if (isset ($user['password']))  
        { 
            unset ($user['password']);
            $tmpUser->set ('password', '');
        }
        
        if (isset ($user['pw_reset']))  
        { 
            unset ($user['pw_reset']);    
            $tmpUser->set ('pw_reset', '');
        }
        
        if (isset ($user['pw_temp']))   
        { 
            unset ($user['pw_temp']);     
            $tmpUser->set ('pw_temp', '');
        }
        
        $user['loggedIn']   = true;

        $_SESSION['auth']   = $user;
        
        if ($stayLoggedIn)  { NPCookie::setCookie ('auth', $user, 2592000);     }
        else                { NPCookie::setCookie ('auth', false);              }

        return $tmpUser;
    }
    
    public static function getReadable ($model, $asGroup = false)
    {
        $oSql   = Sql::getInstance ();
        $rows   = array ();

        $group  = !$asGroup ?  self::userGroup () : self::fetchGroupID ($asGroup);
        
        $query  = 'SELECT `def`.`col` ';
        $query .= 'FROM `model_definitions` as `def` ';
        $query .= 'INNER JOIN `models` ';        
        $query .= 'ON `models`.`ID`=`def`.`model_id` ';
        $query .= 'INNER JOIN `auth_rights` as `rights` ';
        $query .= 'ON `def`.`ID`=`rights`.`definition_id` ';
        $query .= 'AND `rights`.`group_id`>="'.$group.'" ';
        $query .= 'WHERE `models`.`name`="'.$model.'" ';
        $query .= 'AND (';
        $query .=   '`rights`.`rights`=1 OR ';
        $query .=   '`rights`.`rights`=3';
        $query .= ') ';

        $query .= 'GROUP BY ';
        $query .=   '`def`.`col`;';

        $result = $oSql->query ($query);

        if (is_array ($result) && count ($result) > 0)
        {
            foreach ($result as $column)    { $rows[] = $column['col']; }
        }
        
        return is_array ($rows) && count ($rows) > 0 ? $rows : false;
    }
    
    public static function getWritable ($model, $asGroup = false)
    {
        $oSql   = Sql::getInstance ();
        $rows   = array ();

        $group  = !$asGroup ? self::userGroup () : self::fetchGroupID ($asGroup);
        
        $query  = 'SELECT `def`.`col` ';
        $query .= 'FROM `model_definitions` as `def` ';
        $query .= 'INNER JOIN `models` ';
        $query .= 'ON `models`.`ID`=`def`.`model_id` ';
        $query .= 'INNER JOIN `auth_rights` as `rights` ';
        $query .= 'ON `def`.`ID`=`rights`.`definition_id` ';
        $query .= 'AND `rights`.`group_id`>="'.$group.'" ';
        $query .= 'WHERE `models`.`name`="'.$model.'" ';
        $query .= 'AND `rights`.`rights`>1 ';
        $query .= 'GROUP BY ';
        $query .=   '`def`.`col`;';

        $result = $oSql->query ($query);
        
        if (is_array ($result) && count ($result) > 0)
        {
            foreach ($result as $column)    { $rows[] = $column['col']; }
        }
        
        return is_array ($rows) && count ($rows) > 0 ? $rows : false;
    }
    
    public static function getReadAndWritable ($model, $asGroup = false)
    {
        $oSql   = Sql::getInstance ();
        $rows   = array ();
        
        $group  = !$asGroup ? self::userGroup () : self::fetchGroupID ($asGroup);
        
        $query  = 'SELECT `def`.`col` ';
        $query .= 'FROM `model_definitions` as `def` ';
        $query .= 'INNER JOIN `models` ';        
        $query .= 'ON `models`.`ID`=`def`.`model_id` ';
        $query .= 'INNER JOIN `auth_rights` as `rights` ';
        $query .= 'ON `def`.`ID`=`rights`.`definition_id` ';
        $query .= 'AND `rights`.`group_id`>="'.$group.'" ';
        $query .= 'WHERE `models`.`name`="'.$model.'" ';
        $query .= 'AND `rights`.`rights` > 0 ';
        $query .= 'AND `rights`.`rights` IS NOT NULL ';
        $query .= 'GROUP BY ';
        $query .=   '`def`.`col`;';

        $result = $oSql->query ($query);
        
        if (is_array ($result) && count ($result) > 0)
        {
            foreach ($result as $column)    { $rows[] = $column['col']; }
        }
        
        return is_array ($rows) && count ($rows) > 0 ? $rows : false;
    }
    
    private static function getDefaultGroup ()
    {
        $oSql           = Sql::getInstance ();
        $oConfig        = Config::getInstance();
        $settings       = $oConfig->getSettings ();
        
        $group          = isset ($settings['auth']['default_group']) && strlen( $settings['auth']['default_group'] > 0) ? $settings['auth']['default_group'] : 'Visitor';
        
        $query  = 'SELECT `ID` FROM `auth_groups` WHERE `group`="'.$oSql->real_escape_string ($group).'";';
        
        $result = $oSql->query ($query);
        
        return $result ? (int)$result[0]['ID'] : 0;
    }
    
    private static function getRegistrationGroup ()
    {
        $oSql           = Sql::getInstance ();
        $oConfig        = Config::getInstance();
        $settings       = $oConfig->getSettings ();
        
        $group          = isset ($settings['auth']['registration_group']) && strlen( $settings['auth']['registration_group'] > 0) ? $settings['auth']['registration_group'] : 'Customer';
        
        $query  = 'SELECT `ID` FROM `auth_groups` WHERE `group`="'.$oSql->real_escape_string ($group).'";';
        
        $result = $oSql->query ($query);
        
        return $result ? $result[0]['ID'] : false;
    }
    
    private static function updatePassword ($userID, $password)
    {
        $sql    = Sql::getInstance ();
        
        $query  = 'UPDATE ';
        $query .=   '`users` ';
        $query .= 'SET ';
        $query .=   '`password`="'.CryptoLib::hash ($password, CryptoLib::generateSalt ()).'",';
        $query .=   '`pw_reset`="",';
        $query .=   '`pw_temp`="" ';
        $query .= 'WHERE ';
        $query .=   '`ID`="'.$userID.'";';

        return $sql->query ($query) ? 1 : 0;
    }    
    
    private static function fetchGroupID ($groupName) {
        $sql        = Sql::getInstance ();

        $grpName    = $sql->real_escape_string ($groupName);
        $result     = array ();
        
        if (strlen ($groupName) > 0 && trim ($groupName) !== '*')
        {
            $query  = 'SELECT `ID` FROM `auth_groups` WHERE `group`="'.$grpName.'";';
            
            $result = $sql->query ($query);
        }
        
        return $result && is_array ($result) && count ($result) === 1 ? $result[0]['ID'] : self::userGroup ();
    }
    
    private static function mail ($to, $subject, $body, $altBody)
    {
        $config             = Config::getInstance();
        $settings           = $config->getSettings();
        
        $mailer             = new PHPMailer ();
        $mailer->SMTPDebug  = 0;

        $smtp       = isset ($settings['smtp']) ? $settings['smtp'] : false;

        $host       = $smtp && isset ($smtp['host']) ? $smtp['host'] : false;
        $username   = $smtp && isset ($smtp['username']) ? $smtp['username'] : false;
        $password   = $smtp && isset ($smtp['password'])? $smtp['password'] : false;
        $secure     = $smtp && isset ($smtp['secure'])? $smtp['secure'] : 'tls';
        $port       = $smtp && isset ($smtp['port'])? $smtp['port'] : 587;
        $from       = $smtp && isset ($smtp['from'])? $smtp['from'] : false;
        $fromName   = $smtp && isset ($smtp['fromName'])? $smtp['fromName'] : 'Unknown';
        $signature  = $smtp && isset ($smtp['signature'])? $smtp['signature'] : false;
        $htmlSign   = $signature && isset ($signature['html'])? $signature['html'] : false;
        $plainSign  = $signature && isset ($signature['plain'])? $signature['plain'] : false;

        if ($host && $username && $password && $from)
        {
            $mailer->IsSMTP();

            $mailer->Host       = $host;
            $mailer->SMTPAuth   = true;
            $mailer->Username   = $username;
            $mailer->Password   = $password;
            $mailer->SMTPSecure = $secure;

            $mailer->Port       = $port;

            $mailer->From       = $from;
            $mailer->FromName   = $fromName;

            $mailer->addAddress ($to);

            $mailer->isHtml (true);

            if (strlen ($htmlSign) > 0)
            {
                $body       = $body.'<br><br>_________________<br><br>'.'<div style="font-size:12px;">'.$htmlSign.'</div>';
            }
            
            if (strlen ($plainSign) > 0)
            {
                $altBody    = $altBody."\r\n\r\n".'_________________'."\r\n\r\n".$htmlSign;
            }
            
            $mailer->Subject    = $subject;
            $mailer->Body       = $body;
            $mailer->AltBody    = $altBody;        
        }

        return $mailer->send () ? true : new ErrorHandler (560);
    }
    
    private static function setting ($config, $setting = null)
    {
        $oConfig    = Config::getInstance();
        $settings   = $oConfig->getSettings();
        
        if ($setting) 
        {
            return isset ($settings[$config]) && isset ($settings[$config][$setting]) ? $settings[$config][$setting] : '';
        }
        else 
        {
            return isset ($settings[$config]) ? $settings[$config] : null;
        }
    }
    
    private static function insertUser ($email, $password, $groupID)
    {
        $sql    = Sql::getInstance ();
        
        $query  = 'INSERT INTO ';
        $query .=   '`users` ';
        $query .= '(';
        $query .=   '`email`,';
        $query .=   '`password`,';
        $query .=   '`group`';
        $query .= ') ';
        $query .= 'VALUES ';
        $query .= '(';
        $query .=   '"'.$email.'",';
        $query .=   '"'.$password.'",';
        $query .=   '"'.$groupID.'"';
        $query .= ');';
        
        $result = $sql->query ($query);
        
        return $result && (int)$result > 0 ? (int)$result : false;
    }
    
    private static function deleteRegistration ($email)
    {
        $sql    = Sql::getInstance ();
        
        $query  = 'UPDATE ';
        $query .=   '`register` ';
        $query .= 'SET ';
        $query .=   '`deleted`=1 ';
        $query .= 'WHERE ';
        $query .=   '`email`="'.$email.'";';
        
        $result = $sql->query ($query);
        
        return $result ? 1 : 0;
    }
    
    private static function isACrawlerRequest ()
    {
        $crawlerDetect  = new CrawlerDetect ();
        
        return $crawlerDetect->isCrawler ();
    }    
}