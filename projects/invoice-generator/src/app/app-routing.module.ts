import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { InvoiceGeneratorComponent } from './mainpage/invoice-generator/invoice-generator.component';
import { InvoiceTemplateComponent } from './mainpage/invoice-generator/invoice-template/invoice-template.component';
// import { AuthGuard } from './shared/guard/auth.guard';
import { UnauthGuard } from './shared/guard/unauth.guard';
import { AuthGuard } from '@auth0/auth0-angular';

import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { ResolverResolver } from './shared/resolver.resolver';
import { ComingsoonComponent } from './shared/comingsoon/comingsoon.component';
import { TermsAndConditionsComponent } from './mainpage/terms-and-conditions/terms-and-conditions.component';

const routes: Routes = [
  {
    path: 'comingsoon',
    component: ComingsoonComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.LoginModule),
    runGuardsAndResolvers: 'always',
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./mainpage/mainpage.module').then((m) => m.MainpageModule),
    data: { preload: true },
  },

  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    resolve: {
      routeResolver: ResolverResolver,
    },
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
  },
  {
    path: 'termsandconditions',
    component: TermsAndConditionsComponent,
  },
  {
    path: 'invoice-generator',
    component: InvoiceGeneratorComponent,
  },

  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  // {
  //   path: '**',
  //   redirectTo: 'home',
  // },
  // { path: '404', component: PageNotFoundComponent },
  // { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'top',
      initialNavigation: 'enabled',
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
