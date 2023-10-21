/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { DateString, Empty, Identifiable } from '@app/core';

import { clone } from '@app/shared/utils';

import { Contact, Customer, Party, EmptyCustomer, EmptyContact } from './contacts';

import { Presentation, Product, ProductSelection, Vendor } from './product';


export enum OrderStatus {
  Applied   = 'Applied',
  Captured  = 'Captured',
  Closed    = 'Closed',
  Cancelled = 'Cancelled',
};


export const OrderStatusList: Identifiable[] = [
  { uid: OrderStatus.Captured,  name: 'Capturado' },
  { uid: OrderStatus.Applied,   name: 'Aplicado' },
  { uid: OrderStatus.Closed,    name: 'Cerrado' },
  { uid: OrderStatus.Cancelled, name: 'Cancelado' },
];


export function getOrderStatusName(status: OrderStatus): string {
  const item = OrderStatusList.find(x => x.uid === status);
  return item ? item.name : status;
}


export const ShippingMethodList: Identifiable[] = [
  { uid: 'RutaLocal', name: 'Ruta local' },
  { uid: 'RutaForanea', name: 'Ruta foránea' },
  { uid: 'Ocurre', name: 'Ocurre' },
  { uid: 'Paqueteria', name: 'Paquetería' },
];


export const PaymentConditionList: Identifiable[] = [
  { uid: 'Credito', name: 'Crédito' },
  { uid: 'Contado', name: 'Contado' },
];


export interface OrderQuery {
  keywords: string;
  fromDate: DateString;
  toDate: DateString;
  status: OrderStatus;
}


export interface OrderData {
  uid?: string;
  orderNumber: string;
  orderTime: DateString;
  status: OrderStatus;
  customer: Customer;
  customerContact: Contact;
  salesAgent: Party;
  supplier: Party;
  paymentCondition: string;
  shippingMethod: string;
}


export interface OrderAdditionalData {
  notes: string;
}


export interface Order extends OrderData, OrderAdditionalData {
  uid: string;
  orderNumber: string;
  orderTime: DateString;
  status: OrderStatus;
  customer: Customer;
  customerContact: Contact;
  salesAgent: Party;
  supplier: Party;
  paymentCondition: string;
  notes: string;
  shippingMethod: string;

  items: OrderItem[];
  itemsCount: number;
  itemsTotal: number;
  shipment: number;
  discount: number;
  taxes: number;
  orderTotal: number;
}


export interface OrderItem {
  orderItemUID: string;

  product: Product;
  presentation: Presentation;
  vendor: Vendor;

  quantity: number;

  basePrice: number;
  specialPrice: number;
  salesPrice: number;
  additionalDiscount: number;
  additionalDiscountToApply: number;

  shipment: number;
  taxes: number;
  total: number;

  notes: string;
}


export interface OrderFields {
  uid?: string;
  orderNumber: string;
  orderTime: DateString;
  status: OrderStatus;
  customerUID: string;
  customerContactUID: string;
  salesAgentUID: string;
  supplierUID: string;
  paymentCondition: string;
  shippingMethod: string;
  notes: string;
  items: OrderItemFields[];
}


export interface OrderItemFields {
  orderItemUID: string;

  vendorProductUID: string;
  quantity: number;

  basePrice: number;
  specialPrice: number;
  salesPrice: number;
  additionalDiscount: number;
  additionalDiscountToApply: number;

  shipment: number;
  taxes: number;
  total: number;
  notes: string;
}


export function EmptyOrder(): Order {

  return clone({
    uid: null,
    orderNumber: '',
    orderTime: '',
    notes: '',
    shippingMethod: '',
    status: null,
    customer: EmptyCustomer,
    customerContact: EmptyContact,
    supplier: Empty,
    salesAgent: Empty,
    paymentCondition: '',
    itemsCount: 0,
    itemsTotal: 0,
    shipment: 0,
    discount: 0,
    taxes: 0,
    orderTotal: 0,
    items: [],
  })

}


export function mapOrderFieldsFromOrder(order: Order): OrderFields {
  const orderFields: OrderFields = {
    uid: order.uid,
    orderNumber: order.orderNumber,
    orderTime: order.orderTime,
    status: order.status,
    customerUID: order.customer?.uid ?? '',
    customerContactUID: order.customerContact?.uid ?? '',
    salesAgentUID: order.salesAgent?.uid ?? '',
    supplierUID: order.supplier?.uid ?? '',
    paymentCondition: order.paymentCondition,
    shippingMethod: order.shippingMethod,
    items: order.items.map(x => mapOrderItemFieldsFromOrderItem(x)),
    notes: order.notes,
  };

  return orderFields;
}


export function mapOrderItemFieldsFromOrderItem(orderItem: OrderItem): OrderItemFields {
  const orderFields: OrderItemFields = {
    orderItemUID: orderItem.orderItemUID,
    vendorProductUID: orderItem.vendor.vendorProductUID ?? null,
    quantity: orderItem.quantity,
    basePrice: orderItem.basePrice,
    specialPrice: orderItem.specialPrice,
    salesPrice: orderItem.salesPrice,
    additionalDiscount: orderItem.additionalDiscount,
    additionalDiscountToApply: orderItem.additionalDiscountToApply,
    shipment: orderItem.shipment,
    taxes: orderItem.taxes,
    total: orderItem.total,
    notes: orderItem.notes,
  };

  return orderFields;
}


export function mapOrderItemFromProductSelection(product: ProductSelection): OrderItem {
  const productForSeeker: OrderItem = {
    orderItemUID: null,
    quantity: product.quantity,

    basePrice: product.vendor.price,
    specialPrice: null,
    salesPrice: product.vendor.price,
    additionalDiscount: null,
    additionalDiscountToApply: null,

    shipment: null,
    taxes: null,
    total: null,
    notes: null,
    product: product.product,
    presentation: product.presentation,
    vendor: product.vendor,
  };

  return productForSeeker;
}
