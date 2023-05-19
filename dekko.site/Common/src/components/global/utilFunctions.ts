export class Utils {
  static tolerance = 0.0000001;

  static equalT(val: number, expected: number) {
    return Math.abs(val - expected) < Utils.tolerance;
  }

  static lessThanT(val: number, expected: number) {
    return !Utils.equalT(val, expected) && val < expected;
  }

  static greaterThanT(val: number, expected: number) {
    return !Utils.equalT(val, expected) && val > expected;
  }

  static downloadFromBlob(blob: Blob, name: string) {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
  }
}
