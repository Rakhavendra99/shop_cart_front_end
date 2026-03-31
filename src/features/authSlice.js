import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import constants from "../util/Constants/constants";
import { ACCESS_TOKEN_KEY } from "../util/accessToken";

/** Ensures `userId` is always set (same as `id`) for UI / API consumers. */
function normalizeAuthUser(payload) {
    if (!payload || typeof payload !== "object") return payload;
    const u = { ...payload };
    if (u.id != null && u.userId == null) u.userId = u.id;
    return u;
}

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

const withCreds = { withCredentials: true };

export const LoginUser = createAsyncThunk("user/LoginUser", async (user, thunkAPI) => {
    try {
        const response = await axios.post(
            `${constants.API_BASE_URL}/login`,
            {
                email: user.email,
                password: user.password
            },
            withCreds
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${constants.API_BASE_URL}/me`, withCreds);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const LogOut = createAsyncThunk("user/LogOut", async () => {
    try {
        await axios.delete(`${constants.API_BASE_URL}/logout`, withCreds);
    } finally {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(LoginUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = normalizeAuthUser(action.payload);
            if (action.payload?.accessToken) {
                localStorage.setItem(ACCESS_TOKEN_KEY, action.payload.accessToken);
            }
        });
        builder.addCase(LoginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        // Get User Login
        builder.addCase(getMe.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = normalizeAuthUser(action.payload);
        });
        builder.addCase(getMe.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;