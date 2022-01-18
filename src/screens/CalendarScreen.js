import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native'
import { withTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next'
import { Header } from '../components';
import { Calendar } from '../components/index'

const CalendarScreen = withTheme(({ navigation, theme }) => {  
  const { t, i18n } = useTranslation()

  return (
    <View style={{
      flex: 1, 
      backgroundColor: theme.colors.background, 
    }}>
      <Header title={t('calendar.headerTitle')} navigation={navigation}/>
      <Calendar
        onDayPress={weekDate => navigation.navigate('CalendarWeekView', {date: weekDate.toISO()})}
        onDayLongPress={dayDate => navigation.navigate('CalendarDayView', {date: dayDate.toISO()})}
      />
    </View>
  );
})

const mapStateToProps = (state) => ({ state })

const actionsToProps = {
}

export default connect(mapStateToProps, actionsToProps)(CalendarScreen);
