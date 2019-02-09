export class Dialog {
    public static defaultOptions: DailogOptions = {
        labelOK: "OK",
        labelCancel: "Cancel",
    };
    public static setOptions = (options: DailogOptions) => {
        Object.assign(Dialog.globalOptions, Dialog.defaultOptions, options);
    }

    private static containerRef: HTMLElement | null = null;
    private static globalOptions: DailogOptions = Dialog.defaultOptions;


    public finalOptions: DailogOptions = {};
    private ref: HTMLElement | undefined;

    constructor(options?: DailogOptions) {
        this.finalOptions = {...Dialog.globalOptions, ...options};
    }

    public render = (options?: DailogOptions) => {
        this.finalOptions = {...this.finalOptions, ...options};
        this.ref = this.renderElement();
        if (!Dialog.containerRef) {
            Dialog.containerRef = this.renderOverlay();
            document.body.appendChild(Dialog.containerRef);
        }
        Dialog.containerRef.appendChild(this.ref);
    };

    public close = (event?: any) => {
        if (typeof this.finalOptions.onClosing === "function") {
            if (this.finalOptions.onClosing(event)) {
                this.removeElement();
                if (typeof this.finalOptions.onClosed === "function") {
                    this.finalOptions.onClosed(event);
                }
            }
        } else {
            this.removeElement();
            if (typeof this.finalOptions.onClosed === "function") {
                this.finalOptions.onClosed(event);
            }
        }
    };

    private removeElement = () => {
        if (Dialog.containerRef && Dialog.containerRef.querySelectorAll(".dialog").length <= 1) {
            Dialog.containerRef.remove();
            Dialog.containerRef = null;
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
    };

    private renderElement = (): HTMLElement => {
        const options = this.finalOptions;
        const eleRoot = document.createElement("div");
        eleRoot.setAttribute("class", `dialog ${options.css || ""} ${options.theme || ""}`.trim());

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
                this.removeElement();
            });
            eleHeaderToolbox.appendChild(eleHeaderToolboxClose);
            eleHeader.appendChild(eleHeaderToolbox);
        }

        const eleBody = document.createElement("div");
        eleBody.setAttribute("class", "dialog-body");
        eleBody.innerHTML = options.content || "";
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
    };

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
    };

    private renderTip = (tip: string): HTMLElement => {
        const ele = document.createElement("div");
        ele.setAttribute("class", "tip");
        ele.innerHTML = tip;
        return ele;
    };

    private renderButtons = (buttons: DialogButton[]): HTMLElement => {
        const eleContainer = document.createElement("div");
        eleContainer.setAttribute("class", "actions-container");
        if (buttons && buttons.length > 0) {
            buttons.forEach(button => {
                const btn = document.createElement("button");
                btn.innerHTML = button.label;
                btn.addEventListener("click", event => {
                    if (button.onClick && typeof button.onClick === "function") {
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
    };
}

export interface DailogOptions {
    theme?: string;
    content?: string;
    title?: string;
    tip?: string;
    css?: string;
    width?: number | string;
    height?: number | string;
    buttons?: DialogButton[];
    onClosing?: (event: any) => boolean;
    onClosed?: (event: any) => void;
    labelOK?: string;
    labelCancel?: string;
}

export interface DialogButton {
    label: string;
    style?: string;
    css?: string;
    onClick?: (dialog: Dialog) => void;
}

export function alert(message: string, callback?: () => void): Dialog;
export function alert(title: string, message: string, callback?: () => void): Dialog;

export function alert(): Dialog {
    const args = arguments;
    const dialog = new Dialog();
    const dailogOptions = dialog.finalOptions;
    const options: DailogOptions = {};
    options.buttons = [
        {
            label: dailogOptions.labelOK as string,
            css: "btn btn-primary",
            onClick: () => {
                dialog.close();
            },
        },
    ];
    switch (args.length) {
        case 1:
            options.content = args[0];
            break;
        case 2:
            if (typeof args[1] === "function") {
                options.content = args[0];
                options.onClosed = args[1];
            } else {
                options.title = args[0];
                options.content = args[1];
            }
            break;

        case 3:
            options.title = args[0];
            options.content = args[1];
            options.onClosed = args[2];
            break;
    }
    if (options) {
        dialog.render(options);
    }
    return dialog;
}

export function confirm(options: DailogOptions): Dialog;
export function confirm(message: string, callback: () => void): Dialog;
export function confirm(title: string, message: string, callback: () => void): Dialog;

export function confirm(): Dialog {
    const args = arguments;
    const dialog = new Dialog();
    const dialogOptions = dialog.finalOptions;
    const options: DailogOptions = {};
    options.buttons = [
        {
            label: dialogOptions.labelCancel as string,
            css: "btn btn-default btn-light",
            onClick: () => {
                dialog.close();
            },
        },
        {
            label: dialogOptions.labelOK as string,
            css: "btn btn-primary",
        },
    ];
    switch (args.length) {
        case 2:
            options.content = arguments[0];
            options.buttons[1].onClick = () => {
                args[1]();
                dialog.close();
            };
            break;

        case 3:
            options.title = arguments[0];
            options.content = arguments[1];
            options.buttons[1].onClick = () => {
                args[2]();
                dialog.close();
            };
            break;
    }
    if (options) {
        dialog.render(options);
    }
    return dialog;
}