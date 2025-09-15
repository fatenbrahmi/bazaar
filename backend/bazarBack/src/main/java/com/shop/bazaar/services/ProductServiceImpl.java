package com.shop.bazaar.services;

import com.shop.bazaar.dto.ProductDto;
import com.shop.bazaar.entities.*;
import java.util.List;
import com.shop.bazaar.repositories.ProductRepository;
import com.shop.bazaar.specification.ProductSpecification;



import com.shop.bazaar.mapper.ProductMapper;
import com.shop.bazaar.exceptions.ResourceNotFoundEx;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Suppression ou commentaire pour categoryService non utilisé
    // @Autowired
    // private CategoryService categoryService;

    @Autowired
    private ProductMapper productMapper;

    @Override
    public Product addProduct(ProductDto productDto) {
        Product product = productMapper.mapToProductEntity(productDto);
        return productRepository.save(product);
    }

   @Override
public List<ProductDto> getAllProducts(UUID categoryId, UUID typeId, List<String> colors, List<String> sizes) {
    Specification<Product> spec = (root, query, criteriaBuilder) -> null;


    if (categoryId != null) {
        spec = spec.and(ProductSpecification.hasCategoryId(categoryId));
    }
    if (typeId != null) {
        spec = spec.and(ProductSpecification.hasCategoryTypeId(typeId));
    }
    if (colors != null && !colors.isEmpty()) {
        spec = spec.and(ProductSpecification.hasColors(colors));
    }
    if (sizes != null && !sizes.isEmpty()) {
        spec = spec.and(ProductSpecification.hasSizes(sizes));
    }

    List<Product> products = productRepository.findAll(spec);
    return products.stream()
            .map(productMapper::mapProductToDto)
            .toList();
}


     @Override
    public ProductDto getProductBySlug(String slug) {
        Product product= productRepository.findBySlug(slug);
        if(null == product){
            throw new ResourceNotFoundEx("Product Not Found!");
        }
        ProductDto productDto = productMapper.mapProductToDto(product);
        productDto.setCategoryId(product.getCategory().getId());
        productDto.setCategoryTypeId(product.getCategoryType().getId());
        productDto.setVariants(productMapper.mapProductVariantListToDto(product.getProductVariants()));
        productDto.setProductResources(productMapper.mapProductResourcesListDto(product.getResources()));
        return productDto;
    }

    @Override
    public ProductDto getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundEx("Product Not Found!"));
        return buildProductDto(product);
    }

    private ProductDto buildProductDto(Product product) {
        ProductDto productDto = productMapper.mapProductToDto(product);
        productDto.setCategoryId(product.getCategory().getId());
        productDto.setCategoryTypeId(product.getCategoryType().getId());
        productDto.setVariants(productMapper.mapProductVariantListToDto(product.getProductVariants()));
        productDto.setProductResources(productMapper.mapProductResourcesListDto(product.getResources()));
        return productDto;
    }

    @Override
    public Product updateProduct(ProductDto productDto, UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundEx("Product Not Found!"));
        productDto.setId(product.getId());
        return productRepository.save(productMapper.mapToProductEntity(productDto));
    }

    @Override
    public Product fetchProductById(UUID id) throws Exception {
        return productRepository.findById(id).orElseThrow(BadRequestException::new);
    }
    @Override
public void deleteProduct(UUID id) {
    // Vérifiez d'abord si le produit existe
    if (!productRepository.existsById(id)) {
        throw new ResourceNotFoundEx("Product not found with id: " + id);
    }
    productRepository.deleteById(id);
}
}