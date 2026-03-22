package com.supermarket.controller;

import com.supermarket.model.CreditSale;
import com.supermarket.repository.CreditSaleRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/credits")
@CrossOrigin
public class CreditSaleController {

    private final CreditSaleRepository repo;

    public CreditSaleController(CreditSaleRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<CreditSale> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public CreditSale create(@RequestBody CreditSale credit) {
        credit.setBillDate(LocalDate.now());
        credit.setPaid(false);
        return repo.save(credit);
    }

    @PutMapping("/{id}/pay")
    public CreditSale markPaid(@PathVariable Long id) {
        CreditSale credit = repo.findById(id).orElseThrow();
        credit.setPaid(true);
        return repo.save(credit);
    }
}
