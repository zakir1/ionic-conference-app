import {IonicApp, Page, NavController} from 'ionic-framework/ionic';
import {TabsPage} from '../tabs/tabs';
import {SignupPage} from '../signup/signup';


@Page({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  private login: Object = {};
  private submitted: boolean = false;
  
  constructor(private nav: NavController) {}

  onLogin(form) {
    this.submitted = true;

    if (form.valid) {
      this.nav.push(TabsPage);
    }
  }

  onSignup() {
    this.nav.push(SignupPage);
  }
}
