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
  selector: 'app-viewer',
  standalone: true,
  imports: [CommonModule, MatComponentsModule, ReactiveFormsModule],
  templateUrl: './viewer.component.html',
  styles: [],
})
export class ViewerComponent implements OnInit, OnDestroy {
  // form
  viewerForm: FormGroup;
  vendorid: FormControl;
  purchaseid: FormControl;
  qty: FormControl;

  //data
  formSubscription?: Subscription;
  products: Product[] = [];
  vendors: Vendor[] = [];
  purchaseOrders: Purchaseorder[] = [];
  vendorProducts: Product[] = [];
  items: Purchaseorderlineitem[] = [];
  selectedProducts: Product[] = [];
  purchaseOrderProducts?: Product[] = [];
  selectedQtys: string[] = ['EOQ'];
  selectedProduct: Product;
  selectedVendor: Vendor;
  selectedPurchaseOrder: Purchaseorder;
  selectedQty: number;
  // misc
  pickedProduct: boolean;
  pickedVendor: boolean;
  pickedQty: boolean;
  generated: boolean;
  hasProducts: boolean;
  hasPurchase: boolean;
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
    this.purchaseid = new FormControl('');
    this.qty = new FormControl('');
    this.viewerForm = this.builder.group({
      purchaseid: this.purchaseid,
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
    this.selectedPurchaseOrder = {
      id: 0,
      vendorid: 0,
      amount: 0,
      items: [],
      podate: '',
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
    this.hasPurchase = false;
    this.total = 0.0;
  } // constructor

  ngOnInit(): void {
    this.onPickVendor();
    this.onPickProduct();
    this.onPickPurchaseOrder();
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
  getAllPuchaseOrders(id: number, passedMsg: string = ''): void {
    this.purchaseorderService.getSome(id).subscribe({
      // Create observer object
      next: (purchaseOrders: Purchaseorder[]) => {
        this.purchaseOrders = purchaseOrders;
      },
      error: (err: Error) =>
        (this.msg = `Couldn't get purchases - ${err.message}`),
      complete: () =>
        passedMsg ? (this.msg = passedMsg) : (this.msg = `Purchases loaded!`),
    });
  } // getAllEmployees

  /**
   * loadVendorProducts - retrieve a particular employee's expenses
   */
  loadVendorProducts(id: number): void {
    this.msg = 'loading products...';
    this.productService
      .getSome(id)
      .subscribe((expenses) => (this.vendorProducts = expenses));
  }

  /**
   * onPickVendor - Another way to use Observables, subscribe to the select change event
   * then load specific vendor products for subsequent selection
   */
  onPickVendor(): void {
    this.formSubscription = this.viewerForm
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
        this.loadVendorProducts(this.selectedVendor.id);
        this.getAllPuchaseOrders(this.selectedVendor.id);
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
    const expenseSubscription = this.viewerForm
      .get('purchaseid')
      ?.valueChanges.subscribe((val) => {
        this.selectedPurchaseOrder = val;

        // retrieve just the products(items) in the purchase
        if (this.vendorProducts !== undefined) {
          this.purchaseOrderProducts = this.vendorProducts.filter((product) =>
            this.selectedPurchaseOrder?.items.some(
              (item) => item.productid === product.id
            )
          );
          this.hasPurchase = true; // hasReports
          this.generated = true;
          this.total = this.selectedPurchaseOrder.amount;
          // this.purchaseOrderProducts.forEach((element) => {
          //   this.total += element.costprice * element.eoq;
          // });
        }
        this.msg = `Purchase ${this.selectedPurchaseOrder.id} selected`;
      });
    this.formSubscription?.add(expenseSubscription); // add it as a child, so all can be destroyed together
  } // onPickExpense

  onPickPurchaseOrder(): void {
    const qtySubscription = this.viewerForm.get('qty');
  }

  viewPdf(): void {
    window.open(`${PDFURL}${this.selectedPurchaseOrder.id}`, '');
  } // viewPdf
}
