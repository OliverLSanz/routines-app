import { DateTime } from 'luxon'
import { selectAllActivities,  createActivity } from './ActivitySlice'
import { selectGoalById, createGoal } from './GoalsSlice'
import { 
  deleteOneTodaysEntry, upsertEntry, selectTodayEntryByActivityId, selectLogById, 
  createLog, addEntry, sortTodayLog
} from './LogSlice'
import { getToday } from './../util'


export function generateDummyData(){
  return function(dispatch, getState){
    const { dayStartHour } = getState().settings
    const today = getToday(dayStartHour)
    dispatch(createGoal({name: 'dummy goal'}))
    dispatch(createLog({date: today}))
    dispatch(createLog({date: today.plus({day: -1})}))
    dispatch(createLog({date: today.plus({day: -2})}))
    // Daily activities
    dispatch(createActivity({name: 'Social Media', goalId: '0', goal: 'time', timeGoal: 10800, repeatMode: 'daily'}))
    dispatch(createActivity({name: 'Call a pal', goalId: '0', goal: 'check', repeatMode: 'daily'}))
    dispatch(createActivity({name: 'App work', goalId: '0', goal: 'time', timeGoal: 10800, repeatMode: 'daily'}))
    dispatch(createActivity({name: 'Watch anime', goalId: '0', goal: 'time', timeGoal: 10800, repeatMode: 'daily'}))   
    dispatch(createActivity({name: 'Play guitar', goalId: '0', goal: 'time', timeGoal: 3600, repeatMode: 'daily'}))
    dispatch(createActivity({name: 'Anki', goalId: '0', goal: 'check', repeatMode: 'daily'}))
    dispatch(addEntry({date: today, entry: {intervals: [{startDate: '2021-03-20T10:53:26.690+01:00'}], completed: false, id: 2, archived: false }}))
    dispatch(addEntry({date: today, entry: {intervals: [{startDate: '2021-03-20T10:53:26.690+01:00', endDate: '2021-03-20T11:03:14.938+01:00'}], completed: false, id: 3, archived: false }}))
    dispatch(addEntry({date: today, entry: {intervals: [{startDate: '2021-03-20T10:53:26.690+01:00', endDate: '2021-03-20T11:53:26.690+01:00'}], completed: true, id: 4, archived: false }}))
    dispatch(addEntry({date: today, entry: {intervals: [], completed: true, id: 5, archived: false }}))

    // weekly activities
    dispatch(createActivity({name: 'Call a pal', goalId: '0', goal: 'check', timesPerWeek: 3, repeatMode: 'weekly'}))
    dispatch(addEntry({date: today.plus({day: -1}), entry: {intervals: [{startDate: '2021-03-20T10:53:26.690+01:00', endDate: '2021-03-20T11:03:14.938+01:00'}], completed: true, id: 6, archived: false }}))
    dispatch(addEntry({date: today.plus({day: -2}), entry: {intervals: [{startDate: '2021-03-20T10:53:26.690+01:00', endDate: '2021-03-20T11:03:14.938+01:00'}], completed: true, id: 6, archived: false }}))
    dispatch(createActivity({name: 'Social Media', goalId: '0', goal: 'time', timeGoal: 3, repeatMode: 'weekly'}))
    dispatch(addEntry({date: today.plus({day: -1}), entry: {intervals: [{startDate: '2021-03-20T10:53:26.690+01:00', endDate: '2021-03-20T10:53:27.690+01:00'}], completed: true, id: 7, archived: false }}))
    dispatch(addEntry({date: today.plus({day: -2}), entry: {intervals: [{startDate: '2021-03-20T10:53:26.690+01:00', endDate: '2021-03-20T10:53:27.690+01:00'}], completed: true, id: 7, archived: false }}))
  }
}

export function updateLogs(){
  return function(dispatch, getState){
    const state = getState()
    const { dayStartHour } = state.settings
    const today = getToday(dayStartHour)
    
    if(!selectLogById(state, today)){ 
      dispatch(createLog({date: today}))
    }

    for(let activity of selectAllActivities(state)){
      const goal = selectGoalById(state, activity.goalId)
      const oldLog = selectTodayEntryByActivityId(state, activity.id)

      if(dueToday(today, activity, goal)){
        if(oldLog){
          dispatch(upsertEntry({date: today, entry: { ...oldLog, archived: false }}))
        }else{
          const entry = newEntry(activity)
          dispatch(addEntry({date: today, entry}))
        }
      }else{
        if(oldLog?.intervals || oldLog?.completed){
          dispatch(upsertEntry({date: today, entry: { ...oldLog, archived: true }}))
        }else if(oldLog){
          dispatch(deleteOneTodaysEntry(oldLog.id))
        }
      }
    }
    dispatch(sortTodayLog())
  }
}

function newEntry(activity){
  return(
    {
      intervals: [], 
      completed: false, 
      id: activity.id,
      archived: false
    }
  )
}

function dueToday(today, activity, activityGoal){
  if(activity.archived || activityGoal.archived){
    return false
  }
  if(!activity.active || !activityGoal.active){
    return false
  }
  if(activity.repeatMode == 'daily'){
    return true
  }
  if(activity.repeatMode == 'weekly'){
    return true
  }
  if(activity.repeatMode == 'select'){
    if(activity.weekDays[today.weekday]){
      return true
    }
  }
  return false
}



