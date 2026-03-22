package com.supermarket.controller;

import com.supermarket.model.Supplier;
import com.supermarket.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierRepository repo;

    @GetMapping
    public List<Supplier> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Supplier create(@RequestBody Supplier supplier) {
        return repo.save(supplier);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
