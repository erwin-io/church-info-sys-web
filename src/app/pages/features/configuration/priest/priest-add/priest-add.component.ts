import { Component, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { PriestService } from 'src/app/core/services/priest.service';
import { Snackbar } from 'src/app/core/ui/snackbar';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-priest-add',
  templateUrl: './priest-add.component.html',
  styleUrls: ['./priest-add.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PriestAddComponent implements OnInit {

  data: {
    priestId?: string
  }
  priestForm: FormGroup;
  conFirm = new EventEmitter();
  isProcessing = false;
  isLoading = false;
  error;
  timeSlot = [];
  weekSlot = [];
  availability = [];
  enableScheduler = false;
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private priestService: PriestService,
    private snackBar: Snackbar,
    private appconfig: AppConfigService,
    public dialogRef: MatDialogRef<PriestAddComponent>
  ) {
    this.timeSlot = this.appconfig.config.priestConfig.timeSlot;
    this.weekSlot = this.appconfig.config.priestConfig.weekSlot;
    this.enableScheduler = this.appconfig.config.priestConfig.enableScheduler;
    dialogRef.disableClose = true;
    this.priestForm = this.formBuilder.group({
      priestName: ['', Validators.required],
    });
  }
  ngOnInit(): void {

    if(!this.isNew){
      this.getData();
    }
  }

  getData(){
    try {
      this.isLoading = true;
      this.
      priestService
        .getById(this.data.priestId)
        .subscribe(
          async (res) => {
            if (res.success) {
              this.priestForm.controls["priestName"].setValue(res.data.priestName);
              this.availability = res.data.availability;
              this.isLoading = false;
            } else {
              this.isLoading = false;
              this.error = Array.isArray(res.message)
                ? res.message[0]
                : res.message;
              this.snackBar.snackbarError(this.error);
            }
          },
          async (err) => {
            this.isLoading = false;
            this.error = Array.isArray(err.message)
              ? err.message[0]
              : err.message;
            this.snackBar.snackbarError(this.error);
          }
        );
    }catch(err){
      this.isLoading = false;
      this.error = Array.isArray(err.message)
        ? err.message[0]
        : err.message;
      this.snackBar.snackbarError(this.error);
    }
  }

  get isNew(){ return !this.data || !this.data.priestId && this.data.priestId === "" }

  get formData() {
    return {
      ...this.priestForm.value,
      availability: this.availability
    };
  }

  get f() { return this.priestForm.controls; }

  onSubmit(): void {
    if (this.priestForm.valid) {
      const param = {
        priestId: this.data ? this.data.priestId : null,
        ...this.formData
      };
      console.log(param);
      const dialogData = new AlertDialogModel();
      dialogData.title = 'Confirm';
      dialogData.message = 'Save?';
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
      dialogRef.componentInstance.conFirm.subscribe(async (confirmed: any) => {
        if (confirmed) {
          this.isProcessing = true;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          try {
            if(this.isNew) {
              await this.
              priestService
                .add(param)
                .subscribe(
                  async (res) => {
                    if (res.success) {
                      this.conFirm.emit(true);
                      this.snackBar.snackbarSuccess("Saved!");
                      dialogRef.close();
                      this.isProcessing = false;
                      dialogRef.componentInstance.isProcessing = this.isProcessing;
                    } else {
                      this.isProcessing = false;
                      this.error = Array.isArray(res.message)
                        ? res.message[0]
                        : res.message;
                      this.snackBar.snackbarError(this.error);
                      dialogRef.componentInstance.isProcessing = this.isProcessing;
                    }
                  },
                  async (err) => {
                    this.isLoading = false;
                    this.error = Array.isArray(err.message)
                      ? err.message[0]
                      : err.message;
                    this.snackBar.snackbarError(this.error);
                    dialogRef.componentInstance.isProcessing = this.isProcessing;
                  }
                );
            }
            else {
              await this.
              priestService
                .udpdate(param)
                .subscribe(
                  async (res) => {
                    if (res.success) {
                      this.conFirm.emit(true);
                      this.snackBar.snackbarSuccess("Saved!");
                      dialogRef.close();
                      this.isProcessing = false;
                      dialogRef.componentInstance.isProcessing = this.isProcessing;
                    } else {
                      this.isProcessing = false;
                      this.error = Array.isArray(res.message)
                        ? res.message[0]
                        : res.message;
                      this.snackBar.snackbarError(this.error);
                      dialogRef.componentInstance.isProcessing = this.isProcessing;
                    }
                  },
                  async (err) => {
                    this.isLoading = false;
                    this.error = Array.isArray(err.message)
                      ? err.message[0]
                      : err.message;
                    this.snackBar.snackbarError(this.error);
                    dialogRef.componentInstance.isProcessing = this.isProcessing;
                  }
                );
            }
          } catch (e) {
            this.isLoading = false;
            this.error = Array.isArray(e.message) ? e.message[0] : e.message;
            this.snackBar.snackbarError(this.error);
            dialogRef.componentInstance.isProcessing = this.isProcessing;
          }
        }
      });
    }
  }

  async updateAvailability(value, checked) {
    if(checked) {
      this.availability.push(value);
      this.availability = [...new Set(this.availability)];
    } else {
      this.availability = this.availability.filter(x=> x !== value);
      this.availability = [...new Set(this.availability)];
    }
  }

  getToolstrip (time: number) {
    return (time > 12 ? time - 12 : time) + " " + (time < 12 ? "AM" : "PM");
  }

  getError(key:string){
    return this.f[key].errors;
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
