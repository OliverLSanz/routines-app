import React from 'react';
import { useSelector } from 'react-redux'
import { selectActivityById, createOrUnarchiveEntry, archiveOrDeleteEntry } from "../redux"
import activityTypes from './activityTypes'
import { WeekView as BaseWeekView } from '../components'

import { List } from 'react-native-paper'

export function updateEntryThunk( activityId, date ){
  return (dispatch, getState) => {
    const state = getState()
    const activity = selectActivityById( state, activityId )

    const activityType = activityTypes[ activity.type ]
  
    const thunk = activityType.updateEntryThunk
  
    if( thunk ){
      dispatch(thunk(activityId, date))
    }
  }
}

export const TodayScreenItem = ({ activityId, date }) => {
  const activity = useSelector( state => selectActivityById( state, activityId ) )

  const activityType = activityTypes[activity.type]
  const ActivityTypeTodayScreenItem = activityType.TodayScreenItem

  return (
    ActivityTypeTodayScreenItem?
      <ActivityTypeTodayScreenItem activityId={activityId} date={date} />
      : 
      null 
  )
}

export function SelectWeekliesItemDue({ activity, today, isChecked, onCheckboxPress, isSelected, onPress }){
  const activityType = activityTypes[activity.type]
  const ActivityTypeSelectWeekliesItemDue = activityType.SelectWeekliesItemDue

  return (
    ActivityTypeSelectWeekliesItemDue?
      <ActivityTypeSelectWeekliesItemDue activity={activity} today={today} isChecked={isChecked} onCheckboxPress={onCheckboxPress} isSelected={isSelected} onPress={onPress} />
      :
      null
  )
}

export const WeekView = ({ activityId, date, todayChecked }) => {
  const activity = useSelector( state => selectActivityById( state, activityId ) )

  const activityType = activityTypes[activity.type]
  const ActivityTypeWeekView = activityType.WeekView

  return(
    ActivityTypeWeekView?
      <ActivityTypeWeekView activityId={activityId} date={date} todayChecked={todayChecked} />
      : 
      <BaseWeekView dayOfWeek={date.weekday} daysDone={todayChecked=='checked'?[date.weekday]:[]} daysLeft={[]} />
  )
}


/* ATM solely for creating entry of weekly activities when they are selected in the SelectWeekliesScreen */
export function addEntryThunk( activityId, date ){
  return (dispatch, getState) => {
    dispatch(createOrUnarchiveEntry(date, activityId))
  }
}

/* ATM solely for removing entry of weekly activities when they are selected in the SelectWeekliesScreen */
export function removeEntryThunk( activityId, date ){
  return (dispatch, getState) => {
    dispatch(archiveOrDeleteEntry(date, activityId))
  }
}