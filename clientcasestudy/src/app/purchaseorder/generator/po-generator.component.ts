import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatComponentsModule } from 'src/app/mat-components/mat-components.module';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { Product } from 'src/app/product/product';
import { Vendor } from 'src/app/vendor/vendor';
import { Purchaseorderlineitem } from '../purchaseorderlineitem';
import { NewVendorService } from 'src/app/newvendor.service';
import { ProductService } from 'src/app/product/product.service';
import { PurchaseorderService } from '../purchaseorder.service';
import { Purchaseorder } from '../purchaseorder';
import { PDFURL } from '../../constants';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [CommonModule, MatComponentsModule, ReactiveFormsModule],
  templateUrl: './po-generator.component.html',
  styles: [],
})
export class GeneratorComponent implements OnInit, OnDestroy {
  // form
  generatorForm: FormGroup;
  vendorid: FormControl;
  productid: FormControl;
  qty: FormControl;

  //data
  formSubscription?: Subscription;
  products: Product[] = [];
  vendors: Vendor[] = [];
  vendorproducts: Product[] = [];
  items: Purchaseorderlineitem[] = [];
  selectedProducts: Product[] = [];
  selectedQtys: string[] = ['EOQ'];
  selectedProduct: Product;
  selectedVendor: Vendor;
  selectedQty: number;
  // misc
  pickedProduct: boolean;
  pickedVendor: boolean;
  pickedQty: boolean;
  generated: boolean;
  hasProducts: boolean;
  msg: string;
  total: number;
  purchaseno: number = 0;

  constructor(
    private builder: FormBuilder,
    private vendorService: NewVendorService,
    private productService: ProductService,
    private purchaseorderService: PurchaseorderService
  ) {
    for (var i = 0; i <= 100; i++) {
      this.selectedQtys.push(`${i}`);
    }
    this.pickedVendor = false;
    this.pickedProduct = false;
    this.pickedQty = false;
    this.generated = false;
    this.msg = '';
    this.vendorid = new FormControl('');
    this.productid = new FormControl('');
    this.qty = new FormControl('');
    this.generatorForm = this.builder.group({
      productid: this.productid,
      vendorid: this.vendorid,
      qty: this.qty,
    });
    this.selectedProduct = {
      id: '',
      vendorid: 0,
      name: '',
      costprice: 0,
      msrp: 0,
      rop: 0,
      eoq: 0,
      qoh: 0,
      qoo: 0,
      qrcode: '',
      qrcodetxt: '',
    };
    this.selectedVendor = {
      id: 0,
      name: '',
      address1: '',
      city: '',
      province: '',
      postalcode: '',
      phone: '',
      type: '',
      email: '',
    };
    this.selectedQty = 0;
    this.hasProducts = false;
    this.total = 0.0;
  } // constructor

  ngOnInit(): void {
    this.onPickVendor();
    this.onPickProduct();
    this.onPickQty();
    this.msg = 'loading employees from server...';
    this.getAllVendors();
  }

  ngOnDestroy(): void {
    if (this.formSubscription !== undefined) {
      this.formSubscription.unsubscribe();
    }
  } // ngOnDestroy

  /**
   * getAllVendors - retrieve everything
   */
  getAllVendors(passedMsg: string = ''): void {
    this.vendorService.getAll().subscribe({
      // Create observer object
      next: (vendors: Vendor[]) => {
        this.vendors = vendors;
      },
      error: (err: Error) =>
        (this.msg = `Couldn't get vendors - ${err.message}`),
      complete: () =>
        passedMsg ? (this.msg = passedMsg) : (this.msg = `Vendors loaded!`),
    });
  } // getAllVendors

  /**
   * loadVendorProducts - retrieve a particular employee's expenses
   */
  loadVendorProducts(): void {
    this.vendorproducts = [];
    this.productService.getSome(this.selectedVendor.id).subscribe({
      // observer object
      next: (products: Product[]) => {
        this.vendorproducts = products;
      },
      error: (err: Error) =>
        (this.msg = `product fetch failed! - ${err.message}`),
      complete: () => {},
    });
  }

