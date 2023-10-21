/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Assertion, EventInfo } from '@app/core';

import { sendEvent } from '@app/shared/utils';

import { SalesOrdersDataService } from '@app/data-services';

import { EmptyOrder, Order, OrderFields, mapOrderFieldsFromOrder } from '@app/models';

import { OrderEditionEventType } from '../order-edition/order-edition.component';

export enum OrderEditorEventType {
  EDITION_MODE  = 'OrderEditorComponent.Event.EditionMode',
  ORDER_DIRTY   = 'OrderEditorComponent.Event.OrderDirty',
  ORDER_UPDATED = 'OrderEditorComponent.Event.OrderUpdated',
  ORDER_DELETED = 'OrderEditorComponent.Event.OrderDeleted',
}

@Component({
  selector: 'emp-trade-order-editor',
  templateUrl: './order-editor.component.html',
})
export class OrderEditorComponent {

  @Input() order: Order = EmptyOrder();

  @Output() orderEditorEvent = new EventEmitter<EventInfo>();

  submitted = false;


  constructor(private salesOrdersData: SalesOrdersDataService) { }


  onOrderEditionEvent(event: EventInfo): void {
    if (this.submitted) {
      return;
    }

    switch (event.type as OrderEditionEventType) {

      case OrderEditionEventType.UPDATE_ORDER:
        Assertion.assertValue(event.payload.order, 'event.payload.order');
        const order = mapOrderFieldsFromOrder(event.payload.order as Order);
        this.updateOrder(order);
        return;

      case OrderEditionEventType.DELETE_ORDER:
        Assertion.assertValue(event.payload.orderUID, 'event.payload.orderUID');
        this.deleteOrder(event.payload.orderUID);
        return;

      case OrderEditionEventType.EDITION_MODE:
        sendEvent(this.orderEditorEvent, OrderEditorEventType.EDITION_MODE, event.payload);
        return;

      case OrderEditionEventType.ORDER_DIRTY:
        sendEvent(this.orderEditorEvent, OrderEditorEventType.ORDER_DIRTY, event.payload);
        return;

      default:
        console.log(`Unhandled user interface event ${event.type}`);
        return;
    }
  }


  updateOrder(order: OrderFields) {
    this.submitted = true;

    this.salesOrdersData.updateOrder(order.uid, order)
      .firstValue()
      .then(x => sendEvent(this.orderEditorEvent, OrderEditorEventType.ORDER_UPDATED, { order: x }))
      .finally(() => this.submitted = false);;
  }


  deleteOrder(orderUID: string) {
    this.submitted = true;

    this.salesOrdersData.deleteOrder(orderUID)
      .firstValue()
      .then(x => sendEvent(this.orderEditorEvent, OrderEditorEventType.ORDER_DELETED, { orderUID }))
      .finally(() => this.submitted = false);
  }

}
