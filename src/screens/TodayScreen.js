import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View } from 'react-native'
import { DayContent, Dialog, Header, SpeechBubble } from '../components'
import { getToday } from '../util'
import { useTranslation } from 'react-i18next'
import { GeneralColor } from '../styles/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { Appbar } from 'react-native-paper'
import { updateLogs, setTutorialState, selectTutorialState } from '../redux'

const TodayScreen = ({ navigation }) => {
  const dispatch = useDispatch()

  function updateDay(){
    const today = getToday(dayStartHour)
    if(date.toISO() != today.toISO()) {
      setDate(today)
      setDayChangeDialogVisible(true)
    }
  }

  const { t, i18n } = useTranslation()

  // selectors
  const tutorialState = useSelector(selectTutorialState)
  const dayStartHour = useSelector(state => state.settings.dayStartHour)
  const today = getToday(dayStartHour)

  const [ date, setDate ] = useState(today)
  const [ dayChangeDialogVisible, setDayChangeDialogVisible ] = useState(false)
  
  useEffect(() => {
    setDate(today)
  }, [today.toISO()])

  // effect to check every minute if current day has changed
  useEffect(() => {
      const intervalId = setInterval(() => {
        updateDay()
      }, 60000)
      return () => clearInterval(intervalId)  // this function executes before running the effect again
  }, [today.toISO(), date.toISO(), dayStartHour])

  useFocusEffect(
    React.useCallback(() => {
      dispatch(updateLogs())
    })
  );

  return (
    <View style={{flex: 1, backgroundColor: GeneralColor.screenBackground}}>
      <Header title={t('today.headerTitle')} navigation={navigation} buttons={
        tutorialState == 'Finished' ? 
          <Appbar.Action icon='cog' onPress={() => {navigation.navigate('Settings')}} color="white" />
          :
          <Appbar.Action icon='cog' color="white" style={{opacity: 0.5}} />
      }/>
      {tutorialState=='TodayScreenIntroduction' || tutorialState=='GoalsScreenIntroduction'?
        <SpeechBubble
          speeches={[
            {id: 0, text: t('tutorial.TodayScreenIntroduction.1')},
            {id: 1, text: t('tutorial.TodayScreenIntroduction.2')},
            {id: 2, text: t('tutorial.TodayScreenIntroduction.3')},
            {id: 3, text: t('tutorial.TodayScreenIntroduction.4'), 
              onTextEnd: () => dispatch(setTutorialState('GoalsScreenIntroduction'))},
          ]}
          bubbleStyle={{height: 80}}
        />
        : null
      }
      {['ActivitiesInTodayScreen', 'ChooseWeekliesIntroduction', 'OneTimeTasksIntroduction', 'TutorialEnding'].includes(tutorialState)?
        <SpeechBubble
          speeches={[
            {id: 0, text: t('tutorial.ActivitiesInTodayScreen.2')},
            {id: 1, text: t('tutorial.ActivitiesInTodayScreen.3')},
            {id: 2, text: t('tutorial.ActivitiesInTodayScreen.4'), 
              onTextEnd: () => {
                dispatch(setTutorialState('ChooseWeekliesIntroduction'))
              }
            },
            {id: 3, text: t('tutorial.ChooseWeekliesIntroduction.1'), 
              onTextEnd: () => {
                dispatch(setTutorialState('OneTimeTasksIntroduction'))
              }
            },
            //TODO: show OneTimeTasks component when the text starts, no when the previous text ends
            {id: 4, text: t('tutorial.OneTimeTasksIntroduction.1'), 
              onTextEnd: () => dispatch(setTutorialState('TutorialEnding'))},
            {id: 5, text: t('tutorial.TutorialEnding.1')},
            {id: 6, text: t('tutorial.TutorialEnding.2')},
            {id: 7, text: t('tutorial.TutorialEnding.3')},
            {id: 8, text: t('tutorial.TutorialEnding.4')},
            {id: 9, text: t('tutorial.TutorialEnding.5')},
            {id: 10, text: ' ', onTextEnd: () => dispatch(setTutorialState('Finished'))}
          ]}
          bubbleStyle={{height: 80}}
        />
        : null
      }
      <DayContent date={date} />
      <Dialog 
        visible={dayChangeDialogVisible} 
        setVisible={setDayChangeDialogVisible}
        title={t("today.dayChangeDialogTitle")}
        body={t("today.dayChangeDialogBody", {date: date.toFormat("dd-MM-yyyy")})}
        confirmLabel={t("today.dayChangeDialogConfirmLabel")}
      />
    </View>
  );
}

export default TodayScreen
