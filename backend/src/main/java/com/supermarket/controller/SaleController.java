package com.supermarket.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import java.util.List;
import com.supermarket.repository.SaleRepository;
import com.supermarket.model.Sale;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SaleController {

    private final SaleRepository repo;
    private final com.supermarket.repository.ProductRepository productRepository;

    @PostMapping
    public ResponseEntity<Sale> saveSale(@RequestBody Sale sale) {
        com.supermarket.model.Product product = productRepository
                .findByBarcode(sale.getBarcode())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStock() < sale.getQuantity()) {
            throw new RuntimeException("Not enough stock");
        }

        // Reduce stock
        product.setStock(product.getStock() - sale.getQuantity());
        productRepository.save(product);

        return ResponseEntity.ok(repo.save(sale));
    }

    @GetMapping
    public List<Sale> getAll() {
        return repo.findAll();
    }
}
