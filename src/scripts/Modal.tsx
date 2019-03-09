import { defaultOptions } from './DialogOptions';

export class Modal {
    private static containerRef: HTMLElement | null = null;

    public finalOptions: ModalOptions;
    private ref: HTMLElement | undefined;

    constructor(options?: ModalOptions) {
        this.finalOptions = {
            labelOK: defaultOptions.labelOK,
            labelCancel: defaultOptions.labelCancel,
            animate: defaultOptions.animate,
            ...options
        };
    }

    public render = (options?: ModalOptions) => {
        this.finalOptions = {...this.finalOptions, ...options};
        this.ref = this.renderElement();
        if (!Modal.containerRef) {
            Modal.containerRef = this.renderOverlay();
            document.body.appendChild(Modal.containerRef);
        }
        Modal.containerRef.appendChild(this.ref);
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
        if (Modal.containerRef && Modal.containerRef.querySelectorAll(".bn-modal").length <= 1) {
            Modal.containerRef.remove();
            Modal.containerRef = null;
        } else {
            if (this.ref) {
                this.ref.remove();
            }
        }
    }

    private renderOverlay = (): HTMLElement => {
        const ele = document.createElement("div");
        ele.setAttribute("class", "bn-modal-overlay");
        return document.body.appendChild(ele);
    };

    private renderElement = (): HTMLElement => {
        const options = this.finalOptions;
        const eleRoot = document.createElement("div");
        eleRoot.setAttribute("class", `bn-modal ${options.animate ? "animated" : ""} ${options.css || ""} ${options.theme || ""}`.trim());

        if (options.width) {
            eleRoot.style.width = options.width.toString();
        }

        let eleHeader: HTMLElement | null = null;
        if (options.title) {
            eleHeader = document.createElement("div");
            eleHeader.setAttribute("class", "bn-modal-header");
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
        eleBody.setAttribute("class", "bn-modal-body");
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

    private renderFooter = (options: ModalOptions): HTMLElement => {
        const ele = document.createElement("div");
        ele.setAttribute("class", "bn-modal-footer");
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

    private renderButtons = (buttons: ModalButton[]): HTMLElement => {
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

export interface ModalOptions {
    animate?: boolean;
    theme?: string;
    content?: string;
    title?: string;
    tip?: string;
    css?: string;
    width?: number | string;
    height?: number | string;
    buttons?: ModalButton[];
    onClosing?: (event: any) => boolean;
    onClosed?: (event: any) => void;
    labelOK?: string;
    labelCancel?: string;
}

export interface ModalButton {
    label: string;
    style?: string;
    css?: string;
    onClick?: (Modal: Modal) => void;
}

export function alert(message: string, callback?: () => void): Modal;
export function alert(title: string, message: string, callback?: () => void): Modal;

export function alert(): Modal {
    const args = arguments;
    const modal = new Modal();
    const modalOptions = modal.finalOptions;
    const options: ModalOptions = {};
    options.buttons = [
        {
            label: modalOptions.labelOK as string,
            css: "btn btn-primary",
            onClick: () => {
                modal.close();
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
        modal.render(options);
    }
    return modal;
}

export function confirm(options: ModalOptions): Modal;
export function confirm(message: string, callback: () => void): Modal;
export function confirm(title: string, message: string, callback: () => void): Modal;

export function confirm(): Modal {
    const args = arguments;
    const modal = new Modal();
    const modalOptions = modal.finalOptions;
    const options: ModalOptions = {};
    options.buttons = [
        {
            label: modalOptions.labelCancel as string,
            css: "btn btn-default btn-light",
            onClick: () => {
                modal.close();
            },
        },
        {
            label: modalOptions.labelOK as string,
            css: "btn btn-primary",
        },
    ];
    switch (args.length) {
        case 2:
            options.content = arguments[0];
            options.buttons[1].onClick = () => {
                args[1]();
                modal.close();
            };
            break;

        case 3:
            options.title = arguments[0];
            options.content = arguments[1];
            options.buttons[1].onClick = () => {
                args[2]();
                modal.close();
            };
            break;
    }
    if (options) {
        modal.render(options);
    }
    return modal;
}