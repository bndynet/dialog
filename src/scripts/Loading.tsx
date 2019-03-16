import { DialogOptions } from './DialogOptions';

export interface LoadingOptions {
    text?: string;
    color?: string;
}

export class Loading {
    public static hiden() {
        if (Loading.refContainer) {
            Loading.refContainer.remove();
            Loading.refContainer = null;
        }
    }

    private static refContainer: HTMLElement | null;
    private options: LoadingOptions | undefined;

    constructor(options?: LoadingOptions) {
        this.options = options;
    }

    public show() {
        Loading.refContainer = Loading.refContainer || this.renderOverlay();
        Loading.refContainer.appendChild(this.getLoadingEl());
        return this;
    }

    public hide() {
        Loading.hiden();
    }

    private getLoadingEl() : HTMLElement {
        const container = document.createElement("div");
        container.setAttribute("class", "bn-loading-container");

        const elIcon = document.createElement("i");
        elIcon.setAttribute("class", "bicon bicon-loading");
        if (this.options && this.options.color) {
            elIcon.setAttribute("style", `border-left-color: ${this.options.color}`);
        }
        container.appendChild(elIcon);

        if (this.options && this.options.text) {
            container.className += " has-text";
            const elText = document.createElement("div");
            elText.setAttribute("class", "loading-text");
            elText.innerText = this.options.text;
            if (this.options.color) {
                elText.setAttribute("style", `color: ${this.options.color}`);
            }
            container.appendChild(elText);
        }
        return container;
    }

    private renderOverlay = (): HTMLElement => {
        const ele = document.createElement("div");
        ele.setAttribute("class", "bn-loading-overlay");
        return document.body.appendChild(ele);
    };
}

export function loading(args?: boolean | LoadingOptions) {
    if (args === false) {
        Loading.hiden();
    } else if (typeof args === "object") {
        return new Loading(args).show();
    } else {
        return new Loading().show();
    }
}