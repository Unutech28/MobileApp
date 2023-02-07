import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import GLOBALS from '@constants';
import DropDownPicker from '../../updatedNodeModules/react-native-dropdown-picker';
const { FONTS, COLOR, PRODUCT_TYPE } = GLOBALS;
function DropDown(props) {
    let {
        containerStyle = {},
        pickerStyle = {},
        placeholder = "Select",
        theme = "LIGHT",
        textStyle = {},
        labelStyle = {},
        items = {},
        open = false,
        value = 'en',
        setOpen = () => { },
        setValue = () => { },
        onChangeValue = () => { },
        onPress = () => { },
    } = props;
    return (
        <View style={containerStyle}>
            <DropDownPicker
                style={pickerStyle}
                placeholder={placeholder}
                theme={theme}
                containerStyle={[]}
                textStyle={textStyle}
                labelStyle={labelStyle}
                open={open}
                value={value}
                items={items}
                setOpen={() => setOpen(true)}
                setValue={(callback) => setValue(callback)}
                onChangeValue={value => { onChangeValue() }}
                onPress={open => {
                    if (!open) {
                        setTimeout(() => {
                            onPress();
                        }, 100);
                    }
                }}
            />
        </View>

    )

}


const styles = StyleSheet.create({

});
export default (DropDown = React.memo(DropDown));