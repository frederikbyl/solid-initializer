import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { handleIncomingRedirect, getDefaultSession, login } from '@inrupt/solid-client-authn-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  idpServer = 'http://localhost:3000/'
  constructor(private router: Router ) { }

  async ngOnInit(): Promise<void> {
    await handleIncomingRedirect();
    console.log("ON INIT")
    console.log(getDefaultSession().info.isLoggedIn)
    if (getDefaultSession().info.isLoggedIn === true) {
      console.log("navigate")

      this.router.navigate(['/dashboard']);
    }
  
  }

  login() : void {
    console.log("Trying to log in....")
    console.log(getDefaultSession().info)
    if (!getDefaultSession().info.isLoggedIn) {
      // The `login()` redirects the user to their identity provider;
      // i.e., moves the user away from the current page.
      login({
        // Specify the URL of the user's Solid Identity Provider; e.g., "https://broker.pod.inrupt.com" or "https://inrupt.net"
        oidcIssuer: this.idpServer,
        // Specify the URL the Solid Identity Provider should redirect to after the user logs in,
        // e.g., the current page for a single-page app.
        redirectUrl: window.location.href,
        // Pick an application name that will be shown when asked 
        // to approve the application's access to the requested data.
        clientName: "solid-initializer"
      });
    }
  }



}
