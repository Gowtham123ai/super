package com.supermarket.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class CreditSale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String phone;
    private double amount;

    private LocalDate billDate;
    private LocalDate dueDate;

    private boolean paid;

    public CreditSale() {
    }

    public CreditSale(Long id, String customerName, String phone, double amount,
            LocalDate billDate, LocalDate dueDate, boolean paid) {
        this.id = id;
        this.customerName = customerName;
        this.phone = phone;
        this.amount = amount;
        this.billDate = billDate;
        this.dueDate = dueDate;
        this.paid = paid;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public LocalDate getBillDate() {
        return billDate;
    }

    public void setBillDate(LocalDate billDate) {
        this.billDate = billDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public boolean isPaid() {
        return paid;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }
}
