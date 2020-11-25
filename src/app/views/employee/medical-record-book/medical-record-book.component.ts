import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// RxJs
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'ohs-medical-record-book',
  templateUrl: './medical-record-book.component.html',
  styleUrls: ['./medical-record-book.component.scss']
})
export class MedicalRecordBookComponent implements OnInit, OnDestroy {
  private onDestroyUnSubscribe = new Subject<void>();

  public isCollapsed = false;
  public imageUrl: any = 'assets/img/plus-icon.png';
  public selectedFile!: File;
  public selectedName: string = 'Upload Company Logo';
  public imageFile: any;
  public file: any;
  public dataImage: any;
  public filePath: any;
  public imageId: any;

  constructor(
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    // UnSubscribe Subscriptions
    this.onDestroyUnSubscribe.next();
    this.onDestroyUnSubscribe.complete();
  }

  imageFileSelected(event: any) {
    console.log(event.target.files);
    if (event.target.files && event.target.files[0]) {
      this.imageFile = event.target.files[0];
      console.log(this.imageFile);

      this.file = this.imageFile.name.split('.').pop();
      this.imageId = event.target.id;
      console.log(this.imageId);
      
      if ((this.file === 'png' || this.file === 'PNG') || (this.file === 'jpg' || this.file === 'JPG') || (this.file === 'jpeg' || this.file === 'JPEG')) {
        const reader = new FileReader();
        reader.onload = () => {
          if (this.imageId === 'picUpload') {
            this.imageUrl = reader.result;
            // this.registerForm.patchValue({
            //   profileImage: this.imageFile.name
            // });
          }
        }
        reader.readAsDataURL(this.imageFile);
        this.selectedName = this.imageFile.name;
        this.selectedFile = event.target.files[0];
        console.log(this.selectedName);
        // this.formControls.File.setValue(event.target.files[0].name);
      } else {
        this.selectedName = 'Upload Company Logo';
        this.snackBar.open('Only image files are Supported.', 'Close', {
          panelClass: 'error-popup',
        });
      }
    }
  }

  onSubmit() { }

}
