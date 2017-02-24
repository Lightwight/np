<?php
class ProductsHelper extends ControllerHelper
{
    protected function searchByKeyword ($model, $search, $page = 1, $limit = 10, $sortBy = false, $sortOrder = false) 
    {
        $tmpModel   = new Model ('Products');
        $tmpModel->paginate ($limit, $page);
        
        $model      = new Model ('Products');
        
        $optimizer  = new Search_optimizerController ();
        $optimized  = $optimizer->getOptimized ('products', $search);
        
        $sParts = explode ('-', $search);
        
        $model
            ->innerJoin ('article_categories', 'KeyKategorie', 'products', 'category_id', 'article_categories', 'KeyName', 'category')
            ->leftJoin ('article_manufacturers', 'manufacturer_id', 'products', 'manufacturer_id', 'article_manufacturers', 'name', 'manufacturer')
            ->leftJoin ('article_manufacturers', 'manufacturer_id', 'products', 'manufacturer_id', 'article_manufacturers', 'slug', 'manufacturer_slug');
        
        foreach ($sParts as $sPart)
        {
            $model->findLike ('name', $sPart)
                ->orFindLike ('category', $sPart)
                ->orFindLike ('bookmark', $sPart)
                ->orFindLike ('manufacturer', $sPart)
                ->orFindLike ('manufacturer_slug', $sPart);
        }
        
        foreach ($optimized as $optID => $rank)
        {
            $model->orFindBy ('ID', $optID);
        }
        
        if ($sortBy)
        {
            $model->orderBy ($sortBy, $sortOrder);
        }
                
        $result = $model
                    ->excludeDeleted ()
                    ->result ();

        if ($result && !is_array ($result)) { $result = array ($result);    }

        if (is_array ($result))
        {
            foreach ($result as $product)   
            { 
                $id = $product->get ('id');
                
                $product->set ('search_rank', (isset ($optimized[$id]) ? (int)$optimized[$id] : 0));
                $product->set ('search_term', $search);
                $product->set ('search_result', 1);

                $this->saveSearched ($product);
            }
        }
        
        $_SESSION['pagination']['products']['total']            = count ($result);

        if (!$sortBy)
        {
            $result = $this->orderBySearchRank ($result);
        }
        
        return is_array ($result) ? (count ($result) > 1 ? array_slice ($result, (($page-1) * $limit), $limit) : $result) : false;
    }
    
    private function orderBySearchRank ($rows)
    {
        if ($rows)
        {
            usort ($rows, function ($a, $b) {
                return $a->get ('search_rank') < $b->get ('search_rank');
            });
        }
        
        return $rows;
    }
    
    protected function findCategoryByRoute ($route)
    {
        $route          = str_replace ('/*', '', $route);
        $model          = new Model ('Article_categories');

        return $model
                ->findBy ('bookmark', $this->escape_string ($route))
                ->findBy ('deleted', 0)
                ->result ();
    }
    
    protected function getAllProducts (Model $model)
    {
        return $model
                ->leftJoin ('article_manufacturers', 'manufacturer_id', 'products', 'manufacturer_id', 'article_manufacturers', 'name', 'manufacturer')
                ->innerJoin ('article_categories', 'KeyKategorie', 'products', 'category_id', 'article_categories', 'KeyName', 'category')
                ->innerJoin ('article_categories', 'KeyKategorie', 'products', 'category_id', 'article_categories', 'KeyName', 'category_slug')
                ->findBy ('enabled', 1)
                ->excludeDeleted ()
                ->result ();
    }

