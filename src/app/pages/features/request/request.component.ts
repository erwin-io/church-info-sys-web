import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import * as moment from "moment";
import { Observable, forkJoin, startWith, map } from "rxjs";
import { RoleEnum } from "src/app/core/enums/role.enum copy";
import { AppConfigService } from "src/app/core/services/app-config.service";
import { RequestService } from "src/app/core/services/request.service";
import { StorageService } from "src/app/core/storage/storage.service";
import { Snackbar } from "src/app/core/ui/snackbar";

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  error:string;
  dataSource = new MatTableDataSource<any>();
  displayedColumns = [];
  isLoading = false;
  loaderData =[];
  isProcessing = false;
  @ViewChild('paginator', {static: false}) paginator: MatPaginator;
  pageSize = 10;
  allowedAction = {
    payment:false,
    completeAndApproval:false,
    cancelation:false,
    reschedule:false,
  }

  serviceLookup = [];

  isAdvanceSearch = false;
  isLoadingFilter = false;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordCtrl = new FormControl('');
  clientNameCtrl = new FormControl('');
  requestDateFromCtrl = new FormControl(new Date());
  requestDateToCtrl = new FormControl(new Date());
  filterSearchStatusCtrl = new FormControl('');
  filterSearchRequestTypeCtrl = new FormControl('');

  filteredStatus: Observable<string[]>;
  filteredRequestType: Observable<string[]>;

  selectedStatus: string[] = [];
  selectedRequestType: string[] = [];

  @ViewChild('filterSearchStatusInput') filterSearchStatusInput: ElementRef<HTMLInputElement>;
  @ViewChild('filterSearchRequestTypeInput') filterSearchRequestTypeInput: ElementRef<HTMLInputElement>;

  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private requestService: RequestService,
    private snackBar: Snackbar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    public router: Router) {
      this.initAllowedAction();
      this.getRequests();
    }

  ngOnInit(): void {
    this.displayedColumns = ["requestId", "requestDate", "client", "requestType", "requestStatus", "controls"];
    this.selectedStatus = this.allStatus;
    this.selectedRequestType = this.allRequestType;
    this.filteredStatus = this.filterSearchStatusCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) => (value ? this.allStatus.filter(x=>x.toLowerCase().includes(value.toLowerCase())) : this.allStatus.slice())),
    );
    this.filteredRequestType = this.filterSearchRequestTypeCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) => (value ? this.allRequestType.filter(x=>x.toLowerCase().includes(value.toLowerCase())) : this.allRequestType.slice())),
    );
    this.generateLoaderData(this.pageSize);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  get allStatus() {
    const _items = [];
    this.appconfig.config.lookup.requestStatus.forEach((i: any) => {
      _items.push(i);
    });
    return _items;
  }

  get allRequestType() {
    const _items = [];
    this.appconfig.config.lookup.requestType.forEach((i: any) => {
      _items.push(i);
    });
    return _items;
  }

  remove(key: string, value: string): void {
    if(key === "status") {
      const index = this.selectedStatus.indexOf(value);

      if (index >= 0) {
        this.selectedStatus.splice(index, 1);
      }
    }
    if(key === "requestType") {
      const index = this.selectedRequestType.indexOf(value);

      if (index >= 0) {
        this.selectedRequestType.splice(index, 1);
      }
    }
  }

  selected(key: string ,event: MatAutocompleteSelectedEvent): void {
    if(key === "status") {
      this.selectedStatus.push(event.option.viewValue);
      this.filterSearchStatusInput.nativeElement.value = '';
      this.filterSearchStatusCtrl.setValue(null);
    }
    if(key === "requestType") {
      this.selectedRequestType.push(event.option.viewValue);
      this.filterSearchRequestTypeInput.nativeElement.value = '';
      this.filterSearchRequestTypeCtrl.setValue(null);
    }
  }

  initAllowedAction(){
    this.allowedAction.completeAndApproval = this.storageService.getLoginUser().role.roleId === RoleEnum.ADMIN.toString();
    this.allowedAction.payment = 
    (this.storageService.getLoginUser().role.roleId === RoleEnum.ADMIN.toString() ||
    this.storageService.getLoginUser().role.roleId === RoleEnum.FRONTDESK.toString());
    this.allowedAction.cancelation =
    (this.storageService.getLoginUser().role.roleId === RoleEnum.ADMIN.toString() ||
    this.storageService.getLoginUser().role.roleId === RoleEnum.FRONTDESK.toString());
    this.allowedAction.reschedule =
    (this.storageService.getLoginUser().role.roleId === RoleEnum.ADMIN.toString() ||
    this.storageService.getLoginUser().role.roleId === RoleEnum.FRONTDESK.toString());
  }

  async getRequests(){
    try{
      this.isLoading = true;
      await this.requestService.getByAdvanceSearch({
        isAdvance: this.isAdvanceSearch,
        keyword: this.keywordCtrl.value,
        clientName: this.clientNameCtrl.value,
        requestStatus: this.selectedStatus.toString(),
        requestType: this.selectedRequestType.toString(),
        requestDateFrom: moment(this.requestDateFromCtrl.value).format('YYYY-MM-DD'),
        requestDateTo: moment(this.requestDateToCtrl.value).format('YYYY-MM-DD'),
      })
      .subscribe(async res => {
        console.log(res);
        if(res.success){
          this.dataSource.data = res.data.length > 0 ? res.data.map((d)=>{
            return {
              requestId: d.requestId,
              requestDate: d.requestDate,
              client: d.client.fullName,
              requestType: d.requestType.name,
              requestStatus: d.requestStatus.name
            }
          }) : [];
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
