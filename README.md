# DirectChat — Multi-Platform Direct Sender 💬

Direct message sender for **WhatsApp, Instagram, Snapchat, Facebook Messenger, and SMS** with automatic sender signature **`star66`** without needing to save contacts.

---

## 🚀 Supported Platforms & Direct Sending

| Platform | Input | Direct Action |
| :--- | :--- | :--- |
| 🟢 **WhatsApp** | Phone Number | Opens chat on WhatsApp Web/App with message signed as `star66` |
| 📸 **Instagram** | Username / ID | Copies message signed as `star66` & opens Instagram DM (`ig.me/m/<user>`) |
| 👻 **Snapchat** | Username | Copies message signed as `star66` & opens Snapchat (`snapchat.com/add/<user>`) |
| 🔵 **Messenger** | Facebook ID / Username | Copies message signed as `star66` & opens Messenger (`m.me/<user>`) |
| ✉️ **Normal SMS** | Phone Number | Launches native SMS app with message prefilled with `star66` signature |

---

## 🌟 Key Features

1. **Identity `star66`**:
   - Sender name defaults to **`star66`** and is automatically attached as `— Sent by star66` to every message.
   - Includes live preview of how the recipient will see the message.
2. **Dynamic UI**:
   - Switches automatically between international phone number input (with country flag selector) and social handle `@username` input.
3. **Smart Phone Parser**:
   - Paste numbers in any format (`+91 ...`, `+1 ...`) and it auto-detects country codes.
4. **Convenience Tools**:
   - One-click copy message with `star66` signature.
   - One-click copy direct link.
   - Instant QR Code scanner for desktop-to-mobile transitions.
   - Recents history with platform indicators and one-tap re-sending.

---

## 💻 Running the App
- **Live Local URL**: `http://localhost:3000`
- To run manually:
  ```powershell
  cd "C:\Users\User\.gemini\antigravity\scratch\whatsapp-direct-sender"
  python -m http.server 3000
  ```
