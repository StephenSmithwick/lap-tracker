import jsQR from "jsqr";

class Scanner implements QrScanner {
  stopped: boolean = false;
  frame?: number;
  stream?: MediaStream;

  start(video: HTMLVideoElement, onDecode: (text: string) => void) {
    this.stopped = false;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const tick = () => {
      if (this.stopped) return;
      if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(frameData.data, frameData.width, frameData.height);
        if (code) onDecode(code.data);
      }
      this.frame = requestAnimationFrame(tick);
    };

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((mediaStream) => {
        if (this.stopped) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }
        this.stream = mediaStream;
        video.srcObject = this.stream;
        void video.play();
        this.frame = requestAnimationFrame(tick);
      })
      .catch((err: unknown) => {
        console.error("Failed to start camera:", err);
      });
  }

  stop() {
    this.stopped = true;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.stream?.getTracks().forEach((track) => track.stop());
  }
}

export interface QrScanner {
  start(video: HTMLVideoElement, onDecode: (text: string) => void): void;
  stop(): void;
}

export const browserScanner = new Scanner();
export const noopScanner: QrScanner = {
  start: () => {},
  stop: () => {},
};
