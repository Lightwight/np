<?php
class CountriesController extends ControllerHelper implements ControllerInterface
{
    public function getModel ( Model $model, $params )
    {
        return $model->result ();
    }
    
    public function postModel (Model $model)    {}
    public function updateModel (Model $model ) {}
    public function deleteModel (Model $model)  {}

    public function getCrawlerModel(\Model $model, $params) {
        return;
    }
}