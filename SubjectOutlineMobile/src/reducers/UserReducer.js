const UserReducer = (currentState, action) => {
    switch (action.type) {
        case "login":
            return action.payload;
        case "logout":
            return null;
    }
    return currentState;
}

export default UserReducer;