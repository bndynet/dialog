import { setup, defaultOptions } from "../src";

describe("Options", () => {
    it("should set default options", () => {
        setup({
            labelOK: "okok",
            theme: "theme-test",
        });

        expect(defaultOptions.labelOK).toBe("okok");
        expect(defaultOptions.theme).toBe("theme-test");
    });
});
