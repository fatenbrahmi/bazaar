package com.shop.bazaar.controllers;




import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.shop.bazaar.dto.ProductDto;
import com.shop.bazaar.entities.Product;
import com.shop.bazaar.services.ProductService;
import jakarta.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;




@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {

    private ProductService productService;

    @Autowired
    public ProductController(ProductService productService){
        this.productService = productService;
    }

 
   @GetMapping


public ResponseEntity<List<ProductDto>> getAllProducts(
    @RequestParam(required = false,name = "categoryId") UUID categoryId,
    @RequestParam(required = false,name = "typeId") UUID typeId,
    @RequestParam(required = false) List<String> colors,   // nouveau
    @RequestParam(required = false) List<String> sizes,    // nouveau
    @RequestParam(required = false) String slug,
    HttpServletResponse response) {

    List<ProductDto> productList = new ArrayList<>();
    if(StringUtils.isNotBlank(slug)){
        ProductDto productDto = productService.getProductBySlug(slug);
        productList.add(productDto);
    } else {
        productList = productService.getAllProducts(categoryId, typeId, colors, sizes);
    }
    response.setHeader("Content-Range", String.valueOf(productList.size()));
    return new ResponseEntity<>(productList, HttpStatus.OK);
}





    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable UUID id){
        ProductDto productDto = productService.getProductById(id);
        return new ResponseEntity<>(productDto, HttpStatus.OK);
    }

    //   create Product
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody ProductDto productDto){
        Product product = productService.addProduct(productDto);
        return new ResponseEntity<>(product,HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@RequestBody ProductDto productDto,@PathVariable UUID id){
        Product product = productService.updateProduct(productDto,id);
        return new ResponseEntity<>(product,HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
    productService.deleteProduct(id);
    return ResponseEntity.noContent().build();
}


}