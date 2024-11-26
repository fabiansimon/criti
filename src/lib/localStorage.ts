"use client";

const KEYS = {
  sessionId: "sessionId",
};

/**
 * Class to handle local storage operations
 */
export class LocalStorage {
  static storeSessionId(id: string) {
    localStorage.setItem(KEYS.sessionId, id);
  }

  static fetchSessionId(): string | undefined {
    const res = localStorage.getItem(KEYS.sessionId);
    if (!res) return;
    return res;
  }

  static cleanSessionId() {
    localStorage.removeItem(KEYS.sessionId);
  }

  static clean() {
    localStorage.clear();
  }
}
