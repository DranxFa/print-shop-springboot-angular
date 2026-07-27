import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ErrorResponse } from '../models/error.model';
import { toast } from 'ngx-sonner';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error && typeof error.error === 'object') {
        const errPayload = error.error as ErrorResponse;
        let msg = errPayload.message || 'Ocurrió un error en el servidor.';
        
        if (errPayload.fieldErrors && Object.keys(errPayload.fieldErrors).length > 0) {
          const fieldMsgs = Object.entries(errPayload.fieldErrors)
            .map(([field, err]) => `${field}: ${err}`)
            .join(' | ');
          msg += ` (${fieldMsgs})`;
        }
        
        toast.error(msg);
      } else {
        toast.error(error.message || 'Error de red o servidor no disponible.');
      }
      
      return throwError(() => error);
    })
  );
};
