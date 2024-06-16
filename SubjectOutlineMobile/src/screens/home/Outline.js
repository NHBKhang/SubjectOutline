import { View, ScrollView } from 'react-native';
import { gStyles } from '../../core/global';
import { memo, useEffect, useState } from 'react';
import { H1, ActivityIndicator, SearchBar, Dropdown } from '../../components';
import API, { endpoints } from '../../configs/API';
import { TouchableOpacity } from 'react-native-gesture-handler';
import OutlineCard from '../../components/cards/OutlineCard';

const Outline = ({ route, navigation }) => {
  const courseId = route.params?.courseId;

  const [searchQuery, setSearchQuery] = useState('');
  const [yearQuery, setYearQuery] = useState('');
  const [outlines, setOutlines] = useState(null);
  const [years, setYears] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);

  useEffect(() => {
    const loadOutlines = async () => {
      try {
        let res = await API.get(
          `${endpoints['subject-outlines']}?course_id=${courseId}&&q=${searchQuery}&&years=${yearQuery}`);
        setOutlines(res.data.results);
      } catch (ex) {
        setOutlines([]);
        console.error(ex);
      }
    }
    loadOutlines();


  }, [courseId, searchQuery, yearQuery]);

  useEffect(() => {
    const loadYears = async () => {
      try {
        let res = await API.get(endpoints.years);
        let list = [{ value: 0, label: 'Tất cả' }];
        let data = res.data.map(d => ({
          value: `${d.id}`,
          label: d.year
        }));
        setYears([...list, ...data]);
      } catch (ex) {
        console.error(ex);
      }
    }

    loadYears();
  }, []);

  const goToOutlineDetails = (outlineId) => {
    navigation.navigate("OutlineDetails", { "outlineId": outlineId });
  };

  return (
    <View style={gStyles.container}>
      <SearchBar
        placeholder="Tìm kiếm..."
        onChangeText={setSearchQuery}
        value={searchQuery} />

      <H1>ĐỀ CƯƠNG MÔN HỌC</H1>
      <ScrollView style={gStyles.scroll}>
        <Dropdown
          label="Niên khóa"
          mode='outlined'
          containerStyle={{ width: '40%' }}
          visible={showDropDown}
          showDropDown={() => setShowDropDown(true)}
          onDismiss={() => setShowDropDown(false)}
          value={yearQuery}
          setValue={v => setYearQuery(v)}
          list={years} />
        {outlines === null ? <ActivityIndicator /> : <>
          {
            outlines.map(o => (
              <View style={gStyles.row} key={o.id}>
                <TouchableOpacity onPress={() => goToOutlineDetails(o.id)}>
                  <OutlineCard
                    title={o.title}
                    source={o.course.image}
                    years={o.years}
                    instructor={o.instructor.name} />
                </TouchableOpacity>
              </View>
            ))
          }
        </>}
      </ScrollView>
    </View>
  )
}
export default memo(Outline);