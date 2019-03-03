export interface DialogOptions {
    labelOK?: string,
    labelCancel?: string,
    notificationAutoClose?: boolean;
    notificationClickClose?: boolean;
    notificationCloseDelay?: number;
    notificationTheme?: string;
    notificationPlacement?: string;
    notificationMaxItems?: number;
    notificationSquare?: boolean;
}

export let defaultOptions: DialogOptions = {
    labelOK: "OK",
    labelCancel: "Cancel",
    notificationAutoClose: true,
    notificationClickClose: true,
    notificationCloseDelay: 3000,
    notificationTheme: "default",
    notificationPlacement: "bottom right",
    notificationMaxItems: 3,
    notificationSquare: false,
};

export function setup(options: DialogOptions) {
    defaultOptions = {...defaultOptions, ...options};
}