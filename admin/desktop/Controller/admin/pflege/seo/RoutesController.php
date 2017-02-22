<?php
class RoutesController implements ControllerInterface
{
    public function getModel (\Model $model, $params) 
    {
        $routes = $model->findBy ('customizable', 1)->result ();
        
        if ($routes)
        {
            if (!is_array ($routes))    { $routes = array ($routes);    }
        }
        
        return $routes;
    }

    public function postModel (\Model $model)           {}
    public function updateModel (\Model $model)         {}
    public function deleteModel (\Model $model)         {}
    public function uploadFile (\Model $model, $file)   {}
}