/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderConfirmSubmitModalComponent } from './sale-order-confirm-submit-modal.component';

describe('SaleOrderConfirmSubmitModalComponent', () => {
  let component: SaleOrderConfirmSubmitModalComponent;
  let fixture: ComponentFixture<SaleOrderConfirmSubmitModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleOrderConfirmSubmitModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleOrderConfirmSubmitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
