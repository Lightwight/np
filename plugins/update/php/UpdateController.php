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

class UpdateController extends ControllerHelper
{
    public function initPlugin ()           {}

    public function getNewVersion ()
    {
        if ($this->isGroup (1))
        {
            $settings       = $this->setting ('update');
            $currentVersion = isset ($settings['version']) ? $settings['version'] : 0;

            /* TODO: Make usage of apiKey (currently in project update returns true) */
            $apiKey         = isset ($settings['apiKey']) ? $settings['apiKey'] : false;
            $uri            = isset ($settings['uri']) ? $settings['uri'] : false;

            if ($currentVersion && $uri && $apiKey)
            {
                $client         = new \GuzzleHttp\Client (['base_uri' => $uri]);
                $response       = $client->request ('GET', '?version='.$currentVersion.'&key='.$apiKey, ['verify' => false, 'http_errors' => false]);
                $code           = $response->getStatusCode ();

                if ($code === 200)
                {
                    $decoded    = json_decode ($response->getBody (), false);
                    $client     = json_decode (json_encode ($decoded->client), false);
                    $newest     = json_decode (json_encode ($decoded->newest), false);
                    
                    $cMajor     = (int)$client->major;
                    $cMinor     = (int)$client->minor;
                    $cRevision  = (int)$client->revision;
                    $cBuild     = (int)$client->build;
                    
                    $nMajor     = (int)$newest->major;
                    $nMinor     = (int)$newest->minor;
                    $nRevision  = (int)$newest->revision;
                    $nBuild     = (int)$newest->build;
                    
                    $updateable = $cMajor < $nMajor || $cMinor < $nMinor || $cRevision < $nRevision || $cBuild < $nBuild;
                    
                    return array
                    (
                        'new_version'   => $nMajor.'.'.$nMinor.'.'.$nRevision.'-'.$nBuild,
                        'updateable'    => $updateable ? 1 : 0
                    );
                }
                else if ($code === 401)
                {
                    return $this->error ($this->AUTH_ERR_UNAUTHORIZED);
                }
                
                return $this->error ($this->REQ_ERR_UNKNOWN);
            }
        }
        
        return $this->error ($this->AUTH_ERR_UNAUTHORIZED);
    }
    
    public function update ()
    {
        if ($this->isGroup (1))
        {
            // Download the files from remote server:
            $downloaded     = $this->downloadFiles ();
            
            // Cancel if download failed for some reason (file could not be donwloaded or wrong checksum):
            if (!is_array ($downloaded))   { return $downloaded;   }

            // Check checksums of downloaded versions (MITM through https protection):
            $validCheckums  = $this->validateFilesChecksum ($downloaded);
            
            // if any file checksum fails, return error:
            if (!$validCheckums)        { return $this->error ($this->REQ_ERR_UNKNOWN); }
            
            // All checksums ok, extract downloaded versions:
            $extractedFiles = $this->extractFiles ($downloaded);
            
            // if something went wronh while extracting files, return error:
            if (!$extractedFiles)       { return $this->error ($this->REQ_ERR_UNKNOWN); }
            
            // Create files backup:
            $backupFiles    = $this->createFileBackups ($downloaded);
            
            // if something went wronh while extracting files, return error:
            if (!$backupFiles)          { return $this->error ($this->REQ_ERR_UNKNOWN); }

        }
        
        return $this->error ($this->AUTH_ERR_UNAUTHORIZED);  
    }
    
    private function createFileBackups ($majors)
    {
        $webroot        = str_replace ('//', '/', getcwd ().'/');

        $settings       = $this->setting ('update');
        $currentVersion = isset ($settings['version']) ? $settings['version'] : false;
        $backupFolder   = $currentVersion && isset ($settings['backupFolder']) ? str_replace ('//', '/', $webroot.$settings['backupFolder'].'/').$currentVersion.'/' : false;
        
        if ($backupFolder)
        {
            $fso            = new Fso ();

            foreach ($majors as $major => $minors)
            {
                foreach ($minors as $minor => $revisions)
                {
                    foreach ($revisions as $revision => $builds)
                    {
                        foreach ($builds as $build => $files)
                        {
                            $archive    = $files['src'];
                            $path       = $files['path'];
                            
                            $files      = $fso->dirRecursive ($path, false, false);

                            foreach ($files as $file)
                            {
                                $origin = str_replace ('//', '/', $webroot.str_replace ($path, '', $file));
                                
                                echo $origin."\r\n".$file;exit;
                            }
                            echo '<pre>';print_r ($files);exit;
                        }
                    }                
                }
            }
        }
        
        return false;        
    }
    
