export interface NotifierOptions {
    autoClose?: boolean;
    clickClose?: boolean;
    closeDelay?: number;
    theme?: string;
    placement?: string;
    maxItems?: number;
    square?: boolean;
}


class Notifier {

    public static set(options: NotifierOptions) {
        Object.assign(Notifier.globalOptions, options);
    }

    private static refContainer: HTMLElement;
    private static globalOptions: NotifierOptions = {
        autoClose: true,
        closeDelay: 3000,
        clickClose: true,
        theme: "default",
        placement: "bottom right",
        maxItems: 3,
    };

    private ref?: HTMLElement;
    private options: NotifierOptions = Notifier.globalOptions;

    constructor(options?: NotifierOptions) {
        if (options) {
            Object.assign(this.options, options);
        }
    }

    public show = (message: string) => {
        if (Notifier.refContainer) {
            const itemCount  = Notifier.refContainer.querySelectorAll(".notifier-item").length;
            if ( itemCount>= this.options.maxItems!) {
                const needRemovedItems = Array.from(Notifier.refContainer.querySelectorAll(".notifier-item"))
                    .slice(0, itemCount - this.options.maxItems! + 1) as HTMLElement[];
                needRemovedItems.forEach((item: HTMLElement) => {
                    this.close(item);
                });
            }
        }
        return this.renderItem(message);
    }

    public close = (item?: HTMLElement) => {
        if (item) {
            const css = item.getAttribute("class")!.replace("notifier-item-show", "notifier-item-hidden");
            item.setAttribute("class", `${css}`);
            setTimeout(() => {
                item.remove();
            }, 500);
        } else {
            this.close(this.ref);
        }
    }

    private renderItem = (message: string) => {
        if (!Notifier.refContainer) {
            Notifier.refContainer = document.createElement("div");
            Notifier.refContainer.setAttribute("class", `notifier-container ${this.options.placement} ${this.options.square ? "square" : ""}`);
            document.body.appendChild(Notifier.refContainer);
        }

        this.ref = document.createElement("div");
        this.ref.setAttribute("class", `notifier-item ${this.options.theme}`);
        this.ref.innerHTML = message;

        if (this.options.autoClose) {
            setTimeout(() => {
                this.close();
            }, this.options.closeDelay);
        }
        if (this.options.clickClose) {
            this.ref.addEventListener("click", (ev: MouseEvent) => {
                this.close();
            });
        }
        Notifier.refContainer.appendChild(this.ref);
        setTimeout(() => {
            if (this.ref) {
                this.ref.setAttribute("class", `${this.ref.getAttribute("class")} notifier-item-show`);
            }
        }, 100);
        return this.ref;
    }
}

export function setNotifier(options: NotifierOptions) {
    Notifier.set(options);
}

export function notify(message: string, theme?: string) {
    const notifier = new Notifier({
        theme: theme || "default",
        autoClose: false,
    });
    notifier.show(message);
}