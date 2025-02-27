import { Purchaseorderlineitem } from './purchaseorderlineitem';

export interface Purchaseorder {
  id: number;
  vendorid: number;
  amount: number;
  items: Purchaseorderlineitem[];
  podate?: string;
}
