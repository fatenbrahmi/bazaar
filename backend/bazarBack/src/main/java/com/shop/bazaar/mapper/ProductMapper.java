package com.shop.bazaar.mapper;

import com.shop.bazaar.dto.ProductDto;
import com.shop.bazaar.dto.ProductResourceDto;
import com.shop.bazaar.dto.ProductVariantDto;
import com.shop.bazaar.entities.*;
import com.shop.bazaar.services.CategoryService;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    @Autowired
    private CategoryService categoryService;

    public Product mapToProductEntity(ProductDto productDto){
        Product product = new Product();
        if(null != productDto.getId()){
            product.setId(productDto.getId());
        }
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setBrand(productDto.getBrand());
        product.setNewArrival(productDto.isNewArrival());
        product.setPrice(productDto.getPrice());
        product.setRating(productDto.getRating());
        product.setSlug(productDto.getSlug());

        Category category = categoryService.getCategory(productDto.getCategoryId());
        if(null != category){
            product.setCategory(category);
            UUID categoryTypeId = productDto.getCategoryTypeId();

            CategoryType categoryType = category.getCategoryTypes().stream().filter(categoryType1 -> categoryType1.getId().equals(categoryTypeId)).findFirst().orElse(null);
            product.setCategoryType(categoryType);
        }

        if(null != productDto.getVariants()){
            product.setProductVariants(mapToProductVariant(productDto.getVariants(),product));
        }

        if(null != productDto.getProductResources()){
            product.setResources(mapToProductResources(productDto.getProductResources(),product));
        }



        return product;
    }



    

    private List<Resources> mapToProductResources(List<ProductResourceDto> productResources, Product product) {

        return productResources.stream().map(productResourceDto -> {
            Resources resources= new Resources();
            if(null != productResourceDto.getId()){
                resources.setId(productResourceDto.getId());
            }
            resources.setName(productResourceDto.getName());
            resources.setType(productResourceDto.getType());
            resources.setUrl(productResourceDto.getUrl());
            resources.setIsPrimary(productResourceDto.getIsPrimary());
            resources.setProduct(product);
            return resources;
        }).collect(Collectors.toList());
    }



    private List<ProductVariant> mapToProductVariant(List<ProductVariantDto> productVariantDtos, Product product){
        return productVariantDtos.stream().map(productVariantDto -> {
            ProductVariant productVariant = new ProductVariant();
            if(null != productVariantDto.getId()){
                productVariant.setId(productVariantDto.getId());
            }
            productVariant.setColor(productVariantDto.getColor());
            productVariant.setSize(productVariantDto.getSize());
            productVariant.setStockQuantity(productVariantDto.getStockQuantity());
            productVariant.setProduct(product);
            return productVariant;
        }).collect(Collectors.toList());
    }



    public List<ProductDto> getProductDtos(List<Product> products) {
        return products.stream().map(this::mapProductToDto).toList();
    }


public ProductDto mapProductToDto(Product product) {
    ProductDto dto = ProductDto.builder()
            .id(product.getId())
            .brand(product.getBrand())
            .name(product.getName())
            .price(product.getPrice())
            .isNewArrival(product.isNewArrival())
            .rating(product.getRating())
            .description(product.getDescription())
            .slug(product.getSlug())
            .thumbnail(getProductThumbnail(product.getResources()))
            .build();

    // Ajout des champs manquants
    if(product.getCategory() != null) {
        dto.setCategoryId(product.getCategory().getId());
        dto.setCategoryName(product.getCategory().getName());
    }
    
    if(product.getCategoryType() != null) {
        dto.setCategoryTypeId(product.getCategoryType().getId());
        dto.setCategoryTypeName(product.getCategoryType().getName());
    }
    
    if(product.getProductVariants() != null && !product.getProductVariants().isEmpty()) {
        dto.setVariants(mapProductVariantListToDto(product.getProductVariants()));
    }
    
    if(product.getResources() != null && !product.getResources().isEmpty()) {
        dto.setProductResources(mapProductResourcesListDto(product.getResources()));
    }
    
    return dto;
}



   private String getProductThumbnail(List<Resources> resources) {
    if (resources == null || resources.isEmpty()) {
        return "default-thumbnail.jpg"; // ou une URL par défaut
    }
    
    return resources.stream()
            .filter(Resources::getIsPrimary)
            .findFirst()
            .map(Resources::getUrl)
            .orElseGet(() -> resources.get(0).getUrl()); // Fallback sur la première image si aucune principale
}




    public List<ProductVariantDto> mapProductVariantListToDto(List<ProductVariant> productVariants) {
       return productVariants.stream().map(this::mapProductVariantDto).toList();
    }



    private ProductVariantDto mapProductVariantDto(ProductVariant productVariant) {
        return ProductVariantDto.builder()
                .color(productVariant.getColor())
                .id(productVariant.getId())
                .size(productVariant.getSize())
                .stockQuantity(productVariant.getStockQuantity())
                .build();
    }



    public List<ProductResourceDto> mapProductResourcesListDto(List<Resources> resources) {
        return resources.stream().map(this::mapResourceToDto).toList();
    }



    private ProductResourceDto mapResourceToDto(Resources resources) {
        return ProductResourceDto.builder()
                .id(resources.getId())
                .url(resources.getUrl())
                .name(resources.getName())
                .isPrimary(resources.getIsPrimary())
                .type(resources.getType())
                .build();
    }
}
