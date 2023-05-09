import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';
import { Priest } from '../model/priest.model';

@Injectable({
  providedIn: 'root'
})
export class PriestService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  get(): Observable<ApiResponse<Priest[]>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.priest)
    .pipe(
      tap(_ => this.log('Priest')),
      catchError(this.handleError('Priest', []))
    );
  }

  getById(priestId: string): Observable<ApiResponse<Priest>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.priest + priestId)
    .pipe(
      tap(_ => this.log('Priest')),
      catchError(this.handleError('Priest', []))
    );
  }

  add(data: any): Observable<ApiResponse<Priest>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.priest, data)
    .pipe(
      tap(_ => this.log('Priest')),
      catchError(this.handleError('Priest', []))
    );
  }

  udpdate(data: any): Observable<ApiResponse<Priest>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.priest, data)
    .pipe(
      tap(_ => this.log('Priest')),
      catchError(this.handleError('Priest', []))
    );
  }

  delete(priestId: string): Observable<ApiResponse<Priest>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.priest + priestId)
    .pipe(
      tap(_ => this.log('Priest')),
      catchError(this.handleError('Priest', []))
    );
  }

   handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${Array.isArray(error.error.message) ? error.error.message[0] : error.error.message}`);
      return of(error.error as T);
    };
  }

  log(message: string) {
    console.log(message);
  }
}

