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

class DeliveryHelper
{
    private static $gateways    = array ('DHL', 'UPS', 'Hermes');
    private static $cod         = false;
    
    private function __construct()  {}
    private function __clone ()     {} 

    public static function addToPackage ($article_id, $size, $weight, $price)
    {
        foreach (self::$gateways as $gateway)
        {
            try
            {
                $class  = $gateway.'DeliveryGateway';
                
                $class::addToPackage ($article_id, $size, $weight, $price);
            } 
            catch (Exception $ex) { /* Gateway doesnt match */ }
        }
    }
    
    public static function setCOD ($isCod)
    {
        self::$cod  = $isCod;
        
        foreach (self::$gateways as $gateway)
        {
            try 
            {
                $class      = $gateway.'DeliveryGateway';
                
                $class::setCOD ($isCod);
            } 
            catch (Exception $ex) { /* Gateway doesnt match */ }            
        }
    }
    
    public static function calcPackage ()
    {
        $result     = array ();
        
        foreach (self::$gateways as $gateway)
        {
            $result[$gateway]  = array 
            (
                'total'     => 5.90,
                'cod'       => self::$cod ? 2.99 : 0
            );
            
//            try 
//            {
//                $class      = $gateway.'DeliveryGateway';
//                
//                $packages   = $class::calcPackage ();
//                $totalPrice = 0;
//                $totalCOD   = 0;
//                
//                foreach ($packages as $package)
//                {
//                    $totalPrice += $package['price'];
//                    $totalCOD   += $package['total']['cod'];
//                }
//            
//                $result[$gateway]  = array 
//                (
//                    'packages'  => $packages,
//                    'total'     => $totalPrice,
//                    'cod'       => $totalCOD
//                );
//            } 
//            catch (Exception $ex) { /* Gateway doesnt match */ }            
        }

        return $result;
    }
}

class DHLDeliveryGateway
{
    private static $packages        = array ();
    private static $articles        = array ();
    private static $isCod           = false;
    
    private static $codRules        = array
    (
        'min'   => 6.55,
        'perc'  => 0.03
    );
    
    private static $packageRules    = array 
    (
        array 
        (
            'size'      => 'S',
            'maxSize'   => 10,
            'maxWeight' => 4,
            'price'     => 4.95
        ), 
        
        array 
        (
            'size'      => 'S',
            'maxSize'   => 17,
            'maxWeight' => 6,
            'price'     => 7.95
        ), 
        
        array
        (
            'size'      => 'L',
            'maxSize'   => 20,
            'maxWeight' => 10,
            'price'     => 12.95
        )
    );
    
    public static function addToPackage ($article_id, $size, $weight, $price)
    {
        self::$articles[]   = array ($article_id, $size, $weight, $price);
    }
    
    public static function setCOD ($isCod)  { self::$isCod = $isCod;  }
    
    public static function calcPackage ()
    {
        $articles       = self::$articles;
        $isCod          = self::$isCod;
        
        self::$articles = array ();
        self::$isCod    = false;
        
        $packageRule    = false;
        $packageInx     = 0;
        
        $totalSize      = 0;
        $totalWeight    = 0;
        $totalPrice     = 0;
        
        foreach ($articles as $article)
        {
            $article_id     = $article[0];

            $totalSize     += $article[1];
            $totalWeight   += $article[2];
            $totalPrice    += $article[3];

            if ($packageRule)
            {
                if ($totalSize > $packageRule['maxSize']
                    || $totalWeight > $packageRule['maxWeight']
                ) {
                    $packageRule    = false;
                    
                    foreach (self::$packageRules as $inx => $rule)
                    {
                        if ($totalSize <= $rule['maxSize']
                            && $totalWeight <= $rule['maxWeight']
                        ) {
                            $added          = self::$packages[$packageInx]['added'];
                            $total          = self::$packages[$packageInx]['total'];
                            
                            self::$packages[$packageInx]            = $packageRule = $rule;
                            self::$packages[$packageInx]['added']   = $added;
                            self::$packages[$packageInx]['total']   = $total;
                            
                            break;
                        }
                    }                    
                    
                    if (!$packageRule)
                    {
                        $totalSize      = $article[1];
                        $totalWeight    = $article[2];
                        $totalPrice     = $article[3];

                        $packageInx++;
                    }
                }
            }

            if (!$packageRule)
            {
                foreach (self::$packageRules as $inx => $rule)
                {
                    if ($totalSize <= $rule['maxSize']
                        && $totalWeight <= $rule['maxWeight']
                    ) {
                        $packageRule    = $rule;
                        break;
                    }
                }
            } 
            
            if ($packageRule)
            {
                if (!isset (self::$packages[$packageInx]))
                {
                    self::$packages[$packageInx]    = $packageRule;
                }
                
                self::$packages[$packageInx]['total']       = array 
                (
                    'size'      => $totalSize,
                    'weight'    => $totalWeight,
                    'cod'       => $isCod ? self::getCOD ($totalPrice) : 0
                );
                
                self::$packages[$packageInx]['added'][]     = array
                (
                    'article_id'    => $article_id,
                    'size'          => $article[1],
                    'width'         => $article[2],
                );
            }
        }
        
        return self::$packages;
    }
    
