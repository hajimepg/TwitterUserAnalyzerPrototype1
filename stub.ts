export const client = {
    get: (endpoint: string, parameters: { cursor }, callback: (error, response) => void) => {
        if (endpoint === "followers/list") {
            if (parameters.cursor === -1) {
                callback(null, {
                    next_cursor: 1,
                    users: [
                        { screen_name: "user1", profile_image_url: "http://example.com/user1.png" },
                        { screen_name: "user2", profile_image_url: "http://example.com/user2.png" },
                        { screen_name: "user3", profile_image_url: "http://example.com/user3.png" },
                        { screen_name: "user4", profile_image_url: "http://example.com/user4.png" },
                        { screen_name: "user5", profile_image_url: "http://example.com/user5.png" },
                    ]
                });
            }
            else if (parameters.cursor === 1) {
                callback(null, {
                    next_cursor: 2,
                    users: [
                        { screen_name: "user6", profile_image_url: "http://example.com/user6.png" },
                        { screen_name: "user7", profile_image_url: "http://example.com/user7.png" },
                        { screen_name: "user8", profile_image_url: "http://example.com/user8.png" },
                        { screen_name: "user9", profile_image_url: "http://example.com/user9.png" },
                        { screen_name: "user10", profile_image_url: "http://example.com/user10.png" },
                    ]
                });
            }
            else if (parameters.cursor === 2) {
                callback(null, {
                    next_cursor: 0,
                    users: [
                        { screen_name: "user11", profile_image_url: "http://example.com/user11.png" },
                        { screen_name: "user12", profile_image_url: "http://example.com/user12.png" },
                        { screen_name: "user13", profile_image_url: "http://example.com/user13.png" },
                    ]
                });
            }
            else {
                callback(new Error(`Invalid cursor(${parameters.cursor})`), null);
            }
        }
        else if (endpoint === "friends/list") {
            if (parameters.cursor === -1) {
                callback(null, {
                    next_cursor: 1,
                    users: [
                        { screen_name: "user1", profile_image_url: "http://example.com/user1.png" },
                        // { screen_name: "user2", profile_image_url: "http://example.com/user2.png" },
                        { screen_name: "user3", profile_image_url: "http://example.com/user3.png" },
                        // { screen_name: "user4", profile_image_url: "http://example.com/user4.png" },
                        { screen_name: "user5", profile_image_url: "http://example.com/user5.png" },
                    ]
                });
            }
            else if (parameters.cursor === 1) {
                callback(null, {
                    next_cursor: 2,
                    users: [
                        { screen_name: "user6", profile_image_url: "http://example.com/user6.png" },
                        // { screen_name: "user7", profile_image_url: "http://example.com/user7.png" },
                        { screen_name: "user8", profile_image_url: "http://example.com/user8.png" },
                        // { screen_name: "user9", profile_image_url: "http://example.com/user9.png" },
                        { screen_name: "user10", profile_image_url: "http://example.com/user10.png" },
                    ]
                });
            }
            else if (parameters.cursor === 2) {
                callback(null, {
                    next_cursor: 0,
                    users: [
                        { screen_name: "user11", profile_image_url: "http://example.com/user11.png" },
                        { screen_name: "user12", profile_image_url: "http://example.com/user12.png" },
                        // { screen_name: "user13", profile_image_url: "http://example.com/user13.png" },
                        { screen_name: "user14", profile_image_url: "http://example.com/user14.png" },
                        { screen_name: "user15", profile_image_url: "http://example.com/user15.png" },
                    ]
                });
            }
            else {
                callback(new Error(`Invalid cursor(${parameters.cursor})`), null);
            }
        }
    }
};

export default client;
