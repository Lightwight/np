<?php

class NpWitHelper
{
    public static function addValueToEntity ($intent, $entity, $value = null)
    {
        if ($value !== null)
        {
            $_SESSION[$intent][$entity] = $value;
        }
        
        return self::getValueOfEntity ($intent, $entity, $value);
    }
    
    public static function getValueOfEntity ($intent, $entity)
    {
        return isset ($_SESSION[$intent][$entity]) ? $_SESSION[$intent][$entity] : false;
    }
}