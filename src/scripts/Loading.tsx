/** The options for loading component */
export interface LoadingOptions {
    targetEl?: Element | null;
    inline?: boolean;
    text?: string;
    color?: string;
}

/**
 * The loading component class.
 */
export class Loading {
    public static hideGlobal() {
        document.body.querySelectorAll(".bn-loading-overlay").forEach(ele => {
            ele.remove();
        });
    }

    private refEl: HTMLElement | null;
    private options: LoadingOptions | null;

    public constructor(options?: LoadingOptions) {
        this.options = options || null;
        this.refEl = null;
    }

    /**
     * Shows the loading component.
     */
    public show() {
        this.render();
        return this;
    }

    /**
     * Hides the loading component.
     */
    public hide() {
        if (this.options && this.options.targetEl) {
            this.options.targetEl.querySelectorAll(".bn-loading-overlay").forEach(ele => {
                ele.remove();
            });
        } else {
            Loading.hideGlobal();
        }
    }

    private getLoadingEl() : HTMLElement {
        const container = document.createElement("div");
        container.setAttribute("class", "bn-loading-container");

        if (!(this.options && this.options.targetEl)) {
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
            if (this.options.targetEl.querySelectorAll(".bn-loading-overlay").length === 0) {
                this.options.targetEl.appendChild(this.refEl);
                if (this.options.inline) {
                    this.refEl.className += " inline";
                }
            }
        } else {
            if (document.querySelectorAll("body .bn-loading-overlay").length === 0) {
                document.body.appendChild(this.refEl);
            }
        }
    };
}

/**
 * Shows or hides a loading component for page.
 *
 * @param args  false to hide the loading component, or [[LoadingOptions]] interface
 * @returns null if `args` is false, otherwise a [[Loading]] instance
 */
export function loading(args?: boolean | LoadingOptions): Loading | null {
    if (args === false) {
        Loading.hideGlobal();
        return null;
    } else if (typeof args === "object") {
        return new Loading(args).show();
    } else {
        return new Loading().show();
    }
}

/**
 * Shows or hides a loading component for element.
 *
 * @param selector The element selector
 * @param loadingText The loading text
 * @param color The loading component color
 *
 * @returns A instance of [[Loading]] compnent
 */
export function loadingFor(selector: string, loadingText?: string, color?: string): Loading {
    return new Loading({
        targetEl: document.querySelector(selector),
        text: loadingText,
        color,
    }).show();
}