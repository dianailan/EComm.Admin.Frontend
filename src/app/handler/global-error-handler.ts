import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    const chunkFailedMessageRgx = new RegExp('ChunkLoadError');
    if (chunkFailedMessageRgx.test(error.message)) {
      window.location.reload();
    }
  }
}