  /**
   * onPickVendor - Another way to use Observables, subscribe to the select change event
   * then load specific vendor products for subsequent selection
   */
  onPickVendor(): void {
    this.formSubscription = this.generatorForm
      .get('vendorid')
      ?.valueChanges.subscribe((val) => {
        this.selectedProduct = {
          id: '',
          vendorid: 0,
          name: '',
          costprice: 0,
          msrp: 0,
          rop: 0,
          eoq: 0,
          qoh: 0,
          qoo: 0,
          qrcode: '',
          qrcodetxt: '',
        };
        this.selectedVendor = val;
        this.loadVendorProducts();
        this.pickedProduct = false;
        this.hasProducts = false;
        this.msg = 'choose product for vendor';
        this.pickedVendor = true;
        this.generated = false;
        this.items = [];
        this.selectedProducts = [];
      });
  } // onPickVendor

  /**
   * onPickProduct - subscribe to the select change event then
   * update array containing items.
   */
  onPickProduct(): void {
    const productSubscription = this.generatorForm
      .get('productid')
      ?.valueChanges.subscribe((val) => {
        this.selectedProduct = val;
        const item: Purchaseorderlineitem = {
          id: 0,
          poid: 0,
          productid: this.selectedProduct?.id,
          qty: this.selectedProduct?.qoo,
          price: this.selectedProduct?.costprice,
        };

        if (
          this.items.find((item) => item.productid === this.selectedProduct?.id)
        ) {
          //ignore entry
        } else {
          //add entry
          this.items.push(item);
          this.selectedProducts.push(this.selectedProduct);
        }
        if (this.items.length > 0) {
          this.hasProducts = true;
        }

        this.total = 0.0;
        this.selectedProducts.forEach((pro) => (this.total += pro.msrp));
      });
    this.formSubscription?.add(productSubscription);
  } // onPickProduct

  onPickQty(): void {
    const qtySubscription = this.generatorForm
      .get('qty')
      ?.valueChanges.subscribe((val) => {
        console.log(`val: ${val}`);

        if (val == 'EOQ') {
          this.selectedProduct.qoo = this.selectedProduct.eoq;
        } else {
          this.selectedProduct.qoo = parseInt(val);
        }

        if (val == '0') {
          this.items = this.items.filter(
            (item) => item.productid === this.selectedProduct.id
          );
        }
        this.total = 0;
        for (var i = 0; i < this.selectedProducts.length; i++) {
          this.total +=
            this.selectedProducts[i].costprice * this.selectedProducts[i].qoo;
        }

        this.pickedQty = true;
      });
    this.formSubscription?.add(qtySubscription);
  }

  /**
   * createPurchaseOrder - create the client side report
   */
  createPurchaseOrder(): void {
    //correct quantity before send
    //loop through selected products
    for (var i = 0; i < this.selectedProducts.length; i++) {
      //loop items
      for (var ii = 0; ii < this.items.length; ii++) {
        if (this.selectedProducts[i].id == this.items[ii].productid) {
          this.items[ii].qty = this.selectedProducts[i].qoo;
        }
      }
    }

    const purchaseorder: Purchaseorder = {
      id: 0,
      items: this.items,
      vendorid: this.selectedProduct.vendorid,
      amount: this.total,
    };

    this.purchaseorderService.create(purchaseorder).subscribe({
      // observer object
      next: (purchaseorder: Purchaseorder) => {
        // server should be returning purchaseorder with new id
        purchaseorder.id > 0
          ? (this.msg = `Order ${purchaseorder.id} added!`)
          : (this.msg = 'Report not added! - server error');
        this.purchaseno = purchaseorder.id;
      },
      error: (err: Error) => (this.msg = `Order not added! - ${err.message}`),
      complete: () => {
        this.hasProducts = false;
        this.pickedVendor = false;
        this.pickedProduct = false;
        this.generated = true;
      },
    });

    this.generated = true;
    this.pickedQty = false;
    this.hasProducts = false;

    this.selectedProduct = {
      id: '',
      vendorid: 0,
      name: '',
      costprice: 0,
      msrp: 0,
      rop: 0,
      eoq: 0,
      qoh: 0,
      qoo: 0,
      qrcode: '',
      qrcodetxt: '',
    };
    this.selectedVendor = {
      id: 0,
      name: '',
      address1: '',
      city: '',
      province: '',
      postalcode: '',
      phone: '',
      type: '',
      email: '',
    };
  } // createPuchaseOrder

  viewPdf(): void {
    window.open(`${PDFURL}${this.purchaseno}`, '');
  } // viewPdf
}
