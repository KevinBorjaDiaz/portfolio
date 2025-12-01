import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-tiktok',
  templateUrl: './tiktok.component.html',
  standalone: false,
})
export class TiktokComponent {
  constructor(private sanitizer: DomSanitizer) {}

  displayBtn: boolean | false;
  srcURL: SafeResourceUrl | null = null;
  strURL: string | null;
  errorMessage: string | null = null;

  async onPasteHandler(event: ClipboardEvent): Promise<void> {
    let text = event.clipboardData?.getData('text').trim() || '';

    text = await this.CallApiForMobileURL(text);
    this.validateText(text);
  }

  async onSubmitHandler(form: NgForm): Promise<void> {
    const { value } = form;

    const inputValue = value.tikitakURL;
    let text = inputValue;

    text = await this.CallApiForMobileURL(inputValue);
    this.validateText(text)
  }

  validateText = (text : string) : void => {
    if (!text) {
        this.setViewVariables(  'TikTok URL not accessible or restricted', false, '' )
        return;
    }

    return this.PrepareURL(text);
  }

  setViewVariables = (errorMsg : string, displayBtn : boolean, strUrl: string) : void => {
        this.errorMessage = errorMsg;
        this.displayBtn = displayBtn;
        this.strURL = strUrl;
  }

  PrepareURL = (text: string): void => {
    const parsed = new URL(text);
    const paths = parsed.pathname.split('/')
    if (paths.length >= 4 && paths[1] && paths[2] && paths[3]) {
      const videoID = paths[3];
      const finalURL = `https://www.tiktok.com/embed/${videoID}`;
      this.srcURL = this.sanitizer.bypassSecurityTrustResourceUrl(finalURL);
      
      this.setViewVariables( null, true, finalURL )
      return;
    }

    //! If gotten to this point go back to starting point
    this.setViewVariables( 'TikTok URL not accessible or restricted', false, '' )
    return;
  };

  async CallApiForMobileURL(text: string): Promise<string> {
    const providedURL = `https://www.tiktok.com/oembed?url=${text}`;

    try {
      const response = await fetch(providedURL);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const {author_url, embed_product_id } = await response.json();
      return (`${author_url}/v/${embed_product_id}`);

    } catch (error) {
      console.error(error.message);
      return null;
    }
  }

  copyURL(): void {
    navigator.clipboard.writeText(this.strURL);
  }
}
