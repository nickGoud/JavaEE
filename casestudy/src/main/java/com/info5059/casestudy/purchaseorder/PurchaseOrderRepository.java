package com.info5059.casestudy.purchaseorder;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface PurchaseOrderRepository extends CrudRepository<PurchaseOrder, Long>{
    Iterable<PurchaseOrder> findAll();
    List<PurchaseOrder> findByVendorid(Long vendorid);
}