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
    borderWidth: 5,
    borderColor: colors.white,
    paddingVertical: 2,
    paddingHorizontal: 6,
    width: 300,
    height: 50,
  },
  backButtonText: {
    fontFamily: fonts.pressStart2P,
    color: colors.white,
    fontSize: 16,
    textAlign: 'left',
  },
  backContent: {
  flexDirection: 'row',
  alignItems: 'center',
  width: 287,
  height: 40,
  gap: 110, // si te tira error en versiones antiguas, usá marginRight en el ícono
},

backIcon: {
  width: 30,
  height: 30,
  marginRight: 30, // opcional: para separar el ícono del texto
  //tintColor: '#FFFFFF', // opcional: para colorear el ícono blanco si es SVG convertido a PNG negro
},
});
