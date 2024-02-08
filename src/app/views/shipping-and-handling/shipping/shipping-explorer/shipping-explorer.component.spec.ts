/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingExplorerComponent } from './shipping-explorer.component';

describe('ShippingExplorerComponent', () => {
  let component: ShippingExplorerComponent;
  let fixture: ComponentFixture<ShippingExplorerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingExplorerComponent]
    });
    fixture = TestBed.createComponent(ShippingExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
