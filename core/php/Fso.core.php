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

class Fso
{
    private $lastReadError  = 0;    
    private $plainReadError = array();
    
    private $lastDirError   = 0;    
    private $plainDirError  = array();
    
    public function read( $src )
    {
        $fstream    = '';
        
        if( file_exists( $src ) )
        {
            $fsize      = filesize( $src );
            
            if( $fsize > 0 )
            {
                $fhandle    = fopen( $src, 'r' );
                $fstream    = fread( $fhandle, $fsize );
                
                $this->lastReadError        = 0;
                $this->plainReadError[0]    = 'Alles in Ordnung!';
            }
            else
            {
                $this->lastReadError        = 1;                
                $this->plainReadError[1]    = 'Die Datei "'.$src.'" ist leer!';
            }
        }
        else
        {
            $this->lastReadError        = 2;            
            $this->plainReadError[2]    = 'Die Datei "'.$src.'" existiert nicht oder der Webserver hat nicht die notwendigen Rechte auf das Zielverzeichnis bzw. die Zeildatei (755)!';
        }
        
        return $fstream;
    }

    public function dirRecursive ($path, $extensions = false, $sortByExtension = true)
    {
        try
        {
            $ritit          = new RecursiveIteratorIterator (new RecursiveDirectoryIterator ($path), RecursiveIteratorIterator::CHILD_FIRST);
            $retVal         = array();
            
            foreach ($ritit as $name => $object)
            {
                $file   = str_replace ('\\', '/', $name);
                $ext    = (strpos ($file, '.') !== false && strpos ($file, '.' ) < strlen ($file) - 1) ? substr ($file, strrpos ($file, '.') + 1) : false;
                $valid  = $extensions ? in_array ($ext, $extensions) : true;

                if (is_file ($file) && $ext && $valid)
                {
                    if ($sortByExtension)   { $file = $ext.'::::'.$file;    }

                    $retVal[] = $file;
                }
            }

            asort ($retVal);

            return $retVal;
        }
        catch (Exception $e)    { return array ();  }
    }

    public function mkdir( $path, $mode = '755' )
    {
        return ( !is_dir( $path ) )? mkdir( $path, $mode, true ) : true;
    }

    public function dir( $src, $searchFor = array(), $onlyFiles = false )
    {
        $retVal     = array();
        $dhandle    = opendir( $src );
        $blacklist  = array( '.', '..', '.htacess' );

        if( $dhandle )
        {
            while( ( $file = readdir( $dhandle ) ) !== false ) 
            {
                if( !in_array( $file, $blacklist ) && ( ( $onlyFiles && is_file( $src.'/'.$file ) ) || !$onlyFiles ) )
                {
                    if( $searchFor !== null && count( $searchFor ) > 0 )
                    {
                        $extPos     = strrpos( $file, '.'  );
                        
                        // Extract Fileext:
                        if( $extPos )
                        {
                            $ext    = substr( $file, $extPos + 1 );
                            
                            if( in_array( $ext, $searchFor ) )  { $retVal[] = $src.$file;   }
                        }
                    } 
                    else
                    {
                        $retVal[] = $src.$file;
                    }
                }
            }

            closedir( $dhandle );
        }
        else
        {
            $this->lastDirError         = 1;            
            $this->plainDirError[2]     = 'Das Verzeichnis "'.$src.'" existiert nicht oder der Webserver hat nicht die notwendigen Rechte auf das Zielverzeichnis (755)!';
        }
        
        return $retVal;
    }
    
    public function lastReadError( $plain = false ) 
    { 
        if( !$plain )   { return $this->lastReadError;                          }
        else            { return $this->plainReadError[$this->lastReadError];   }
    }
    
    public function lastDirError( $plain = false ) 
    { 
        if( !$plain )   { return $this->lastDirError;                           }
        else            { return $this->plainDirError[$this->lastDirError];     }
    }

    public function write( $dest, $data )
    {
        $retVal         = false;
        $tmpData        = '';

        if( '' != trim( $dest ) )
        {
            $fHandle    = fopen( $dest, 'w'  );

            if( is_array( $data ) )
            {
                foreach( $data as $line ) { $tmpData .= $line;  }

                $stream     = $tmpData;

                unset( $tmpData );
            }

            if( fwrite( $fHandle, $data ) )
            {
                if( fclose( $fHandle ) ) { $retVal = true; }
            }
        }

        return $retVal;
    }
    
    public function deleteFile( $file )
    {
        if( is_file( $file ) )  { return unlink( $file );  }
    }
}
?>