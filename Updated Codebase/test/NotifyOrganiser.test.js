const assert = require("chai").assert;
const expect = require("chai").expect;
const request = require("supertest");
const NotifyOrganiser = require("../NotifyOrganiser");

const port = process.env.PORT || 65001;

describe("NotifyOrganiser Test", function () {
    var Amenity = "Whiteboard";
    var RoomName = "Mississippi";
    var extractedDetails = { Organizer: "adelev@teamthreshold.onmicrosoft.com" };

    it("sendOrganiserBookingNotification() should return a boolean", () => {
        return NotifyOrganiser.sendOrganiserBookingNotification(extractedDetails, RoomName, Amenity).then((result) => {
            expect(result).to.be.an("boolean");
        });
    });
});