    private static function getCOD ($price)
    {
        $percPrice  = self::$codRules['perc'] > 0 ? round ($price * self::$codRules['perc'], 2) : 0;
        
        return $percPrice > self::$codRules['min'] ? $percPrice : self::$codRules['min'];
    }
}

class UPSDeliveryGateway
{
    private static $packages        = array ();
    private static $articles        = array ();
    private static $isCod           = false;
    
    private static $codRules        = array
    (
        'min'   => 6.55,
        'perc'  => 0.03
    );
    
    private static $packageRules    = array 
    (
        array 
        (
            'size'      => 'S',
            'maxSize'   => 8,
            'maxWeight' => 5,
            'price'     => 5.05
        ), 
        
        array 
        (
            'size'      => 'S',
            'maxSize'   => 8,
            'maxWeight' => 8,
            'price'     => 6.95
        ), 
        
        array
        (
            'size'      => 'L',
            'maxSize'   => 20,
            'maxWeight' => 10,
            'price'     => 11.95
        ),
        
        array
        (
            'size'      => 'L',
            'maxSize'   => 20,
            'maxWeight' => 20,
            'price'     => 15.95
        )
    );
    
    public static function addToPackage ($article_id, $size, $weight, $price)
    {
        self::$articles[]   = array ($article_id, $size, $weight, $price);
    }
    
    public static function setCOD ($isCod)  { self::$isCod = $isCod;    }
    
    public static function calcPackage ()
    {
        $articles       = self::$articles;
        $isCod          = self::$isCod;
        
        self::$articles = array ();
        self::$isCod    = false;
        
        $packageRule    = false;
        $packageInx     = 0;
        
        $totalSize      = 0;
        $totalWeight    = 0;
        $totalPrice     = 0;
        
        foreach ($articles as $article)
        {
            $article_id     = $article[0];

            $totalSize     += $article[1];
            $totalWeight   += $article[2];
            $totalPrice    += $article[3];

            if ($packageRule)
            {
                if ($totalSize > $packageRule['maxSize']
                    || $totalWeight > $packageRule['maxWeight']
                ) {
                    $packageRule    = false;
                    
                    foreach (self::$packageRules as $inx => $rule)
                    {
                        if ($totalSize <= $rule['maxSize']
                            && $totalWeight <= $rule['maxWeight']
                        ) {
                            $added          = self::$packages[$packageInx]['added'];
                            $total          = self::$packages[$packageInx]['total'];
                            
                            self::$packages[$packageInx]            = $packageRule = $rule;
                            self::$packages[$packageInx]['added']   = $added;
                            self::$packages[$packageInx]['total']   = $total;
                            
                            break;
                        }
                    }                    
                    
                    if (!$packageRule)
                    {
                        $totalSize      = $article[1];
                        $totalWeight    = $article[2];
                        $totalPrice     = $article[3];

                        $packageInx++;
                    }
                }
            }

            if (!$packageRule)
            {
                foreach (self::$packageRules as $inx => $rule)
                {
                    if ($totalSize <= $rule['maxSize']
                        && $totalWeight <= $rule['maxWeight']
                    ) {
                        $packageRule    = $rule;
                        break;
                    }
                }
            } 
            
            if ($packageRule)
            {
                if (!isset (self::$packages[$packageInx]))
                {
                    self::$packages[$packageInx]    = $packageRule;
                }
                
                self::$packages[$packageInx]['total']       = array 
                (
                    'size'      => $totalSize,
                    'weight'    => $totalWeight,
                    'cod'       => $isCod ? self::getCOD ($totalPrice) : 0
                );
                
                self::$packages[$packageInx]['added'][]     = array
                (
                    'article_id'    => $article_id,
                    'size'          => $article[1],
                    'width'         => $article[2],
                );
            }
        }
        
        return self::$packages;
    }
    
