import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";

type Props = React.ComponentProps<typeof Searchbar>;

const SearchBar = ({ ...props }: Props) => {
    return (
        <Searchbar style={styles.bar}
            {...props} />
    )
}

const styles = StyleSheet.create({
    bar: {
        width: '100%'
    }
});

export default memo(SearchBar);