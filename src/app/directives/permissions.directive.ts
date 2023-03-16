import {Directive, OnInit, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {UserService} from "../services/user.service";

@Directive({
  selector: '[hasPermission]'
})

export class PermissionsDirective implements OnInit {
  private userPermissions;
  private permissionToCheck;
  private logicalOperator = 'OR';
  private isHidden = true;

  @Input()
  set hasPermission(value) {
    this.permissionToCheck = value;
    this.updateView();
  }

  @Input()
  set hasPermissionOperator(operator) {
    this.logicalOperator = operator;
    this.updateView();
  }

  constructor(
    private userService: UserService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
  }

  ngOnInit(): void {
  }

  private updateView() {
    if (this.checkPermission()) {
      if (this.isHidden) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isHidden = false;
      }
    } else {
      this.isHidden = true;
      this.viewContainer.clear();
    }
  }

  checkPermission() {
    let hasPermission = false;
    this.userPermissions = this.userService.permissions;
    if (this.userPermissions !== undefined) {
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
    return hasPermission;
  }
}
