package com.shop.bazaar.specification;

import com.shop.bazaar.entities.Product;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Join;
import java.util.List;
import java.util.UUID;

public class ProductSpecification {

    public static Specification<Product> hasCategoryId(UUID categoryId){
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Product> hasCategoryTypeId(UUID typeId){
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("categoryType").get("id"), typeId);
    }

    public static Specification<Product> hasColors(List<String> colors) {
        return (root, query, criteriaBuilder) -> {
            Join<Product, ?> variants = root.join("productVariants");
            return variants.get("color").in(colors);
        };
    }

    public static Specification<Product> hasSizes(List<String> sizes) {
        return (root, query, criteriaBuilder) -> {
            Join<Product, ?> variants = root.join("productVariants");
            return variants.get("size").in(sizes);
        };
    }
}
