import UAParser from "ua-parser-js";

export const detectDevice = (req) => {
  const ua = req.headers["user-agent"];
  const parser = new UAParser(ua);
  const result = parser.getResult();

  return {
    device: result.device.type || "desktop",
    browser: result.browser.name || "unknown",
    os: result.os.name || "unknown"
  };
};
