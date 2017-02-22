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

class MediathekController extends ControllerHelper
{
    public function initPlugin ()
    {
        return $this->getMediathek ();
    }
    
    private function getPath ()
    {
        $config     = Config::getInstance ();

        return $config->getPath ().'assets/mediathek/';
    }
    
    private function getFileType ($file) 
    {
        $mime_type  = '';

        if ($file)
        {
            $file_info  = new finfo (FILEINFO_MIME);
            $mime_type  = $file_info->buffer (file_get_contents ($file['tmp_name']));
        }
        
        return  strlen ($mime_type) > 0 && strpos ($mime_type, '/') !== false ? substr ($mime_type, 0, strpos ($mime_type, '/')) : false;
    }
    
    private function saveImage ($file, $realname, $folder)
    {
        $config     = Config::getInstance ();
        $path       = $config->getPath ().'assets/mediathek/';
        $result     = array ();

        $slugify    = new Cocur\Slugify\Slugify ();

        $sql        = Sql::getInstance ();
        $fso        = new Fso ();

        $fso->mkdir ($path, '755');

        $name               = $sql->real_escape_string ($slugify->slugify (explode ('.', $file['name'])[0])).'.png';
        $prename            = $slugify->slugify (explode ('.', $file['name'])[0]);

        $result[$realname]  = false;

        $query  = 'INSERT INTO ';
        $query .=   '`mediathek` ';
        $query .= '(';
        $query .=   '`name`,';
        $query .=   '`src`,';
        $query .=   '`thumb_xs`,';
        $query .=   '`thumb_sm`,';
        $query .=   '`thumb_md`,';
        $query .=   '`thumb_lg`,';
        $query .=   '`type`,';
        $query .=   '`folder_id`';
        $query .= ') ';
        $query .= 'VALUES';
        $query .= '(';
        $query .=   '"'.$name.'",';
        $query .=   '"/assets/mediathek/",';
        $query .=   '"'.$prename.'_thumb_xs.png",';
        $query .=   '"'.$prename.'_thumb_sm.png",';
        $query .=   '"'.$prename.'_thumb_md.png",';
        $query .=   '"'.$prename.'_thumb_lg.png",';
        $query .=   '"image",';
        $query .=   '"'.$folder.'"';
        $query .= ');';

        $id     = $sql->query ($query);

        // Bad condition. To deep. Solve it, nab! Look at method $this->saveAudio (). Not perfect but better.
        if ($id)
        {
            if (move_uploaded_file ($file['tmp_name'], $path.$id.$name))
            {
                if (file_exists ($path.$id.$name))
                {
                    $image                      = @imagecreatefromjpeg ($path.$id.$name);
                    if (!$image)    { $image    = @imagecreatefrompng ($path.$id.$name); }
                    if (!$image)    { $image    = @imagecreatefromgif ($path.$id.$name); }
                    if (!$image)    { $image    = @imagecreatefrombmp ($path.$id.$name); }

                    if ($image)
                    {
                        $width      = imagesx ($image);
                        $height     = imagesy ($image);

                        $container  = imagecreatetruecolor ($width*1.1, $height*1.1);
                        $newImage   = imagecreatetruecolor ($width, $height);

                        if (imagecopyresampled ($container, $image, 0, 0, 0, 0, $width*1.1, $height*1.1, $width, $height))
                        {
                            if (imagecopyresampled ($newImage, $container, 0, 0, 0, 0, $width, $height, $width*1.1, $height*1.1))
                            {
                                imagealphablending ($image, false);
                                imagesavealpha ($image, true);

                                $thumbs = $this->generateThumbs ($image, $width, $height, $path, $id, $prename);

                                @unlink ($path.$id.$name);

                                set_time_limit (120);

                                if (imagepng ($image, $path.$id.$name, 9))
                                {
                                    $result[$realname]  = array 
                                    (
                                        'id'        => $id, 
                                        'src'       => '/assets/mediathek/'.$id.$name,
                                        'thumb_xs'  => $thumbs['xs'],
                                        'thumb_sm'  => $thumbs['sm'],
                                        'thumb_md'  => $thumbs['md'],
                                        'thumb_lg'  => $thumbs['lg']
                                    );
                                }
                            }
                        }
                    }
                    else 
                    {
                        @unlink ($path.$id.$name);
                        $this->error ($this->REQ_ERR_INVALID_ARGS, true);
                        $result[$realname]  = array ('id' => $id, 'error' => 'mime');
                    }
                }
                else
                {
                    @unlink ($path.$id.$name);
                    $this->error ($this->REQ_ERR_INVALID_ARGS, true);
                    $result[$realname]  = array ('id' => $id, 'error' => 'move2');
                }
            }
            else 
            {
                $this->error ($this->REQ_ERR_INVALID_ARGS, true);
                $result[$realname]  = array ('id' => -1, 'error' => 'move');
            }
        }
        else
        {
            $this->error ($this->REQ_ERR_INVALID_ARGS, true);
            $result[$realname]  = array ('id' => -1, 'error' => 'sql');
        }        
        
        return $result;
    }
    
