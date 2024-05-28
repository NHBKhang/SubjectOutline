import { View } from "react-native"
import { gStyles } from "../../core/global"
import { memo, useEffect, useState } from "react"
import { H1 } from "../../components/Header";
import { ActivityIndicator } from "react-native-paper";

const EvaluationDetails = ({ route }) => {
    const outlineId = route.params?.outlineId;
    const [evaluations, setEvaluations] = useState(null);

    useEffect(() => {
        const loadEvaluations = async () => {
            try {

            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Không thể tải được đánh giá môn học");
                navigation.goBack();
            }
        }

        loadEvaluations()
    }, [outlineId]);
    return (
        <View style={gStyles.container}>
            <H1>Đánh giá môn học</H1>
            {evaluations === null ?
                <View style={[gStyles.container, { justifyContent: 'center' }]}>
                    <ActivityIndicator />
                </View> : <>
                </>}
        </View>
    )
}

export default memo(EvaluationDetails);