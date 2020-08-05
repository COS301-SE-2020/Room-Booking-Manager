import { AuthenticationContext } from "adal-node";

import { adalConfiguration } from "../constants";

const resource = "https://graph.microsoft.com/";

/**
 * Generate a fully formed uri to use for authentication based on the supplied resource argument
 * @return {string} a fully formed uri with which authentication can be completed.
 */
export function getAuthUrl() {
    return (
        adalConfiguration.authority +
        "/oauth2/authorize" +
        "?client_id=" +
        adalConfiguration.clientID +
        "&response_type=code" +
        "&redirect_uri=" +
        adalConfiguration.redirectUri
    );
}

/**
 * Gets a token for a given resource.
 * @param {string} code An authorization code returned from a client.
 * @param {AcquireTokenCallback} callback The callback function.
 */
export function getTokenFromCode(code) {
    const authContext = new AuthenticationContext(adalConfiguration.authority);
    return new Promise((resolve, reject) => {
        authContext.acquireTokenWithAuthorizationCode(
            code,
            adalConfiguration.redirectUri,
            resource,
            adalConfiguration.clientID,
            adalConfiguration.clientSecret,
            (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            }
        );
    });
}

export function getAppOnlyToken() {
    const authContext = new AuthenticationContext(
        adalConfiguration.authority.replace(
            "common",
            adalConfiguration.tenantID
        )
    );
    return new Promise((resolve, reject) => {
        authContext.acquireTokenWithClientCredentials(
            resource,
            adalConfiguration.clientID,
            adalConfiguration.clientSecret,
            (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            }
        );
    });
}
