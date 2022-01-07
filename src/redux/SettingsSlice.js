import { createSlice } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import * as Localization from 'expo-localization'


const initialState = {
    dayStartHour: DateTime.fromObject({hour:0, minute:0}).toISO(),
    newUser: true,
    language: Localization.locale,
    dailyNotificationHour: DateTime.fromObject({hour:9, minute:0}).toISO(),
}

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setDayStartHour(state, action){
            state.dayStartHour = action.payload
        },
        setState(state, action){
            const { newState } = action.payload
            return { ...initialState, ...newState }
        },
        finishOnboarding(state, action){
            state.newUser = false
        },
        setLanguage(state, action) {
            state.language = action.payload
        },
        setDailyNotificationHour(state, action){
            state.dailyNotificationHour = action.payload
        }
    }
})

export const { setDayStartHour, setState, finishOnboarding, setLanguage, setDailyNotificationHour } = settingsSlice.actions

export default settingsSlice.reducer