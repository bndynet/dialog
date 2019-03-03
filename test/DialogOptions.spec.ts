import { setup, defaultOptions } from "../src";

describe("Options", () => {
    it("should set default options", () => {
        setup({
            labelOK: "okok",
        });

        expect(defaultOptions.labelOK).toBe("okok");
    });
});
