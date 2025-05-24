import { StyleSheet } from 'react-native';
import colors from '../constants/Colors';
import fonts from '../constants/fonts';

export const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 12,
    paddingVertical: 0,
    backgroundColor: colors.grayDark,
    width: 279,
    height: 55,
    justifyContent: 'center',
    marginBottom: 20,
  },
  input: {
    color: colors.white,
    fontFamily: fonts.pressStart2P,
    fontSize: 10,
    textAlignVertical: 'center',
    height: '100%',
    
  },
});