    protected function getProducts (Model $model, $routeCategory, $page = 1, $limit = 10, $searchValues = false, $sortBy = false, $sortOrder = 'asc')
    {
        $query          =   $model->paginate ($limit, $page)
                            ->leftJoin ('article_manufacturers', 'manufacturer_id', 'products', 'manufacturer_id', 'article_manufacturers', 'name', 'manufacturer')
                            ->innerJoin ('article_categories', 'KeyKategorie', 'products', 'category_id', 'article_categories', 'KeyName', 'category')
                            ->innerJoin ('article_categories', 'KeyKategorie', 'products', 'category_id', 'article_categories', 'KeyName', 'category_slug')
                            ->findBy ('enabled', 1)
                            ->findBy ('category', $routeCategory)
                            ->excludeDeleted ();

        if (is_array ($searchValues))
        {
            foreach ($searchValues as $column => $search)
            {
                if ($search !== 'all')
                {
                    $query  = $query->findBy ($column, $search);
                }
            }
        }
        
        if ($sortBy)
        {
            $query  = $query->orderBy ($sortBy, $sortOrder);
        }

        $result = $query->result ();

        return $result ? $result : $this->error ($this->SQL_ERR_NOT_FOUND, false);
    }
    
    protected function getProductByBookmark ($model, $bookmark)
    {
        if (strpos ($bookmark, '/') > 0)
        {
            $parts          = explode ('/', $bookmark);
            $bookmark       = $parts[0];
            $searchResult   = isset ($parts[1]) && (int)$parts[1] === 1;
        }

        $product    = $model
                        ->innerJoin ('article_categories', 'KeyKategorie', 'products', 'category_id', 'article_categories', 'KeyName', 'category')
                        ->leftJoin ('article_manufacturers', 'manufacturer_id', 'products', 'manufacturer_id', 'article_manufacturers', 'name', 'manufacturer')
                        ->findBy ('enabled', 1)
                        ->findBy ('bookmark', '/product/'.$bookmark)
                        ->excludeDeleted ()
                        ->nl2br ('description')
                        ->result ();

        if ($product)
        {
            // If the clicked triggered by a searched product, then
            // add it to the search collection for better later results
            // in case of the same product search.
            if ($searchResult)
            {
                
            }

            // Statistic: User viewed product details (inner 30 mins):
            $this->saveViewed ($product);

            return $product;
        }
        
        return false;
    }
    
    protected function saveViewed ($product)
    {
        $article_id = $product->get ('article_id');
        
        $mProduct   = new Model ('Products');
        $resProduct = $mProduct->findBy ('article_id', $article_id)->result ();
        
        if ($resProduct && !is_array ($resProduct))
        {
            if (!isset ($_SESSION['products'])) 
            { 
                $_SESSION['products']   = array (); 
            }
            
            if (!isset ($_SESSION['products'][$article_id])) 
            { 
                $_SESSION['products'][$article_id] = array (); 
            }
            
            if (!isset ($_SESSION['products'][$article_id]['viewed'])) 
            { 
                $_SESSION['products'][$article_id]['viewed'] = time ();
                
                $resProduct->set ('viewed', ((int)$resProduct->get ('viewed')+1));
                $resProduct->update ();
            }
            
            $updateable = (time ()-$_SESSION['products'][$article_id]['viewed'])/60 > 60;
            
            if ($updateable)
            {
                $_SESSION['products'][$article_id]['viewed'] = time ();
                
                $resProduct->set ('viewed', ((int)$resProduct->get ('viewed')+1));
                $resProduct->update ();
            }
        }
    }
    
    protected function saveSearched ($product)
    {
        $rel_article_id = $product->get ('rel_article_id');
        $article_id     = !empty ($rel_article_id) ? $rel_article_id : $product->get ('article_id');
        
        $mProduct   = new Model ('Products');
        $resProduct = $mProduct->findBy ('article_id', $article_id)->result ();
        
        if ($resProduct && !is_array ($resProduct))
        {
            if (!isset ($_SESSION['products'])) 
            { 
                $_SESSION['products']   = array (); 
            }
            
            if (!isset ($_SESSION['products'][$article_id])) 
            { 
                $_SESSION['products'][$article_id] = array (); 
            }
            
            if (!isset ($_SESSION['products'][$article_id]['searched'])) 
            { 
                $_SESSION['products'][$article_id]['searched'] = time ();
                
                $resProduct->set ('searched', ((int)$resProduct->get ('searched')+1));
                $resProduct->update ();
            }
            
            $updateable = (time ()-$_SESSION['products'][$article_id]['searched'])/60 > 60;
            
            if ($updateable)
            {
                $_SESSION['products'][$article_id]['searched'] = time ();
                
                $resProduct->set ('searched', ((int)$resProduct->get ('searched')+1));
                $resProduct->update ();
            }
        }
    }

