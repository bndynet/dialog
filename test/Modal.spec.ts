import { alert, confirm, Modal, iframe, element } from "../src";

describe("Modal", () => {
    it("use constructor to build modal and should show the tips", () => {
        let modal = new Modal({
            width: 100,
            height: "80%",
            title: "title",
            tip: "help",
            content: "content",
        });
        modal = new Modal({
            width: 100,
            height: 100,
            title: "title",
            tip: "help",
            content: "content",
        });
        modal.render();
        expect(document.querySelectorAll(".tip").length).toBe(1);
        modal.close();
    });

    it("should render an overlay div", () => {
        const modal = alert("title", "message");
        expect(document.querySelectorAll(".bn-modal-overlay").length).toBe(1);
        modal.close();
        expect(document.querySelectorAll(".bn-modal-overlay").length).toBe(0);
    });

    it("should close when click &times icon", () => {
        alert("title", "message", () => {
            setTimeout(() => {
                expect(document.querySelectorAll(".bn-modal").length).toBe(0);
            }, 100);
        });
        expect(document.querySelectorAll(".bn-modal").length).toBe(1);
        document.querySelector<HTMLElement>("[aria-label='Close']").click();
    });

    it("should not call onClosed method when onClosing method returns false", () => {
        const fnClosing = jest.fn(() => false);
        const fnClosed = jest.fn();
        const modal = new Modal({
            onClosing: fnClosing,
            onClosed: fnClosed,
        });
        modal.close();
        expect(fnClosing.mock.calls.length).toBe(1);
        expect(fnClosed.mock.calls.length).toBe(0);
    });

    it("should cover closing and closed methods when onClosing method returns true", () => {
        let fnClosing = jest.fn(() => true);
        let fnClosed = jest.fn();
        let modal = new Modal({
            onClosing: fnClosing,
            onClosed: fnClosed,
        });
        modal.close();
        expect(fnClosing.mock.calls.length).toBe(1);
        expect(fnClosed.mock.calls.length).toBe(1);

        fnClosing = null;
        fnClosed = jest.fn();
        modal = new Modal({
            onClosing: fnClosing,
            onClosed: fnClosed,
        });
        modal.close();
        expect(fnClosed.mock.calls.length).toBe(1);
    });

    it("should just render one overlay div when multiple Modals opened, and remove the overlay div when last Modal closed", () => {
        const Modal1 = alert("message");
        const Modal2 = confirm("message", () => {
            // nothing to do
        });
        const Modal3 = confirm("title", "message", () => {
            // nothing to do
        });
        expect(document.querySelectorAll(".bn-modal-overlay").length).toBe(1);
        Modal1.close();
        expect(document.querySelectorAll(".bn-modal-overlay").length).toBe(1);
        Modal2.close();
        expect(document.querySelectorAll(".bn-modal-overlay").length).toBe(1);
        Modal3.close();
        expect(document.querySelectorAll(".bn-modal-overlay").length).toBe(0);
    });

    it("should render multiple buttons for Modal", () => {
        const modal = new Modal({
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
        modal.render();
        expect(document.querySelectorAll("button").length).toBe(3);
        modal.close();
    });

    describe("#alert", () => {
        it("should close alert when button clicked", () => {
            alert("title", "message", () => {
                setTimeout(() => {
                    expect(document.querySelectorAll(".bn-modal").length).toBe(0);
                }, 100);
            });
            expect(document.querySelectorAll(".bn-modal").length).toBe(1);
            document.querySelector<HTMLElement>(".btn").click();

            alert("title", () => {
                setTimeout(() => {
                    expect(document.querySelectorAll(".bn-modal").length).toBe(0);
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
            expect(document.querySelectorAll(".bn-modal").length).toBe(1);
            document.querySelectorAll<HTMLElement>(".btn")[0].click();
            expect(document.querySelectorAll(".bn-modal").length).toBe(0);

            confirm("confirm", () => {
                // nothing
            });
            expect(document.querySelectorAll(".bn-modal").length).toBe(1);
            document.querySelectorAll<HTMLElement>(".btn")[1].click();
            expect(document.querySelectorAll(".bn-modal").length).toBe(0);

            confirm("confirm", "confirm message", () => {
                // nothing
            });
            expect(document.querySelectorAll(".bn-modal").length).toBe(1);
            document.querySelectorAll<HTMLElement>(".btn")[1].click();
            expect(document.querySelectorAll(".bn-modal").length).toBe(0);
        });
    });

    describe("#iframe", () => {
        it("should render an iframe element for external url", () => {
            const modal = iframe("http://bndy.net", "External URL");
            expect(document.querySelectorAll(".theme-iframe").length).toBe(1);
            modal.close();
        });
    });

    describe("#element", () => {
        it("should render specified element as the modal dialog content", () => {
            const modalContent = document.createElement("div");
            modalContent.id = "modal-form";
            document.body.appendChild(modalContent);
            expect(document.querySelectorAll("#modal-form").length).toBe(1);
            expect(document.querySelectorAll(".bn-modal #modal-form").length).toBe(0);
            const modal = element("modal-form", "Element Modal");
            expect(document.querySelectorAll(".bn-modal #modal-form").length).toBe(1);
            modal.close();
            expect(document.querySelectorAll("#modal-form").length).toBe(1);
        });
    });
});
