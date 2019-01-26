import { resolve } from 'url';

class Dialog {
    private static containerRef: HTMLElement | undefined;
    private ref: HTMLElement | undefined;

    constructor(config?: DailogConfigs) {
        // TODO:

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

        if (options.title) {
            const eleHeader = document.createElement("div");
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

        eleRoot.appendChild(this.renderFooter(options));

        return eleRoot;
    }

    private renderFooter = (options: DailogOptions): HTMLElement => {
        const ele = document.createElement("div");
        ele.setAttribute("class", "dialog-footer");
        if (options.tip) {
            ele.appendChild(this.renderTip(options.tip));
        }
        if (options.actions) {
            ele.appendChild(this.renderButtons(options.actions));
        }
        return ele;
    }

    private renderTip = (tip: string): HTMLElement => {
        const ele = document.createElement("div");
        ele.setAttribute("class", "tip");
        ele.innerHTML = tip;
        return ele;
    }

    private renderButtons = (actions: DialogAction[]): HTMLElement => {
        const eleContainer = document.createElement("div");
        eleContainer.setAttribute("class", "actions-container");
        if (actions && actions.length > 0) {
            actions.forEach(action => {
                const btn = document.createElement("button");
                btn.innerHTML = action.label;
                btn.addEventListener("click", event => {
                    if (action.onDo && typeof action.onDo === "function") {
                        action.onDo(event);
                    }
                });
                if (action.css) {
                    btn.setAttribute("class", action.css);
                }
                if (action.style) {
                    btn.setAttribute("style", action.style);
                }
                eleContainer.appendChild(btn);
            });
        }
        return eleContainer;
    }
}

export interface DailogConfigs {
    injectNotifyVariants: string[];
}

export interface DailogOptions {
    content: string;
    title?: string;
    tip?: string;
    css?: string;
    actions: DialogAction[];
    onClosing?: (event: any) => boolean;
    onClosed?: (event: any) => void;
}

export interface DialogAction {
    label: string;
    style?: string;
    css?: string;
    onDo?: (event?: any) => void;
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
    let options: DailogOptions | null = null;
    if (typeof arg1 === "object") {
        options = {
            title: arg1.title,
            content: arg1.content,
            tip: arg1.tip,
            actions: [
                {
                    label: "OK",
                    onDo: () => {
                        if (typeof arg1.onOk === "function") {
                            arg1.onOk();
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