    protected function getProductAndWanted ($model, $bookmark)
    {
        $mProducts      = new Model ('Products');
        $product        = $this->getProductByBookmark ($model, $bookmark);
        $mostWanted     = $this->getMostWanted ($product);
        $cleaned        = $this->removeVariations ($mostWanted);
        $products       = $product ? array (array ($product), $cleaned) : array (array (), $cleaned);
        $merged         = $this->mergeProducts ($products);
        
        foreach ($merged as $mgProduct) { $mProducts->add ($mgProduct); }
        
        return $mProducts->result ();
    }
    
    protected function getNewProducts ($since = '1981-12-05', $op = '<=', $limit = 10)
    {
        $retProducts    = new Model ('Products');

        $sMonth         = date ('Y-m-01');
        $sWeek          = date ('Y-m-d', strtotime ('-'.(date ('w')-1).' days'));
        $cDay           = date ('Y-m-d');

        $mProducts      = new Model ('Products');
        $products       = $mProducts->limit ($limit)
                        ->leftJoin ('article_categories', 'KeyKategorie', 'products', 'category_id', 'article_categories', 'KeyName', 'category_slug')
                        ->leftJoin ('article_manufacturers', 'manufacturer_id', 'products', 'manufacturer_id', 'article_manufacturers', 'name', 'manufacturer')
                        ->orderBy ('publish_date', 'desc')
                        ->findBy ('rel_article_id', '')
                        ->findBy ('publish_date', $since, $op)
                        ->findBy ('stock', '0', '>')
                        ->findBy ('enabled', 1)
                        ->excludeDeleted ()
                        ->result ();

        $result     = array ();

        if (is_array ($products))
        {
            foreach ($products as $product)
            {
                $row            = $this->rankProducts (array ($this->completeProduct ($product->getRow())))->getRow ();
                $publishDate    = date ($row['publish_date']);

                $row['kind_of_new'] = array 
                (
                    'new_in_month'  => $publishDate >= $sMonth, 
                    'new_in_week'   => $publishDate >= $sMonth, 
                    'new_in_day'    => $publishDate == $cDay 
                );

                $retProducts->add ($row);
            }
                            
            $result     = $retProducts->result ();
        }

        return $result;
    }

    protected function getMostWanted ($productToIgnore = false)
    {
        $mostOrdered    = $this->getMostOrdered ($productToIgnore);
        $mostViewed     = $this->getMostViewed ($productToIgnore);
        $mostSearched   = $this->getMostSearched ($productToIgnore);
        
        return $this->rankProducts ($this->mergeProducts (array ($mostOrdered, $mostViewed, $mostSearched)));
    }
    
    protected function getProductByArticleID ($articleID)
    {
        $mProduct   = new Model ('Products');
        $resProduct = $mProduct
                        ->innerJoin ('article_categories', 'KeyKategorie', 'products', 'category_id', 'article_categories', 'KeyName', 'category')
                        ->leftJoin ('article_manufacturers', 'manufacturer_id', 'products', 'manufacturer_id', 'article_manufacturers', 'name', 'manufacturer')
                        ->findBy ('enabled', 1)
                        ->findBy ('article_id', $articleID)
                        ->result ();

        if ($resProduct)
        {
            $product    = $resProduct->getRow ();
            
            return $this->completeProduct ($product);
        }
        
        return false;
    }
    
    protected function getUnavailableProductByArticleID ($articleID)
    {
        $mProduct   = new Model ('Products');
        $resProduct = $mProduct
                        ->innerJoin ('article_categories', 'KeyKategorie', 'products', 'category_id', 'article_categories', 'KeyName', 'category')
                        ->leftJoin ('article_manufacturers', 'manufacturer_id', 'products', 'manufacturer_id', 'article_manufacturers', 'name', 'manufacturer')
                        ->findBy ('article_id', $articleID)
                        ->result ();

        if ($resProduct)
        {
            $product    = $resProduct->getRow ();
            
            return $this->completeProduct ($product);
        }
        
        return false;
    }
    
