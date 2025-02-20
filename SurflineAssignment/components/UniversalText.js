import { Text, StyleSheet} from 'react-native';

/**
 * Universal text, that provides consistent styling that can be easily switched between
 * @param {*} style Any extra styling to use 
 * @param {*} type the type of text 
 */
export function UniversalText({ style, type = 'default', ...rest}) {
  return (
    <Text
      style={[
        { color: 'black' },
        type == 'default' ? styles.default : undefined,
        type == 'defaultBold' ? styles.defaultBold : undefined,
        type == 'smallBold' ? styles.smallBold : undefined,
        type == 'small' ? styles.small : undefined,
        type == 'title' ? styles.title : undefined,
        type == 'subtitle' ? styles.subtitle : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '600',
  },
  small: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '500',
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
