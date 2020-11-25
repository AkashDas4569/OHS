/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { TokenInterceptorService } from './token-interceptor.service';
import { LoaderInterceptorService } from './loader-interceptor.service';
//import { UploadInterceptor } from './upload-interceptor.service';


/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
 // { provide: HTTP_INTERCEPTORS, useClass: UploadInterceptor, multi: true },
];


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
