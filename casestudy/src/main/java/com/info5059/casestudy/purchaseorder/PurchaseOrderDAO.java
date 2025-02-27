package com.info5059.casestudy.purchaseorder;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.info5059.casestudy.product.Product;
import com.info5059.casestudy.product.ProductRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Component
public class PurchaseOrderDAO {
    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private ProductRepository prodRepo;

    @Transactional
    public PurchaseOrder create(PurchaseOrder purchaseOrder) {
        PurchaseOrder realPurchaseOrder = new PurchaseOrder();

        realPurchaseOrder.setVendorid(purchaseOrder.getVendorid());
        realPurchaseOrder.setAmount(purchaseOrder.getAmount());
        realPurchaseOrder.setPodate(LocalDateTime.now());

        entityManager.persist(realPurchaseOrder);
        for (PurchaseOrderLineitem item : purchaseOrder.getItems()) {
            PurchaseOrderLineitem realItem = new PurchaseOrderLineitem();

            realItem.setProductid(item.getProductid());
            realItem.setPoid(realPurchaseOrder.getId());
            realItem.setQty(item.getQty());
            realItem.setPrice(item.getPrice());
            // realPurchaseOrder.getItems().add(realItem);

            entityManager.persist(realItem);

            // we also need to update the QOO on the product table
            Product prod = prodRepo.getReferenceById(item.getProductid());
            prod.setQoo(prod.getQoo() + item.getQty());
            prodRepo.saveAndFlush(prod);

        }
        entityManager.flush();
        entityManager.refresh(realPurchaseOrder);
        return realPurchaseOrder;
    }

}
/*
SELECT * FROM PURCHASE_ORDER;
SELECT * FROM PURCHASE_ORDER_LINEITEM;
SELECT * FROM PRODUCT;
 */