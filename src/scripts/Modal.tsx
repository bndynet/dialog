import { defaultOptions } from './DialogOptions';

/**
 * The Modal component for building alert and confirm dialog.
 */
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

    /**
     * Renders a [[Modal]] instance with options.
     * @param options The modal options, see the [[ModalOptions]] interface
     */
    public render = (options?: ModalOptions) => {
        this.finalOptions = {...this.finalOptions, ...options};
        if (!Modal.containerRef) {
            Modal.containerRef = this.renderOverlay();
            document.body.appendChild(Modal.containerRef);
        }
        this.renderElement();

    };

    /**
     * Closes the [[Modal]] instance.
     *
     * @param event The close event
     */
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
        document.body.appendChild(ele);
        return ele;
    };

    private renderElement = (): HTMLElement => {
        const options = this.finalOptions;
        const eleRoot = document.createElement("div");
        eleRoot.setAttribute("class", `bn-modal ${options.animate ? "animated" : ""} ${options.css || ""} ${options.theme || ""}`.trim());
        this.ref = eleRoot;
        if (Modal.containerRef) {
            Modal.containerRef.appendChild(this.ref);
        }

        if (options.width) {
            eleRoot.style.width = options.width.toString();
        }

        let headerHeight = 0;
        if (options.title) {
            let eleHeader: HTMLElement | null = null;
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

            headerHeight = eleHeader.clientHeight;
        }

        // check whether the content is URI
        let eleBody;
        if (options.content && (
                options.content.toUpperCase().startsWith("HTTP:") ||
                options.content.toUpperCase().startsWith("HTTPS:") ||
                options.content.toUpperCase().startsWith("FILE:") ||    // maybe browsers disable access local resoruces, like Chrome, Firefox
                options.content.toUpperCase().startsWith("FTP:") ||
                options.content.startsWith("/"))) {
            eleBody = document.createElement("iframe");
            eleBody.setAttribute("src", options.content);
            eleBody.setAttribute("class", "bn-modal-body");
        } else {
            eleBody = document.createElement("div");
            eleBody.setAttribute("class", "bn-modal-body");
            eleBody.innerHTML = options.content || "";
        }
        eleRoot.appendChild(eleBody);

        let footerHeight = 0;
        if ((options.buttons && options.buttons.length > 0) || options.tip) {
            const eleFooter = this.renderFooter(options);
            eleRoot.appendChild(eleFooter);
            footerHeight = eleFooter.clientHeight;
        }

        let height: number | string | null = null;
        if (options.height && typeof options.height === "number") {
            height = options.height - headerHeight - footerHeight;
        } else if (typeof options.height === "string") {
            height = `calc(${options.height} - ${headerHeight}px - ${footerHeight}px)`;
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

/** The options for [[Modal]] */
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

/** The button definition for [[Modal]] buttons */
export interface ModalButton {
    label: string;
    style?: string;
    css?: string;
    onClick?: (Modal: Modal) => void;
}

/**
 * Shows an alert dialog.
 * @param message The alert message
 * @param callback The callback function when you click ok button
 */
export function alert(message: string, callback?: () => void): Modal;

/**
 * Shows an alert dialog.
 * @param title The alert dialog title
 * @param message The alert dialog message
 * @param callback The callback function when you click ok button
 */
export function alert(title: string, message: string, callback?: () => void): Modal;

/**
 * Shows an alert dialog according to the specified arguments.
 */
export function alert(): Modal {
    const args = arguments;
    const modal = new Modal();
    const modalOptions = modal.finalOptions;
    const options: ModalOptions = {};
    options.theme = "theme-alert";
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

/**
 * Shows a confirm dialog.
 * @param options The modal options, see [[ModalOptions]] interface
 * @returns A [[Modal]] instance
 */
export function confirm(options: ModalOptions): Modal;
/**
 * Shows a confirm dialog.
 * @param message The confirm message
 * @param callback The callback function when click ok button
 * @returns A [[Modal]] instance
 */
export function confirm(message: string, callback: () => void): Modal;
/**
 * Shows a confirm dialog.
 * @param title The confirm title
 * @param message The confirm message
 * @param callback The callback function when click ok button
 * @returns A [[Modal]] instance
 */
export function confirm(title: string, message: string, callback: () => void): Modal;

/**
 * Shows an confirm dialog according to the specified arguments.
 */
export function confirm(): Modal {
    const args = arguments;
    const modal = new Modal();
    const modalOptions = modal.finalOptions;
    const options: ModalOptions = {
        theme: "theme-confirm",
    };
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

/**
 * Opens a window with iframe element for opening the specified url.
 * @param url The url to open
 * @param title The window title. If empty, show the url
 * @param options The [[ModalOptions]] like {width: '80%', height: '80%'}
 */
export function iframe(url: string, title: string, options?: ModalOptions) : Modal {
    options = {
        content: url,
        theme: "theme-iframe",
        title: title || url,
        ...options,
    };
    const modal = new Modal(options);
    modal.render();
    return modal;
}