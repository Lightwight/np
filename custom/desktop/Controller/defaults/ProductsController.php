<?php
class ProductsController extends ProductsHelper implements ControllerInterface
{
    public function getModel (\Model $model, $params) 
    {
        $route      = str_replace ('/*', '', $this->getRoute ());
        $isCategory = $this->findCategoryByRoute ($route) !== false;
        $isSearch   = $route === '/search';
        $isProduct  = !$isCategory && !$isSearch && $route === '/product';

        $products   = array ();

        if ($isCategory)
        {
            $products   = $this->getProductsOfCategory ($model, $route, $params);
            
            return $products;
        }
        else if ($isSearch)
        {
            $products   = $this->findProducts ($model, $params);
        }
        else if ($isProduct)
        {
            $products   = $this->getProduct ($model, $params);
            
            return $products;
        }
        
        if ($products && !is_array ($products)) 
        { 
            $products = array ($products);    
            
            return array_merge ($products, $this->getPopularProducts ($model));
        }
        
        return $this->getPopularProducts ($model);
    }

    public function deleteModel(\Model $model)  {}
    public function postModel(\Model $model)    {}
    public function updateModel(\Model $model)  {}
    
    private function getPopularProducts (\Model $model)
    {
        $newProducts        = $this->getNewProducts (date ('Y-m-01'), '<=', 4); 
        $popularProducts    = $this->getMostWanted ();
        
        if ($newProducts && !is_array ($newProducts))           { $newProducts = array ($newProducts);          }
        if ($popularProducts && !is_array ($popularProducts))   { $popularProducts = array ($popularProducts);  }
        
        
        return array_merge (is_array ($newProducts) ? $newProducts : array (), is_array ($popularProducts) ? $popularProducts : array ());
    }
    
    private function getProductsOfCategory (\Model $model, $route, $params)
    {
        $params     = explode ('/', $params);
        $producer   = isset ($params[0]) && is_string ($params[0]) && !empty ($params[0]) ? $this->escape_string ($params[0]) : 'all';
        $producer   = $producer === 'alle' ? 'all' : $producer;

        $page       = isset ($params[1]) && (int)$params[1] > 0 ? (int)$params[1] : 1;
        $sortBy     = isset ($params[2]) ? $this->escape_string ($params[2]) : false;
        $orderBy    = $sortBy ? (isset ($params[3]) ? ($params[3] === 'asc' ? 'asc' : 'desc') : 'asc') : false;
        
        $slugify    = new Cocur\Slugify\Slugify ();
        $parts      = explode ('/', $route);
        
        unset ($parts[0]);
        
        $parts      = array_values ($parts);

        $category   = strtolower ($slugify->slugify ($parts[0]));

        $search     = array
        (
            'slug'  => $producer
        );

        return $this->getProducts ($model, $category, $page, 2, $search, $sortBy, $orderBy);
    }
    
    private function findProducts ($model, $params)
    {
        $params     = explode ('/', $params);
        $search     = isset ($params[0]) && is_string ($params[0]) && !empty ($params[0]) ? $this->escape_string ($params[0]) : 'all';

        $page       = isset ($params[1]) && (int)$params[1] > 0 ? (int)$params[1] : 1;
        $sortBy     = isset ($params[2]) ? $this->escape_string ($params[2]) : false;
        $orderBy    = $sortBy ? (isset ($params[3]) ? ($params[3] === 'asc' ? 'asc' : 'desc') : 'asc') : false;
        

        return $this->searchByKeyword ($model, $search, $page, 2, $sortBy, $orderBy);
    }
    
    private function getProduct (\Model $model, $params)
    {
        return $this->getProductByBookmark ($model, $params);   
    }

    public function uploadFile (\Model $model, $files) {}
}