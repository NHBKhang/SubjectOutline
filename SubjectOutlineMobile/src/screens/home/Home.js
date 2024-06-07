import { View, ScrollView, StyleSheet } from 'react-native';
import { gStyles } from '../../core/global';
import { memo, useEffect, useState } from 'react';
import { H1 } from '../../components/Header';
import API, { endpoints } from '../../configs/API';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DropDown from 'react-native-paper-dropdown';
import CourseCard from '../../components/cards/CourseCard';
import { ActivityIndicator } from '../../components';

const Home = ({ navigation }) => {
  const [course, setCourse] = useState(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [creditHour, setCreditHour] = useState(0);

  useEffect(() => {
    const loadOutlines = async () => {
      try {
        let res = await API.get(`${endpoints.courses}?credit=${creditHour}`);
        setCourse(res.data.results);
      } catch (ex) {
        setCourse([]);
        console.error(ex);
      }
    };

    loadOutlines();
  }, [creditHour]);

  const goToOutlines = (courseId) => {
    navigation.navigate("Outline", { "courseId": courseId });
  };

  return (
    <View style={gStyles.container}>
      <H1>DANH MỤC MÔN HỌC</H1>
      <ScrollView style={gStyles.scroll}>
        <View style={{ width: '30%', marginStart: 5, marginBottom: 5 }}>
          <DropDown
            label={'Số tín chỉ'}
            mode={'outlined'}
            visible={showDropDown}
            showDropDown={() => setShowDropDown(true)}
            onDismiss={() => setShowDropDown(false)}
            value={creditHour}
            setValue={setCreditHour}
            list={Array.from({ length: 5 }, (_, index) => ({
              label: `${index == 0 ? 'Tất cả' : index}`,
              value: `${index}`,
            }))} />
        </View>

        {course === null ? <ActivityIndicator /> : <>
          {
            course.map(c => (
              <View style={gStyles.row} key={c.id}>

                <TouchableOpacity onPress={() => goToOutlines(c.id)}>
                  <CourseCard
                    title={c.name}
                    enTitle={c.en_name}
                    source={c.image}
                    creditHour={c.credit_hour.total}
                    faculty={c.faculty.name} />
                </TouchableOpacity>
              </View>
            ))
          }
        </>}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({

});

export default memo(Home);