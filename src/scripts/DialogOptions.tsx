
/** All options for dialog */
export interface DialogOptions {
    theme?: string;
    labelOK?: string,
    labelCancel?: string,
    animate?: boolean,
    notificationAutoClose?: boolean;
    notificationClickClose?: boolean;
    notificationCloseDelay?: number;
    notificationTheme?: string;
    notificationPlacement?: string;
    notificationMaxItems?: number;
    notificationSquare?: boolean;
}

/** The default options for dialog */
export let defaultOptions: DialogOptions = {
    labelOK: "OK",
    labelCancel: "Cancel",
    animate: true,
    notificationAutoClose: true,
    notificationClickClose: true,
    notificationCloseDelay: 3000,
    notificationTheme: "default",
    notificationPlacement: "bottom right",
    notificationMaxItems: 3,
    notificationSquare: false,
};

/**
 * Sets global options for dialog.
 *
 * @param options  The dialog options
 */
export function setup(options: DialogOptions) {
    defaultOptions = {...defaultOptions, ...options};
    if (defaultOptions.theme) {
        document.body.classList.add(defaultOptions.theme);
    }
}