    protected function getProductState ($product)
    {
        $product['visibility']   = array
        (
            'enabled'       => (int)$product['enabled'],
            'deliverable'   => (int)$product['deliverable']
        );
        
        return $product;
    }

    private function getMostOrdered ($productToIgnore = false)
    {
        $mOrders    = new Model ('Orders');
        $ordered    = $mOrders->limit (10)->orderBy ('amount', 'desc')->result ();
        $ignoreID   = $productToIgnore !== false ? $productToIgnore->get ('article_id') : false;
        $result     = array ();
        
        if ($ordered)
        {
            if (!is_array ($ordered))   { $ordered = array ($ordered);  }
            
            foreach ($ordered as $product)
            {
                $rel_article_id = $product->get ('ref_article_id');
                $article_id     = !empty ($rel_article_id) ? $rel_article_id : $product->get ('article_id');
                
                $mProduct       = new model ('Products');
                $resProduct     = $mProduct
                                    ->leftJoin ('article_categores', 'KeyKategorie', 'products', 'category_id', 'article_categores', 'KeyBeschreibung', 'category')
                                    ->leftJoin ('article_manufacturers', 'manufacturer_id', 'products', 'manufacturer_id', 'article_manufacturers', 'name', 'manufacturer')
                                    ->findBy ('article_id', $article_id)
                                    ->findBy ('enabled', 1)
                                    ->excludeDeleted ()
                                    ->result ();
                
                if ($resProduct && !is_array ($resProduct) && $resProduct->get ('article_id') !== $ignoreID)
                {
                    $tmpProduct             = $resProduct->getRow ();
                    $tmpProduct['ordered']  = $product->get ('amount');
                    
                    $result[]               = $tmpProduct;
                }
            }
        }
        
        return $result;
    }
    
    private function getMostViewed ($productToIgnore = false)
    {
        $mProducts  = new Model ('Products');
        $products   = $mProducts
                        ->leftJoin ('article_categories', 'KeyKategorie', 'products', 'category_id', 'article_categories', 'KeyBeschreibung', 'category')
                        ->leftJoin ('article_manufacturers', 'manufacturer_id', 'products', 'manufacturer_id', 'article_manufacturers', 'name', 'manufacturer')
                        ->findBy ('enabled', 1)
                        ->excludeDeleted ()
                        ->limit (10)
                        ->orderBy ('viewed', 'desc')
                        ->result ();
        
        $ignoreID   = $productToIgnore !== false ? $productToIgnore->get ('article_id') : false;
        $return     = array ();
        
        if ($products)
        {
            if (!is_array ($products))  { $products = array ($products);    }
            
            foreach ($products as $product)
            {
                if ($product->get ('viewed') > 0 
                    && $product->get ('article_id') !== $ignoreID 
                    && $product->get ('rel_article_id') !== $ignoreID
                ) {
                    
                    $return[] = $product; 
                }
            }
        }
        
        return $return;
    }
    
    private function getMostSearched ($productToIgnore = false)
    {
        $mProducts  = new Model ('Products');
        $products   = $mProducts
                        ->leftJoin ('article_categories', 'KeyKategorie', 'products', 'category_id', 'article_categories', 'KeyBeschreibung', 'category')
                        ->leftJoin ('article_manufacturers', 'manufacturer_id', 'products', 'manufacturer_id', 'article_manufacturers', 'name', 'manufacturer')
                        ->findBy ('enabled', 1)
                        ->excludeDeleted ()
                        ->limit (10)
                        ->orderBy ('searched', 'desc')
                        ->result ();

        $ignoreID   = $productToIgnore !== false ? $productToIgnore->get ('article_id') : false;
        $result     = array ();
        
        if (is_array ($products))
        {
            foreach ($products as $product)
            {
                if (empty ($product->get ('rel_article_id')) && $product->get ('article_id') !== $ignoreID)
                {
                    $result[]   = $product;
                }
            }
        }

        return $result;
    }

