export const client = {
    get: (endpoint: string, parameters: { cursor }, callback: (error, response) => void) => {
        if (endpoint === "followers/list") {
            if (parameters.cursor === -1) {
                callback(null, {
                    next_cursor: 1,
                    users: [
                        { screen_name: "user1"},
                        { screen_name: "user2"},
                        { screen_name: "user3"},
                        { screen_name: "user4"},
                        { screen_name: "user5"},
                    ]
                });
            }
            else if (parameters.cursor === 1) {
                callback(null, {
                    next_cursor: 2,
                    users: [
                        { screen_name: "user6"},
                        { screen_name: "user7"},
                        { screen_name: "user8"},
                        { screen_name: "user9"},
                        { screen_name: "user10"},
                    ]
                });
            }
            else if (parameters.cursor === 2) {
                callback(null, {
                    next_cursor: 0,
                    users: [
                        { screen_name: "user11"},
                        { screen_name: "user12"},
                        { screen_name: "user13"},
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
                        { screen_name: "user1"},
                        // { screen_name: "user2"},
                        { screen_name: "user3"},
                        // { screen_name: "user4"},
                        { screen_name: "user5"},
                    ]
                });
            }
            else if (parameters.cursor === 1) {
                callback(null, {
                    next_cursor: 2,
                    users: [
                        { screen_name: "user6"},
                        // { screen_name: "user7"},
                        { screen_name: "user8"},
                        // { screen_name: "user9"},
                        { screen_name: "user10"},
                    ]
                });
            }
            else if (parameters.cursor === 2) {
                callback(null, {
                    next_cursor: 0,
                    users: [
                        { screen_name: "user11"},
                        { screen_name: "user12"},
                        // { screen_name: "user13"},
                        { screen_name: "user14"},
                        { screen_name: "user15"},
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