    private static function getCOD ($price)
    {
        $percPrice  = self::$codRules['perc'] > 0 ? round ($price * self::$codRules['perc'], 2) : 0;
        
        return $percPrice > self::$codRules['min'] ? $percPrice : self::$codRules['min'];
    }
}

class HermesDeliveryGateway
{
    private static $packages        = array ();
    private static $articles        = array ();
    private static $isCod           = false;
    
    private static $codRules        = array
    (
        'min'   => 6.55,
        'perc'  => 0.06
    );
    
    private static $packageRules    = array 
    (
        array 
        (
            'size'      => 'S',
            'maxSize'   => 5,
            'maxWeight' => 3,
            'price'     => 3.95
        ), 
        
        array 
        (
            'size'      => 'S',
            'maxSize'   => 8,
            'maxWeight' => 8,
            'price'     => 6.95
        ), 
        
        array
        (
            'size'      => 'L',
            'maxSize'   => 15,
            'maxWeight' => 8,
            'price'     => 10.95
        ),
        
        array
        (
            'size'      => 'L',
            'maxSize'   => 15,
            'maxWeight' => 10,
            'price'     => 12.95
        )
    );

    public static function addToPackage ($article_id, $size, $weight, $price)
    {
        self::$articles[]   = array ($article_id, $size, $weight, $price);
    }
    
    public static function setCOD ($isCod)  { self::$isCod = $isCod;    }

    public static function calcPackage ()
    {
        $articles       = self::$articles;
        $isCod          = self::$isCod;
        
        self::$articles = array ();
        self::$isCod    = false;
        
        $packageRule    = false;
        $packageInx     = 0;
        
        $totalSize      = 0;
        $totalWeight    = 0;
        $totalPrice     = 0;
        
        foreach ($articles as $article)
        {
            $article_id     = $article[0];

            $totalSize     += $article[1];
            $totalWeight   += $article[2];
            $totalPrice    += $article[3];

            if ($packageRule)
            {
                if ($totalSize > $packageRule['maxSize']
                    || $totalWeight > $packageRule['maxWeight']
                ) {
                    $packageRule    = false;
                    
                    foreach (self::$packageRules as $inx => $rule)
                    {
                        if ($totalSize <= $rule['maxSize']
                            && $totalWeight <= $rule['maxWeight']
                        ) {
                            $added          = self::$packages[$packageInx]['added'];
                            $total          = self::$packages[$packageInx]['total'];
                            
                            self::$packages[$packageInx]            = $packageRule = $rule;
                            self::$packages[$packageInx]['added']   = $added;
                            self::$packages[$packageInx]['total']   = $total;
                            
                            break;
                        }
                    }                    
                    
                    if (!$packageRule)
                    {
                        $totalSize      = $article[1];
                        $totalWeight    = $article[2];
                        $totalPrice     = $article[3];

                        $packageInx++;
                    }
                }
            }

            if (!$packageRule)
            {
                foreach (self::$packageRules as $inx => $rule)
                {
                    if ($totalSize <= $rule['maxSize']
                        && $totalWeight <= $rule['maxWeight']
                    ) {
                        $packageRule    = $rule;
                        break;
                    }
                }
            } 
            
            if ($packageRule)
            {
                if (!isset (self::$packages[$packageInx]))
                {
                    self::$packages[$packageInx]    = $packageRule;
                }
                
                self::$packages[$packageInx]['total']       = array 
                (
                    'size'      => $totalSize,
                    'weight'    => $totalWeight,
                    'cod'       => $isCod ? self::getCOD ($totalPrice) : 0
                );
                
                self::$packages[$packageInx]['added'][]     = array
                (
                    'article_id'    => $article_id,
                    'size'          => $article[1],
                    'width'         => $article[2],
                );
            }
        }
        
        return self::$packages;
    }
    
    private static function getCOD ($price)
    {
        $percPrice  = self::$codRules['perc'] > 0 ? round ($price * self::$codRules['perc'], 2) : 0;
        
        return $percPrice > self::$codRules['min'] ? $percPrice : self::$codRules['min'];
    }
}