    private function findProductsByProducer ($keyword)
    {
        $model  = new Model ('Products');
        $result = $model->findLike ('producer', $keyword)->result ();

        if ($result)
        {
            if (!is_array ($result))    { $result = array ($result);    }
            
            return $result;
        }
        else
        {
            return array ();
        }
    }
    
    private function findProductsByName ($keyword)
    {
        $model  = new Model ('Products');
        $result = $model->findLike ('name', $keyword)->result ();

        if ($result)
        {
            if (!is_array ($result))    { $result = array ($result);    }
            
            return $result;
        }
        else
        {
            return array ();
        }
    }
    
    private function findProductsByID ($keyword)
    {
        $model  = new Model ('Products');
        $result = $model->findLike ('article_id', $keyword)->result ();
        
        if ($result)
        {
            if (!is_array ($result))    { $result = array ($result);    }
            
            return $result;
        }
        else
        {
            return array ();
        }
    }
    
    private function findProductsByVariation ($keyword)
    {
        $mVarVals       = new Model ('Article_variation_value');
        $resVarVals     = $mVarVals->findLike ('ArtikelNr', $keyword)->result ();

        $result         = array ();

        if ($resVarVals)
        {
            if (!is_array ($resVarVals))        { $resVarVals = array ($resVarVals);                }
            
            foreach ($resVarVals as $resVarVal)
            {
                $mVariation     = new Model ('Article_variations');
                $resVariation   = $mVariation->findBy ('KeyEigenschaft', $resVarVal->get ('KeyEigenschaft'))->result ();
        
                if ($resVariation && !is_array ($resVariation))
                {
                    $mArticle   = new Model ('Articles');
                    $resArticle = $mArticle->findBy ('KeyArtikel', $resVariation->get ('KeyArtikel'))->result ();

                    if ($resArticle && !is_array ($resArticle))
                    {
                        $mProduct   = new Model ('Products');
                        $resProduct = $mProduct->findBy ('article_id', $resArticle->get ('ArtikelNo'))->result ();
                        
                        if ($resProduct && !is_array ($resProduct)) { $result[] = $resProduct;  }
                    }
                }
            }

            return $result;
        }
        else
        {
            return array ();
        }
    }
    
    private function mergeSearchResults ($productsA, $productsB, $productsC, $productsD)
    {
        $mProducts  = new Model ('Products');
        $artIDS     = array ();
        
        foreach ($productsA as $product)
        { 
            $artIDS[]   = $product->get ('article_id');
            $mProducts->add ($this->completeProduct ($product->getRow ()));
        }
        
        foreach ($productsB as $product)    
        { 
            if (!in_array ($product->get ('article_id'), $artIDS))
            {
                $artIDS[]   = $product->get ('article_id');
                $mProducts->add ($this->completeProduct ($product->getRow ()));
            }
        }
        
        foreach ($productsC as $product)    
        { 
            if (!in_array ($product->get ('article_id'), $artIDS))
            {
                $artIDS[]   = $product->get ('article_id');
                $mProducts->add ($this->completeProduct ($product->getRow ()));
            }
        }
        
        foreach ($productsD as $product)    
        { 
            if (!in_array ($product->get ('article_id'), $artIDS))
            {
                $artIDS[]   = $product->get ('article_id');
                $mProducts->add ($this->completeProduct ($product->getRow ()));
            }
        }
        
        return $mProducts->result ();
    }
    