    private function saveVideo ($file, $realname, $folder)
    {
        
    }   
    
    private function saveAudio ($file, $realname, $folder)
    {
        $config     = Config::getInstance ();
        $path       = $config->getPath ().'assets/mediathek/';
        $result     = array ();

        $slugify    = new Cocur\Slugify\Slugify ();

        $sql        = Sql::getInstance ();
        $fso        = new Fso ();

        $fso->mkdir ($path, '755');
        
        $fileParts  = explode ('.', $file['name']);
        $fileExt    = array_pop ($fileParts);
        $fileName   = $sql->real_escape_string ($slugify->slugify (implode ('.', $fileParts)).'.'.$fileExt);

        $result[$realname]  = false;

        $query  = 'INSERT INTO ';
        $query .=   '`mediathek` ';
        $query .= '(';
        $query .=   '`name`,';
        $query .=   '`src`,';
        $query .=   '`type`,';
        $query .=   '`folder_id`';
        $query .= ') ';
        $query .= 'VALUES';
        $query .= '(';
        $query .=   '"'.$fileName.'",';
        $query .=   '"/assets/mediathek/",';
        $query .=   '"audio",';
        $query .=   '"'.$folder.'"';
        $query .= ');';

        $id     = $sql->query ($query);

        if (!$id)
        {
            $this->error ($this->REQ_ERR_INVALID_ARGS, true);
            $result[$realname]  = array ('id' => -1, 'error' => 'sql');
            
            return $result;
        }
        
        if (!move_uploaded_file ($file['tmp_name'], $path.$id.$fileName))
        {
            $this->error ($this->REQ_ERR_INVALID_ARGS, true);
            $result[$realname]  = array ('id' => -1, 'error' => 'move_temp');
            
            return $result;
        }
        
        if (!file_exists ($path.$id.$fileName))
        {
            $this->error ($this->REQ_ERR_INVALID_ARGS, true);
            $result[$realname]  = array ('id' => -1, 'error' => 'move_temp2');
            
            return $result;
        }
        
        return array
        (
            $realname   => array 
            (
                'id'        => $id, 
                'src'       => '/assets/mediathek/'.$id.$fileName
            )
        );

    }
    
    private function getMaxUploadableFileSize ()
    {
        //select maximum upload size
        $max_upload     = return_bytes (ini_get ('upload_max_filesize'));

        //select post limit
        $max_post       = return_bytes (ini_get ('post_max_size'));

        //select memory limit
        $memory_limit   = return_bytes (ini_get ('memory_limit'));

        // return the smallest of them, this defines the real limit
        return min ($max_upload, $max_post, $memory_limit);
    }
    
    private function validateThroughController ($model, $file)
    {
        if ($model)
        {
            $oConfig        = Config::getInstance ();
            $scope          = $oConfig->getScope ();

            $hModel         = ucfirst ($model);
            $class          = $hModel.'Controller';

            $classExists    = npAutoload ($class, RouteHelper::getDefaultRoute (), $scope);

            if ($classExists)
            {
                $model      = new Model ('model');
                $oClass     = new $class ();

                return $oClass->uploadFile ($model, $file);
            }
        } 
        
        return false;
    }

    public function saveMedia ($files, $folder = 1, $model = false)
    {
        $file                   = isset ($files['file']) ? $files['file'] : false;
        $fileType               = $this->getFileType ($file);
        $fileMethod             = 'save'.ucfirst ($fileType);
        $methodExist            = method_exists ($this, $fileMethod);
        $realname               = isset ($file['name']) ? $file['name'] : 'noname';
        $controllerValidated    = $this->validateThroughController ($model, $file);

        if (!$this->validUploadableFileSize ($file))
        {
            $this->error ($this->REQ_ERR_INVALID_ARGS, true);
            $result[$realname]  = array ('id' => -1, 'error' => 'file_size', 'file_size' => $this->getMaxUploadableFileSize ());
            
            return $result;
        }

        // Currently only Images, Videos and Audios are supported.
        if (!$methodExist)
        {
            $this->error ($this->REQ_ERR_INVALID_ARGS, true);
            $result[$realname]  = array ('id' => -1, 'error' => 'filetype_unsup');
            
            return $result;
        }

        if (($this->isGroup (1) && isset ($files['file'])) || $controllerValidated === true)
        {
            $file       = $files['file'];
            
            return $this->$fileMethod ($file, $realname, $folder);
        }
        else 
        {
            $this->error ($this->REQ_ERR_INVALID_ARGS, true);
            $result[$realname]  = array ('id' => -1, 'error' => !$controllerValidated ? 'mime' : 'no_auth');
            
            return $result;
        }
        
        return $this->error ($this->AUTH_ERR_UNAUTHORIZED);
    }
    
