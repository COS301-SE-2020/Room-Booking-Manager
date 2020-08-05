exports.adalConfiguration = {
    authority: "https://login.microsoftonline.com/common",
    clientID: "af50279a-b342-40f8-9b9e-040f383fcc0f",
    clientSecret: "c-3JXS.vpq.PCYO2xmnvH1QIf-al_~iI30",
    tenantID: "0f5281ec-d7fa-424d-86d7-2e2bca5630dd",
    redirectUri: "http://localhost:3000/callback",
};

exports.subscriptionConfiguration = {
    changeType: "Created",
    notificationUrl: "https://fd523294d5ba.ngrok.io/listen",
    resource: "me/mailFolders('Inbox')/messages",
    clientState: "cLIENTsTATEfORvALIDATION",
    includeResourceData: false,
};

exports.certificateConfiguration = {
    certificateId: "myCertificateId",
    relativeCertPath: "./certificate.pem",
    relativeKeyPath: "./key.pem",
    password: "Password123",
}; // the certificate will be generated during the first subscription creation, production solutions should rely on a certificate store
