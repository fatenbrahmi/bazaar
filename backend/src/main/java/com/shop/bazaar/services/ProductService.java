package com.shop.bazaar.services;
import  com.shop.bazaar.dto.ProductDto;
import com.shop.bazaar.entities.Product;
import java.util.List;
import java.util.UUID;



public interface ProductService {

    public Product addProduct(ProductDto product);;
    
    public List<ProductDto> getAllProducts(UUID categoryId, UUID typeId, List<String> colors, List<String> sizes);

    ProductDto getProductBySlug(String slug);

    ProductDto getProductById(UUID id);

    Product updateProduct(ProductDto productDto, UUID id);

    Product fetchProductById(UUID uuid) throws Exception;
    void deleteProduct(UUID id);

   
}
