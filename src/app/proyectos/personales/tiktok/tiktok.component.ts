import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-tiktok',
  templateUrl: './tiktok.component.html',
  styleUrl: './tiktok.component.css',
  standalone: false,
})
export class TiktokComponent {
  constructor(private sanitizer: DomSanitizer) {}

  displayBtn: boolean | false;
  srcURL: SafeResourceUrl | null = null;
  strURL: string | null;

  async onPasteHandler(event: ClipboardEvent): Promise<void> {
    const clipboardText = event.clipboardData?.getData('text').trim() || '';
    let text = clipboardText;

    if (clipboardText.includes('vt.tiktok')) {
      text = await this.CallApiForMobileURL(clipboardText);
    }

    if (!this.PrepareURL(text)) {
      //! If gotten to this point go back to starting point
      this.displayBtn = false;
      this.strURL = '';
    }
  }

  async onSubmitHandler(form: NgForm): Promise<void> {
    const { value } = form;

    const inputValue = value.tikitakURL;
    let text = inputValue;

    if (inputValue.includes('vt.tiktok')) {
      text = await this.CallApiForMobileURL(inputValue);
    }

    if (!this.PrepareURL(text)) {
      //! If gotten to this point go back to starting point
      this.displayBtn = false;
      this.strURL = '';
    }
  }

  PrepareURL = (text): boolean => {
    let videoID = text.replace('https://www.', 'www.');

    const indexOfUser = videoID.indexOf('/');
    const indexOfType = videoID.indexOf('/', indexOfUser + 1);
    const indexOfID = videoID.indexOf('/', indexOfType + 1);
    const endofID =
      videoID.indexOf('?') == -1 ? videoID.length : videoID.lastIndexOf('?');
    if (
      indexOfUser != -1 &&
      indexOfType != -1 &&
      indexOfID != -1 &&
      endofID != -1
    ) {
      videoID = videoID.substring(indexOfID + 1, endofID);
      const finalURL = `https://www.tiktok.com/embed/${videoID}`;

      this.srcURL = this.sanitizer.bypassSecurityTrustResourceUrl(finalURL);
      this.displayBtn = true;
      this.strURL = finalURL;
      return true;
    }
    return false;
  };

  async CallApiForMobileURL(text): Promise<string> {
    const providedURL = `https://www.tiktok.com/oembed?url=${text}`;
    let finalURL = '';

    try {
      const response = await fetch(providedURL);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      return (finalURL = `${json.author_url}/v/${json.embed_product_id}`);
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }

  copyURL(): void {
    navigator.clipboard.writeText(this.strURL);
  }
}
