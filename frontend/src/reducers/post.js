import { 
    CREATE_POST_SUCCESS,
    CREATE_POST_FAIL
} from '../actions/types';

const initialState = {
    isPostCreated: false
};

export default function post(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case CREATE_POST_SUCCESS:
            return {
                isPostCreated: true
            }
        case CREATE_POST_FAIL:
            return {
                isPostCreated: false
            }
        default:
            return state
    }
}