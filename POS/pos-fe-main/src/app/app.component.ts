import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareStateService } from './shared/services/share-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'POS_Frontend';
  username;
  constructor(
    private shareStateService: ShareStateService,
    private router: Router
  ) {
    router.events.subscribe((url: any) => {
      try {
        if (!url.url.includes("/main/warehouse-receipt/detail")) {
          this.shareStateService.updateStateSideBarOption(true)
        }
      }
      catch {
        return;
      }
      // finally {
      //   this.shareStateService.updateStateSideBarOption(true)
      // }
    });

    window.addEventListener('storage', (event) => {
      if (event.storageArea != localStorage) return;
      if (event.key === 'full_name') {
        if (localStorage.getItem('full_name')) {
          window.location.reload();
          this.router.navigate(['/main/dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  @HostListener("window:click", ["$event"])
  clickHandle() {
    this.shareStateService.updateStateLogoutOption(false)
  }
}
