package com.supermarket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.supermarket.model.Product;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByBarcode(String barcode);
}
