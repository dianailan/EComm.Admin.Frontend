import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {UserService} from '../services/user.service';

@Directive({
  selector: '[appPermissionsattr]'
})
export class PermissionsattrDirective implements AfterViewInit {
  isHidden = true;
  userPermissions: string[];
  @Input() permissionToCheck: string | string[];
  @Input() logicalOperator = 'OR';
  constructor(
    private userService: UserService,
    private elementRef: ElementRef
  ) {
  }

  ngAfterViewInit(): void {
    this.checkPermission();
  }
    private updateView(hasPermission) {
      if (!hasPermission) {
        this.elementRef.nativeElement.disabled = true;
        this.elementRef.nativeElement.title = 'Permissions';
      }
    }

    checkPermission() {
      let hasPermission = false;
      this.userPermissions = this.getPermission();
      if (this.userPermissions) {
        for (const permission of this.permissionToCheck) {
          const permissionFound = this.userPermissions.find(p =>
          p.toUpperCase() === permission.toUpperCase());
          if (permissionFound) {
            hasPermission = true;
            if (this.logicalOperator.toUpperCase() === 'OR') {
              break;
            }
          } else {
            hasPermission = false;
            if (this.logicalOperator.toUpperCase() === 'AND') {
              break;
            }
          }
        }
      }
      this.updateView(hasPermission);
    }

    getPermission() {
      return this.userService.permissions;
    }
}
