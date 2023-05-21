import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Messages } from './core/model/messages.model';
import { SessionActivityService } from './core/services/session-activity.service';
import { StorageService } from './core/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'church-info-sys-web';
  grantNotif = false;
  constructor(private snackBar: MatSnackBar,
    private sessionActivityService: SessionActivityService,
    private storageService: StorageService) {
      document.addEventListener("click input", ()=> {
        if(!this.sessionActivityService.isSessionExpired) {
          this.sessionActivityService.stop();
          this.sessionActivityService.resetSession();
          this.sessionActivityService.start();
        }
      })
      // this.socket.init();
  }

  
  ngOnInit() {
    //start session
      const currentUser = this.storageService.getLoginUser();
      if(currentUser && this.storageService.getSessionExpiredDate()) {
        this.sessionActivityService.stop();
        this.sessionActivityService.start();
      }
  }
  ngOnDestroy() {
    //stop session
    const currentUser = this.storageService.getLoginUser();
    if(currentUser) {
      this.sessionActivityService.stop();
    }
  }
}
