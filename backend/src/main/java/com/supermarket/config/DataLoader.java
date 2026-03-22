package com.supermarket.config;

import com.supermarket.model.Product;
import com.supermarket.repository.ProductRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class DataLoader {

    private final ProductRepository productRepository;

    public DataLoader(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @PostConstruct
    public void loadData() {
        if (productRepository.count() == 0) {

            productRepository.save(new Product(null, "8901234567890", "Fresh Milk 1L", 65.0, 5.0, 50));
            productRepository.save(new Product(null, "8901111222333", "Brown Bread", 40.0, 0.0, 30));
            productRepository.save(new Product(null, "8904445556667", "Amul Butter 500g", 275.0, 12.0, 25));
            productRepository.save(new Product(null, "8907778889990", "Basmati Rice 5kg", 850.0, 5.0, 15));
            productRepository.save(new Product(null, "8905556667771", "Maggi Noodles Pack", 156.0, 12.0, 120));

            System.out.println("✅ Demo products loaded");
        }
    }
}
