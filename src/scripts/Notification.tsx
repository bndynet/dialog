import { defaultOptions } from './DialogOptions';

/** The options for [[Notification]] */
export interface NotificationOptions {
    autoClose?: boolean;
    clickClose?: boolean;
    closeDelay?: number;
    theme?: string;
    placement?: string;
    maxItems?: number;
    square?: boolean;
    message: string;
}

/**
 * The notification component for popping up notifications.
 */
export class Notification {
    private static refContainer: HTMLElement;

    private ref?: HTMLElement;
    private finalOptions: NotificationOptions;

    constructor(options: NotificationOptions) {
        this.finalOptions = {
            autoClose: defaultOptions.notificationAutoClose,
            clickClose: defaultOptions.notificationClickClose,
            closeDelay: defaultOptions.notificationCloseDelay,
            theme: defaultOptions.notificationTheme,
            placement: defaultOptions.notificationPlacement,
            maxItems: defaultOptions.notificationMaxItems,
            square: defaultOptions.notificationSquare,
            ...options,
        };
    }

    /**
     * Shows a notification
     */
    public show = () => {
        if (Notification.refContainer) {
            const itemCount  = Notification.refContainer.querySelectorAll(".notification-item").length;
            if ( itemCount>= this.finalOptions.maxItems!) {
                const needRemovedItems = Array.from(Notification.refContainer.querySelectorAll(".notification-item"))
                    .slice(0, itemCount - this.finalOptions.maxItems! + 1) as HTMLElement[];
                needRemovedItems.forEach((item: HTMLElement) => {
                    this.close(item);
                });
            }
        }
        return this.renderItem(this.finalOptions.message);
    }

    /**
     * Closes the notification
     * @param item The notification item typed [[HTMLElement]]
     */
    public close = (item?: HTMLElement) => {
        if (item) {
            const css = item.getAttribute("class")!.replace("notification-item-show", "notification-item-hidden");
            item.setAttribute("class", `${css}`);
            setTimeout(() => {
                item.remove();
            }, 500);
        } else {
            this.close(this.ref);
        }
    }

    private renderItem = (message: string) => {
        if (!Notification.refContainer) {
            Notification.refContainer = document.createElement("div");
            Notification.refContainer.setAttribute("class", `bn-notification-container ${this.finalOptions.placement} ${this.finalOptions.square ? "square" : ""}`);
            document.body.appendChild(Notification.refContainer);
        }

        this.ref = document.createElement("div");
        this.ref.setAttribute("class", `notification-item ${this.finalOptions.theme}`);
        this.ref.innerHTML = message;

        if (this.finalOptions.autoClose) {
            setTimeout(() => {
                this.close();
            }, this.finalOptions.closeDelay);
        }
        if (this.finalOptions.clickClose) {
            this.ref.addEventListener("click", (ev: MouseEvent) => {
                this.close();
            });
        }
        Notification.refContainer.appendChild(this.ref);
        setTimeout(() => {
            if (this.ref) {
                this.ref.setAttribute("class", `${this.ref.getAttribute("class")} notification-item-show`);
            }
        }, 100);
        return this.ref;
    }
}

/**
 * Shows a notification with options.
 * @param messageOrOptions The notification message or [[NotificationOptions]]
 * @param theme The notification theme, can be `success`, `warning`, `error` and `default`
 */
export function notify(messageOrOptions: string | NotificationOptions, theme?: string) {
    if (typeof messageOrOptions === "object") {
        new Notification(messageOrOptions).show();
    } else {
        const notification = new Notification({
            theme: theme || "default",
            autoClose: true,
            message: messageOrOptions,
        });
        notification.show();
    }
}