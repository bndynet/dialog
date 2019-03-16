import { loading } from "../src/scripts/Loading";

describe("Loading", () => {
    it("should render the loading element and can be closed", () => {
        loading();
        expect(document.querySelectorAll(".bn-loading-container").length).toBe(1);
        loading(false);
        expect(document.querySelectorAll(".bn-loading-container").length).toBe(0);
    });

    it("should render the loading element with multiple parameters", () => {
        const el = loading({ text: "loading", color: "#ff0000" });
        expect(document.querySelectorAll(".bn-loading-container").length).toBe(1);
        expect(document.querySelectorAll(".loading-text").length).toBe(1);
        el.hide();
        expect(document.querySelectorAll(".bn-loading-container").length).toBe(0);
    });
});
