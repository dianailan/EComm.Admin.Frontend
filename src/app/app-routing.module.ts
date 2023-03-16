import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WrapperComponent } from "./features/wrapper/wrapper.component";
import { CanActivateGuard } from "./helpers/canActivate.guard";
import { PermissionsResolver } from "./resolver/permissions.resolver";

const routes: Routes = [
  {
    path: '', component: WrapperComponent, children: [
      {
        path: '',
        redirectTo: 'companies',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../app/features/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'users', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_UM_View'] },
        loadChildren: () => import('../app/features/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'companies', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_CM_View'] },
        loadChildren: () => import('../app/features/company/company.module').then(m => m.CompanyModule)
      },
      {
        path: 'webpages', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_SM_View'] },
        loadChildren: () => import('../app/features/web-pages/webpages.module').then(m => m.WebpagesModule)
      },
      {
        path: 'callbacks', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_SM_View'] },
        loadChildren: () => import('../app/features/callbacks/callbacks.module').then(m => m.CallbacksModule)
      },
      {
        path: 'merchant-logos', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_SM_View'] },
        loadChildren: () => import('../app/features/merchant-logos/merchant-logos.module').then(m => m.MerchantLogosModule)
      },
      {
        path: 'products', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_SM_View'] },
        loadChildren: () => import('../app/features/products/products.module').then(m => m.ProductsModule)
      },
      {
        path: 'baskets', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_SM_View'] },
        loadChildren: () => import('../app/features/baskets/baskets.module').then(m => m.BasketsModule)
      },
      {
        path: 'transactions', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_TM_View'] },
        loadChildren: () => import('../app/features/transactions/transactions.module').then(m => m.TransactionsModule)
      },
      {
        path: 'cards', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_TM_View'] },
        loadChildren: () => import('../app/features/cards/cards.module').then(m => m.CardsModule)
      },
      {
        path: 'reccuring-cards', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_TM_View'] },
        loadChildren: () => import('../app/features/reccuring-cards/reccuring-cards.module').then(m => m.ReccuringCardsModule)
      },
      {
        path: 'qrpayments', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_QRM_View'] },
        loadChildren: () => import('../app/features/qr-payments/qrpayments.module').then(m => m.QrpaymentsModule)
      },
      {
        path: 'posqr', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_POS_QR_MRC_View'] },
        loadChildren: () => import('../app/features/pos-qr/posqr.module').then(m => m.PosqrMoudle)
      },
      {
        path: 'posterminal', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_POS_QR_TRM_View'] },
        loadChildren: () => import('../app/features/pos-terminal/pos-terminal.module').then(m => m.PosTerminalMoudle)
      },
      {
        path: 'qrmerchant', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_QRM_View'] },
        loadChildren: () => import('../app/features/qr-merchant/qrmerchant.module').then(m => m.QrmerchantModule)
      },
      {
        path: 'qrcode', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_NQRM_View'] },
        loadChildren: () => import('../app/features/qr-code/qr-code.module').then(m => m.QrCodeModule)
      },
      {
        path: 'logs', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_AL_View'] },
        loadChildren: () => import('../app/features/logs/logs.module').then(m => m.LogsModule)
      },
      {
        path: 'facemerchant', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_FACEM_View'] },
        loadChildren: () => import('../app/features/face-merchant/facemerchant.module').then(m => m.FaceMerchantModule)
      },
      {
        path: 'faceterminal', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_FACE_TRM_View'] },
        loadChildren: () => import('../app/features/face-terminal/face-terminal.module').then(m => m.FaceTerminalModule)
      },
      {
        path: 'facedevice', canLoad: [CanActivateGuard], data: { permissions: ['R_V_View', 'R_FACE_DVC_View'] },
        loadChildren: () => import('../app/features/face-device/face-device.module').then(m => m.FaceDeviceModule)
      },
      {
        path: 'certificates', canLoad: [CanActivateGuard], data: { permissions: ['R_CERT_View', 'R_CERT_Add_Update'] },
        loadChildren: () => import('../app/features/certificates/certificates.module').then(m => m.CertificatesModule)
      },

    ],
    resolve: {
      accountDetails: PermissionsResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