    private function completeProduct ($product)
    {
        // Seek the Article of root article-table:
        $mArticles      = new Model ('Articles');
        $resArticle     = $mArticles->findBy ('ArtikelNo', $product['article_id'])->result ();

        $product['dependencies']    = $this->getProductDependencies ($product['description']);
        $product['description']     = $this->cleanDescription ($product['description']);
        
        // TODO: $resArticle dprecated because table Articles is unused. Replace with new logic
        
        if ($resArticle && !is_array ($resArticle))
        {
            // Seek the category relation of the article:
            $mCategoryRel       = new Model ('Article_category_rel');
            $resCategoryRel     = $mCategoryRel->findBy ('KeyArtikel', $resArticle->get ('KeyArtikel'))->result ();
            
            if ($resCategoryRel && !is_array ($resCategoryRel))
            {
                // Set the category ID:
                $product['category_id'] = $resCategoryRel->get ('KeyKategorie');
            }

            // Seek the article variations:
            $mVariations        = new Model ('Article_variations');
       
            $resVariations      = $mVariations->findBy ('KeyArtikel', $resArticle->get ('KeyArtikel'))->result ();

            $variations         = array ();
                
            // If it has variations, then complete the article with its variations:
            if ($resVariations)
            {
                if (!is_array ($resVariations)) { $resVariations = array ($resVariations);  }

                foreach ($resVariations as $resVariation)
                {
                    $varName        = $resVariation->get ('Name');

                    $variations[]   = array  ('label' => $varName, 'id' => (int)$resVariation->get ('id'), 'key' => $resVariation->get ('KeyEigenschaft').'-'.$resVariation->get ('KeyArtikel'));
                    $inx            = count ($variations)-1;
                    
                    // Seek the article variation details:
                    $mVarRels       = new Model ('Article_variation_value');
                    $resVarRels     = $mVarRels->findBy ('KeyEigenschaft', $resVariation->get ('KeyEigenschaft'))->result ();

                    if ($resVarRels)
                    {
                        if (!is_array ($resVarRels)) { $resVarRels = array ($resVarRels);    }

                        foreach ($resVarRels as $resVarRel)
                        {
                            $rowResVarRel       = $resVarRel->getRow ();
                            
                            // Seek variation article price details if available:
                            $mVarArticle        = new Model ('Articles');
                            $mProdArticle       = new Model ('Products');
                            
                            $resVarArticle      = $mVarArticle->findBy ('ArtikelNo', $rowResVarRel['ArtikelNr'])->result ();
                            $resProdArticle     = $mProdArticle->findBy ('article_id', $rowResVarRel['ArtikelNr'])->result ();
                            
                            if ($resVarArticle)
                            {
                                $rowResVarRel['tax']    = $resVarArticle->get ('ArtikelMwSt');
                                $rowResVarRel['price']  = $resVarArticle->get ('ArtikelVKNetto');
                            }
                            
                            if ($resProdArticle)
                            {
                                $rowResVarRel['bookmark']       = $resProdArticle->get ('bookmark');
                                $rowResVarRel['title']          = $resProdArticle->get ('title');
                                $rowResVarRel['description']    = $resProdArticle->get ('description');
                            }
                            
                            $variations[$inx][] = $rowResVarRel;
                        }
                    }

                    if (count ($variations[$inx]) === 0)
                    {
                        unset ($variations[$inx]);
                    }
                }
            }

            $product['variations']      = $variations;
        }
        
        // Ceck if product is a variation product itself
        // if it is add the variation values:
        if (strlen ($product['rel_article_id']) > 0)
        {
            // Get the Agio:
            $mVarVals       = new Model ('Article_variation_value');
            $resVarVal      = $mVarVals->findBy ('ArtikelNr', $product['article_id'])->result ();
            
            if ($resVarVal) 
            { 
                $product['agio'] = $resVarVal->get ('Aufpreis'); 
                
                // Get the Category ID:
                $mVars          = new Model ('Article_variations');
                $resVars        = $mVars->findBy ('KeyEigenschaft', $resVarVal->get ('KeyEigenschaft'))->result ();

                if ($resVars)
                {
                    $mCategoryRel   = new Model ('Article_category_rel');
                    $resCategoryRel = $mCategoryRel->findBy ('KeyArtikel', $resVars->get ('KeyArtikel'))->result ();
                    
                    if ($resCategoryRel && !is_array ($resCategoryRel))
                    {
                        $product['category_id'] = $resCategoryRel->get ('KeyKategorie');
                    }
                }
            }
        }

        return $product;
    }
    
