import { Component } from '@angular/core';
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

  onPasteHandler(event: ClipboardEvent): void {
    const text = event.clipboardData?.getData('text').trim() || '';
    let videoID = text.replace('https://vm.', 'www.');
    videoID = videoID.replace('https://www.', 'www.');

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
      return;
    }

    //error handle
    this.displayBtn = false;
    this.strURL = '';
  }

  copyURL(): void {
    navigator.clipboard.writeText(this.strURL);
  }
}
