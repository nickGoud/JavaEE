package com.info5059.casestudy.purchaseorder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class PurchaseOrderController {
    @Autowired
    private PurchaseOrderDAO purchaseOrderDAO;

    @Autowired
    private PurchaseOrderRepository poRepository;

    @PostMapping("/api/purchaseorders")
    public ResponseEntity<PurchaseOrder> addOne(@RequestBody PurchaseOrder purchaseOrder) { // use RequestBody here
        return new ResponseEntity<PurchaseOrder>(purchaseOrderDAO.create(purchaseOrder), HttpStatus.OK);
    }

    @GetMapping("/api/purchaseorders/{id}")
    public ResponseEntity<Iterable<PurchaseOrder>> findByVendor(@PathVariable Long id) {
        return new ResponseEntity<Iterable<PurchaseOrder>>(poRepository.findByVendorid(id), HttpStatus.OK);
    }

    @GetMapping("/api/pos")
    public ResponseEntity<Iterable<PurchaseOrder>> findAll() {
        Iterable<PurchaseOrder> pos = poRepository.findAll();
        return new ResponseEntity<Iterable<PurchaseOrder>>(pos, HttpStatus.OK);
    }

}
