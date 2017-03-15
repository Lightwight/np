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

class Sql
{
    private static $instance    = null;
    private static $connection  = null;
    
    /*
     * Error code mapping for table errors (mysql error to error_id)
     */
    private $errorMap           = array
    (
        1011    => 9,   // MySql HY000 (ER_CANT_DELETE_FILE): Error on delete
        1054    => 18,  // MySql SQLSTATE: 42S22 (ER_BAD_FIELD_ERROR): Unknown column %s in %S
        1055    => 11,  // MySql SQLSTATE: EMPTY RESULT
        1062    => 12,  // MySql SQLSTATE: 23000 (ER_DUP_ENTRY): Duplicate entry (Record already exists)
        1064    => 13,  // MySql SQLSTATE: 42000 (ER_PARSE_ERROR): %s near '%s' at line %
        2000    => 14,  // MySql ERROR ON POST
        2001    => 15   // MySql ERROR ON UPDATE
    );
    
    private $result             = null;
    private $counter            = null;
    
    private $host               = null;
    private $db                 = null;
    private $user               = null;
    private $pass               = null;
    
    private $lastError          = false;

    private $table              = null;
    private $config             = null;
    
    private $lock_timeout       = null;    
    
    public static function getInstance ()   
    {
        if (self::$instance === null)   { 
            self::$instance = new self;   
        }
        
        self::$instance->connect ();
        
        return self::$instance; 
    }
    
    private function __construct () { $this->connect ();    }
    private function __clone ()     { $this->connect ();    }
    
    public function connect ()
    {
	$cFile		    = str_replace ('\\', '/', __FILE__);
	$cFile		    = substr ($cFile, 0, strrpos ($cFile, '/core/php/Sql.core.php')).'/config.php';
	
        require $cFile;
        
        $this->config       = $config;
        
        if (self::$connection === null)
        {
            $this->host         = $config['sql']['host'];
            $this->db           = $config['sql']['db'];
            $this->user         = $config['sql']['user'];
            $this->pass         = $config['sql']['pass'];
            $this->lock_timeout = isset ($config['sql']['lock_timeout']) && (int)$config['sql']['lock_timeout'] > 0 ? (int)$config['sql']['lock_timeout'] : 60;

            if (!is_object (self::$connection ) || get_class (self::$connection) !== 'mysqli')
            {
                self::$connection   = mysqli_connect ($this->host, $this->user, $this->pass);
                
                mysqli_select_db (self::$connection, $this->db);
            }
        }
    }
    
    public function getConnection ()    { return self::$connection; }
    
    public function setHost ($host)
    {
        $this->host     = $host;
        
        return $this;
    }
    
    public function setDatabase ($database)
    {
        $this->db = $database;
        
        return $this;
    }
    
    public function setUser ($user)
    {
        $this->user     = $user;
        
        return $this;
    }
    
    public function setPass ($pass)
    {
        $this->pass     = $pass;
        
        return $this;
    }
    
    public function disconnect () 
    {
        if( is_resource (self::$connection) )   { mysqli_close (self::$connection); }
    }
 
    public function lastError ($mapped = false) 
    {
        return !$mapped ? $this->lastError : $this->mapError ($this->lastError);
    }
    
    public function mapError ($errno)
    {
        if ($this->lastError !== false)
        {
            return array_key_exists ($errno, $this->errorMap) ? $this->errorMap[$errno] : 0;
        }
        
        return false;
    }
    
