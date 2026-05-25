import Script from "next/script";

import { localeCookieName } from "@/lib/i18n/config";

/** Sets `dir` / `lang` on `<html>` from the locale cookie before paint (no `cookies()` in layout). */
export function LocaleHtmlScript() {
	const script = `
(function () {
  var match = document.cookie.match(/(?:^|; )${localeCookieName}=([^;]*)/);
  var locale = match && (match[1] === "ar" || match[1] === "en") ? match[1] : "en";
  var dir = locale === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = locale;
  document.documentElement.dir = dir;
})();
`.trim();

	return (
		<Script
			// biome-ignore lint/security/noDangerouslySetInnerHtml: sync-only inline bootstrap
			dangerouslySetInnerHTML={{ __html: script }}
		/>
	);
}
