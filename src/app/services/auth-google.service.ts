import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc'

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {

  constructor(private oauthService: OAuthService) {
    this.initLogin();
  }

  initLogin() {
    const config: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: '186431286028-kgqbqh15cfnp2ahusjo17fl8sjq4k8i9.apps.googleusercontent.com',
      redirectUri: 'http://localhost:4200/sign-in',
      scope: 'openid profile email',
    }

    this.oauthService.configure(config);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
    localStorage.removeItem('access_token'); // Clear access token from localStorage on logout
  }

  getProfile() {
    return this.oauthService.getIdentityClaims();
  }

  isLoggedIn(): boolean {
    return !!this.getProfile(); // Checks if the user's profile exists (if logged in)
  }

}
