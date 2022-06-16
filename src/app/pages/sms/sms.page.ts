import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.page.html',
  styleUrls: ['./sms.page.scss'],
})
export class SmsPage implements OnInit {

  phone: string = "3006895932";
  code: string;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  send() {
    fetch('https://dev-kae17svc.us.auth0.com/passwordless/start', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "client_id": "cjOt4vkow5z4bPEMJ307Zthg2I33pLNE",
        "client_secret": "nis3tL9dEP8rAK5iwVuTGHN6IKFniV3mS6HAWtR1_ehLVcMY1ZNBgwsYC3KioNJI",
        "connection": "sms",
        "phone_number": "+57" + this.phone,
        "send": "code",
        "authParams": {
          "response_type": "code",
          "redirect_uri": "http://localhost:8100"
        }
      })
    })
  }

  async login() {
    const res = await fetch('https://dev-kae17svc.us.auth0.com/oauth/token', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "grant_type": "http://auth0.com/oauth/grant-type/passwordless/otp",
        "client_id": "cjOt4vkow5z4bPEMJ307Zthg2I33pLNE",
        "client_secret": "nis3tL9dEP8rAK5iwVuTGHN6IKFniV3mS6HAWtR1_ehLVcMY1ZNBgwsYC3KioNJI",
        "otp": this.code,
        "realm": "sms",
        "username": "+57" + this.phone
      })
    });
    const json = await res.json();

    const sub = await this.authService.sub();
    const token = await this.authService.token();

    console.log(json.access_token);

    await fetch(`https://dev-kae17svc.us.auth0.com/api/v2/users/${sub}/identities`, {
      method: 'POST',
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "link_with": json.id_token
      })
    });

  }

}
