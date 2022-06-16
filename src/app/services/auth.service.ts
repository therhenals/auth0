import { Injectable, NgZone } from '@angular/core';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private clientPrimary = new Auth0Client({
    client_id: environment.auth.clientId,
    domain: environment.auth.domain,
    cacheLocation: 'localstorage',
    useRefreshTokens: true,
    redirect_uri: environment.auth.redirectUri(''),
    scope: 'read:current_user create:users read:users update:users update:current_user_identities',
    audience: `https://${environment.auth.domain}/api/v2/`,
  });

  private clientLink = new Auth0Client({
    client_id: environment.auth.clientId,
    domain: environment.auth.domain,
    redirect_uri: environment.auth.redirectUri(''),
    max_age: 0,
  });

  constructor(
    private ngZone: NgZone,
  ) { }

  async login() {
    const url = await this.clientPrimary.buildAuthorizeUrl();
    await Browser.open({ url, windowName: '_self' })
  }

  async logout() {
    this.clientLink.logout({ localOnly: true })
  }

  async handleUrl() {
    const native = Capacitor.isNativePlatform();
    if (native) {
      this.handleNative();
    } else {
      this.handleWeb();
    }
  }

  private async handleWeb() {
    const url = window.location.href;
    if (url.includes('code=')) {
      await this.clientPrimary.handleRedirectCallback(url);
    }
  }

  private async handleNative() {
    App.addListener('appUrlOpen', ({ url }) => {
      this.ngZone.run(async () => {
      });
    });
  }

  async profile() {
    const { sub } = await this.clientPrimary.getUser({
      audience: `https://${environment.auth.domain}/api/v2/`,
    });
    const token = await this.clientPrimary.getTokenSilently();
    const response = await fetch(
      `https://${environment.auth.domain}/api/v2/users/${sub}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return await response.json();
  }

  async token() {
    return await this.clientPrimary.getTokenSilently();
  }

  async sub() {
    const { sub } = await this.clientPrimary.getUser();
    return sub;
  }
}
