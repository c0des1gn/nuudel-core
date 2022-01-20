import React from 'react';
import { IRNFormFieldProps } from './RNFormField';
import { Text, Slideshow, Image } from '@Components';
import { width } from '../../common/UI';
import styles from './styles.module.scss';
import { t } from 'nuudel-utils';

const RNFieldImageDisplay: React.FunctionComponent<IRNFormFieldProps> = (
  props
) => {
  if (props.value instanceof Array) {
    if (props.value.length > 0) {
      return <Slideshow images={props.value} />;
    } else return <></>;
  } else {
    if (props.value && props.value.uri) {
      let _width: any = '100%';
      //Image.getSize(props.value, success, [failure]);
      let height: any = width * 0.7;

      if (props.value.height && props.value.width) {
        height = (height * props.value.height) / props.value.width;
      }

      if (props.fieldSchema && props.fieldSchema.InternalName === 'avatar') {
        _width = height = 50;
      }

      // picture field
      return (
        <Image
          src={props.value}
          style={{
            maxWidth: '100%',
            alignSelf: 'flex-end',
            width: _width,
            height,
          }}
        />
      );
    } else {
      return (
        <Text className={styles.display}>{t('ImageFieldPlaceholder')}</Text>
      );
    }
  }
};

export default RNFieldImageDisplay;