    public function query ($query, $lock_name = false, $lock_timeout = false)
    {
        $user               = isset ($_SESSION['auth']['user']) ? $_SESSION['auth']['user'] : false;
        $userID             = $user ? (int)$_SESSION['auth']['user']['id'] : 0;

        $this->lastError    = false;

        mysqli_query (self::$connection, 'SET CHARACTER SET utf8');

        if (is_object ($this->result) && get_class ($this->result) === 'mysqli_result') { mysqli_free_result ($this->result);   }
        
        if (isset ($this->config['log']) 
            && isset ($this->config['log']['sqlQueries'])
            && $this->config['log']['sqlQueries'] === true
        ) {
            $logQuery       = 'INSERT INTO `log` (`user_id`, `type`, `log`) VALUES ("'.$userID.'", "SQL_QUERY", \''.mysqli_real_escape_string (self::$connection, $query).'\');';
            mysqli_query (self::$connection, $logQuery);
        }

        $lock_timeout   = (int)$lock_timeout > 0 ? (int)$lock_timeout : $this->lock_timeout;
        $lock_name      = is_string ($lock_name) && strlen ($lock_name) > 0 ? $lock_name.'_'.session_id () : false;
        $release        = !$lock_name;
        
        $lock           = $lock_name ? $this->getLock ($lock_name, $lock_timeout, $query) : true;

        if ($lock)
        {
            $this->result   = mysqli_query (self::$connection, $query);
            
            $this->counter  = null;

            $rows           = array ();

            if (strpos ($query, 'INSERT') === 0)
            {
                if ($this->result == 1)    
                {
                    $rows = mysqli_insert_id (self::$connection);

                    if ($rows === 0)  { $rows = 'duplicate';    }
                }
                else
                {
                    $rows = false;
                }
            }
            else if (strpos ($query, 'DELETE') === 0 || strpos ($query, 'UPDATE') === 0)
            {
                if ($this->result == 1)
                {
                    $rows   = mysqli_affected_rows (self::$connection);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           }
                else
                {
                    $this->lastError    = self::$connection->errno;

                    $rows               = false;
                }
            }
            else if (strpos ($query, 'SELECT SQL_CALC_FOUND_ROWS') === 0)
            {
                if (is_object ($this->result) && get_class ($this->result) === 'mysqli_result')
                {
                    $this->result   = mysqli_query (self::$connection, 'SELECT FOUND_ROWS();');
                    
                    if (is_object ($this->result) && get_class ($this->result) === 'mysqli_result')
                    {
                        while ($rows[] = mysqli_fetch_assoc ($this->result)){}
                        
                        if (isset ($rows[0]))
                        {
                            foreach ($rows[0] as $value)    { return $value;    }
                        }
                    }
                }
                
                return 0;
            }
            else
            {
                if ($this->result !== true && $this->result !== false)
                {
                    while ($rows[] = mysqli_fetch_assoc ($this->result)){}

                    if (count ($rows) > 0) { unset ($rows[(count ($rows) - 1)]);    }
                }
                else
                {
                    $rows	= $this->result;
                }
            }

            return $release ? ($this->releaseLock ($lock_name) ? $rows : false) : $rows;
        }
        // Got no Lock:
        else
        {
            return false;
        }
    }

    public function count () 
    {
        if( $this->counter == null && is_resource ($this->result))
        {
            $this->counter  = mysqli_num_rows ($this->result);
        }

        return $this->counter;
    }
    
    public function real_escape_string( $string )   { return mysqli_real_escape_string (self::$connection, $string);   }
    
    public function tableExists ($table)
    {
        return (count ($this->query ('SHOW TABLES LIKE "'.$table.'";')) > 0);
    }

    public function createTable ($name, $definition)
    {
        $sql    = 'CREATE TABLE `'.$name.'`(';
        $sql   .=   '`ID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,';
        
        foreach ($definition as $key => $type)
        {
            $cType  = '';
            
            switch ($type)
            {
                case 'text':
                    $cType  = 'MEDIUMTEXT';
                    break;
                case 'string':
                    $cType  = 'VARCHAR(100)';
                    break;
                case 'numnber':
                    $cType = 'INT(100)';
                    break;
                case 'date':
                    $cType = 'DATETIME';
                    break;
            }
            
            $sql   .= '`'.$key.'` '.$cType.',';
        }
        
        $sql   .=   'enabled INT(1) DEFAULT 1,';
        $sql   .=   'deleted INT(1) DEFAULT 0,';
        $sql   .=   'created_at TIMESTAMP DEFAULT NOW(),';
        $sql   .=   'updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP';
        $sql   .= ');';
        
        return $this->query ($sql) === 1;
    }
    
    public function selectTable ($table)
    {
        $this->table    = $table;
    }
    
    public function find ($vars)
    {
        if (count ($vars) > 0)
        {
            $query  = 'SELECT * FROM `'.$this->table.'` WHERE ';

            foreach ($vars as $key => $value)
            {
                $query .= '`'.$key.'`="'.$value.'" AND ';
            }

            $query  = substr ($query, 0, strlen ($query) - 5);
            
            return $this->query ($query);
        }
        else
        {
            return array ();
        }
    }
    
    public function findAll ()
    {
        $query  = 'SELECT * FROM `'.$this->table.'`';

        return $this->query ($query);
    }
    
    private function getLock ($name, $timeout = 60, $query2 = '', $test = true)
    {
        $query  = 'SELECT GET_LOCK("'.$name.'", '.$timeout.');';
        $result = mysqli_query (self::$connection, $query);
        
        return is_object ($result) && strtolower (get_class ($result)) === 'mysqli_result' && @mysqli_num_rows ($result) == 1 && ($row = mysqli_fetch_array ($result)) && $row[0] == 1;
    }
    
    private function releaseLock ($name)
    {
        $query  = 'SELECT RELEASE_LOCK("'.$name.'");';
        $result = mysqli_query (self::$connection, $query);
        
        return is_object ($result) && strtolower (get_class ($result)) === 'mysqli_result' && @mysqli_num_rows ($result) == 1 && ($row = mysqli_fetch_array ($result)) && ($row[0] == 1 || is_null ($row[0]));
    }
}