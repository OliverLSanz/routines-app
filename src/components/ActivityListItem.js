import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { List, Checkbox, IconButton, Text, ProgressBar } from 'react-native-paper'
import * as Progress from 'react-native-progress';
import { getTodayTime, isActivityRunning, getPreferedExpression, roundValue } from '../util'
import { toggleCompleted, startTimer, stopTimer } from '../redux'
import PlayFilledIcon from '../../assets/play-filled'
import PlayOutlinedIcon from '../../assets/play-outlined'
import PauseFilledIcon from '../../assets/pause-filled'
import PauseOutlinedIcon from '../../assets/pause-outlined'
import { useTranslation } from 'react-i18next'
import { ActivityListItemColors } from '../styles/Colors'

const ActivityListItem = ({ 
  timeGoal,    // number of seconds of the time goal for this activity or null if it is not a timed activity
  name,        // name of the activity
  repeatMode,      // 'daily' or 'weekly'
  weeklyTime,    // time spent this week, not counting today (just used in 'weekly' repeatMode activities)
  completed,   // boolean value
  timesPerWeek, // number of days that the activity should be completed each week
  weeklyTimes, // number of times that the activity has been done this week (counting today)
  intervals, 
  archived,
  id,
  toggleCompleted,
  startTimer,
  stopTimer,
  disabled,
  date
}) => {
  function update(){
    const currentTime = getTodayTime(intervals)
    setTodayTime(currentTime)
    const totalTime = weeklyTime?currentTime.plus(weeklyTime):currentTime
    if(timeGoal && totalTime.as('seconds') >= timeGoal && !completed){
      toggleCompleted({date: date, id: id})
    }
  }

  const { t, i18n } = useTranslation()

  React.useEffect(() => {
    update()
    if (isActivityRunning(intervals)) {
      const intervalId = setInterval(() => {
        update()
      }, 1000)
      return () => clearInterval(intervalId)
    }
  }, [intervals, completed, timeGoal])

  function onPressPlay(){
    if(disabled) return
    startTimer(id)
  }

  function onPressPause(){
    if(disabled) return
    stopTimer(id)
  }

  const current = isActivityRunning(intervals)
  const [todayTime, setTodayTime] = React.useState(getTodayTime(intervals))
  
  const totalTime = weeklyTime?todayTime.plus(weeklyTime):todayTime
  const totalTimes = weeklyTimes?(weeklyTimes+(completed?1:0)):(completed?1:0)

  let leftSlot, rightSlot, description;

  if((!timeGoal && completed)){
    leftSlot = (
      <View style={styles.checkboxView}>
        <Checkbox 
          color='black'
          status='checked'
          onPress={() => {
            if(disabled) return
            toggleCompleted({date: date, id: id})
        }}/>
      </View>
    )
  }else if(weeklyTimes?(totalTimes >= timesPerWeek):false){
    leftSlot = (
      <View style={styles.checkboxView}>
        <Checkbox 
          color='gray'
          status='checked'
          onPress={() => {
            return
        }}/>
      </View>
    )
  }else if(!timeGoal && !completed){
    leftSlot = (
      <View style={styles.checkboxView}>
        <Checkbox 
          color='black'
          uncheckedColor='black'
          status='unchecked' 
          onPress={() => {
            if(disabled) return
            toggleCompleted({date: date, id: id})
        }}  />
      </View>
    )
  }else if(timeGoal && current && !completed){
    leftSlot = <IconButton icon={() => <PauseOutlinedIcon />} onPress={onPressPause} />
  }else if(timeGoal && current && completed){
    leftSlot = <IconButton icon={() => <PauseFilledIcon />} onPress={onPressPause} />
  }else if(timeGoal && completed){
    leftSlot = (
      <IconButton 
        icon={() => <PlayFilledIcon />} 
        onPress={onPressPlay}  
      />)
  }else{
    leftSlot = <IconButton icon={() => <PlayOutlinedIcon />} onPress={onPressPlay} />
  }

  if((repeatMode == 'daily' || repeatMode == 'select') && timeGoal){
    const expression = getPreferedExpression(timeGoal, t)
    description = t('activityListItem.description.todayTimeGoal', { expressionValue: expression.value, expressionUnit: expression.localeUnit })
  }else if(repeatMode=='weekly' && !timeGoal){
    description = t('activityListItem.description.weekCheck', { totalTimes, timesPerWeek })
  }else if(repeatMode=='weekly' && timeGoal){
    const expression = getPreferedExpression(timeGoal, t)
    const weeklyTimeNumber = roundValue(totalTime.as(expression.unit))
    description = t('activityListItem.description.weekTimeGoal', {weeklyTimeNumber, expressionValue: expression.value, expressionUnit: expression.localeUnit})
  }

  if(todayTime.as('seconds') > 0){
    rightSlot = <Text style={styles.timeLabel}>{todayTime.toFormat('hh:mm:ss')}</Text>
  }

  const navigation = useNavigation();

  const progress = Math.min(totalTime.as('seconds') / timeGoal, 1)
  const weeklyProgress = weeklyTime?
    Math.min(weeklyTime.as('seconds') / timeGoal, 1) : 0

  return (
    archived? <></> : 
    <View style={{ backgroundColor: current? ActivityListItemColors.currentActivityBackground : ActivityListItemColors.listItemBackground }}>
      <List.Item
        left={() => leftSlot}
        title={name}
        description={description}
        right={() => rightSlot}
        onPress={() => {
          navigation.navigate('ActivityDetail', {activityId: id, date: date.toISO()})
        }}
      />
      {current?
        <DoubleProgressBar 
          height={4}
          firstColor={ActivityListItemColors.progressBarFirstColor} 
          secondColor={ActivityListItemColors.progressBarSecondColor} 
          backgroundColor={ActivityListItemColors.progressBarBackground} 
          firstProgress={weeklyProgress} 
          secondProgress={progress} />
      : <></> }
    </View>
  );
}

const DoubleProgressBar = ({firstColor, secondColor, backgroundColor, firstProgress, secondProgress, height}) => (
  <View >
    <Progress.Bar progress={secondProgress} width={null} height={height} unfilledColor={backgroundColor} borderRadius={0} borderWidth={0} color={secondColor} />
    <Progress.Bar style={{position: 'absolute'}} progress={firstProgress} height={height} color={firstColor} unfilledColor={ActivityListItemColors.progressBarUnfilledColor} borderWidth={0} width={useWindowDimensions().width} borderRadius={0} />
  </View>
)

const styles = StyleSheet.create({
  checkboxView: {
    padding: 6
  },
  iconButton: {
    margin: 0,
  },
  timeLabel: {
    alignSelf: 'center',
    marginRight: 12,
    fontSize: 15,
  },
})

const actionsToProps = {
  toggleCompleted,
  startTimer,
  stopTimer
}

export default connect(null, actionsToProps)(ActivityListItem);