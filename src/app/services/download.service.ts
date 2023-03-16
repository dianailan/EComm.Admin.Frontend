import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})

export class DownloadService {
  public download(res) {
    const blob = new Blob([res.data], { type: res.data.type });
    const file = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = file;
    a.target = '_blank';
    a.setAttribute('download', res.fileName);
    setTimeout(() => {
      a.dispatchEvent(new MouseEvent('click'));
    }, 300);
  }
}
