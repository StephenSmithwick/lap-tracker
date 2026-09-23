declare module "jsqr" {
  export interface QRCodePoint {
    x: number;
    y: number;
  }

  export interface QRCode {
    data: string;
    location: {
      topLeftCorner: QRCodePoint;
      topRightCorner: QRCodePoint;
      bottomLeftCorner: QRCodePoint;
      bottomRightCorner: QRCodePoint;
    };
  }

  export interface Options {
    inversionAttempts?: "dontInvert" | "onlyInvert" | "attemptBoth" | "invertFirst";
  }

  export default function jsQR(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    options?: Options,
  ): QRCode | null;
}
