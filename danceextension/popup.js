async function send(action, data = {}) {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Inject content.js manually (fixes issue)
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });

  // Now send message
  chrome.tabs.sendMessage(tab.id, { action, ...data });
}

// Buttons
document.getElementById("mirror").onclick = () => send("MIRROR");

document.getElementById("loop").onclick = () => {
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;
  send("LOOP", { start, end });
};

document.getElementById("fast").onclick = () => send("FAST");
document.getElementById("slow").onclick = () => send("SLOW");

document.getElementById("off").onclick = () => send("OFF");