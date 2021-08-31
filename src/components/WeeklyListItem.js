import React from 'react';
import { useSelector } from 'react-redux';
import { View, FlatList } from 'react-native';
import { GeneralColor, SelectWeekliesColor } from '../styles/Colors';
import { Header, Checkbox } from '../components';
import { useTranslation } from 'react-i18next';
import { Appbar, List, Text } from 'react-native-paper';
import { selectEntryByActivityIdAndDate, selectAllWeekEntriesByActivityId, addEntry, selectActivityEntities, deleteEntry, weekliesSelectedToday, upsertEntry, archiveOrDeleteEntry, createOrUnarchiveEntry } from '../redux';
import { extractActivityList, getToday, getWeeklyStats, getPreferedExpression, newEntry, selectAllActiveActivities } from '../util';
import Duration from 'luxon/src/duration.js'
import { WeekView } from '../components';

const WeeklyListItem = ({name, description, id, checkboxStatus, onCheckboxPress, checkboxColor, selected, onPress, date}) => {
  // if checkboxStatus is null, check if there is already a log for this activity and day
  let status = checkboxStatus
  if( !status ){
    const entry = useSelector((state) => selectEntryByActivityIdAndDate(state, id, date))
    if( entry && !entry.archived ){
      status = 'checked'
    }else{
      status = 'unchecked'
    }
  }

  const leftSlot = (
    <Checkbox 
      color={checkboxColor}
      uncheckedColor={checkboxColor}
      status={status}
      onPress={() => onCheckboxPress(status=='checked'?'unchecked':'checked')}
    />
  )

  return (
    <List.Item 
      left={() => leftSlot}
      title={name}
      description={description}
      style={{
        backgroundColor: selected?GeneralColor.selectedSurface:'white'
      }}
      onPress={onPress}
    />
  )
}

export default WeeklyListItem