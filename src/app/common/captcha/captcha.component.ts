import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html'
})
export class CaptchaComponent implements OnInit {

  @ViewChild('recaptcha', { static: true })
  public recaptchaElement: ElementRef;
  @Input()
  public siteKey: string;
  @Output()
  public onResponse = new EventEmitter<string>();
  @Output()
  public onExpired = new EventEmitter<boolean>();  

  constructor() { }

  ngOnInit() {
    this.addRecaptchaScript();
  }

  renderReCaptch() {
    window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
      'sitekey': this.siteKey,
      'expired-callback': (response) => {
        //console.log(response);
        this.onExpired.next(true);
      },
      'callback': (response) => {
        //console.log(response);
        this.onResponse.next("finalizarExamen");
      }
    });
  }

  
  addRecaptchaScript() {
    var _captchaTries = 0;
    window['grecaptchaCallback'] = () => {
         _captchaTries++;
          if (_captchaTries > 9)
              return;
          if (window['grecaptcha'].length > 0) {
            this.renderReCaptch();
              return;
          }
          setTimeout(()=>{this.renderReCaptch()}, 1000);
      }

    (function (d, s, id, obj) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { obj.renderReCaptch(); return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp;render=explicit&hl=es";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'recaptcha-jssdk', this));

  }

}
