export { default as store } from './store'

export { 
    setGoal, toggleGoal, archiveGoal, selectAllGoals, selectGoalById, 
} from './GoalsSlice'

export { 
    setActivity, toggleActivity, archiveActivity,
    selectAllActivities, selectActivityById, selectActivityByIdAndDate
} from './ActivitySlice'

// TODO: refactor
export { 
    addEntry, // rename to addActivityInstance
    toggleCompleted,
    upsertEntry, // rename to updateActivityInstance
    deleteEntry, // rename to deleteActivityInstance
    startTodayTimer, 
    stopTodayTimer, 
    weekliesSelectedToday,
    selectEntriesByDay, // rename to selectActivityInstancesByDay
    areWeekliesSelectedToday, 
    selectAllWeekEntriesByActivityId, // rename to selectAllWeekInstancesByActivityId 
    selectEntryByActivityIdAndDate, // rename to selectInstanceByActivityIdAndDate
    setRepetitions,
    selectAllActivityEntries,
    selectDailyDurationById,
    getPeriodStats,
    getLifeTimeStats,
} from './LogSlice'  // rename to activityInstancesSlice

export { 
    addTodayTask, toggleTask, areTasksAddedToday, deleteTodayTask, getTodayTasks, tasksAddedToday 
} from './TasksSlice'

export { 
    generateDummyData, updateLogs, importState, archiveOrDeleteEntry, createOrUnarchiveEntry
} from './Thunks'

export { setDayStartHour, finishOnboarding, setLanguage } from './SettingsSlice'

export { 
    selectAllActiveActivities, getWeeklyStats, getTodaySelector,
    selectAllActiveActivitiesByDate, isActiveSelector
} from './selectors'
