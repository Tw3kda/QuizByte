import { StyleSheet } from 'react-native';
import colors from '../constants/Colors';
import fonts from '../constants/fonts';

export const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: colors.grayDark,
    borderWidth: 1,
    width: 279,
    height: 55,
  },
  input: {
    color: colors.white,
    fontFamily: fonts.pressStart2P,
    fontSize: 12,
    textAlign: 'left',
    textAlignVertical: 'center',
    height: '100%',
  },
});
