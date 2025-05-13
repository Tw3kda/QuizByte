import { StyleSheet } from 'react-native';
import colors from '../constants/Colors';
import fonts from '../constants/fonts';

export const styles = StyleSheet.create({
  blackButton: {
    backgroundColor: colors.purple,
    borderWidth: 5,
    borderColor: colors.black,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 278,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blackButton2: {
    backgroundColor: colors.orange,
    borderWidth: 5,
    borderColor: colors.black,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 278,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blackButtonText: {
    fontFamily: fonts.pressStart2P,
    color: colors.white,
    fontSize: 16,
    textShadowColor: colors.black,
    textShadowOffset: { width: 2, height: 2 }, // Ajusta estos valores para el grosor del borde
    textShadowRadius: 0,
    textAlign: 'center', // Asegúrate de que el texto esté centrado dentro del botón
  },
  whiteButton: {
    backgroundColor: colors.purple,
    borderWidth: 5,
    borderColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 278,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteButtonText: {
    fontFamily: fonts.pressStart2P,
    color: colors.white,
    fontSize: 14,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: colors.purple,
    borderWidth: 2,
    borderColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButtonText: {
    fontFamily: fonts.pressStart2P,
    color: colors.white,
    fontSize: 14,
    textAlign: 'left',
  },
  backContent: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10, // si te tira error en versiones antiguas, usá marginRight en el ícono
},

backIcon: {
  width: 16,
  height: 16,
  //tintColor: '#FFFFFF', // opcional: para colorear el ícono blanco si es SVG convertido a PNG negro
},
});
