<?php
class LanguageHelper 
{
    public function getLanguage ()
    {
        $cookieLang = NPCookie::getCookie ('lang', false);
        $config     = Config::getInstance ();
        $settings   = $config->getSettings ();
        $autodetect = isset ($settings['language']['autodetect']) && is_bool ($settings['language']['autodetect']) ? $settings['language']['autodetect'] : false;

        $language   = $cookieLang ? $cookieLang : ($autodetect ? $this->getBrowserLanguage () : $this->getDefaultLanguage ());
        
        if (!$language) { $this->setLanguage ($language);   }

        return $language;
    }
    
    public function setLanguage ($language = 'DE')
    {
        // Expires in 1 month
        NPCookie::setCookie ('lang', $language, 60*60*24*365);
    }
    
    public function getBrowserLanguage ()
    {
        $langs          = explode (',', $_SERVER['HTTP_ACCEPT_LANGUAGE']);
        $hiq            = 0;
        
        $config         = Config::getInstance ();
        $settings       = $config->getSettings ();
        $l              = isset ($settings['language']) && isset ($settings['language']['default']) ? strtoupper ($settings['language']['default']) : 'DE';

        foreach ($langs as $lang)
        {
            $parts      = explode (';', $lang);
            $lang_code  = isset ($parts[0]) ? strtoupper (substr ($parts[0], 0, 2)) : $l;
            $q          = isset ($parts[1]) ? $parts[1] : 1;

            if ($q > $hiq)      { $l    = $lang_code;   }
        }

        return $l;
    }
    
    public function getDefaultLanguage ()
    {
        $config     = Config::getInstance ();
        $settings   = $config->getSettings ();

        return isset ($settings['language']) && isset ($settings['language']['default']) ? $settings['language']['default'] : 'DE';
    }
}