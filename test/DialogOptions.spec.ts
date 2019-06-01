import { setup, defaultOptions, setTheme } from "../src";

describe("Options", () => {
    it("should set default options", () => {
        setup({
            labelOK: "okok",
            theme: "theme-test",
        });

        expect(defaultOptions.labelOK).toBe("okok");
        expect(defaultOptions.theme).toBe("theme-test");
    });

    it("should toggle themes", () => {
        setTheme("theme1");
        expect(document.body.classList.contains("theme1")).toBe(true);
        setTheme("theme2");
        expect(document.body.classList.contains("theme2")).toBe(true);
    });
});
