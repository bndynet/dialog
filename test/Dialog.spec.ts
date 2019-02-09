import { alert, confirm, Dialog } from "../src";

describe("Dialog", () => {
    it("should work when options set", () => {
        Dialog.setOptions({
            theme: "custom-theme",
            width: 100,
            height: 100,
            tip: "tip message",
        });
        const dialog = new Dialog({
            buttons: [],
        });
        expect(dialog.finalOptions.theme).toBe("custom-theme");
        expect(dialog.finalOptions.buttons.length).toBe(0);
        dialog.close();
    });

    it("should render an overlay div", () => {
        const dialog = alert("title", "message");
        expect(document.querySelectorAll(".dialog-overlay").length).toBe(1);
        dialog.close();
        expect(document.querySelectorAll(".dialog-overlay").length).toBe(0);
    });

    it("should close when click &times icon", () => {
        alert("title", "message", () => {
            setTimeout(() => {
                expect(document.querySelectorAll(".dialog").length).toBe(0);
            }, 100);
        });
        expect(document.querySelectorAll(".dialog").length).toBe(1);
        document.querySelector<HTMLElement>("[aria-label='Close']").click();
    });

    it("should not call onClosed method when onClosing method returns false", () => {
        const fnClosing = jest.fn(() => false);
        const fnClosed = jest.fn();
        const dialog = new Dialog({
            onClosing: fnClosing,
            onClosed: fnClosed,
        });
        dialog.close();
        expect(fnClosing.mock.calls.length).toBe(1);
        expect(fnClosed.mock.calls.length).toBe(0);
    });

    it("should cover closing and closed methods when onClosing method returns true", () => {
        let fnClosing = jest.fn(() => true);
        let fnClosed = jest.fn();
        let dialog = new Dialog({
            onClosing: fnClosing,
            onClosed: fnClosed,
        });
        dialog.close();
        expect(fnClosing.mock.calls.length).toBe(1);
        expect(fnClosed.mock.calls.length).toBe(1);

        fnClosing = null;
        fnClosed = jest.fn();
        dialog = new Dialog({
            onClosing: fnClosing,
            onClosed: fnClosed,
        });
        dialog.close();
        expect(fnClosed.mock.calls.length).toBe(1);
    });

    it("should just render one overlay div when multiple dialogs opened, and remove the overlay div when last dialog closed", () => {
        const dialog1 = alert("message");
        const dialog2 = confirm("message", () => {
            // nothing to do
        });
        const dialog3 = confirm("title", "message", () => {
            // nothing to do
        });
        expect(document.querySelectorAll(".dialog-overlay").length).toBe(1);
        dialog1.close();
        expect(document.querySelectorAll(".dialog-overlay").length).toBe(1);
        dialog2.close();
        expect(document.querySelectorAll(".dialog-overlay").length).toBe(1);
        dialog3.close();
        expect(document.querySelectorAll(".dialog-overlay").length).toBe(0);
    });

    it("should render multiple buttons for dialog", () => {
        const dialog = new Dialog({
            buttons: [
                {
                    label: "a",
                    css: "",
                    style: "padding: 10px",
                },
                {
                    label: "b",
                    css: "",
                    style: "padding: 10px",
                },
                {
                    label: "c",
                    css: "",
                    style: "padding: 10px",
                },
            ],
            height: "50%",
            theme: "",
            content: null,
        });
        dialog.render();
        expect(document.querySelectorAll("button").length).toBe(3);
        dialog.close();
    });

    describe("#alert", () => {
        it("should close alert when button clicked", () => {
            alert("title", "message", () => {
                setTimeout(() => {
                    expect(document.querySelectorAll(".dialog").length).toBe(0);
                }, 100);
            });
            expect(document.querySelectorAll(".dialog").length).toBe(1);
            document.querySelector<HTMLElement>(".btn").click();

            alert("title", () => {
                setTimeout(() => {
                    expect(document.querySelectorAll(".dialog").length).toBe(0);
                }, 100);
            });
            document.querySelector<HTMLElement>(".btn").click();
        });
    });

    describe("#confirm", () => {
        it("should close when both of buttons clicked", () => {
            confirm("confirm", () => {
                // nothing
            });
            expect(document.querySelectorAll(".dialog").length).toBe(1);
            document.querySelectorAll<HTMLElement>(".btn")[0].click();
            expect(document.querySelectorAll(".dialog").length).toBe(0);

            confirm("confirm", () => {
                // nothing
            });
            expect(document.querySelectorAll(".dialog").length).toBe(1);
            document.querySelectorAll<HTMLElement>(".btn")[1].click();
            expect(document.querySelectorAll(".dialog").length).toBe(0);

            confirm("confirm", "confirm message", () => {
                // nothing
            });
            expect(document.querySelectorAll(".dialog").length).toBe(1);
            document.querySelectorAll<HTMLElement>(".btn")[1].click();
            expect(document.querySelectorAll(".dialog").length).toBe(0);
        });
    });
});
