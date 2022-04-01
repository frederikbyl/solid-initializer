import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  session: any;
  constructor(private router: Router) { 
   
  }

  ngOnInit(): void {
    if (getDefaultSession().info.isLoggedIn) {
      this.session = getDefaultSession();
   
    } else {
      this.router.navigate(['/login']);
    }
  }

  navigateToAuthorizations() {
    this.router.navigate(['/authorization']);
  }

  navigateToData() {
    this.router.navigate(['/data']);
  }
}
