import { DisplayType } from 'nuudel-utils';
import { t } from '../../loc/i18n';

const unionBy = (a, b) => {
  b.forEach((item) => {
    let index = a.findIndex((itm) => itm.field === item.field);
    if (index >= 0) {
      a[index] = item;
    } else {
      a.push(item);
    }
  });
  return a;
};

export const getRegex = (listname: string) => {
  let fields = [];
  if (listname === 'Address') {
    fields = unionBy(
      [],
      [
        {
          field: 'register',
          type: DisplayType.Requared,
          regex:
            /^(([a-zA-Z]{2,3}|[а-яА-ЯөӨүҮёЁ]{2})\d{8}\s{0,1})$|^\d{7}\s{0,4}$/u,
          MaxLength: 11,
        },
      ]
    );
  } else if (listname === 'User') {
    fields = [
      {
        field: 'firstname',
        type: DisplayType.Requared,
        MaxLength: 60,
      },
      {
        field: 'lastname',
        type: DisplayType.Requared,
        MaxLength: 60,
      },
      {
        field: 'phone',
        type: DisplayType.Optional,
        regex: /^[1-9]\d{7}$|^$/,
        prompt: t('number only'),
        MaxLength: 8,
      },
      {
        field: 'mobile',
        type: DisplayType.Optional,
        regex: /^[1-9]\d{7}$|^$/,
        prompt: t('number only'),
        MaxLength: 8,
      },
    ];
  }
  return fields;
};
