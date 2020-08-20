const assert = require("chai").assert;
const expect = require("chai").expect;
const request = require("supertest");
const GlobalOptimization = require("../GlobalOptimization");

const port = process.env.PORT || 65001;

describe("GlobalOptimization Test", function () {
    var B2BEvents = {
        Events: [
            {
                CurrentMeetingID: "24",
                CurrentMeetingRoom: "1S2",
                Attendees: ["adelev@teamthreshold.onmicrosoft.com"],
            },
        ],
    };

    it("checkBackToBack() should return a boolean", () => {
        return GlobalOptimization.checkBackToBack(B2BEvents).then((result) => {
            expect(result).to.be.an("boolean");
        });
    });

    it("getBackToBackList() should return an array", () => {
        return GlobalOptimization.getBackToBackList().then((result) => {
            expect(result).to.be.an("object");
        });
    });
});
