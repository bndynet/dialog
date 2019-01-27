import { resolve } from 'url';

class Dialog {
    public static DefaultConfig: DailogConfig = {
        labelOK: "OK",
        labelCancel: "Cancel",
    };

    private static containerRef: HTMLElement | undefined;

    public config: DailogConfig | undefined;
    private ref: HTMLElement | undefined;

    constructor(config?: DailogConfig) {
        if (config) {
            Object.assign(this.config, Dialog.DefaultConfig,  config);
        } else {
            this.config = Dialog.DefaultConfig;
        }
    }

    public render = (options: DailogOptions) => {
        this.ref = this.renderElement(options);
        if (!Dialog.containerRef) {
            Dialog.containerRef = this.renderOverlay();
        }
        Dialog.containerRef.appendChild(this.ref);
    }

    public close = (event?: any) => {
        if (Dialog.containerRef && Dialog.containerRef.querySelectorAll(".dialog").length <= 1) {
            Dialog.containerRef.remove();
        } else {
            if (this.ref) {
                this.ref.remove();
            }
        }
    }

    private renderOverlay = (): HTMLElement => {
        const ele = document.createElement("div");
        ele.setAttribute("class", "dialog-overlay");
        return document.body.appendChild(ele);
    }

    private renderElement = (options: DailogOptions): HTMLElement => {
        const eleRoot = document.createElement("div");
        eleRoot.setAttribute("class", "dialog " + options.css || "");

        if (options.width) {
            eleRoot.style.width = options.width.toString();
        }

        let eleHeader: HTMLElement | null = null;
        if (options.title) {
            eleHeader = document.createElement("div");
            eleHeader.setAttribute("class", "dialog-header");
            eleRoot.appendChild(eleHeader);

            const eleHeaderTitle = document.createElement("h1");
            eleHeaderTitle.innerHTML = options.title;
            eleHeader.appendChild(eleHeaderTitle);

            const eleHeaderToolbox = document.createElement("div");
            eleHeaderToolbox.setAttribute("class", "toolbox");
            const eleHeaderToolboxClose = document.createElement("a");
            eleHeaderToolboxClose.setAttribute("aria-label", "Close");
            eleHeaderToolboxClose.innerHTML = "&times;";
            eleHeaderToolboxClose.addEventListener("click", event => {
                if (typeof options.onClosing === "function" && options.onClosing(event)) {
                    this.close(event);
                    if (typeof options.onClosed === "function") {
                        options.onClosed(event);
                    }
                } else {
                    this.close(event);
                    if (typeof options.onClosed === "function") {
                        options.onClosed(event);
                    }
                }
            });
            eleHeaderToolbox.appendChild(eleHeaderToolboxClose);
            eleHeader.appendChild(eleHeaderToolbox);
        }

        const eleBody = document.createElement("div");
        eleBody.setAttribute("class", "dialog-body");
        eleBody.innerHTML = options.content;
        eleRoot.appendChild(eleBody);

        const eleFooter = this.renderFooter(options);
        eleRoot.appendChild(eleFooter);

        let height: number | string | null = null;
        if (options.height && typeof options.height === "number") {
            height = options.height;
            if (eleHeader) {
                height = height - eleHeader.clientHeight;
            }
            if (eleFooter) {
                height = height - eleFooter.clientHeight;
            }
        } else if (typeof options.height === "string") {
            height = `calc(100vh - ${eleHeader ? eleHeader.clientHeight : 0}px - ${eleFooter ? eleFooter.clientHeight : 0}px)`;
        }
        if (height) {
            eleBody.style.height = height.toString();
        }

        return eleRoot;
    }

    private renderFooter = (options: DailogOptions): HTMLElement => {
        const ele = document.createElement("div");
        ele.setAttribute("class", "dialog-footer");
        if (options.tip) {
            ele.appendChild(this.renderTip(options.tip));
        }
        if (options.buttons) {
            ele.appendChild(this.renderButtons(options.buttons));
        }
        return ele;
    }

    private renderTip = (tip: string): HTMLElement => {
        const ele = document.createElement("div");
        ele.setAttribute("class", "tip");
        ele.innerHTML = tip;
        return ele;
    }

    private renderButtons = (buttons: DialogButton[]): HTMLElement => {
        const eleContainer = document.createElement("div");
        eleContainer.setAttribute("class", "actions-container");
        if (buttons&& buttons.length > 0) {
            buttons.forEach(button => {
                const btn = document.createElement("button");
                btn.innerHTML = button.label;
                btn.addEventListener("click", event => {
                    if (button.onClick && typeof button.onClick=== "function") {
                        button.onClick(this);
                    }
                });
                if (button.css) {
                    btn.setAttribute("class", button.css);
                } else {
                    btn.setAttribute("class", "btn btn-default btn-light");
                }
                if (button.style) {
                    btn.setAttribute("style", button.style);
                }
                eleContainer.appendChild(btn);
            });
        }
        return eleContainer;
    }
}

export interface DailogConfig {
    injectNotifyVariants?: string[];
    labelOK?:string;
    labelCancel?: string;
}

export interface DailogOptions {
    content: string;
    title?: string;
    tip?: string;
    css?: string;
    width?: number | string;
    height?: number | string;
    buttons?: DialogButton[];
    onClosing?: (event: any) => boolean;
    onClosed?: (event: any) => void;
}

export interface DialogButton {
    label: string;
    style?: string;
    css?: string;
    onClick?: (dialog: Dialog) => void;
}


export interface AlertOptions {
    title?: string;
    tip?: string;
    content: string;
    onOk?: () => void;
}

export function alert(options: AlertOptions): Dialog;
export function alert(message: string, callback: () => void): Dialog;
export function alert(title: string, message: string, callback: () => void): Dialog;

export function alert(arg1: any, arg2?: any, arg3?: any, arg4?: any): Dialog {
    const dialog = new Dialog();
    const dialogConfig = dialog.config;
    let options: DailogOptions | null = null;
    if (typeof arg1 === "object" && dialog && dialogConfig) {
        options = {
            title: arg1.title,
            content: arg1.content,
            tip: arg1.tip,
            buttons: [
                {
                    label: dialogConfig.labelOK as string,
                    css: "btn btn-primary",
                    onClick: () => {
                        if (typeof arg1.onOk === "function") {
                            arg1.onOk(dialog);
                        }
                        dialog.close();
                    },
                }
            ]
        };
    } else {
       if (typeof arg2 === "function") {
           return alert({
               content: arg1,
               onOk: arg2,
           });
       } else {
           return alert({
               title: arg1,
               content: arg2,
               onOk: arg3,
               tip: arg4,
           });
       }
    }
    if (options) {
        dialog.render(options);
    }
    return dialog;
}