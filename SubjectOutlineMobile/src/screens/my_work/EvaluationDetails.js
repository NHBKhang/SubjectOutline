import { Alert, View } from "react-native"
import { gStyles } from "../../core/global"
import { memo, useEffect, useState } from "react"
import { H1 } from "../../components/Header";
import { ActivityIndicator, Text } from "react-native-paper";
import API, { endpoints } from "../../configs/API";
import TextInput from "../../components/TextInput";

const EvaluationDetails = ({ navigation, route }) => {
    const evaluationsId = route.params?.evaluationsId;
    const [evaluations, setEvaluations] = useState([]);

    useEffect(() => {
        const loadEvaluations = async () => {
            try {
                setEvaluations([]);
                await evaluationsId.map(async (e) => {
                    let res = await API.get(endpoints.evaluation(e));
                    setEvaluations((prevState) => [...prevState, res.data]);
                });
                console.info(evaluations);
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Không thể tải được đánh giá môn học");
                navigation.goBack();
            }
        }

        loadEvaluations();
    }, [evaluationsId]);

    return (
        <View style={gStyles.container}>
            <H1>Đánh giá môn học</H1>
            {evaluations === null ?
                <View style={[gStyles.container, { justifyContent: 'center' }]}>
                    <ActivityIndicator />
                </View> : <>
                    {evaluations.map(e => (
                        <View style={gStyles.w100}>
                            <Text>Mã đánh giá: {e.id}</Text>
                            <TextInput
                                label="Tỉ lệ"
                                returnKeyType="next"
                                onChangeText={t => { }}
                                value={e.weight?.toString()}
                                keyboardType="numeric" />
                        </View>
                    ))}
                </>}
        </View>
    )
}

export default memo(EvaluationDetails);