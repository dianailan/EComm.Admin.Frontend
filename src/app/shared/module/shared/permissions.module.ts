import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsDirective } from '../../../directives/permissions.directive';
import { PermissionsattrDirective } from '../../../directives/permissionsattr.directive';
import { GeorgianLettersDirective } from "../../../directives/georgian-letters.directive";

@NgModule({
  declarations: [
    PermissionsDirective,
    PermissionsattrDirective,
    GeorgianLettersDirective

  ],
  imports: [
    CommonModule
  ],
  exports: [
    PermissionsDirective,
    PermissionsattrDirective,
    GeorgianLettersDirective
  ]
})
export class PermissionsModule {
  static forChild(): ModuleWithProviders<PermissionsModule> {
    return {
      ngModule: PermissionsModule,
      providers: []
    };
  }
}
