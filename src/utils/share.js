function copyText(text) {
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.setAttribute("inputmode", "none");
  input.style.cssText =
    "position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0;";
  document.body.appendChild(input);
  input.focus();
  input.select();
  input.setSelectionRange(0, text.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }

  document.body.removeChild(input);
  return copied;
}

async function shareText({ title, text, url }) {
  if (navigator.share) {
    try {
      await navigator.share(
        url ? { title, text, url } : { title, text }
      );
      return "shared";
    } catch (error) {
      if (error?.name === "AbortError") {
        return "cancelled";
      }
    }
  }

  const message = url ? `${text} ${url}` : text;
  if (copyText(message)) {
    return "copied";
  }

  window.open(
    `https://wa.me/?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  );
  return "opened";
}

export { copyText, shareText };
