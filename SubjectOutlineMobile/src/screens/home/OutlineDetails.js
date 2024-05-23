import { memo, useContext, useEffect, useState } from "react"
import { Alert, Image, Keyboard, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { H1, H2, H3 } from "../../components/Header";
import API, { authApi, endpoints } from "../../configs/API";
import { gStyles } from "../../core/global";
import { ActivityIndicator, Checkbox, Text } from "react-native-paper";
import moment from "moment";
import Context from "../../configs/Context";
import Avatar from "../../components/Avatar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';
import CommentCard from "../../components/cards/CommentCard";
import Table from "../../components/Table";
import InputField from "../../components/InputField";
import { processString } from "../../core/utils";
import { types } from "../../core/data";

const creditHeaders = ['Tổng', 'Lý thuyết', 'Thực hành', 'Tự học'];
const objectiveHeaders = ['Mục tiêu môn học', 'Mô tả', 'CĐR CTĐT phân bổ cho môn học'];
const requirementHeaders = ['STT', 'Môn học điều kiện', 'Mã môn học'];
const outcomeHeaders = ['Mục tiêu môn học', 'CĐR môn học (CLO)', 'Mô tả CĐR'];
const evaluationHeaders = ['Thành phần đánh giá', 'Bài đánh giá', 'Thời điểm', 'CĐR môn học/CLOs', 'Tỷ lệ %'];
const scheduleHaeaders = ['Tuần', 'Nội dung', 'CĐR môn học', 'Bài đánh giá', 'Tài liệu'];

const OutlineDetails = ({ route }) => {
    const outlineId = route.params?.outlineId;
    const [outline, setOutline] = useState(null);
    const [comments, setComments] = useState(null);
    const [content, setContent] = useState();
    const [liked, setLiked] = useState(false);
    const [user,] = useContext(Context);

    useEffect(() => {
        const loadOutline = async () => {
            try {
                let token = await AsyncStorage.getItem("access-token");
                let res = await authApi(token).get(endpoints["outline-details"](outlineId));
                setOutline(res.data);
                setLiked(res.data.liked);
            } catch (ex) {
                setOutline(null);
                console.error(ex);
            }
        };

        const loadComments = async () => {
            try {
                let res = await API.get(endpoints.comments(outlineId));
                setComments(res.data.results);
            } catch (ex) {
                setComments([]);
                console.error(ex);
            }
        }

        loadOutline();
        loadComments();
    }, [outlineId]);

    const addComment = async () => {
        if (!content || content === '') {
            Alert.alert("Error", "Bình luận không được rỗng!");
            return;
        }
        try {
            let token = await AsyncStorage.getItem("access-token");
            let res = await authApi(token).post(endpoints['add-comment'](outlineId), {
                'content': content
            })
            setComments(current => [res.data, ...current]);
            Alert.alert("Done", "Bình luận đã được cập nhật.");
        } catch (ex) {
            console.error(ex);
            Alert.alert("Error", "Không thể tải được bình luận của bạn.");
        } finally {
            Keyboard.dismiss();
        }
    };

    const like = async () => {
        try {
            let token = await AsyncStorage.getItem("access-token");
            let res = await authApi(token).post(endpoints.like(outlineId))
            setOutline(res.data);
            setLiked(!liked);
        } catch (ex) {
            console.error(ex);
            Alert.alert("Error", "Lỗi.");
        }
    };

    return (
        <>
            <ScrollView>
                {outline === null ? <View style={[gStyles.container, { justifyContent: 'center' }]}>
                    <ActivityIndicator />
                </View> : <><Image
                    source={{ uri: outline.course.image }}
                    width={450} height={180} />

                    <View style={[styles.ownerBox, gStyles.row]}>
                        <View style={{ marginEnd: 10 }}>
                            <Avatar src={outline.instructor.avatar} size={55} />
                        </View>
                        <View style={{ width: '80%' }}>
                            <Text style={{ fontWeight: 'bold' }}>{outline.instructor.name}</Text>
                            <Text>{outline.instructor.email}</Text>
                            <Text style={[gStyles.textEnd, gStyles.w100]}>
                                {'Đăng vào: ' + moment(outline.created_date).fromNow()}</Text>
                        </View>
                    </View>

                    <View style={gStyles.container}>

                        <Text style={[styles.f1, gStyles.w100, gStyles.textEnd]}>
                            TRƯỜNG ĐẠI HỌC MỞ THÀNH PHỐ HỒ CHÍ MINH</Text>
                        <Text style={[styles.f1, gStyles.w100, gStyles.textEnd, { fontWeight: 'bold' }]}>
                            KHOA {outline.course.faculty.name.toUpperCase()}</Text>

                        <H1>ĐỀ CƯƠNG MÔN HỌC</H1>
                        <View style={styles.textContainer}>
                            <H2>I. Thông tin tổng quát</H2>

                            <H3 style={styles.m}>{'\t1. Tên môn học tiếng Việt:'}
                                <Text> {outline.course.name.toUpperCase()}</Text>
                            </H3>

                            <H3 style={styles.m}>{'\t2. Tên môn học tiếng Anh:'}
                                <Text> {outline.course.en_name.toUpperCase()}</Text>
                            </H3>

                            <H3 style={styles.m}>{'\t3. Thuộc khối kiến thức/kỹ năng'}</H3>
                            {types.map(({ id, name }) =>
                                <View key={id} style={[gStyles.row, styles.type]}>
                                    <Checkbox status={id == outline.course.type ?
                                        'checked' : 'unchecked'} />
                                    <Text style={styles.f1}>{name}</Text>
                                </View>)}

                            <H3 style={styles.m}>{'\t4. Số tín chỉ'}</H3>
                            <Table headers={creditHeaders} data={[[
                                outline.course.credit_hour.total,
                                outline.course.credit_hour.theory,
                                outline.course.credit_hour.practice,
                                outline.course.credit_hour.self_learning,
                            ]]} dataStyle={gStyles.textCenter} />

                            <H3 style={styles.m}>{'\t5. Phụ trách môn học'}</H3>
                            <View>
                                <Text style={[styles.m, styles.f1]}>
                                    {'\t\ta) Phụ trách: ' + outline.instructor.faculty}</Text>
                                <Text style={[styles.m, styles.f1]}>
                                    {'\t\tb) Giảng viên: ' + outline.instructor.name}</Text>
                                <Text style={[styles.m, styles.f1]}>
                                    {'\t\tc) Địa chỉ email liên hệ: ' + outline.instructor.email}</Text>
                                <Text style={[styles.m, styles.f1]}>
                                    {'\t\td) Phòng làm việc: ' + outline.instructor.work_room}</Text>
                            </View>

                            <H2>II. Thông tin về môn học</H2>

                            <H3 style={styles.m}>{'\t1. Mô tả môn học'}</H3>
                            <Text style={[styles.f1, gStyles.textJustify]}>
                                {'\t\t\t' + outline.course.description}</Text>

                            <H3 style={styles.m}>{'\t2. Môn học điều kiện'}</H3>
                            <Table headers={requirementHeaders} data={[
                                ['1', 'Môn tiên quyết', null],
                                outline.requirement && outline.requirement.prerequisites.length > 0 ?
                                    outline.requirement.prerequisites.map(p => [null, p.name, p.code]).flat() :
                                    [null, "Không", null],
                                ['2', 'Môn học trước', null],
                                outline.requirement && outline.requirement.preceding_courses.length > 0 ?
                                    outline.requirement.preceding_courses.map(p => [null, p.name, p.code]).flat() :
                                    [null, "Không", null],
                                ['3', 'Môn học song hành', null],
                                outline.requirement && outline.requirement.co_courses.length > 0 ?
                                    outline.requirement.co_courses.map(p => [null, p.name, p.code]).flat() :
                                    [null, "Không", null]
                            ]} flexArr={[0.5, 2, 1]} />

                            <H3 style={styles.m}>{'\t3. Mục tiêu môn học'}</H3>
                            <Text style={[styles.f1, gStyles.textJustify]}>
                                {'\t\t\tMôn học cung cấp cho người học những kiến thức, kỹ năng cũng như cho người học có các thái độ như sau:'}</Text>
                            <Table headers={objectiveHeaders} flexArr={[0.5, 2, 0.85]} data={
                                outline.objectives.length > 0 && outline.objectives.map(o =>
                                    [o.code, o.description, o.outcome]
                                )} />

                            <H3 style={styles.m}>{'\t4. Chuẩn đầu ra (CĐR) môn học'}</H3>
                            <Table headers={outcomeHeaders} flexArr={[0.5, 1, 2]} data={
                                outline.objectives.length > 0 && outline.objectives.map(o =>
                                    o.learning_outcomes.map(l => [o.code, l.code, l.description])
                                ).flat()
                            } dataStyle={gStyles.textJustify} />

                            <H3 style={styles.m}>{'\t5. Học liệu'}</H3>
                            {outline.materials.textbooks && outline.materials.materials && <>
                                <Text style={[styles.m, styles.f1, styles.u]}>
                                    {'\t\ta) Giáo trình'}</Text>
                                {outline.materials.textbooks.map(t =>
                                    <Text style={[styles.f1, gStyles.textJustify]}>
                                        {'\t\t' + t.content}</Text>)}
                                <Text style={[styles.m, styles.f1, styles.u]}>
                                    {'\t\tb) Tài liệu tham khảo'}</Text>
                                {outline.materials.materials.map(m =>
                                    <Text style={[styles.f1, gStyles.textJustify]}>
                                        {'\t\t' + m.content}</Text>)}
                                {outline.materials.software.lenght > 0 &&
                                    <Text style={[styles.m, styles.f1, styles.u]}>
                                        {'\t\ta) Phần mềm'}</Text>}
                                {outline.materials.software.map(m =>
                                    <Text style={[styles.f1, gStyles.textJustify]}>
                                        {'\t\t' + m}</Text>)}
                            </>}


                            <H3 style={styles.m}>{'\t6. Đánh giá môn học'}</H3>
                            <Text style={[styles.f1, gStyles.textJustify]}>
                                {'\t\tA1. Đánh giá quá trình\n\t\tA2. Đánh giá giữa kỳ\n\t\tA3. Đánh giá cuối kỳ'}</Text>
                            <Table dataStyle={gStyles.textCenter} headers={evaluationHeaders} data={
                                outline.evaluations && outline.evaluations.map(e =>
                                    [
                                        e.type == 1 ? 'A1' : (e.type == 2 ? 'A2' : 'A3'),
                                        e.method, e.time, e.learning_outcomes, e.weight
                                    ])
                            } flexArr={[1, 1.25, 1, 1.25, 0.75]} containerStyle={{ marginBottom: 0 }} />
                            <Table data={[['Tổng:', '100%']]} flexArr={[4.5, 0.75]} containerStyle={{ marginTop: 0 }} />

                            <H3 style={styles.m}>{'\t7. Kế hoạch giảng dạy'}</H3>
                            <Table headers={scheduleHaeaders} data={
                                outline.schedule_weeks && outline.schedule_weeks.map(s =>
                                    [s.week, s.content, s.outcomes, s.evaluations, s.materials])
                            } flexArr={[0.75, 1.75, 1, 0.75, 0.65]} dataStyle={gStyles.textJustify} />

                            <H3 style={styles.m}>{'\t8. Quy định của môn học'}</H3>
                            <Text style={[styles.f1, gStyles.textJustify]}>
                                {'\t\t' + processString(outline.rule)}</Text>
                        </View>
                    </View>

                    <ScrollView>
                        <View style={gStyles.row}>
                            <TouchableOpacity style={styles.box} onPress={like}>
                                <View style={[gStyles.w100, gStyles.row, styles.center]}>
                                    <Icon style={[styles.icon, liked && styles.checked]} name="thumbs-up" color={'gray'} size={20} />
                                    <Text style={[styles.count, liked && styles.checked]}>{outline.like_count}</Text>
                                    <Text style={[styles.count, liked && styles.checked]}>Thích</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.box}>
                                <View style={[gStyles.w100, gStyles.row, styles.center]}>
                                    <Icon style={styles.icon} name="comment" color={'gray'} size={20} />
                                    <Text style={styles.count}>{outline.comment_count}</Text>
                                    <Text style={styles.count}>Bình luận</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {comments === null ? <ActivityIndicator /> : <>
                            {comments.map(c => <View key={c.id}>
                                <CommentCard
                                    avatar={c.user.avatar}
                                    username={c.user.name}
                                    content={c.content}
                                    createdDate={c.created_date} />
                            </View>)}
                        </>}
                    </ScrollView>
                </>}
            </ScrollView>

            {user === null ? null : <>
                <InputField
                    onChangeText={t => setContent(t)}
                    placeholder="Nội dung bình luận..."
                    onPress={addComment}
                    value={content}
                    abs={false} />
            </>}
        </>
    )
}

const styles = StyleSheet.create({
    textContainer: {
        alignSelf: 'baseline'
    },
    m: {
        margin: 2,
    },
    type: {
        alignItems: 'center',
    },
    f1: {
        fontSize: 16
    },
    ownerBox: {
        padding: 5,
        margin: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5
    },
    box: {
        borderWidth: 1,
        borderColor: 'gray',
        width: '50%',
        height: 35,
        backgroundColor: 'white',
    },
    center: {
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        marginEnd: 5
    },
    count: {
        fontSize: 18,
        fontWeight: '500',
        marginStart: 5,
        color: 'gray',
        padding: 0
    },
    checked: {
        color: 'blue'
    },
    u: {
        textDecorationLine: 'underline'
    }
});

export default memo(OutlineDetails);