    private function extractFiles ($majors)
    {
        foreach ($majors as $major => $minors)
        {
            foreach ($minors as $minor => $revisions)
            {
                foreach ($revisions as $revision => $builds)
                {
                    foreach ($builds as $build => $files)
                    {
                        $archive    = $files['src'];
                        $path       = $files['path'];
                        
                        try {
                            $phar   = new PharData ($archive);
                            
                            // Extract all files, and overwrite:
                            $phar->extractTo ($path, null, true); 

                        } catch (Exception $e) {
                            return false;
                        }                        
                    }
                }                
            }
        }
        
        return true;
    }
    
    private function validateFilesChecksum ($majors)
    {
        foreach ($majors as $major => $minors)
        {
            foreach ($minors as $minor => $revisions)
            {
                foreach ($revisions as $revision => $builds)
                {
                    foreach ($builds as $build => $files)
                    {
                        if (md5_file ($files['src']) !== $files['checksum'])
                        {
                            return false;
                        }
                    }
                }                
            }
        }
        
        return true;
    }
    
    private function downloadFiles ()
    {
        $webroot        = str_replace ('//', '/', getcwd ().'/');

        $settings       = $this->setting ('update');
        $currentVersion = isset ($settings['version']) ? $settings['version'] : 0;

        /* TODO: Make usage of apiKey (currently in project update returns true) */
        $apiKey         = isset ($settings['apiKey']) ? $settings['apiKey'] : false;
        $uri            = isset ($settings['uri']) ? $settings['uri'] : false;
        $updateFolder   = isset ($settings['updateFolder']) ? str_replace ('//', '/', $webroot.$settings['updateFolder'].'/') : false;

        if ($currentVersion && $uri && $apiKey && $updateFolder)
        {
            $client         = new \GuzzleHttp\Client (['base_uri' => $uri]);
            $options        = array ('verify' => false, 'http_errors' => false);
            $response       = $client->request ('GET', '?version='.$currentVersion.'&key='.$apiKey.'&update=true', $options);
            $code           = $response->getStatusCode ();

            if ($code === 200)
            {
                $result     = json_decode ($response->getBody (), true);
                $majorFiles = $result['files'];
                $status     = $result['status'];

                if ((int)$status['success'] > -1)
                {
                    foreach ($majorFiles as $majorVersion => $minorFiles)
                    {
                        foreach ($minorFiles as $minorVersion => $revisionFiles)
                        {
                            foreach ($revisionFiles as $revisionVersion => $buildFiles)
                            {
                                foreach ($buildFiles as $buildVersion => $buildFile)
                                {
                                    $file           = $buildFile['file'];
                                    $checksum       = $buildFile['checksum'];

                                    $filePath       = implode ('/', array_slice (explode ('/', $file), 0, -1));

                                    if ($file !== 0)   
                                    { 
                                        if (!is_dir ($updateFolder.$filePath)) { mkdir ($updateFolder.$filePath, 0775, true);  }

                                        $resourceAdd        = fopen ($updateFolder.$file, 'w');
                                        $tmpOptions         = array_merge ($options, array ('sink' => $resourceAdd));

                                        $client->request ('GET', $file, $tmpOptions);

                                        $fileDownloaded     = file_exists ($updateFolder.$file);
                                        $validChecksum      = $fileDownloaded && $this->validChecksum ($updateFolder.$file, $checksum);
                                        
                                        $majorFiles[$majorVersion][$minorVersion][$revisionVersion][$buildVersion]['src']       = $updateFolder.$file;
                                        $majorFiles[$majorVersion][$minorVersion][$revisionVersion][$buildVersion]['path']      = $updateFolder.substr ($file, 0, strpos ($file, '.tar.gz'));
                                        
                                        if (!$fileDownloaded)   { return -1;    }
                                        if (!$validChecksum)    { return -2;    }
                                    }
                                }
                            }
                        }
                    }

                    return $majorFiles;
                }
                else
                {
                    return $this->error ($this->REQ_ERR_UNKNOWN);
                }
            }
            else if ($code === 401)
            {
                return $this->error ($this->AUTH_ERR_UNAUTHORIZED);
            }

            return $this->error ($this->REQ_ERR_UNKNOWN);
        }

        return $this->error ($this->REQ_ERR_UNKNOWN);        
    }
    
    private function validChecksum ($file, $checksum)
    {
        return md5 (file_get_contents ($file)) === $checksum;
    }
}