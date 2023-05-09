import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Priest } from 'src/app/core/model/priest.model';
import { PriestService } from 'src/app/core/services/priest.service';
import { Snackbar } from 'src/app/core/ui/snackbar';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { PriestAddComponent } from './priest-add/priest-add.component';

@Component({
  selector: 'app-priest',
  templateUrl: './priest.component.html',
  styleUrls: ['./priest.component.scss']
})
export class PriestComponent implements OnInit {

  error:string;
  dataSource = new MatTableDataSource<Priest>();
  data: Priest[] = [];
  displayedColumns = [];
  isLoading = false;
  loaderData =[];
  isProcessing = false;
  @ViewChild('paginator', {static: false}) paginator: MatPaginator;
  pageSize = 10;

  keywordCtrl = new FormControl('');

  constructor(
    private priestService: PriestService,
    private snackBar: Snackbar,
    private dialog: MatDialog,
    public router: Router) { }

  ngOnInit(): void {
    this.getPriests();
    this.generateLoaderData(this.pageSize);
  }

  async add(){
    const dialogRef = this.dialog.open(PriestAddComponent, {
      closeOnNavigation: true,
      panelClass: 'priest-dialog',
    });
    dialogRef.componentInstance.data = null;
    dialogRef.componentInstance.conFirm.subscribe((data: boolean) => {
      if(data){
        dialogRef.close();
        this.getPriests();
      }
    });
  }

  async edit(priestId: string){

    const dialogRef = this.dialog.open(PriestAddComponent, {
      closeOnNavigation: true,
      panelClass: 'priest-dialog',
    });
    dialogRef.componentInstance.data = { priestId };
    dialogRef.componentInstance.conFirm.subscribe((data: boolean) => {
      if(data){
        dialogRef.close();
        this.getPriests();
      }
    });
  }

  async remove(priestId: string){
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Delete priest?';
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
          this.priestService
            .delete(priestId)
            .subscribe(
              async (res) => {
                if (res.success) {
                  this.getPriests();
                  dialogRef.close();
                  this.isProcessing = false;
                  dialogRef.componentInstance.isProcessing = this.isProcessing;
                  this.snackBar.snackbarError("Priest removed!");
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

  filter() {
    this.isLoading = true;
    const keyword = this.keywordCtrl.value.toLowerCase();
    this.dataSource.data = this.data.length > 0 ?
    this.data.filter(x=>x.priestId.toLowerCase().includes(keyword) ||
    x.priestName.toLowerCase().includes(keyword)) : [];
    this.dataSource.paginator = this.paginator;
    this.isLoading = false;
  }

  getPriests(){
    this.displayedColumns = ['name', 'controls'];
    try{
      this.isLoading = true;
      this.priestService.get()
      .subscribe(async res => {
        if(res.success){
          this.data = res.data;
          this.dataSource.data = this.data;
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
        }
        else{
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.snackbarError(this.error);
          this.isLoading = false;
        }
      }, async (err) => {
        this.error = Array.isArray(err.message) ? err.message[0] : err.message;
        this.snackBar.snackbarError(this.error);
        this.isLoading = false;
      });
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.snackbarError(this.error);
    }

  }

  generateLoaderData(length: number){
    for (let i = 0; i < length; i++) {
      this.loaderData.push(i);
    }

  }
}

