/**
 * PWA Notification utilities for Clean Gains
 */

export interface NotificationOptions {
  title: string;
  body: string;
  tag?: string;
  data?: Record<string, unknown>;
}

/**
 * Check if notifications are supported in the current browser
 */
export function isNotificationSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator
  );
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

/**
 * Request notification permission from user
 * @returns The permission result
 */
export async function requestNotificationPermission(): Promise<
  NotificationPermission | "unsupported"
> {
  if (!isNotificationSupported()) return "unsupported";

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return "denied";
  }
}

/**
 * Show a notification via the service worker
 * Falls back to Notification API if SW not available
 */
export async function showNotification(
  options: NotificationOptions
): Promise<boolean> {
  if (!isNotificationSupported()) return false;

  const permission = getNotificationPermission();
  if (permission !== "granted") return false;

  try {
    const registration = await navigator.serviceWorker.ready;

    await registration.showNotification(options.title, {
      body: options.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: options.tag || "clean-gains",
      data: options.data,
    });

    return true;
  } catch (error) {
    console.error("Error showing notification:", error);

    // Fallback to Notification API
    try {
      new Notification(options.title, {
        body: options.body,
        icon: "/icons/icon-192.png",
        tag: options.tag,
      });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Show rest timer completion notification
 */
export async function showRestCompleteNotification(): Promise<boolean> {
  return showNotification({
    title: "Rest Complete",
    body: "Time to get back to work!",
    tag: "rest-timer",
    data: { type: "rest-complete" },
  });
}
