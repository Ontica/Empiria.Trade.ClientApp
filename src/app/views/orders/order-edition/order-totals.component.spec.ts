/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTotalsComponent } from './order-totals.component';

describe('OrderTotalsComponent', () => {
  let component: OrderTotalsComponent;
  let fixture: ComponentFixture<OrderTotalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderTotalsComponent]
    });
    fixture = TestBed.createComponent(OrderTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
