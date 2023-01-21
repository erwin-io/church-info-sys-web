import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { Request } from "../model/request.model";
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class RequestService implements IServices {
  constructor(private http: HttpClient, private appconfig: AppConfigService) {}

  getByAdvanceSearch(params: any): Observable<ApiResponse<Request[]>> {
    return this.http
      .get<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.request.getByAdvanceSearch,
          {params}
      )
      .pipe(
        tap((_) => this.log('request')),
        catchError(this.handleError('request', []))
      );
  }

  getById(requestId: string): Observable<ApiResponse<Request>> {
    return this.http
      .get<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.request.getById +
          requestId
      )
      .pipe(
        tap((_) => this.log('request')),
        catchError(this.handleError('request', []))
      );
  }

  getRequestForADay(dateString: string): Observable<ApiResponse<Request[]>> {
    return this.http
      .get<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.request.getRequestForADay +
          dateString
      )
      .pipe(
        tap((_) => this.log('request')),
        catchError(this.handleError('request', []))
      );
  }

  createRequest(data: any): Observable<ApiResponse<Request>> {
    return this.http
      .post<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.request.createClientRequest,
        data
      )
      .pipe(
        tap((_) => this.log('request')),
        catchError(this.handleError('request', []))
      );
  }

  rescheduleRequest(data: any): Observable<ApiResponse<Request>> {
    return this.http
      .put<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.request.rescheduleRequest,
        data
      )
      .pipe(
        tap((_) => this.log('request')),
        catchError(this.handleError('request', []))
      );
  }

  updateRequestStatus(data: any): Observable<ApiResponse<Request>> {
    return this.http
      .put<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.request.updateRequestStatus,
        data
      )
      .pipe(
        tap((_) => this.log('request')),
        catchError(this.handleError('request', []))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log(
        `${operation} failed: ${
          Array.isArray(error.error.message)
            ? error.error.message[0]
            : error.error.message
        }`
      );
      return of(error.error as T);
    };
  }

  log(message: string) {
    console.log(message);
  }
}
