/**
 * @license
 * Copyright (c) La Vía Óntica SC, Ontica LLC and contributors. All rights reserved.
 *
 * See LICENSE.txt in the project root for complete license information.
 */

import { inject } from '@angular/core';

import { Router, ActivatedRouteSnapshot, CanActivateFn, CanActivateChildFn } from '@angular/router';

import { SessionService } from '../general/session.service';

import { RoutingStateService } from './routing-state.service';


export const ParentRouteGuard: CanActivateFn = () => isAuthenticated();


export const ChildRouteGuard: CanActivateChildFn = (route: ActivatedRouteSnapshot) => {
  if (!isAuthenticated()) {
    return false;
  }

  const isRoutingInicialized = inject(RoutingStateService).isInitialized;

  if (!isRouteProtected(route)) {
    return true;
  }

  const session = inject(SessionService);

  if (!session.hasPermission(route.data.permission)) {
    const firstValidRouteInModule = isRoutingInicialized ?
      session.getFirstValidRouteInModule(route.data.permission) : null;

    inject(Router).navigateByUrl(firstValidRouteInModule ?? 'unauthorized');

    return false;
  }

  return true;
};


const isAuthenticated = (): boolean => {
  if (!inject(SessionService).getPrincipal().isAuthenticated) {
    inject(Router).navigateByUrl('security/login');
    return false;
  }

  return true;
};


const isRouteProtected = (route: ActivatedRouteSnapshot): boolean => {
  return !!route.data.permission;
};
