export interface LoadingOptions {
    targetEl?: HTMLElement;
    inline?: boolean;
    text?: string;
    color?: string;
}

export class Loading {
    public static globalInstance: Loading | null;

    private refEl: HTMLElement | null;
    private options: LoadingOptions | null;

    constructor(options?: LoadingOptions) {
        this.options = options || null;
        this.refEl = null;
    }

    public show() {
        this.render();
        if (this.isGlobal()) {
            Loading.globalInstance = this;
        }
        return this;
    }

    public hide() {
        if (this.refEl) {
            this.refEl.remove();
            this.refEl = null;
            if (this.isGlobal()) {
                Loading.globalInstance = null;
            }
        }
    }

    private isGlobal(): boolean {
        return !(this.options && this.options.targetEl);
    }

    private getLoadingEl() : HTMLElement {
        const container = document.createElement("div");
        container.setAttribute("class", "bn-loading-container");

        if (this.isGlobal()) {
            const elIcon = document.createElement("i");
            elIcon.setAttribute("class", "bicon bicon-loading");
            if (this.options && this.options.color) {
                elIcon.setAttribute("style", `border-left-color: ${this.options.color}`);
            }
            container.appendChild(elIcon);
        } else {
            const elIcon = document.createElement("div");
            elIcon.setAttribute("class", "loading-element");
            for(let i=1; i<4; i++) {
                const el = document.createElement("div");
                if (this.options && this.options.color) {
                    el.setAttribute("style", `background-color: ${this.options.color}`);
                }
                elIcon.appendChild(el);
            }
            container.appendChild(elIcon);
        }

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

    private render() {
        this.refEl = document.createElement("div");
        this.refEl.setAttribute("class", "bn-loading-overlay");
        this.refEl.appendChild(this.getLoadingEl());
        if (this.options && this.options.targetEl) {
            this.options.targetEl.appendChild(this.refEl);
            if (this.options.inline) {
                this.refEl.className += " inline";
            }
        } else {
            document.body.appendChild(this.refEl);
        }
    };
}

export function loading(args?: boolean | LoadingOptions) {
    if (args === false) {
        if (Loading.globalInstance) {
            Loading.globalInstance.hide();
        }
    } else if (typeof args === "object") {
        return new Loading(args).show();
    } else {
        return new Loading().show();
    }
}