    public function addFolder ($params)
    {
        if ($this->isGroup (1))
        {
            $values     = $params['mediathek']['add']['folder'];
            $mFolders   = new Model ('Mediathek_folders');
            $max        = $mFolders->max ('folder_id') + 1;
            
            $folder     = array
            (
                'folder_id' => $max,
                'folder'    => $values['folder']
            );
            
            $postID = $mFolders->add ($folder)->result ()->post ();

            return $postID ? array ('folder_id' => $max, 'id' => $postID) : $this->error ($this->SQL_ERR_ON_POST);
        }
    }
    
    public function updateFolder ($params)
    {
        if ($this->isGroup (1))
        {
            $folder_id  = $params['folder_id'];
            $folder     = $params['folder'];
            
            $mFolders   = new Model ('Mediathek_folders');
            $resFolders = $mFolders->findBy ('folder_id', $folder_id)->result ();

            if ($resFolders)
            {
                $resFolders->set ('folder', $folder);
                
                return $resFolders->update ();
            }
            
            return $this->error ($this->SQL_ERR_NOT_FOUND);
        }
        
        return $this->error ($this->AUTH_ERR_UNAUTHORIZED);
    }
    
    public function updateImage ($params)
    {
        if ($this->isGroup (1))
        {
            $mMediathek     = new Model ('Mediathek');
            
            $id             = $params['id'];
            $folder_id      = $params['folder_id'];
            $title          = $params['title'];
            $description    = $params['description'];
            
            $resMediathek   = $mMediathek
                                ->findBy ('id', $id)
                                ->result ();
            if ($resMediathek)
            {
                if ($folder_id > 0) { $resMediathek->set ('folder_id', $folder_id);     }
                if ($title)         { $resMediathek->set ('title', $title);             }
                if ($description)   { $resMediathek->set ('description', $description); }
                
                return $resMediathek->update ();
            }
            
            return $this->error ($this->SQL_ERR_NOT_FOUND);
        }
        
        return $this->error ($this->AUTH_ERR_UNAUTHORIZED);
    }

    public function addVideo ($params)
    {
        if ($this->isGroup (1))
        {
            $values     = $params['mediathek']['add']['video'];

            $mMediathek = new Model ('Mediathek');

            $video      = array
            (
                'name'  => $values['name'],
                'src'   => $values['video_id'],
                'type'  => 'youtube'
            );

            return $mMediathek->add ($video)->result ()->post ();
        }
        
        return $this->error ($this->AUTH_ERR_UNAUTHORIZED);
    }
    
    public function removeFolder ($folder_id)
    {
        if ($this->isGroup (1))
        {
            $mMediathek = new Model ('Mediathek_folders');
            
            return $mMediathek->findBy ('folder_id', $folder_id)->result ()->delete (true);
        }
    }
    
    public function removeItem ($id)
    {
        if ($this->isGroup (1))
        {
            $mMediathek = new Model ('Mediathek');
            
            return $mMediathek->findBy ('id', $id)->result ()->delete (true);
        }
        
        return $this->error ($this->AUTH_ERR_UNAUTHORIZED);
    }
    
    private function generateThumbs ($image, $w, $h, $path, $id, $name)
    {
        $thumbs = array (
            'xs'    => '',
            'sm'    => '',
            'md'    => '',
            'lg'    => ''
        );
        
        $ratio  = $w / $h;
        
        $sizes  = array
        (
            'xs'    => array
            (
                'width'     => 50,
                'height'    => (int)(50 / $ratio)
            ),
            
            'sm'    => array
            (
                'width'     => 100,
                'height'    => (int)(100 / $ratio)
            ),
            
            'md'    => array
            (
                'width'     => 150,
                'height'    => (int)(150 / $ratio)
            ),
            
            'lg'    => array
            (
                'width'     => 250,
                'height'    => (int)(250 / $ratio)
            )
        );
        
        foreach ($sizes as $size => $values)
        {
            $sW = $values['width'];
            $sH = $values['height'];
            
            $imgContainer   = imagecreatetruecolor ($sW, $sH);
            
            imagealphablending ($imgContainer, false);
            imagesavealpha ($imgContainer, true);            

            imagecopyresampled ($imgContainer, $image, 0, 0, 0, 0, $sW, $sH, $w, $h);


            imagepng ($imgContainer, $path.$id.$name.'_thumb_'.$size.'.png', 9);
            
            $thumbs[$size]  = $name.'_thumb_'.$size; 
        }
        
        return $thumbs;
    }
    
    private function getMediathek () 
    {
        $mediathek  = array ();
        
        if ($this->isGroup (1))
        {
            $mFolders       = new Model ('Mediathek_folders');
            $mMediathek     = new Model ('Mediathek');
            
            $rFolders       = $mFolders->orderBy ('folder', 'asc')->result ();
            
            $result         = $mMediathek->orderBy ('name')->result ();

            if ($result && !is_array ($result)) { $result = array ($result);  }
 
            $mediathek      = array
            (
                'folders'   => $rFolders,
                'media'     => $result
            );

            return $mediathek;
        }
        
        return $this->error ($this->AUTH_ERR_UNAUTHORIZED, false);
    }
}