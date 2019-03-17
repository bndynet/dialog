import { notify } from "../src";

describe("Notification", () => {
    it("should pop up a message with default styles", () => {
        notify("This is a message");
        expect(document.getElementsByClassName("default").length).toBe(1);
    });

    it("should pop up a success message and and click to close", done => {
        notify("This is a message", "success");
        expect(document.getElementsByClassName("success").length).toBe(1);
        document.querySelector<HTMLElement>(".success").click();
        setTimeout(() => {
            expect(document.getElementsByClassName("success").length).toBe(0);
            done();
        }, 1000);
    });

    it("should limit the message count", done => {
        notify({ message: "message", square: true });
        notify("This is a message");
        notify("This is a message");
        notify("This is a message");
        notify("This is a message");
        notify("This is a message");
        notify("This is a message");
        setTimeout(() => {
            expect(document.getElementsByClassName("notification-item").length).toBe(3);
            done();
        }, 1000);
    });

    it("should close all message after 3000 seconds", done => {
        // jest.useFakeTimers();    // solution instead of `done`
        setTimeout(() => {
            expect(document.getElementsByClassName("notification-item").length).toBe(0);
            done();
        }, 4000);
        // jest.runAllTimers();
    });
});
