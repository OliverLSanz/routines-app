import React from 'react';
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { View, ScrollView } from 'react-native'
import { Card, Title, Paragraph, withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import { ActivityList, BottomScreenPadding, ViewHighlighter } from '../components'
import { SelectWeekliesListItem, SelectTasksListItem, TaskList, DeleteDialog, InfoCard } from '../components';
import { 
  areWeekliesSelectedToday, areTasksAdded, selectEntriesByDay, selectTutorialState
} from '../redux'
import { areThereWeeklyActivities, areTherePendingWeeklyActivities } from '../activityHandler'
import { useTranslation } from 'react-i18next'
import { getToday } from '../util'
import tutorialStates from '../tutorialStates'
import Animated, { Layout } from 'react-native-reanimated'

const FutureWarning = () => {
  const { t, i18n } = useTranslation()

  return (
      <InfoCard 
        title={t("dayContent.futureWarningTitle")}
        paragraph={t("dayContent.futureWarningSubtitle")} 
      />
  )
}

const EmptyPastWarning = () => {
  const { t, i18n } = useTranslation()

  return (
    <InfoCard 
      title={t("dayContent.emptyPastWarningTitle")}
      paragraph={t("dayContent.emptyPastWarningSubtitle")} 
    />
  )
}

const DayContent = withTheme(({ theme, date }) => {
  
  // setup hooks
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()

  // selectors
  // using getToday because on day change getTodaySelector was still returning the previous day
  const today      = getToday(useSelector(state => state.settings.dayStartHour))
  const entryList  = useSelector((state) => selectEntriesByDay(state, date))
  const tasksAdded = useSelector(state => areTasksAdded(state, date))
  const areWeekliesSelectedTodayResult = useSelector(areWeekliesSelectedToday)
  const areTherePendingWeeklyActivitiesResult = useSelector((state) => areTherePendingWeeklyActivities(state, date))
  const areThereWeeklyActivitiesResult = useSelector(areThereWeeklyActivities)
  const tutorialState = useSelector(selectTutorialState)

  // compute values
  const timeStatus = (
    today.toISO() == date.toISO() ? 'today' :
    today > date ? 'past' :
    'future'
  )

  const weekliesSelector = (
    timeStatus != 'today' ? 'hidden' :
    areWeekliesSelectedTodayResult? 'checked' :
    areTherePendingWeeklyActivitiesResult? 'unchecked' :
    areThereWeeklyActivitiesResult? 'allcompleted' :
    'hidden'
  )

  const tasksSelector = (
    timeStatus != 'today' ? 'hidden' :
    tasksAdded ? 'checked' :
    'unchecked'
  )
  
  const completedActivities = entryList.filter(entry => !entry.archived && entry.completed)
  const pendingActivities   = entryList.filter(entry => !entry.archived && !entry.completed)

  return (
    <Animated.View style={{flex: 1}} layout={Layout.delay(100)}>
      <ScrollView style={{flex: 1}}>
        { timeStatus == 'past' && completedActivities.length == 0 && pendingActivities.length == 0 ? <EmptyPastWarning /> : null }
        { timeStatus == 'future' ? <FutureWarning /> : null }
        <ActivityList data={pendingActivities} date={date} />
        <TaskList date={date} show='pending' />
        { weekliesSelector=='unchecked' || 
            tutorialState >= tutorialStates.ChooseWeekliesIntroduction 
            && tutorialState < tutorialStates.Finished
            && weekliesSelector!='checked' ?
        <SelectWeekliesListItem date={date} checked={false} navigation={navigation} disabled={weekliesSelector=='hidden'} style={tutorialState == tutorialStates.ChooseWeekliesIntroduction?{backgroundColor: theme.colors.primaryContainer} : {}} />
        : <></> }
        { tasksSelector == 'unchecked' && tutorialState >= tutorialStates.OneTimeTasksIntroduction ?
          <SelectTasksListItem checked={false} onPress={() => {navigation.navigate('AddTasks')}} style={tutorialState == tutorialStates.OneTimeTasksIntroduction?{backgroundColor: theme.colors.primaryContainer} : {}} />
          : <></> 
        }
        <ActivityList data={completedActivities} date={date} />
        <TaskList date={date} show='completed' />
        { weekliesSelector == 'checked'?
        <SelectWeekliesListItem date={date} checked={true} navigation={navigation}/>
        : <></> }
        { weekliesSelector == 'allcompleted'?
        <SelectWeekliesListItem date={date} checked={true} navigation={navigation} color={theme.colors.placeholder}/>
        : <></> }
        { tasksSelector == 'checked' && tutorialState >= tutorialStates.OneTimeTasksIntroduction ?
          <SelectTasksListItem checked={true} onPress={() => {navigation.navigate('AddTasks')}}/>
          : <></> }
        <BottomScreenPadding />  
      </ScrollView>
    </Animated.View>
  );
})

export default DayContent
