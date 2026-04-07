chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "updateBadge" && sender.tab) {
    const text = msg.count > 0 ? String(msg.count) : "";
    chrome.action.setBadgeText({ text, tabId: sender.tab.id });
    chrome.action.setBadgeBackgroundColor({ color: "#f59e0b", tabId: sender.tab.id });
  }
});
