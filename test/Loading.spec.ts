import { loading, loadingFor, Loading } from "../src/scripts/Loading";

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

    it("should render the loading element for specified element using constructor", () => {
        const box = document.createElement("div");
        box.setAttribute("id", "box");
        document.body.appendChild(box);
        const l = new Loading({
            targetEl: document.querySelector("#box"),
            inline: true,
            color: "#ff0000",
        }).show();
        expect(document.querySelectorAll(".bn-loading-container").length).toBe(1);
        l.hide();
        expect(document.querySelectorAll(".bn-loading-container").length).toBe(0);
    });

    it("should render the loading element for specified element using `loadingFor` method", () => {
        const box = document.createElement("div");
        box.setAttribute("id", "box");
        document.body.appendChild(box);
        const l = loadingFor("#box");
        expect(document.querySelectorAll(".bn-loading-container").length).toBe(1);
        l.hide();
        expect(document.querySelectorAll(".bn-loading-container").length).toBe(0);
    });
});
