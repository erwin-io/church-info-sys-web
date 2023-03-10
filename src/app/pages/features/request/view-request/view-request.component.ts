import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { SelectTimeslotComponent } from "src/app/component/select-timeslot/select-timeslot.component";
import { ViewClientInfoComponent } from "src/app/component/view-client-info/view-client-info.component";
import { RequestStatusEnum } from "src/app/core/enums/request-status.enum";
import { RoleEnum } from "src/app/core/enums/role.enum copy";
import { Messages } from "src/app/core/model/messages.model";
import { Request } from "src/app/core/model/request.model";
import { AppConfigService } from "src/app/core/services/app-config.service";
import { RequestService } from "src/app/core/services/request.service";
import { StorageService } from "src/app/core/storage/storage.service";
import { Snackbar } from "src/app/core/ui/snackbar";
import { AlertDialogModel } from "src/app/shared/alert-dialog/alert-dialog-model";
import { AlertDialogComponent } from "src/app/shared/alert-dialog/alert-dialog.component";

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewRequestComponent implements OnInit {
  request: Request;
  currentUserId: string;
  mediaWatcher: Subscription;
  isLoading = false;
  isProcessing = false;
  isUploading = false;
  isLoadingRoles = false;
  error;
  statusEnum = RequestStatusEnum;
  roleEnum = RoleEnum;
  allowedAction = {
    readyForPickup: false,
    closed: false
  };
  requestAction = {
    readyForPickup: false,
    closed: false,
  };
  messages: any[] = [];
  currentMessagePage = 0;
  loadingMessage = false;
  isSendingMessage = false;
  connect = false;
  tabIndex = 1;
  diagnosisAndTreatment: FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private requestService: RequestService,
    private snackBar: Snackbar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    public router: Router,
  ) {
    this.initAllowedAction();
  }

  get getSelectedIndex() {
    return this.connect ? 1 : 0;
  }

  ngOnInit(): void {
    this.currentUserId = this.storageService.getLoginUser().userId;
    const requestId = this.route.snapshot.paramMap.get('requestId');
    this.initRequest(requestId);

  }

  initAllowedAction() {
    this.allowedAction.readyForPickup =
      this.storageService.getLoginUser().role.roleId ===
        this.roleEnum.ADMIN.toString() ||
      this.storageService.getLoginUser().role.roleId ===
        this.roleEnum.FRONTDESK.toString();
    this.allowedAction.closed =
      this.storageService.getLoginUser().role.roleId ===
        this.roleEnum.ADMIN.toString() ||
      this.storageService.getLoginUser().role.roleId ===
        this.roleEnum.FRONTDESK.toString();

      console.log(this.allowedAction);
  }

  initRequestAction() {
    this.requestAction.readyForPickup = this.request.requestStatus.requestStatusId ===
    this.statusEnum.PENDING.toString();
    this.requestAction.closed = this.request.requestStatus.requestStatusId ===
      this.statusEnum.READYFORPICKUP.toString();
  }

  initRequest(requestId: string) {
    this.isLoading = true;
    try {
      this.requestService.getById(requestId).subscribe(
        (res) => {
          if (res.success) {
            console.log(res.data);
            this.request = res.data;
            this.initRequestAction();
            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.error = Array.isArray(res.message)
              ? res.message[0]
              : res.message;
            this.snackBar.snackbarError(this.error);
            if (this.error.toLowerCase().includes('not found')) {
              this.router.navigate(['/requests/']);
            }
          }
        },
        async (err) => {
          this.isLoading = false;
          this.error = Array.isArray(err.message)
            ? err.message[0]
            : err.message;
          this.snackBar.snackbarError(this.error);
          if (this.error.toLowerCase().includes('not found')) {
            this.router.navigate(['/requests/']);
          }
        }
      );
    } catch (e) {
      this.isLoading = false;
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.snackbarError(this.error);
      if (this.error.toLowerCase().includes('not found')) {
        this.router.navigate(['/requests/']);
      }
    }
  }

  changeStatus(requestStatusId: number) {
    const status = [2,3,4];
    if(!status.includes(requestStatusId)){
      return;
    }
    const params = {
      requestId: this.request.requestId,
      requestStatusId: requestStatusId,
      isUpdatedByClient: false
    };
    const dialogData = new AlertDialogModel();
    if(requestStatusId === 2) {
      dialogData.title = 'Confirm Ready for pickup';
      dialogData.message = 'Ready for pickup?';
    }
    else if(requestStatusId === 3) {
      dialogData.title = 'Confirm Closed';
      dialogData.message = 'Closed request?';
    }
    dialogData.confirmButton = {
      visible: true,
      text: 'yes',
      color: 'primary',
    };
    dialogData.dismissButton = {
      visible: true,
      text: 'cancel',
    };
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
    });

    dialogRef.componentInstance.alertDialogConfig = dialogData;
    dialogRef.componentInstance.conFirm.subscribe(async (confirm: any) => {
      if(confirm) {
        this.isProcessing = true;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        try {
          this.requestService
            .updateRequestStatus(params)
            .subscribe(
              async (res) => {
                if (res.success) {
                  dialogRef.close();
                  this.isProcessing = false;
                  dialogRef.componentInstance.isProcessing = this.isProcessing;
                  if(requestStatusId === this.statusEnum.READYFORPICKUP) {
                    this.snackBar.snackbarSuccess("Request is now ready for pickup!");
                  }
                  else if(requestStatusId === this.statusEnum.CLOSED) {
                    this.snackBar.snackbarSuccess("Request closed!");
                  }
                  this.initRequest(this.request.requestId);
                } else {
                  this.isProcessing = false;
                  dialogRef.componentInstance.isProcessing = this.isProcessing;
                  this.error = Array.isArray(res.message)
                    ? res.message[0]
                    : res.message;
                  this.snackBar.snackbarError(this.error);
                }
              },
              async (err) => {
                this.isProcessing = false;
                dialogRef.componentInstance.isProcessing = this.isProcessing;
                this.error = Array.isArray(err.message)
                  ? err.message[0]
                  : err.message;
                this.snackBar.snackbarError(this.error);
              }
            );
        } catch (e) {
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.error = Array.isArray(e.message) ? e.message[0] : e.message;
          this.snackBar.snackbarError(this.error);
        }
      }
    });
  }

  async viewClientInfo(userId) {
    const dialogRef = this.dialog.open(ViewClientInfoComponent, {
      closeOnNavigation: false,
      maxWidth: '500px',
      width: '500px',
    });
    dialogRef.componentInstance.userId = userId;
  }
}
