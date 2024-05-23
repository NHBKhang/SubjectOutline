import React, { memo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { gStyles } from '../core/global';
import TextInput from './TextInput';
import { Table as ReactTable, Row } from 'react-native-table-component';

const ProfileTableRow = ({ data, editMode, updateCallback }) => {
    return (
        <View style={[!editMode && styles.row, editMode && gStyles.p0]}>
            {editMode ? (
                <TextInput
                    style={gStyles.w100}
                    label={data.label}
                    value={data.value}
                    type={data.type}
                    onChangeText={text => updateCallback(data.field, text)} />
            ) : (
                <>
                    <Text style={styles.label}>{data.label}</Text>
                    <Text style={styles.value}>{data.value}</Text>
                </>
            )}
        </View >
    )
};

export const ProfileTable = ({
    rows,
    editMode = false,
    updateCallback = null }) => (
    <View style={[!editMode && styles.table, gStyles.w100]}>
        {rows.map((rowData, rowIndex) => (
            <ProfileTableRow
                key={rowIndex}
                data={rowData}
                editMode={editMode}
                updateCallback={updateCallback} />
        ))}
    </View>
);

const Table = ({ headers, data, dataStyle, headerStyle, containerStyle, flexArr }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <ReactTable borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                {headers ? <Row
                    data={headers}
                    style={[styles.head, headerStyle]}
                    textStyle={styles.headText}
                    flexArr={flexArr} /> : <></>}
                {data && data.length > 0 ? data.map(row => <Row
                    data={row}
                    flexArr={flexArr}
                    textStyle={[styles.text, dataStyle]} />
                ) : <></>}
            </ReactTable>
        </View>
    )
}

const styles = StyleSheet.create({
    table: {
        borderWidth: 1,
        borderBottomWidth: 0,
        borderColor: 'lightgray',
        marginBottom: 10,
    },
    row: {
        padding: 20,
        flexDirection: 'row',
        width: '100%',
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        backgroundColor: 'whitesmoke'
    },
    label: {
        width: '38%',
        marginStart: '1%',
        fontSize: 18,
    },
    value: {
        fontSize: 18,
        width: '60%',
        marginEnd: '1%',
        textAlign: 'right'
    },
    container: {
        margin: 5,
        backgroundColor: '#fff'
    },
    head: {
        backgroundColor: '#f1f8ff',
    },
    headText: {
        fontWeight: 'bold',
        margin: 6,
        fontSize: 16,
        textAlign: 'center',
        verticalAlign: 'middle'
    },
    text: {
        margin: 6,
        fontSize: 16,
        verticalAlign: 'middle'
    },
    center: {
        textAlign: 'center'
    }
});

export default memo(Table);