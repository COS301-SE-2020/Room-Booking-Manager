const socket = io.connect("http://localhost:3001"); // eslint-disable-line no-undef

// initialize array of notifications in JSON format:
var arrWebhookNotifications = [];

// function to return the notifications:
function getWebhookNotifications() {
    return arrWebhookNotifications;
}

// Socket `notification_received` event handler.
socket.on("notification_received", (notificationData) => {
    if (notificationData) {
        // printing to console
        console.log("\n" + JSON.stringify(notificationData) + "\n");

        // add notification to array
        arrWebhookNotifications.push(notificationData);

        const listItem = document.createElement("div");
        if (notificationData.webLink || notificationData.webUrl) {
            const link = document.createElement("a");
            link.innerText = "Open in application";
            link.href = notificationData.webLink
                ? notificationData.webLink
                : notificationData.webUrl;
            link.target = "_blank";
            listItem.appendChild(link);
            listItem.appendChild(document.createElement("br"));
        }
        if (notificationData.sender) {
            const primaryText = document.createElement("span");
            primaryText.innerText = notificationData.sender.emailAddress.name;
            listItem.appendChild(primaryText);
            listItem.appendChild(document.createElement("br"));
        }

        const secondaryText = document.createElement("span");
        secondaryText.innerText = notificationData.subject
            ? notificationData.subject
            : JSON.stringify(notificationData);
        listItem.appendChild(secondaryText);

        document.getElementById("notifications").appendChild(listItem);

        for (var x = 0; x < arrWebhookNotifications.length; x++) {
            console.log(
                "\n\n\nPrinting " +
                    x +
                    " = " +
                    JSON.stringify(
                        arrWebhookNotifications[x].sender.emailAddress.name
                    ) +
                    "\n And Length = " +
                    arrWebhookNotifications.length +
                    "\n"
            );
        }
    }
});

// When the page first loads, create the socket room.
const subscriptionId = getQueryStringParameter("subscriptionId");
socket.emit("create_room", subscriptionId);
document.getElementById("subscriptionId").innerText = subscriptionId;

document.getElementById("signOutButton").onclick = () => {
    window.location.href = "/signout/" + subscriptionId;
};

function getQueryStringParameter(paramToRetrieve) {
    const params = document.URL.split("?")[1].split("&");

    for (let i = 0; i < params.length; i++) {
        const singleParam = params[i].split("=");
        if (singleParam[0] === paramToRetrieve) return singleParam[1];
    }
    return null;
}
