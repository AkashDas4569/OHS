import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { FormControlValidator } from '../../../core/validators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService, OhsClientService } from '../../../core/services';

@Component({
  selector: 'ohs-ohs-client-list',
  templateUrl: './ohs-client-list.component.html',
  styleUrls: ['./ohs-client-list.component.scss']
})
export class OhsClientListComponent implements OnInit, OnDestroy {
  private onDestroyUnSubscribe = new Subject<void>();
  public clientSearchForm!: FormGroup;

  public clientListData: any;
  public customArray = Array;
  public numberOfPages = 0;
  public currentPage = 1;
  pageSize: number = 25;
  public totalDocuments: number = 25;
  public noDataText: string = `Please wait while we're fetching your data...`;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private ohsClientService: OhsClientService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.clientSearchForm = this.fb.group({
      skip: [0],
      take: [10],
      companyName: ['']
    });

    this.clientList(this.pageSize, 0);
  }

  get formControls() {
    return this.clientSearchForm.controls;
  }
  errorState(field: AbstractControl, validatorFieldName: string) {
    return FormControlValidator(field, validatorFieldName);
  }
  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  clientList(pageSize: number, page: number, search?: any) {
    this.pageSize = pageSize;
    page -= 1;
    const pageNumber = (page <= 0 ? 0 : (page * this.pageSize));
    const clientDataPayLoad = {
      companyName: (search ? search : ''),
      skip: pageNumber,
      take: this.pageSize
    };
    this.noDataText = `Please wait while we're fetching your data...`;
    
    this.ohsClientService.getAllClientList(clientDataPayLoad)
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((clientListData: any) => {
        this.clientListData = clientListData['clients'];
        this.totalDocuments = clientListData['totalNumber'];
        this.numberOfPages = Math.ceil(this.totalDocuments/this.pageSize);
        // console.log('No. of Pages: ', this.numberOfPages);
        // console.log('Total Number: ', this.totalDocuments);

        // console.log(this.clientListData);
        this.noDataText = 'No Data Found';
      });
  }

  prevPage(pageSize: any) {
    this.currentPage = this.currentPage - 1;
    this.clientList(pageSize, this.currentPage);
  }
  nextPage(pageSize: any) {
    this.currentPage = this.currentPage + 1;
    this.clientList(pageSize, this.currentPage);
  }
  pageEntered(pageSize: any) {
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
    if (this.currentPage > this.numberOfPages) {
      this.currentPage = this.numberOfPages;
    }
    this.clientList(pageSize, this.currentPage);
}

  editClient(data: any) {
    // console.log(data);
    
    this.router.navigate(['/ohs-client/update-settings', data.Id]);
  }
  deleteClient(data: any) {
    if(confirm("Are you sure want to delete ?" + " " + data.CompanyName)) {
      this.currentPage = 0;

      this.ohsClientService.deleteOhsClientModule({ ID: data.Id })
      .pipe(takeUntil(this.onDestroyUnSubscribe))
      .subscribe((response: any) => {
        if (response['status'] == 200) {
          this.snackBar.open('Deleted Successfully', 'Close', {
            panelClass: 'success-popup',
          });

          this.clientList(this.pageSize, this.currentPage);
        } else {
          this.snackBar.open('Something went wrong! Please try again.', 'Close', {
            panelClass: 'error-popup',
          });
        }
      });
    }
  }

  onSubmit() {
    this.clientSearchForm.markAllAsTouched();
    this.currentPage = 1;
    if (this.clientSearchForm.valid) {
      // console.log('Valid', this.clientSearchForm);
        this.clientList(this.pageSize, this.currentPage, this.clientSearchForm.value.companyName);
    } 
  }
}