    private function mergeProducts ($array, $debug = false)
    {
        $collected  = array ();
        $result     = array ();
        
        foreach ($array as $products)
        {
            if (!is_array ($products))  { $products = array ($products);    }
            
            foreach ($products as $product)
            {
                $completeProduct    = $this->completeProduct (!is_array ($product) ? $product->getRow () : $product);

                if (!in_array ($completeProduct['article_id'], $collected))
                {
                    $result[]       = $completeProduct;
                    $collected[]    = $completeProduct['article_id'];

                    if (isset ($completeProduct['dependencies'])
                        && is_array ($completeProduct['dependencies'])
                        && count ($completeProduct['dependencies']) > 0
                    ) {
                        $dependencies   = $completeProduct['dependencies'];

                        foreach ($dependencies as $dependency)
                        {
                            if (!in_array ($dependency, $collected))
                            {
                                
                                $mProduct   = new Model ('Products');
                                $resProduct = $mProduct->findBy ('article_id', $dependency)->result ();

                                if ($resProduct)
                                {
                                    $dProduct       = $this->completeProduct($resProduct->getRow ());
                                    
                                    $result[]       = $dProduct;
                                    $collected[]    = $dProduct['article_id'];
                                }
                            }
                        }
                    }
                }
                else
                {
                    foreach ($result as $key => $tmpProduct)
                    {
                        if ($completeProduct['article_id'] === $tmpProduct['article_id'])
                        {
                            $tmpOrdered = isset ($tmpProduct['ordered']) ? $tmpProduct['ordered'] : 0;
                            $cOrdered   = isset ($completeProduct['ordered']) ? $completeProduct['ordered'] : 0;
                            
                            $cRank      = isset ($completeProduct['rank']) ? $completeProduct['rank'] : 0;
                            
                            $rank       = $cOrdered > 0 ? $cOrdered : $cRank;
                            
                            $result[$key]['ordered']    = $tmpOrdered+$cOrdered;
                            $result[$key]['rank']       = $rank;
                            
                            break;
                        }
                    }
                }
            }
        }

        return $result;
    }
    
    /*
     * Rank product
     * 
     * Factor Ordered:  10000
     * Factor Searched: 1
     * Factor Viewed:   1
     * 
     */
    private function rankProducts ($products)
    {
        $result = false;

        if (is_array ($products) && count ($products) > 0)
        {
            $resProducts    = new Model ('Products');

            foreach ($products as $key => $product)
            {
                $hasOrdered     = isset ($product['ordered']);
                $hasViewed      = isset ($product['viewed']);
                $hasSearched    = isset ($product['searched']);

                $ordered        = $hasOrdered ? $product['ordered'] : 0;
                $viewed         = $hasViewed ? $product['viewed'] : 0;
                $searched       = $hasSearched ? $product['searched'] : 0;

                $rank           = ($ordered * 10000 + $viewed * 0.5 + $searched) / 100;

                $products[$key]['rank'] = $rank;

                if ($hasOrdered)    { unset ($products[$key]['ordered']);   }
                if ($hasViewed)     { unset ($products[$key]['viewed']);    }
                if ($hasSearched)   { unset ($products[$key]['searched']);  }

                $resProducts->add ($products[$key]);
            }
            
            $result = $resProducts->result ();
        }

        return $result ? $result : array ();
    }
    
    private function getProductDependencies ($description) {
        $regex          = '/\#{1}(A{1}[\w-]+)\;{1}/im';
        $matches        = array ();
        $dependencies   = array ();
        
        if (strlen ($description) > 0 && strpos ($description, '#') > 0) 
        {
            preg_match_all ($regex, $description, $matches, PREG_PATTERN_ORDER);

            // Found some article dependencies in description?
            if (count ($matches[1]) > 0)  
            {
                // Yes! Add 'em:
                $dependencies   = $matches[1];
            }
        }

        return $dependencies;
    }
    
    private function cleanDescription ($description) 
    {
        $regex          = '/\#{1}(A{1}[\w-]+)\;{1}/im';
        
        return preg_replace ($regex, '', $description);
    }
    
    public function removeVariations ($products)
    {
        $retProducts    = array ();

        if (!is_array ($products) && get_class ($products) === 'ModelManip')
        {
            $products   = array ($products);
        }
        
        if ($products)
        {
            foreach ($products as $product)
            {
                if ($product->get ('rel_article_id') === '')
                {
                    $retProducts[]  = $product;
                }
            }
        }
        
        return $retProducts;
    }
}
