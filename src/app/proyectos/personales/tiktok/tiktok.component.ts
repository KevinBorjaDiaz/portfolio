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
//https://www.tiktok.com/@theonion/video/7493945007024426282?_t=ZM-8vawpZPDx2M&_r=1
//https://www.tiktok.com/@erick_m79/photo/7493735348221136133?_d=secCgYIASAHKAESPgo8TZrG6qutiEXsukRYo2YnjNfxlcfJqHPR7gheMZTR%2FG3g%2BDTrJgsUxoleIIknFzeHw6xf4%2FTxvU%2Bt7sq%2FGgA%3D&_r=1&_svg=1&aweme_type=150&checksum=9d8eb5842c2e5d84493233e975304347ed6a4947373dcc1dfee0cfa12ac78e08&cover_exp=v1&link_reflow_popup_iteration_sharer=%7B"click_empty_to_play"%3A1%2C"dynamic_cover"%3A1%2C"follow_to_play_duration"%3A-1.0%2C"profile_clickable"%3A1%7D&pic_cnt=4&preview_pb=0&sec_user_id=MS4wLjABAAAARoUvCjccRMxGT_Il4wvwPOCWd0RPhdkwK2Kuwwc-K3eQFDHX_lF_lDK554WWbh7-&share_app_id=1233&share_item_id=7493735348221136133&share_link_id=7d2f6c2e-0a89-4402-9837-113f82951009&sharer_language=es&social_share_type=14&source=h5_m&timestamp=1744850202&u_code=da7g36b4a889da&ug_btm=ChatShellActivity%2Cb2878&ug_photo_idx=3&ugbiz_name=UNKNOWN&user_id=6778957353414919174&utm_campaign=client_share&utm_medium=android&utm_source=messenger
